export type SignUpBody = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type SignInBody = {
    email: string;
    password: string;
}

export async function signUp(body: SignUpBody, signal?: AbortSignal) {
    const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal,
        credentials: "include",
    });

    const data = await res.json().catch(() => {});
    if (!res.ok) {
        const err = new Error(data?.message || "Sign up failed");
        (err as any).status = res.status;
        (err as any).details = data;
        throw err;
    }

    localStorage.setItem("accessToken", data.accessToken);
    return data;
}

export async function signIn(body: SignInBody, signal?: AbortSignal) {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal,
        credentials: "include",
    });

    const data = await res.json().catch(() => {});
    if (!res.ok) {
        const err = new Error(data?.message || "Sign up failed");
        (err as any).status = res.status;
        (err as any).details = data;
        throw err;   
    }

    localStorage.setItem("accessToken", data.accessToken);
    return data;
}

export async function signOut() {
    const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Logout failed");
    }

    localStorage.removeItem("accessToken");

    return true;
}