import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  SimpleGrid,
  Divider,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatedPage } from "../ui/AnimatedPage";
import { useAuth } from "../hooks/useAuth";
import { getApplicationById } from "../lib/api";

type Application = {
  _id: string;
  userId: string;
  status: string;
  approval?: string;
  createdAt?: string;
  updatedAt?: string;
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  employmentInfo?: {
    employerName?: string;
    position?: string;
    monthlyIncomeBase?: string | number;
  };
  assetsLiabilities?: any;
  realEstate?: any;
  loanProperty?: {
    salesPrice?: string | number;
    propertyAddress?: string;
    occupancy?: string;
  };
  declarations?: any;
};

export const AdminApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!id || !user || user.role !== "admin") return;

    let cancelled = false;

    async function load() {
      try {
        const app = await getApplicationById(id!);
        if (!cancelled) setApplication(app);
      } catch (err: any) {
        console.error("Error loading application:", err);
        if (!cancelled) {
          toast({
            title: "Failed to load application",
            description: err.message || "Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, user, toast]);

  if (loading || (user && user.role !== "admin" && isLoading)) {
    return (
      <AnimatedPage>
        <Box
          minH="80vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" />
        </Box>
      </AnimatedPage>
    );
  }

  if (!user || user.role !== "admin") return null;

  if (isLoading) {
    return (
      <AnimatedPage>
        <Box
          minH="80vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" />
        </Box>
      </AnimatedPage>
    );
  }

  if (!application) {
    return (
      <AnimatedPage>
        <Container maxW="4xl" py={10}>
          <VStack spacing={4}>
            <Heading size="md">Application not found</Heading>
            <Button onClick={() => navigate("/admin/dashboard")}>
              Back to Dashboard
            </Button>
          </VStack>
        </Container>
      </AnimatedPage>
    );
  }

  const createdAt = application.createdAt
    ? new Date(application.createdAt).toLocaleString()
    : "Unknown";
  const updatedAt = application.updatedAt
    ? new Date(application.updatedAt).toLocaleString()
    : "Unknown";

  const approval = application.approval || "pending";

  const statusColor: Record<string, string> = {
    approved: "green",
    denied: "red",
    pending: "yellow",
    submitted: "blue",
  };

  return (
    <AnimatedPage>
      <Container maxW="5xl" py={10}>
        <VStack align="stretch" spacing={6}>
          {/* Header */}
          <HStack
            justify="space-between"
            align="center"
            flexWrap="wrap"
            gap={4}
          >
            <Box>
              <Heading size="lg">Application Details</Heading>
              <Text color="gray.600">ID: {application._id}</Text>
            </Box>
            <HStack spacing={3}>
              <Badge colorScheme={statusColor[application.status] || "gray"}>
                {application.status.toUpperCase()}
              </Badge>
              <Badge colorScheme={statusColor[approval] || "gray"}>
                {approval.toUpperCase()}
              </Badge>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/dashboard")}
              >
                Back to Dashboard
              </Button>
            </HStack>
          </HStack>

          <Card p={5}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">
                  USER ID
                </Text>
                <Text fontSize="sm">{application.userId}</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">
                  CREATED AT
                </Text>
                <Text fontSize="sm">{createdAt}</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">
                  LAST UPDATED
                </Text>
                <Text fontSize="sm">{updatedAt}</Text>
              </Box>
            </SimpleGrid>
          </Card>

          <Card p={5}>
            <Heading size="md" mb={3}>
              Personal Information
            </Heading>
            {application.personalInfo ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    FULL NAME
                  </Text>
                  <Text>{application.personalInfo.fullName || "N/A"}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    EMAIL
                  </Text>
                  <Text>{application.personalInfo.email || "N/A"}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    PHONE
                  </Text>
                  <Text>{application.personalInfo.phone || "N/A"}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    ADDRESS
                  </Text>
                  <Text>
                    {[
                      application.personalInfo.street,
                      application.personalInfo.city,
                      application.personalInfo.state,
                      application.personalInfo.zip,
                    ]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </Text>
                </Box>
              </SimpleGrid>
            ) : (
              <Text color="gray.500">No personal information on file.</Text>
            )}
          </Card>

          <Card p={5}>
            <Heading size="md" mb={3}>
              Employment Information
            </Heading>
            {application.employmentInfo ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    EMPLOYER
                  </Text>
                  <Text>
                    {application.employmentInfo.employerName || "N/A"}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    POSITION
                  </Text>
                  <Text>{application.employmentInfo.position || "N/A"}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    MONTHLY INCOME
                  </Text>
                  <Text>
                    {application.employmentInfo.monthlyIncomeBase
                      ? `$${Number(
                          application.employmentInfo.monthlyIncomeBase
                        ).toLocaleString()}`
                      : "N/A"}
                  </Text>
                </Box>
              </SimpleGrid>
            ) : (
              <Text color="gray.500">No employment information on file.</Text>
            )}
          </Card>

          <Card p={5}>
            <Heading size="md" mb={3}>
              Loan & Property Information
            </Heading>
            {application.loanProperty ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    PROPERTY ADDRESS
                  </Text>
                  <Text>
                    {application.loanProperty.propertyAddress || "N/A"}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    SALES PRICE
                  </Text>
                  <Text>
                    {application.loanProperty.salesPrice
                      ? `$${Number(
                          application.loanProperty.salesPrice
                        ).toLocaleString()}`
                      : "N/A"}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    OCCUPANCY
                  </Text>
                  <Text>{application.loanProperty.occupancy || "N/A"}</Text>
                </Box>
              </SimpleGrid>
            ) : (
              <Text color="gray.500">
                No loan/property information on file.
              </Text>
            )}
          </Card>

          {/* Add more sections for assetsLiabilities, realEstate, declarations, etc. */}
          {/* <Card> ... </Card> */}

          <Divider />

          <Box textAlign="right">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
            >
              Back to Dashboard
            </Button>
          </Box>
        </VStack>
      </Container>
    </AnimatedPage>
  );
};
