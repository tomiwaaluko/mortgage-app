import type { LoanAppData } from "../context/LoanAppContext";

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

export async function submitLoanApplication(data: LoanAppData) {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        throw new Error("Not authenticated");
    }

    const res = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => {});
        throw new Error(err.error || "Failed to submit application");
    }

    return res.json();
}

export async function getUserApplication() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        throw new Error("Not authenticated");
    }

    const res = await fetch("/api/get-user-application", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        credentials: "include"
    });

    if (!res.ok) {
        if (res.status === 404) {
            return null;
        }

        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to fetch application");
    }

    const data = await res.json();
    return data.application;
}

export async function deleteUserApplication() {
  const token = localStorage.getItem("accessToken");
  const res = await fetch('/api/delete-user-application', {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete application");
  }

  return res.json();
}

export async function getAllApplications() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch("/api/admin/applications", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to fetch applications");
  }

  const data = await res.json();
  return data;
}

export async function getApplicationById(id: string) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`/api/admin/applications/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch application details");
  }

  const data = await res.json();
  return data.application;
}

export async function updateApplicationApproval(
  id: string,
  approval: "approved" | "denied"
) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`/api/admin/applications/${id}/approval`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ approval }),
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Failed to update approval");
  }

  return data as { ok: true; applicationId: string; approval: "approved" | "denied" };
}
