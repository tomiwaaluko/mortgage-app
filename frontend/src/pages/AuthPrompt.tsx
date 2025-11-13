import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Icon,
  Container,
  Spinner,
} from "@chakra-ui/react";
import { AnimatedPage } from "../ui/AnimatedPage";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaSignInAlt,
  FaLock,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

export const AuthPrompt: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    )
  }

  return (
    <AnimatedPage>
      <Container maxW="container.lg" py={10}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minH="70vh"
        >
          <Card
            p={{ base: 6, md: 10 }}
            boxShadow="2xl"
            borderRadius="xl"
            maxW="2xl"
            w="full"
          >
            <VStack spacing={6} align="stretch">
              <VStack spacing={3} textAlign="center">
                <Heading size="xl" color="brand.600">
                  Ready to Get Pre-Qualified?
                </Heading>
                <Text fontSize="lg" color="gray.600">
                  Sign in to continue your application or create a new account
                  to get started.
                </Text>
              </VStack>

              {/* Benefits */}
              <VStack
                spacing={3}
                align="stretch"
                bg="gray.50"
                p={5}
                borderRadius="lg"
              >
                <HStack>
                  <Icon as={FaClock} color="brand.600" />
                  <Text fontSize="sm">
                    <strong>Save your progress</strong> - Complete at your own
                    pace
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FaLock} color="brand.600" />
                  <Text fontSize="sm">
                    <strong>Secure</strong> - Your information is encrypted and
                    protected
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FaCheckCircle} color="brand.600" />
                  <Text fontSize="sm">
                    <strong>Fast</strong> - Get pre-qualified in just 5 minutes
                  </Text>
                </HStack>
              </VStack>

              <Divider />

              {/* Action Buttons */}
              <VStack spacing={4}>
                <VStack spacing={2} w="full">
                  <Text fontWeight="bold" fontSize="sm" color="gray.600">
                    New here?
                  </Text>
                  <Button
                    size="lg"
                    colorScheme="blue"
                    w="full"
                    leftIcon={<FaUserPlus />}
                    onClick={() => navigate("/sign-up")}
                    py={6}
                    fontSize="lg"
                  >
                    Create Account
                  </Button>
                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    Free to sign up • No credit check • Takes &lt;30 seconds
                  </Text>
                </VStack>

                <Divider />

                <VStack spacing={2} w="full">
                  <Text fontWeight="bold" fontSize="sm" color="gray.600">
                    Already have an account?
                  </Text>
                  <Button
                    size="lg"
                    variant="outline"
                    colorScheme="blue"
                    w="full"
                    leftIcon={<FaSignInAlt />}
                    onClick={() => navigate("/sign-in")}
                    py={6}
                    fontSize="lg"
                  >
                    Sign In
                  </Button>
                </VStack>
              </VStack>

              {/* Back to Home */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                color="gray.500"
              >
                ← Back to Home
              </Button>
            </VStack>
          </Card>
        </Box>
      </Container>
    </AnimatedPage>
  );
};
