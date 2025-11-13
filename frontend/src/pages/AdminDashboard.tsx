import React, { useEffect, useState, useMemo } from "react";
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
  Badge,
  useToast,
  Spinner,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Input,
} from "@chakra-ui/react";
import { AnimatedPage } from "../ui/AnimatedPage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getAllApplications } from "../lib/api";
import {
  FaUsers,
} from "react-icons/fa";

type Application = {
  _id: string;
  userId: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  approval?: "approved" | "denied" | "pending";
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
  loanProperty?: {
    salesPrice?: string;
    propertyAddress?: string;
    occupancy?: string;
  };
};

import { updateApplicationApproval } from "../lib/api";

export const AdminDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(true);
  const [filter, setFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    let cancelled = false;

    async function loadApps() {
      try {
        const data = await getAllApplications();
        if (!cancelled) {
            if (!data.ok) {
            throw new Error(data.error || "Failed to fetch applications");
            }

            setApplications(data.applications || []);
        }
      } catch (err: any) {
        console.error("Error fetching applications:", err);
        if (!cancelled) {
          toast({
            title: "Failed to load applications",
            description: err.message || "Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } finally {
        if (!cancelled) setIsLoadingApps(false);
      }
    }

    loadApps();

    return () => {
      cancelled = true;
    };
  }, [user, toast]);

  const handleApprovalChange = async (
    appId: string,
    approval: "approved" | "denied"
  ) => {
    try {
      setUpdatingId(appId);
      const result = await updateApplicationApproval(appId, approval);

      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId
            ? {
                ...app,
                approval: result.approval,
                approvalUpdatedAt: new Date().toISOString(),
              }
            : app
        )
      );

      toast({
        title: `Application ${approval}`,
        description: `Application has been marked as ${approval}.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err: any) {
      console.error("Error updating approval:", err);
      toast({
        title: "Failed to update approval",
        description: err.message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const statusColor: Record<string, string> = {
    approved: "green",
    pending : "yellow",
    denied : "red",
  };

  const filteredApps = useMemo(() => {
    if (!filter.trim()) return applications;

    const term = filter.toLowerCase();
    return applications.filter((app) => {
      const name = app.personalInfo?.fullName?.toLowerCase() || "";
      const email = app.personalInfo?.email?.toLowerCase() || "";
      const status = app.status?.toLowerCase() || "";
      const propertyAddr = app.loanProperty?.propertyAddress?.toLowerCase() || "";
      return (
        name.includes(term) ||
        email.includes(term) ||
        status.includes(term) ||
        propertyAddr.includes(term) ||
        app._id.toString().includes(term)
      );
    });
  }, [applications, filter]);

  if (loading || (user && user.role !== "admin" && isLoadingApps)) {
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

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <AnimatedPage>
      <Container maxW="6xl" py={10}>
        <VStack align="stretch" spacing={8}>
          {/* Header */}
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Box>
              <Heading size="xl" mb={1}>
                Admin Dashboard
              </Heading>
            </Box>
            <Tag
              size="lg"
              colorScheme="purple"
              borderRadius="full"
              fontWeight="bold"
            >
              Admin: {user.email}
            </Tag>
          </HStack>

          {/* Filter/Search */}
          <Card p={4}>
            <HStack spacing={4} align="center">
              <Icon as={FaUsers} boxSize={5} color="blue.500" />
              <Input
                placeholder="Search..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </HStack>
          </Card>

          {/* Applications table */}
          <Card p={0} overflowX="auto">
            {isLoadingApps ? (
              <Box p={8} textAlign="center">
                <Spinner />
              </Box>
            ) : filteredApps.length === 0 ? (
              <Box p={8} textAlign="center">
                <Heading size="sm" mb={2}>
                  No applications found
                </Heading>
                <Text color="gray.600">
                  Try adjusting your search or check back later.
                </Text>
              </Box>
            ) : (
              <Table size="sm" variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>Applicant</Th>
                    <Th>Email</Th>
                    <Th textAlign="center">Status</Th>
                    <Th>Property</Th>
                    <Th isNumeric>Price</Th>
                    <Th>Submitted</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredApps.map((app) => {
                    const name = app.personalInfo?.fullName || "N/A";
                    const email = app.personalInfo?.email || "N/A";
                    const status = app.approval || "N/A";
                    const property =
                      app.loanProperty?.propertyAddress || "Not specified";
                    const price = app.loanProperty?.salesPrice || "";
                    const createdAt = app.createdAt
                      ? new Date(app.createdAt).toLocaleString()
                      : "Unknown";

                    return (
                      <Tr key={app._id}>
                        <Td>
                          <VStack align="flex-start" spacing={0}>
                            <Text fontWeight="medium">{name}</Text>
                            <Text fontSize="xs" color="gray.500">
                              ID: {app._id}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>{email}</Td>
                        <Td>
                            <Flex justify="center" align="center">
                                <Badge
                                    colorScheme={
                                    statusColor[status]
                                    }
                                    textAlign="center"
                                >
                                    {status.toUpperCase()}
                                </Badge>
                            </Flex>
                        </Td>
                        <Td maxW="220px">
                          <Text noOfLines={2} fontSize="sm">
                            {property}
                          </Text>
                        </Td>
                        <Td isNumeric>
                          {price ? `$${Number(price).toLocaleString()}` : "—"}
                        </Td>
                        <Td>
                          <Text fontSize="xs" color="gray.600">
                            {createdAt}
                          </Text>
                        </Td>
                        <Td>
                          <HStack>
                            <Button
                                size="xs"
                                variant="outline"
                                onClick={() => navigate(`/admin/applications/${app._id}`)}
                            >
                                View
                            </Button>
                            <Button
                              size="xs"
                              colorScheme="green"
                              variant={status === "approved" ? "solid" : "outline"}
                              isDisabled={updatingId === app._id}
                              onClick={() => handleApprovalChange(app._id, "approved")}
                            >
                              Approve
                            </Button> 
                            <Button
                              size="xs"
                              colorScheme="red"
                              variant={status === "denied" ? "solid" : "outline"}
                              isDisabled={updatingId === app._id}
                              onClick={() => handleApprovalChange(app._id, "denied")}
                            >
                              Deny
                            </Button>                        
                          </HStack>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </Card>
        </VStack>
      </Container>
    </AnimatedPage>
  );
};
