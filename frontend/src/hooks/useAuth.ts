import { useEffect, useState } from "react";
import type { AuthUser, AuthContextValue } from "../types/auth";

export function useAuth(): AuthContextValue {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");

    if (!savedToken) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setUser(data.user as AuthUser);
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("accessToken");
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
