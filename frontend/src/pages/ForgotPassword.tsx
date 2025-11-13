import {
  Box,
  Button,
  Card,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ForgotValues = { email: string };

export default function ForgotPassword() {
  const { register, handleSubmit, formState } = useForm<ForgotValues>({
    defaultValues: { email: "" },
  });
  const { errors, isSubmitting } = formState;
  const toast = useToast();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  const onSubmit = async (values: ForgotValues) => {
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to request reset");
      }

      setDone(true);
      toast({
        title: "Check your email",
        description: data.message || "If that email exists, a reset link has been sent.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: "Request failed",
        description: err?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="80vh" display="flex" alignItems="center" justifyContent="center">
      <Card p={10} boxShadow="2xl" borderRadius="xl" maxW="lg" w="full">
        <Heading mb={4}>Forgot your password?</Heading>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormControl isInvalid={!!errors.email} mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          {done && (
            <Box mb={4} fontSize="sm">
              If that email exists, a reset link has been sent. Please check your
              inbox and spam folder.
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button variant="outline" onClick={() => navigate("/sign-in")}>
              Back to Sign-In
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              rightIcon={isSubmitting ? <Spinner size="sm" /> : undefined}
            >
              Send reset link
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
