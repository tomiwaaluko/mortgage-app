const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}

run().catch(console.dir);

app.get("/api/ping", async (req, res) => {
    try {
        res.status(200).json({ message: "Pong!" });
    } catch (err) {
        console.error("Error while trying to ping: ", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(3001, () => {
    console.log(`Server started at ${3001}!`);
});