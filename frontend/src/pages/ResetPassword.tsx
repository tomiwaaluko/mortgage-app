import {
  Box,
  Button,
  Card,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Spinner,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { ImEye, ImEyeBlocked } from "react-icons/im";

type ResetValues = { password: string };

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>();

  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    // If there is no token in the URL, we show an error view below
  }, [token]);

  const onSubmit = async (values: ResetValues) => {
    if (!token) return;

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to reset password");
      }

      toast({
        title: "Password reset",
        description: "You can now sign in with your new password.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      setTimeout(() => {
        navigate("/sign-in", { replace: true });
      }, 1500);
    } catch (err: any) {
      toast({
        title: "Reset failed",
        description: err?.message || "The link may be invalid or expired.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!token) {
    // URL has no ?token=... -> show invalid-link UI
    return (
      <Box minH="80vh" display="flex" alignItems="center" justifyContent="center">
        <Card p={10} boxShadow="2xl" borderRadius="xl" maxW="lg">
          <Heading mb={4}>Invalid reset link</Heading>
          <Text mb={6}>The reset link is missing or invalid.</Text>
          <Button onClick={() => navigate("/forgot-password")} colorScheme="blue">
            Request new link
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box minH="80vh" display="flex" alignItems="center" justifyContent="center">
      <Card p={10} boxShadow="2xl" borderRadius="xl" maxW="lg">
        <Heading mb={4}>Set a new password</Heading>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormControl isInvalid={!!errors.password} mb={4}>
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <Input
                type={showPw ? "text" : "password"}
                placeholder="********"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "At least 8 characters" },
                })}
              />
              <InputRightElement width="3rem">
                <IconButton
                  aria-label={showPw ? "Hide password" : "Show password"}
                  size="sm"
                  variant="ghost"
                  icon={showPw ? <ImEye /> : <ImEyeBlocked />}
                  onClick={() => setShowPw((x) => !x)}
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              rightIcon={isSubmitting ? <Spinner size="sm" /> : undefined}
            >
              Reset password
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
