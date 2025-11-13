import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { Box, Spinner } from "@chakra-ui/react";
 

export default function AuthRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <Spinner size="xl" />
        </Box>
    );
    if (!user) return <Navigate to="/sign-in" replace />

    return children
}