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
import { useLoanApp } from "../hooks/useLoanApp";
import { AnimatedPage } from "../ui/AnimatedPage";
import emailjs from "@emailjs/browser";

const DataRow: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <Flex justify="space-between" py={1} borderBottom="1px solid #EDF2F7">
    <Text fontWeight="medium" color="gray.700">{label}</Text>
    <Text color="gray.800">{String(value)}</Text>
  </Flex>
);

export const Review: React.FC = () => {
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

        // 1. Personal Info
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

        // 2. Employment Info
        employment_employerName: data.employmentInfo.employerName,
        employment_position: data.employmentInfo.position,
        employment_startDate: data.employmentInfo.startDate,
        employment_yearsInLineOfWork: data.employmentInfo.yearsInLineOfWork,
        employment_monthlyIncomeBase: data.employmentInfo.monthlyIncomeBase,

        // 3. Assets & Liabilities
        assets_accounts: JSON.stringify(data.assetsLiabilities.assetsAccounts, null, 2),
        assets_otherAssets: JSON.stringify(data.assetsLiabilities.otherAssets, null, 2),
        assets_liabilities: JSON.stringify(data.assetsLiabilities.liabilities, null, 2),
        assets_otherLiabilities: JSON.stringify(data.assetsLiabilities.otherLiabilities, null, 2),

        // 4. Real Estate
        realEstate_ownsRealEstate: data.realEstate.ownsRealEstate,
        realEstate_properties: (data.realEstate.properties ?? [])
          .map(
            (p: any, i: number) =>
              `Property ${i + 1}:\nAddress: ${p.address}\nValue: ${p.value}\nStatus: ${p.status}\nOccupancy: ${p.occupancy}\nMonthly Payment: ${p.monthlyPayment}\nRental Income: ${p.rentalIncome}`
          )
          .join("\n\n"),

        // 5. Loan Property
        loan_underContract: data.loanProperty.underContract,
        loan_salesPrice: data.loanProperty.salesPrice,
        loan_downPayment: data.loanProperty.downPayment,
        loan_propertyAddress: data.loanProperty.propertyAddress,
        loan_occupancy: data.loanProperty.occupancy,
        loan_receivingGift: data.loanProperty.receivingGift,
        loan_giftAssetType: data.loanProperty.giftAssetType,
        loan_giftDeposited: data.loanProperty.giftDeposited,
        loan_giftSource: data.loanProperty.giftSource,
        loan_giftValue: data.loanProperty.giftValue,

        // 6. Declarations
        declarations_occupyAsPrimary: data.declarations.occupyAsPrimary,
        declarations_ownedPropertyLast3Years: data.declarations.ownedPropertyLast3Years,
        declarations_typeOfProperty: data.declarations.typeOfProperty,
        declarations_titleHeld: data.declarations.titleHeld,
        declarations_relationshipWithSeller: data.declarations.relationshipWithSeller,
        declarations_borrowingMoney: data.declarations.borrowingMoney,
        declarations_borrowingMoneyAmount: data.declarations.borrowingMoneyAmount,
        declarations_mortgageOnOtherProperty: data.declarations.mortgageOnOtherProperty,
        declarations_obligatedOnLoan: data.declarations.obligatedOnLoan,
        declarations_cosigner: data.declarations.cosigner,
        declarations_borrowedDownPayment: data.declarations.borrowedDownPayment,
        declarations_declaredForeclosure: data.declarations.declaredForeclosure,
        declarations_declaredBankruptcy: data.declarations.declaredBankruptcy,
        declarations_bankruptcyTypes: (data.declarations.bankruptcyTypes || []).join(", "),
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