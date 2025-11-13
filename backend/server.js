const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const nodemailer = require("nodemailer");

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

const EMAIL_VERIFY_SECRET = process.env.JWT_EMAIL_VERIFY_SECRET || "email-secret";
const EMAIL_VERIFY_TTL = "1d";

function signEmailVerifyToken(payload) {
  return jwt.sign(payload, EMAIL_VERIFY_SECRET, { expiresIn: EMAIL_VERIFY_TTL });
}

async function sendVerificationEmail(email, token) {
  const verifyUrl = `${process.env.CLIENT_ORIGIN || "http://localhost:5173"}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <p>Thanks for signing up!</p>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${verifyUrl}">Verify Email</a></p>
      <p>If you did not sign up, you can ignore this email.</p>
    `,
  });
}


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        credentials: true,
    })
);

app.set("trust proxy", 1);
const prod = process.env.NODE_ENV === "production";

const client = new MongoClient(process.env.MONGO_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;

async function run() {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    db = client.db(process.env.DB_NAME || "app");
    console.log("You successfully connected to MongoDB!");
}

run().catch((err) => {
    console.error("Mongo initialization error:", err);
    process.exit(1);
});

app.use((req, _res, next) => {
    req.db = db;
    next();
});

const ACCESS_TTL = "2h";
const REFRESH_TTL = "7d";
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function signAccessToken(payload) {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}

function signRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}

function auth(req, res, next) {
    const hdr = req.headers.authorization || "";
    const [, token] = hdr.split(" ");

    if (!token)
        return res.status(401).json({ error: "Missing token" });

    try {
        const decoded = jwt.verify(token, ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({ error: "Invalid/expired token" });
    }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

app.get("/api/ping", async (_req, res) => {
    try {
        await db.admin().command({ ping: 1 });
        res.status(200).json({ message: "Pong!", db: "ok" });
    } catch (err) {
        console.error("Error while trying to ping: ", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/auth/signup", async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password
        } = req.body || {};

        if (!firstName || !lastName) return res.status(400).json({ error: "Missing first or last name" });
        if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

        const Users = req.db.collection("Users");
        const existing = await Users.findOne({ email });

        if (existing) {
            return res.status(409).json({ error: "Email already in use!" });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const { insertedId } = await Users.insertOne({
            firstName,
            lastName,
            email,
            passwordHash,
            createdAt: new Date(),
            role: "customer",
            emailVerified: false,
            verifiedAt: null,
            emailVerifyToken: null,
        });

        const verifyToken = signEmailVerifyToken({
            sub: insertedId.toString(),
            email,
            type: "email-verify",
        });

        await Users.updateOne(
            { _id: insertedId }, 
            { 
                $set: { 
                    emailVerifyToken: verifyToken,
                } 
            }
        );

        try {
            await sendVerificationEmail(email, verifyToken);
        } catch (mailErr) {
            console.error("Error sending verification email: ", mailErr);
        }

        return res.json({
            ok: true,
            message: "Signup successful, please check your email to verify your account."
        });
    } catch (e) {
        console.error("Signup error:", e);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/auth/verify-email", async (req, res) => {
  try {
    const { token } = req.body || {};

    if (!token) {
      return res.status(400).json({ error: "Missing token" });
    }

    let payload;
    try {
      payload = jwt.verify(token, EMAIL_VERIFY_SECRET);
    } catch (err) {
      console.error("Invalid/expired email verification token:", err);
      return res.status(400).json({ error: "Invalid or expired verification token" });
    }

    if (payload.type !== "email-verify") {
      return res.status(400).json({ error: "Invalid token type" });
    }

    const userId = payload.sub;
    const Users = req.db.collection("Users");

    const user = await Users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.emailVerifyToken && user.emailVerifyToken !== token) { 
    return res.status(400).json({ error: "Verification link is no longer valid. Please request a new one." });
    }

    if (user.emailVerified) {
      return res.json({ ok: true, alreadyVerified: true });
    }

    await Users.updateOne(
      { _id: user._id },
      {
        $set: {
          emailVerified: true,
          verifiedAt: new Date()
        },
        $unset: {
          emailVerifyToken: ""
        }
      }
    );

    return res.json({ ok: true, message: "Email verified successfully!" });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password)
            return res.status(400).json({ error: "Missing email or password!" });

        const Users = req.db.collection("Users");
        const user = await Users.findOne({ email });

        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
            return res.status(401).json({ error: "Invalid credentials" });

        if (!user.emailVerified) {
            return res.status(403).json({
                error: "Email not verified",
                code: "EMAIL_NOT_VERIFIED",
            });
        }

        const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email, role: user.role });
        const refreshToken = signRefreshToken({ sub: user._id.toString() });

        await Users.updateOne({ _id: user._id }, { $set: { refreshToken } });

        res.cookie("rt", refreshToken, {
            httpOnly: true,
            secure: prod,
            sameSite: prod ? "lax" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/api/auth",
        });

        res.json({ ok: true, user: { id: user._id, email: user.email }, accessToken });
    } catch (e) {
        console.error("Login error:", e);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/auth/resend-verification", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Missing email" });

    const Users = req.db.collection("Users");
    const user = await Users.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.emailVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    const verifyToken = signEmailVerifyToken({
      sub: user._id.toString(),
      email: user.email,
      type: "email-verify",
    });

    await Users.updateOne(
      { _id: user._id },
      { $set: { emailVerifyToken: verifyToken } }
    );

    try {
      await sendVerificationEmail(user.email, verifyToken);
    } catch (mailErr) {
      console.error("Error resending verification email:", mailErr);
      return res.status(500).json({ error: "Failed to send verification email" });
    }

    return res.json({ ok: true, message: "Verification email resent, please check your inbox!" });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/logout", async (req, res) => {
    try {
        const { rt } = req.cookies;

        if (!rt) {
            return res.status(200).json({ ok: true });
        }

        const Users = req.db.collection("Users");

        await Users.updateOne(
            { refreshToken: rt },
            { $unset: { refreshToken: "" }}
        );

        res.clearCookie("rt", {
            httpOnly: true,
            secure: prod,
            sameSite: prod ? "lax" : "lax",
            path: "/api/auth",
        });

        return res.json({ ok: true });
    } catch (err) {
        console.error("Logout error: ", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/auth/me", auth, async (req, res) => {
    const Users = req.db.collection("Users");
    const user = await Users.findOne(
        { _id: new ObjectId(req.user.sub) },
        { projection: { passwordHash: 0, refreshToken: 0 } }
    );

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ ok: true, user });
});

