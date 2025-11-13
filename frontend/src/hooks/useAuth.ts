import { useEffect, useState } from 'react';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                setUser(data.user);
            })
            .catch(() => {
                setUser(null);
                localStorage.removeItem("accessToken");
            })
            .finally(() => setLoading(false));
    }, []);

    return { user, loading };
}