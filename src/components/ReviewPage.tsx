import React from "react";
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AnimatedPage } from "../functions/AnimatedPage";
import { useLoanApp } from "../context/LoanAppContext";

export const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useLoanApp();

  const onSubmit = () => {
    console.log("Submitting Application:", data);
    // You could POST this to your backend here
    alert("Application submitted successfully!");
  };

  return (
    <AnimatedPage>
      <Flex direction="column" minH="100vh" align="center" bg="white" px={4} py={6}>
        <VStack spacing={6} maxW="800px" w="100%">
          <Heading as="h2" size="lg" textAlign="center">
            Review Your Application
          </Heading>
          <Text textAlign="center" color="gray.600">
            Please review all the information you provided.
          </Text>

          <Box w="100%" p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
            <Heading size="md" mb={2}>
              Personal Information
            </Heading>
            <pre>{JSON.stringify(data.personalInfo, null, 2)}</pre>
          </Box>

          <Box w="100%" p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
            <Heading size="md" mb={2}>
              Employment Information
            </Heading>
            <pre>{JSON.stringify(data.employmentInfo, null, 2)}</pre>
          </Box>

          <Box w="100%" p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
            <Heading size="md" mb={2}>
              Assets & Liabilities
            </Heading>
            <pre>{JSON.stringify(data.assetsLiabilities, null, 2)}</pre>
          </Box>

          <Box w="100%" p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
            <Heading size="md" mb={2}>
              Real Estate Information
            </Heading>
            <pre>{JSON.stringify(data.realEstate, null, 2)}</pre>
          </Box>

          <Box w="100%" p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
            <Heading size="md" mb={2}>
              Loan Property Information
            </Heading>
            <pre>{JSON.stringify(data.loanProperty, null, 2)}</pre>
          </Box>

          <Box w="100%" p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
            <Heading size="md" mb={2}>
              Declarations
            </Heading>
            <pre>{JSON.stringify(data.declarations, null, 2)}</pre>
          </Box>

          <Flex justify="space-between" w="100%" mt={4}>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button colorScheme="brand" onClick={onSubmit}>
              Submit Application
            </Button>
          </Flex>
        </VStack>
      </Flex>
    </AnimatedPage>
  );
};