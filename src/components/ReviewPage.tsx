import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  VStack,
  Heading,
  Text,
  Divider,
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useLoanApp } from "../context/LoanAppContext";
import { AnimatedPage } from "../functions/AnimatedPage";
import emailjs from "@emailjs/browser";

const DataRow: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <Flex justify="space-between" py={1} borderBottom="1px solid #EDF2F7">
    <Text fontWeight="medium" color="gray.700">
      {label}
    </Text>
    <Text color="gray.800">{String(value)}</Text>
  </Flex>
);

export const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useLoanApp();
  const toast = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recipient, setRecipient] = useState<string>("Luis Alban");
  const [isSending, setIsSending] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = () => {
    setIsDialogOpen(true);
  };

  const handleFinalSubmit = async () => {
    setIsSending(true);

    // Map recipient to email address
    const emailMap: Record<string, string> = {
      "Luis Alban": "lalban@pmfmortgage.com",
      "Joshua Goff": "jgoff@pmfmortgage.com",
      "Andy Hall": "ahall@pmfmortgage.com",
    };

    const recipientEmail = emailMap[recipient];

    try {
      await emailjs.send(
        "PMF Lake Mary",
        "template_sqtn2kq",
        {
          to_name: recipient,
        to_email: recipientEmail,

        personal_fullName: data.personalInfo.fullName,
        personal_ssn: data.personalInfo.ssn,
        personal_dob: data.personalInfo.dob,
        personal_citizenship: data.personalInfo.citizenship,
        personal_maritalStatus: data.personalInfo.maritalStatus,
        personal_phone: data.personalInfo.phone,
        personal_email: data.personalInfo.email,
        personal_street: data.personalInfo.street,
        personal_city: data.personalInfo.city,
        personal_state: data.personalInfo.state,
        personal_zip: data.personalInfo.zip,

        employment_employerName: data.employmentInfo.employerName,
        employment_position: data.employmentInfo.position,
        employment_startDate: data.employmentInfo.startDate,
        employment_yearsInLineOfWork: data.employmentInfo.yearsInLineOfWork,
        employment_monthlyIncomeBase: data.employmentInfo.monthlyIncomeBase,

        assets_summary: JSON.stringify(data.assetsLiabilities, null, 2),
        realEstate_summary: JSON.stringify(data.realEstate, null, 2),
        loanProperty_summary: JSON.stringify(data.loanProperty, null, 2),
        declarations_summary: JSON.stringify(data.declarations, null, 2),
        },
        "AZ8_cULXf034K-faR"
      );

      toast({
        title: "Application sent.",
        description: `Successfully sent to ${recipient}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setIsDialogOpen(false);
      // Optionally navigate to thank you
      // navigate("/");
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "There was an issue sending the application.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatedPage>
      <Flex direction="column" minH="100vh" align="center" bg="white" px={4} py={6}>
        <VStack spacing={4} maxW="700px" w="100%">
          <Heading as="h2" size="lg" textAlign="center">
            Review Your Application
          </Heading>
          <Text textAlign="center" color="gray.600">
            Please review the information you entered below. Use "Edit" to make changes.
          </Text>

          <VStack w="100%" spacing={6} align="stretch">
            {[
              { label: "Personal Information", path: "/personal-info", section: data.personalInfo },
              { label: "Employment Information", path: "/employment-info", section: data.employmentInfo },
              { label: "Assets & Liabilities", path: "/assets-liabilities", section: data.assetsLiabilities },
              { label: "Real Estate Information", path: "/real-estate-info", section: data.realEstate },
              { label: "Loan Property Information", path: "/loan-property-info", section: data.loanProperty },
              { label: "Declarations", path: "/declarations", section: data.declarations },
            ].map((s) => (
              <Box key={s.label} borderWidth="1px" borderRadius="md" p={4}>
                <Flex justify="space-between" align="center">
                  <Heading as="h3" size="md">{s.label}</Heading>
                  <Button size="sm" variant="outline" onClick={() => navigate(s.path)}>
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

      {/* Modal */}
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Send Application
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text mb={2}>Who would you like to send this application to?</Text>
              <Select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              >
                <option value="Luis Alban">Luis Alban</option>
                <option value="Joshua Goff">Joshua Goff</option>
                <option value="Andy Hall">Andy Hall</option>
              </Select>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleFinalSubmit}
                ml={3}
                isLoading={isSending}
                loadingText="Sending"
              >
                Send
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AnimatedPage>
  );
};