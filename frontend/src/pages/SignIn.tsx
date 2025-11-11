import {
  Box,
  Button,
  Card,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AnimatedPage } from "../ui/AnimatedPage";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useState } from "react";
import { ImEye, ImEyeBlocked } from "react-icons/im";

import { signIn } from "../lib/api";

// Validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type SignInFormData = {
  email: string;
  password: string;
};

export default function SignIn() {
  const navigate = useNavigate();
  const toast = useToast();
  const [toggle, setToggle] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      await signIn(data);
      toast({
        title: "Sign in successful",
        description: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Sign in failed",
        description:
          error instanceof Error ? error.message : "Invalid credentials",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <AnimatedPage>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="80vh"
      >
        <Card p={10} boxShadow="2xl" borderRadius="xl" maxW="md" w="full">
          <Heading mb={6} textAlign="center">
            Sign In
          </Heading>

          <Box as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={5} align="stretch" w="full">
              <FormControl isInvalid={!!errors.email} isRequired>
                <FormLabel fontWeight="bold">Email</FormLabel>
                <Input
                  type="email"
                  placeholder="john.aedo@ucf.edu"
                  autoComplete="email"
                  {...register("email")}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password} isRequired>
                <FormLabel fontWeight="bold">Password</FormLabel>
                <InputGroup>
                  <Input
                    type={toggle ? "text" : "password"}
                    placeholder="********"
                    autoComplete="current-password"
                    {...register("password")}
                  />
                  <InputRightElement width="3rem">
                    <IconButton
                      aria-label={toggle ? "Hide Password" : "Show Password"}
                      icon={toggle ? <ImEye /> : <ImEyeBlocked />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setToggle(!toggle)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <Box display="flex" justifyContent="flex-end" mt={6} gap={3}>
                <Button onClick={() => navigate("/sign-up")} variant="outline">
                  Create Account
                </Button>
                <Button
                  variant="solid"
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                >
                  Sign In
                </Button>
              </Box>
            </VStack>
          </Box>
        </Card>
      </Box>
    </AnimatedPage>
  );
}
