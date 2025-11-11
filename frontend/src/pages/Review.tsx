import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  VStack,
  Heading,
  Text,
  Divider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useLoanApp } from "../hooks/useLoanApp";
import { AnimatedPage } from "../ui/AnimatedPage";

const DataRow: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <Flex justify="space-between" py={1} borderBottom="1px solid #EDF2F7">
    <Text fontWeight="medium" color="gray.700">
      {label}
    </Text>
    <Text color="gray.800">{String(value)}</Text>
  </Flex>
);

export const Review: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useLoanApp();
  const toast = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = () => {
    setIsDialogOpen(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Application submitted!",
        description:
          "Your pre-qualification application has been successfully submitted. We'll be in touch soon.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setIsDialogOpen(false);

      // Navigate to dashboard after successful submission
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description:
          "There was an issue submitting the application. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <VStack spacing={4} maxW="700px" w="100%">
          <Heading as="h2" size="lg" textAlign="center">
            Review Your Application
          </Heading>
          <Text textAlign="center" color="gray.600">
            Please review the information you entered below. Use "Edit" to make
            changes.
          </Text>

          <VStack w="100%" spacing={6} align="stretch">
            {[
              {
                label: "Personal Information",
                path: "/personal-info",
                section: data.personalInfo,
              },
              {
                label: "Employment Information",
                path: "/employment-info",
                section: data.employmentInfo,
              },
              {
                label: "Assets & Liabilities",
                path: "/assets-liabilities",
                section: data.assetsLiabilities,
              },
              {
                label: "Real Estate Information",
                path: "/real-estate-info",
                section: data.realEstate,
              },
              {
                label: "Loan Property Information",
                path: "/loan-property-info",
                section: data.loanProperty,
              },
              {
                label: "Declarations",
                path: "/declarations",
                section: data.declarations,
              },
            ].map((s) => (
              <Box key={s.label} borderWidth="1px" borderRadius="md" p={4}>
                <Flex justify="space-between" align="center">
                  <Heading as="h3" size="md">
                    {s.label}
                  </Heading>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(s.path)}
                  >
                    Edit
                  </Button>
                </Flex>
                <Divider my={2} />
                {Object.entries(s.section).map(([k, v]) => (
                  <DataRow key={k} label={k} value={v || "-"} />
                ))}
              </Box>
            ))}
          </VStack>

          <Flex justify="flex-end" mt={8} w="100%">
            <Button colorScheme="blue" onClick={handleSubmit}>
              Submit Application
            </Button>
          </Flex>
        </VStack>
      </Flex>

      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Submit Application
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>
                Are you ready to submit your pre-qualification application?
                Please make sure all information is correct before proceeding.
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleFinalSubmit}
                ml={3}
                isLoading={isSubmitting}
                loadingText="Submitting"
              >
                Submit
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AnimatedPage>
  );
};
