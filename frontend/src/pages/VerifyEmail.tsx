import {
  Box,
  Button,
  Card,
  Heading,
  Text,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const email = (location.state as { email?: string } | null)?.email;
  const token = searchParams.get("token");

  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");

  useEffect(() => {
    const verify = async () => {
      if (!token) return;

      setStatus("verifying");
      try {
        const res = await axios.post("/api/auth/verify-email", { token });

        setStatus("success");
        toast({
          title: "Email verified!",
          description: res.data?.message || "You can now sign in.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });

        setTimeout(() => {
          navigate("/sign-in", { replace: true });
        }, 1500);
      } catch (err: any) {
        setStatus("error");
        toast({
          title: "Verification failed",
          description:
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            "The link may be invalid or expired.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    verify();
  }, [token, toast, navigate]);

  const handleResend = async () => {
    if (!email) {
      toast({
        title: "Missing email",
        description: "Please sign up again or sign in.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSending(true);
      await axios.post("/api/auth/resend-verification", { email });

      toast({
        title: "Verification email resent",
        description: "Check your inbox and spam folder.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: "Failed to resend",
        description: err?.response?.data?.error || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  if (token) {
    return (
      <Box
        minH="80vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Card p={10} boxShadow="2xl" borderRadius="xl" maxW="lg">
          {status === "verifying" && (
            <>
              <Heading mb={4}>Verifying your email...</Heading>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mt={4}
              >
                <Spinner size="xl" />
              </Box>
            </>
          )}

          {status === "success" && (
            <>
              <Heading mb={4}>Email verified 🎉</Heading>
              <Text mb={6}>You can now sign in to your account.</Text>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  colorScheme="blue"
                  onClick={() => navigate("/sign-in", { replace: true })}
                >
                  Go to Sign-In
                </Button>
              </Box>
            </>
          )}

          {status === "error" && (
            <>
              <Heading mb={4}>Verification failed</Heading>
              <Text mb={6}>
                The verification link may be invalid or expired. You can request
                a new email from the sign-up screen.
              </Text>
              <Box display="flex" justifyContent="flex-end" gap={3}>
                <Button onClick={() => navigate("/sign-up")} variant="outline">
                  Back to Sign-Up
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => navigate("/sign-in")}
                >
                  Sign-In
                </Button>
              </Box>
            </>
          )}
        </Card>
      </Box>
    );
  }

  return (
    <Box
      minH="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Card p={10} boxShadow="2xl" borderRadius="xl" maxW="lg">
        <Heading mb={4}>Verify your email</Heading>
        <Text mb={4}>
          We&apos;ve sent a verification link to{" "}
          <b>{email || "your email"}</b>. Please click the link in that email to
          activate your account.
        </Text>
        <Text mb={6}>
          Didn&apos;t get the email? Check your spam folder, or click the button
          below to resend it.
        </Text>
        <Box display="flex" gap={3} justifyContent="flex-end">
          <Button variant="outline" onClick={() => navigate("/sign-in")}>
            Back to Sign-In
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleResend}
            isDisabled={!email || isSending}
            leftIcon={isSending ? <Spinner size="sm" /> : undefined}
          >
            {isSending ? "Resending..." : "Resend email"}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
