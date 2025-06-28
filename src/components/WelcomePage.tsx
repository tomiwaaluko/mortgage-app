import React from "react";
import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  VStack,
  Link,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AnimatedPage } from "../functions/AnimatedPage";

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <AnimatedPage>
      <Flex
      direction="column"
      minH="100vh"
      align="center"
      bg="white"
      px={4}
      py={6}
    >
      {/* Center Content */}
      <VStack textAlign="center" maxW="400px">
        <Image
          src="/welcome.png"
          alt="House"
          borderRadius="lg"
          boxShadow="md"
        />
        <Text fontSize="2xl" fontWeight="bold" color="gray.700">
          Get prequalified for your dream home
        </Text>
        <VStack spacing={2}>
          <Text fontSize="sm" color="gray.500">
            Takes about 5 minutes
          </Text>
          <Text fontSize="sm" color="gray.500">
            Unlock exclusive rates and savings
          </Text>
          <Text fontSize="sm" color="gray.500">
            Instant access to our experts
          </Text>
        </VStack>
        <Button 
        colorScheme="brand" 
        size="lg"
        w="100%"
        borderRadius="full"
        onClick={() => navigate("/personal-info")}        
        >
          Get Started
        </Button>
        <Text fontSize="xs" color="gray.400">
          By selecting Continue, you agree to our{" "}
          <Link color="blue.500">Terms of Use</Link> and{" "}
          <Link color="blue.500">Privacy Policy</Link>.
        </Text>
      </VStack>

      <Box />
    </Flex>
    </AnimatedPage>
  );
};