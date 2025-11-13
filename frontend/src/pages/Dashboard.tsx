import React from "react";
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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
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

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useLoanApp();

  // Check if user has started pre-qualification by checking if any personal info exists
  const hasStartedPreQualification =
    data.personalInfo && Object.keys(data.personalInfo).length > 0;

  // Check completion status of each section
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

  const completedSections = sections.filter((s) => s.completed).length;
  const totalSections = sections.length;
  const progressPercent = Math.round((completedSections / totalSections) * 100);

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
                    You Haven't Been Pre-Qualified Yet
                  </AlertTitle>
                  <AlertDescription maxWidth="md" fontSize="md">
                    Start your free pre-qualification process now. It only takes
                    5 minutes and won't affect your credit score.
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
                        employment, assets, and the property you're interested
                        in.
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
            // User has started pre-qualification - Show detailed dashboard
            <>
              {/* Progress Overview */}
              <Card
                p={8}
                boxShadow="lg"
                borderRadius="xl"
                bg="blue.50"
                borderColor="blue.200"
                borderWidth={1}
              >
                <HStack
                  justify="space-between"
                  align="flex-start"
                  wrap="wrap"
                  spacing={6}
                >
                  <Box>
                    <Heading size="md" mb={2}>
                      Application Progress
                    </Heading>
                    <Text color="gray.600">
                      {completedSections} of {totalSections} sections completed
                    </Text>
                  </Box>
                  <Stat>
                    <StatLabel>Completion</StatLabel>
                    <StatNumber fontSize="4xl" color="blue.600">
                      {progressPercent}%
                    </StatNumber>
                    <StatHelpText>
                      {progressPercent === 100
                        ? "Ready to submit!"
                        : "Keep going!"}
                    </StatHelpText>
                  </Stat>
                </HStack>
              </Card>

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
                            ${data.employmentInfo.monthlyIncomeBase}
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
                            ${data.loanProperty.salesPrice}
                          </Text>
                        </Box>
                      )}
                    </SimpleGrid>
                  </Card>
                )}

              {/* Action Buttons */}
              <Card p={6} boxShadow="lg" borderRadius="xl" bg="gray.50">
                <VStack spacing={4}>
                  <Heading size="md">Next Steps</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                    <Button
                      size="lg"
                      colorScheme="blue"
                      rightIcon={<FaArrowRight />}
                      onClick={() => navigate("/review")}
                    >
                      Review & Submit Application
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      colorScheme="blue"
                      onClick={() => {
                        const firstIncomplete = sections.find(
                          (s) => !s.completed
                        );
                        navigate(firstIncomplete?.route || "/personal-info");
                      }}
                    >
                      Continue Where I Left Off
                    </Button>
                  </SimpleGrid>
                </VStack>
              </Card>
            </>
          )}
        </VStack>
      </Container>
    </AnimatedPage>
  );
};
