import React from "react";
import {
  Flex,
  Image,
  Button,
  Text,
  Progress,
  Box,
  HStack,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Define steps in order
  const steps = [
    "/personal-info",
    "/employment-info",
    "/assets-liabilities",
    "/real-estate-info",
    "/loan-property-info",
    "/declarations",
    "/review",
  ];

  const currentIndex = steps.indexOf(location.pathname);
  const progressPercent =
    currentIndex >= 0
      ? Math.round(((currentIndex + 1) / steps.length) * 100)
      : 0;

  return (
    <Box>
      <Flex
        position="fixed"
        top={0}
        left={0}
        width="100%"
        justify="space-between"
        align="center"
        px={4}
        py={3}
        bg="white"
        boxShadow="sm"
        zIndex={10}
      >
        {/* Logo */}
        <Image
          src="/image-1.png"
          alt="Logo"
          h="60px"
          w="120px"
          cursor="pointer"
          onClick={() => navigate("/")}
        />

        {/* Center Text */}
        <Text
          display={{ base: "none", md: "block" }}
          fontSize="xl"
          fontWeight="medium"
          color="blue.600"
        >
          APEX Residential Finance
        </Text>

        {/* Contact and Sign In */}
        <HStack spacing={2}>
          {user ? (
            <HStack>
              <Button
                onClick={async () => {
                  navigate("/profile");
                }}
                colorScheme="blue"
                size="md"
                variant="outline"
              >
                Profile
              </Button>
              <Button
                onClick={async () => {
                  navigate("/dashboard");
                }}
                colorScheme="blue"
                size="md"
              >
                Dashboard
              </Button>
            </HStack>
          ) : (
            <HStack>
              <Button
                onClick={() => navigate("/sign-in")}
                colorScheme="blue"
                variant="outline"
                size="md"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/sign-up")}
                colorScheme="blue"
                size="md"
              >
                Get Started
              </Button>
            </HStack>
          )}
        </HStack>
      </Flex>

      {/* Progress Bar and Step Text */}
      {currentIndex >= 0 && (
        <Box mt="62px" px={4}>
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              Step {currentIndex + 1} of {steps.length}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {progressPercent}%
            </Text>
          </HStack>
          <Progress
            value={progressPercent}
            size="sm"
            colorScheme="blue"
            borderRadius="0"
          />
        </Box>
      )}
    </Box>
  );
};