app.post("/api/submit-application", auth, async (req, res) => {
    try {
        const userId = req.user.sub;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const Applications = req.db.collection("Applications");
        const userObjectId = new ObjectId(userId);

        const now = new Date();
        const loanData = req.body;

        const existing = await Applications.findOne({ userId: userObjectId });
        if (!existing) {
            const doc = {
                userId: userObjectId,
                status: "submitted",
                approval: "pending",
                createdAt: now,
                updatedAt: now,
                ...loanData,
            };

            const { insertedId } = await Applications.insertOne(doc);

            return res.json({
                ok: true,
                applicationId: insertedId,
            });
        }

        await Applications.updateOne(
            { _id: existing._id },
            {
                $set: {
                    ...loanData,
                    status: "submitted",
                    approval: "pending",
                    updatedAt: now
                },
            }
        );

        return res.json({
            ok: true,
            applicationId: existing._id,
        });
    } catch (error) {
        console.error("Submitting application error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/get-user-application", auth, async (req, res) => {
    try {
        const userId = req.user.sub;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const Applications = req.db.collection("Applications");

        const application = await Applications.findOne(
          { userId: new ObjectId(userId) },
        );

        if (!application) return res.status(404).json({ error: "User Application not found" });
        res.json({ ok: true, application });
    } catch (err) {
        console.error("Getting user application error:", err);
        res.status(500).json({ error: "Internal server error "});
    }
});

app.delete("/api/delete-user-application", auth, async (req, res) => {
    try {
        const userId = req.user.sub;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const Applications = req.db.collection("Applications");
        const userObjectId = new ObjectId(userId);

        const result = await Applications.deleteOne({ userId: userObjectId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "User application not found" });
        }

        return res.json({ ok: true, deleted: true });
    } catch (err) {
        console.error("Deleting user application error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/admin/applications", auth, requireAdmin, async (req, res) => {
    try {
        const Applications = req.db.collection("Applications");

        const apps = await Applications.find({})
            .sort({ createdAt: -1 })
            .toArray();

        return res.json({ ok: true, applications: apps });
    } catch (err) {
        console.error("Fetching all applications error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.patch("/api/admin/applications/:id/approval", auth, requireAdmin, async (req, res) => {
    try {
        const appId = req.params.id;
        const { approval } = req.body || {};

        const allowed = ["approved", "denied"];
        if (!allowed.includes(approval)) {
            return res.status(400).json({
                error: "Invalid approval status. Must be 'approved' or 'denied'."
            });
        }

        const Applications = req.db.collection("Applications");

        const result = await Applications.updateOne(
            { _id: new ObjectId(appId) },
            {
                $set: {
                    approval,
                    approvalUpdatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Application not found" });
        }

        return res.json({ ok: true, applicationId: appId, approval });
    } catch (err) {
        console.error("Updating application approval error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/admin/applications/:id", auth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const Applications = req.db.collection("Applications");
        const application = await Applications.findOne({ _id: new ObjectId(id) });

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        return res.json({ ok: true, application });
    } catch (err) {
        console.error("Fetching single application error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started at ${PORT}!`);
});