import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Badge,
  Divider,
  useToast,
  Spinner,
  AlertDialog,       
  AlertDialogBody,   
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { AnimatedPage } from "../ui/AnimatedPage";
import { useNavigate } from "react-router-dom";
import { useLoanApp } from "../hooks/useLoanApp";
import {
  FaClipboardList,
  FaArrowRight,
  FaUser,
  FaBriefcase,
  FaDollarSign,
  FaHome,
  FaFileAlt,
  FaEdit,
  FaCheckCircle,
} from "react-icons/fa";

import { getUserApplication } from "../lib/api";
import { deleteUserApplication } from "../lib/api";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    data,
    updatePersonalInfo,
    updateEmploymentInfo,
    updateAssetsLiabilities,
    updateRealEstate,
    updateLoanProperty,
    updateDeclarations,
  } = useLoanApp();

  const toast = useToast();
  const [existingApp, setExistingApp] = useState<any | null>(null);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);
  const [hasHydratedApp, setHasHydratedApp] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const cancelWithdrawRef = React.useRef<HTMLButtonElement | null>(null);  

  useEffect(() => {
    let cancelled = false;

    async function getData() {
      try {
        const app = await getUserApplication();
        if (!cancelled) {
          setExistingApp(app);
        }
      } catch (err: any) {
        if (!cancelled) {
          if (err.message !== "Not authenticated") {
            console.error("Error loading user application:", err);
            toast({
              title: "Error loading application",
              description:
                "We couldn't load your existing application status. You can still continue your pre-qualification.",
              status: "warning",
              duration: 5000,
              isClosable: true,
            });
          }
        }
      } finally {
        if (!cancelled) setIsLoadingExisting(false);
      }
    }

    getData();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  useEffect(() => {
    if (!existingApp) return;
    if (hasHydratedApp) return;

    if (existingApp.personalInfo) {
      updatePersonalInfo(existingApp.personalInfo);
    }
    if (existingApp.employmentInfo) {
      updateEmploymentInfo(existingApp.employmentInfo);
    }
    if (existingApp.assetsLiabilities) {
      updateAssetsLiabilities(existingApp.assetsLiabilities);
    }
    if (existingApp.realEstate) {
      updateRealEstate(existingApp.realEstate);
    }
    if (existingApp.loanProperty) {
      updateLoanProperty(existingApp.loanProperty);
    }
    if (existingApp.declarations) {
      updateDeclarations(existingApp.declarations);
    }

    setHasHydratedApp(true);
  }, [
    existingApp,
    hasHydratedApp,
    updatePersonalInfo,
    updateEmploymentInfo,
    updateAssetsLiabilities,
    updateRealEstate,
    updateLoanProperty,
    updateDeclarations
  ]);

  const hasStartedPreQualification =
    !!existingApp || (data.personalInfo && Object.keys(data.personalInfo).length > 0);

  const sections = [
    {
      name: "Personal Information",
      icon: FaUser,
      route: "/personal-info",
      data: data.personalInfo,
      completed: data.personalInfo && Object.keys(data.personalInfo).length > 3,
    },
    {
      name: "Employment Information",
      icon: FaBriefcase,
      route: "/employment-info",
      data: data.employmentInfo,
      completed:
        data.employmentInfo && Object.keys(data.employmentInfo).length > 3,
    },
    {
      name: "Assets & Liabilities",
      icon: FaDollarSign,
      route: "/assets-liabilities",
      data: data.assetsLiabilities,
      completed:
        data.assetsLiabilities &&
        ((data.assetsLiabilities.assetsAccounts &&
          data.assetsLiabilities.assetsAccounts.length > 0) ||
          (data.assetsLiabilities.liabilities &&
            data.assetsLiabilities.liabilities.length > 0)),
    },
    {
      name: "Real Estate Information",
      icon: FaHome,
      route: "/real-estate-info",
      data: data.realEstate,
      completed: data.realEstate && Object.keys(data.realEstate).length > 0,
    },
    {
      name: "Loan & Property Info",
      icon: FaFileAlt,
      route: "/loan-property-info",
      data: data.loanProperty,
      completed: data.loanProperty && Object.keys(data.loanProperty).length > 3,
    },
    {
      name: "Declarations",
      icon: FaFileAlt,
      route: "/declarations",
      data: data.declarations,
      completed: data.declarations && Object.keys(data.declarations).length > 3,
    },
  ];

  const handleWithdrawApplication = async () => {
    if (!existingApp) return;

    setIsWithdrawing(true);
    try {
      await deleteUserApplication();

      setExistingApp(null);
      setHasHydratedApp(false);

      updatePersonalInfo({});
      updateEmploymentInfo({});
      updateAssetsLiabilities({});
      updateRealEstate({});
      updateLoanProperty({});
      updateDeclarations({});

      toast({
        title: "Application withdrawn",
        description: "Your application has been removed. You can start a new one anytime.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setIsWithdrawDialogOpen(false);
    } catch (err: any) {
      console.error("Error withdrawing application:", err);
      toast({
        title: "Error withdrawing application",
        description: err.message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsWithdrawing(false);
      window.location.reload();
    }
  };

  return (
    <AnimatedPage>
      <Container maxW="container.lg" py={10}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="xl" mb={2}>
              Dashboard
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Manage your pre-qualification application
            </Text>
          </Box>

          {/* Server-side application status */}
          <Card p={4} borderRadius="lg" borderWidth={1}>
            {isLoadingExisting ? (
              <HStack spacing={3}>
                <Spinner size="sm" />
                <Text color="gray.600" fontSize="sm">
                  Checking your application status...
                </Text>
              </HStack>
            ) : existingApp ? (
              <HStack justify="space-between" align="center" flexWrap="wrap">
                <Box>
                  <Heading size="sm" mb={1}>
                    Application Status
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Submitted
                  </Text>
                  {existingApp.updatedAt && (
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Last updated:{" "}
                      {new Date(existingApp.updatedAt).toLocaleString()}
                    </Text>
                  )}
                </Box>
                <Badge
                  colorScheme="green"
                  fontSize="xs"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  Submitted
                </Badge>
              </HStack>
            ) : (
              <Text fontSize="sm" color="gray.600">
                No application found on file yet.
              </Text>
            )}
          </Card>

          {!hasStartedPreQualification ? (
            // User hasn't started pre-qualification yet
            <Card p={8} boxShadow="lg" borderRadius="xl">
              <VStack spacing={6} align="stretch">
                <Alert
                  status="info"
                  variant="subtle"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  borderRadius="lg"
                  py={8}
                >
                  <AlertIcon boxSize="40px" mr={0} />
                  <AlertTitle mt={4} mb={1} fontSize="xl">
                    You Haven&apos;t Been Pre-Qualified Yet
                  </AlertTitle>
                  <AlertDescription maxWidth="md" fontSize="md">
                    Start your free pre-qualification process now. It only takes
                    5 minutes and won&apos;t affect your credit score.
                  </AlertDescription>
                </Alert>

                <VStack spacing={4}>
                  <HStack
                    spacing={3}
                    align="flex-start"
                    w="full"
                    p={4}
                    bg="gray.50"
                    borderRadius="md"
                  >
                    <Icon
                      as={FaClipboardList}
                      color="brand.600"
                      boxSize={5}
                      mt={1}
                    />
                    <Box>
                      <Text fontWeight="bold" mb={1}>
                        Quick & Easy Process
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Answer a few simple questions about yourself, your
                        employment, assets, and the property you&apos;re
                        interested in.
                      </Text>
                    </Box>
                  </HStack>

                  <Button
                    size="lg"
                    colorScheme="blue"
                    rightIcon={<FaArrowRight />}
                    onClick={() => navigate("/personal-info")}
                    w="full"
                    py={6}
                  >
                    Start Pre-Qualification
                  </Button>
                </VStack>
              </VStack>
            </Card>
          ) : (
            <>
              {/* Application Sections */}
              <Box>
                <Heading size="lg" mb={4}>
                  Your Information
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {sections.map((section) => (
                    <Card
                      key={section.name}
                      p={6}
                      boxShadow="md"
                      borderRadius="xl"
                      _hover={{
                        boxShadow: "lg",
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.2s"
                      borderWidth={2}
                      borderColor={section.completed ? "green.200" : "gray.200"}
                    >
                      <VStack align="stretch" spacing={4}>
                        <HStack justify="space-between">
                          <HStack>
                            <Icon
                              as={section.icon}
                              color="blue.600"
                              boxSize={6}
                            />
                            <Badge
                              colorScheme={section.completed ? "green" : "gray"}
                              fontSize="xs"
                            >
                              {section.completed ? "Complete" : "Incomplete"}
                            </Badge>
                          </HStack>
                          {section.completed && (
                            <Icon
                              as={FaCheckCircle}
                              color="green.500"
                              boxSize={5}
                            />
                          )}
                        </HStack>

                        <Box>
                          <Heading size="sm" mb={2}>
                            {section.name}
                          </Heading>
                          <Text fontSize="sm" color="gray.600" noOfLines={2}>
                            {section.completed
                              ? "Review and edit your information"
                              : "Complete this section to continue"}
                          </Text>
                        </Box>

                        <Button
                          size="sm"
                          colorScheme={section.completed ? "blue" : "gray"}
                          variant={section.completed ? "outline" : "solid"}
                          leftIcon={<FaEdit />}
                          onClick={() => navigate(section.route)}
                        >
                          {section.completed ? "Edit" : "Complete"}
                        </Button>
                      </VStack>
                    </Card>
                  ))}
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Quick Info Summary - Personal Info */}
              {data.personalInfo &&
                Object.keys(data.personalInfo).length > 0 && (
                  <Card p={6} boxShadow="md" borderRadius="xl">
                    <Heading size="md" mb={4}>
                      Quick Summary
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                      {data.personalInfo.fullName && (
                        <Box>
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            fontWeight="bold"
                          >
                            FULL NAME
                          </Text>
                          <Text fontSize="md">
                            {data.personalInfo.fullName}
                          </Text>
                        </Box>
                      )}
                      {data.personalInfo.email && (
                        <Box>
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            fontWeight="bold"
                          >
                            EMAIL
                          </Text>
                          <Text fontSize="md">{data.personalInfo.email}</Text>
                        </Box>
                      )}
                      {data.personalInfo.phone && (
                        <Box>
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            fontWeight="bold"
                          >
                            PHONE
                          </Text>
                          <Text fontSize="md">{data.personalInfo.phone}</Text>
                        </Box>
                      )}
                      {data.employmentInfo?.employerName && (
                        <Box>
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            fontWeight="bold"
                          >
                            EMPLOYER
                          </Text>
                          <Text fontSize="md">
                            {data.employmentInfo.employerName}
                          </Text>
                        </Box>
                      )}
                      {data.employmentInfo?.monthlyIncomeBase && (
                        <Box>
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            fontWeight="bold"
                          >
                            MONTHLY INCOME
                          </Text>
                          <Text fontSize="md">
                            {data.employmentInfo.monthlyIncomeBase}
                          </Text>
                        </Box>
                      )}
                      {data.loanProperty?.salesPrice && (
                        <Box>
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            fontWeight="bold"
                          >
                            PROPERTY PRICE
                          </Text>
                          <Text fontSize="md">
                            {data.loanProperty.salesPrice}
                          </Text>
                        </Box>
                      )}
                    </SimpleGrid>
                  </Card>
                )}

                {existingApp && (
                    <Card
                      p={6}
                      boxShadow="md"
                      borderRadius="xl"
                      borderWidth={1}
                      borderColor="red.200"
                      bg="red.50"
                    >
                      <HStack justify="space-between" align="flex-start" spacing={4}>
                        <Box>
                          <Heading size="md" color="red.600" mb={2}>
                            Withdraw Application
                          </Heading>
                          <Text fontSize="sm" color="red.700">
                            This will permanently remove your current application.
                            You&apos;ll be able to start a new application from scratch.
                          </Text>
                        </Box>
                        <Button
                          colorScheme="red"
                          variant="solid"
                          onClick={() => setIsWithdrawDialogOpen(true)}
                          isLoading={isWithdrawing}
                          loadingText="Withdrawing..."
                        >
                          Withdraw Application
                        </Button>
                      </HStack>
                    </Card>
                  )}
            </>
          )}
        </VStack>
      </Container>
      {existingApp && (
        <AlertDialog
          isOpen={isWithdrawDialogOpen}
          leastDestructiveRef={cancelWithdrawRef}
          onClose={() => !isWithdrawing && setIsWithdrawDialogOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Withdraw Application
              </AlertDialogHeader>

              <AlertDialogBody>
                This will permanently remove your current application and clear your saved answers.
                Are you sure you want to continue?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelWithdrawRef}
                  onClick={() => setIsWithdrawDialogOpen(false)}
                  isDisabled={isWithdrawing}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleWithdrawApplication}
                  ml={3}
                  isLoading={isWithdrawing}
                  loadingText="Withdrawing..."
                >
                  Withdraw
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </AnimatedPage>
  );
};
