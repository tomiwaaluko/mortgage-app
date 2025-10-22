import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Text,
  VStack,
  Link,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AnimatedPage } from "../functions/AnimatedPage";
import { 
  FaCheckCircle, 
  FaClock, 
  FaShieldAlt, 
  FaStar, 
  FaHandshake,
  FaChartLine,
  FaUserTie,
  FaAward,
} from "react-icons/fa";

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <Box bg="white">
        {/* Hero Section */}
        <Box
          bgGradient="linear(to-br, brand.500, brand.700)"
          color="white"
          py={{ base: 16, md: 24 }}
          px={4}
          position="relative"
          overflow="hidden"
        >
          <Container maxW="container.xl">
            <Grid
              templateColumns={{ base: "1fr", md: "1fr 1fr" }}
              gap={8}
              alignItems="center"
            >
              <VStack align={{ base: "center", md: "flex-start" }} spacing={6} textAlign={{ base: "center", md: "left" }}>
                <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
                  ⚡ Get Pre-Qualified in 5 Minutes
                </Badge>
                <Heading
                  as="h1"
                  fontSize={{ base: "3xl", md: "5xl" }}
                  fontWeight="bold"
                  lineHeight="1.2"
                >
                  Your Dream Home Starts Here
                </Heading>
                <Text fontSize={{ base: "lg", md: "xl" }} opacity={0.95}>
                  Pioneer Mortgage Funding makes home buying simple, fast, and stress-free. 
                  Join thousands of Florida families who found their perfect home with us.
                </Text>
                <HStack spacing={4} flexWrap="wrap" justify={{ base: "center", md: "flex-start" }}>
                  <HStack>
                    <Box as={FaCheckCircle} />
                    <Text fontSize="sm">No SSN Required</Text>
                  </HStack>
                  <HStack>
                    <Box as={FaCheckCircle} />
                    <Text fontSize="sm">No Credit Impact</Text>
                  </HStack>
                  <HStack>
                    <Box as={FaCheckCircle} />
                    <Text fontSize="sm">100% Free</Text>
                  </HStack>
                </HStack>
                <Button
                  size="lg"
                  colorScheme="green"
                  px={10}
                  py={7}
                  fontSize="xl"
                  borderRadius="full"
                  boxShadow="2xl"
                  _hover={{ transform: "translateY(-2px)", boxShadow: "3xl" }}
                  transition="all 0.2s"
                  onClick={() => navigate("/personal-info")}
                >
                  Get Pre-Qualified Now →
                </Button>
                <Text fontSize="xs" opacity={0.8}>
                  ⭐ Trusted by 10,000+ Florida homebuyers • 4.9/5 rating
                </Text>
              </VStack>
              <Box display={{ base: "none", md: "block" }}>
                <Image
                  src="/welcome.png"
                  alt="Happy family in front of their new home"
                  borderRadius="2xl"
                  boxShadow="2xl"
                />
              </Box>
            </Grid>
          </Container>
        </Box>

        {/* Trust Bar */}
        <Box bg="gray.50" py={6} borderBottom="1px" borderColor="gray.200">
          <Container maxW="container.xl">
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} textAlign="center">
              <VStack>
                <Text fontSize="3xl" fontWeight="bold" color="brand.600">
                  $2.5B+
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Loans Funded
                </Text>
              </VStack>
              <VStack>
                <Text fontSize="3xl" fontWeight="bold" color="brand.600">
                  10,000+
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Happy Homeowners
                </Text>
              </VStack>
              <VStack>
                <Text fontSize="3xl" fontWeight="bold" color="brand.600">
                  4.9/5
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Customer Rating
                </Text>
              </VStack>
              <VStack>
                <Text fontSize="3xl" fontWeight="bold" color="brand.600">
                  24hr
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Avg. Response Time
                </Text>
              </VStack>
            </SimpleGrid>
          </Container>
        </Box>

        {/* How It Works Section */}
        <Box py={{ base: 16, md: 20 }} px={4}>
          <Container maxW="container.xl">
            <VStack spacing={4} mb={12} textAlign="center">
              <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }}>
                Simple. Fast. Transparent.
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Getting pre-qualified shouldn't be complicated. Here's how we make it easy.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <VStack
                bg="white"
                p={8}
                borderRadius="xl"
                boxShadow="lg"
                border="1px"
                borderColor="gray.100"
                spacing={4}
                transition="all 0.3s"
                _hover={{ transform: "translateY(-5px)", boxShadow: "2xl" }}
              >
                <Box
                  bg="brand.50"
                  p={4}
                  borderRadius="full"
                  color="brand.600"
                >
                  <Box as={FaClock} fontSize="32px" />
                </Box>
                <Heading as="h3" fontSize="xl">
                  1. Quick Application
                </Heading>
                <Text textAlign="center" color="gray.600">
                  Fill out our simple 5-minute form. No lengthy paperwork or confusing jargon.
                </Text>
              </VStack>
              <VStack
                bg="white"
                p={8}
                borderRadius="xl"
                boxShadow="lg"
                border="1px"
                borderColor="gray.100"
                spacing={4}
                transition="all 0.3s"
                _hover={{ transform: "translateY(-5px)", boxShadow: "2xl" }}
              >
                <Box
                  bg="brand.50"
                  p={4}
                  borderRadius="full"
                  color="brand.600"
                >
                  <Box as={FaChartLine} fontSize="32px" />
                </Box>
                <Heading as="h3" fontSize="xl">
                  2. Instant Results
                </Heading>
                <Text textAlign="center" color="gray.600">
                  Get your pre-qualification amount immediately. See what you can afford right away.
                </Text>
              </VStack>
              <VStack
                bg="white"
                p={8}
                borderRadius="xl"
                boxShadow="lg"
                border="1px"
                borderColor="gray.100"
                spacing={4}
                transition="all 0.3s"
                _hover={{ transform: "translateY(-5px)", boxShadow: "2xl" }}
              >
                <Box
                  bg="brand.50"
                  p={4}
                  borderRadius="full"
                  color="brand.600"
                >
                  <Box as={FaHandshake} fontSize="32px" />
                </Box>
                <Heading as="h3" fontSize="xl">
                  3. Expert Guidance
                </Heading>
                <Text textAlign="center" color="gray.600">
                  Connect with a dedicated loan officer who'll guide you every step of the way.
                </Text>
              </VStack>
            </SimpleGrid>
          </Container>
        </Box>

        {/* Benefits Section */}
        <Box bg="gray.50" py={{ base: 16, md: 20 }} px={4}>
          <Container maxW="container.xl">
            <VStack spacing={4} mb={12} textAlign="center">
              <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }}>
                Why Choose Pioneer Mortgage Funding?
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                We're not just another lender. We're your partner in making homeownership a reality.
              </Text>
            </VStack>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
              <HStack
                bg="white"
                p={6}
                borderRadius="lg"
                spacing={4}
                align="flex-start"
              >
                <Box as={FaShieldAlt} fontSize="24px" color="brand.600" mt={1} />
                <Box>
                  <Heading as="h4" fontSize="lg" mb={2}>
                    Secure & Confidential
                  </Heading>
                  <Text color="gray.600">
                    Your information is protected with bank-level 256-bit encryption. We never sell your data.
                  </Text>
                </Box>
              </HStack>
              <HStack
                bg="white"
                p={6}
                borderRadius="lg"
                spacing={4}
                align="flex-start"
              >
                <Box as={FaStar} fontSize="24px" color="brand.600" mt={1} />
                <Box>
                  <Heading as="h4" fontSize="lg" mb={2}>
                    Best Rates Guaranteed
                  </Heading>
                  <Text color="gray.600">
                    Access exclusive rates and programs. We shop multiple lenders to find your best deal.
                  </Text>
                </Box>
              </HStack>
              <HStack
                bg="white"
                p={6}
                borderRadius="lg"
                spacing={4}
                align="flex-start"
              >
                <Box as={FaUserTie} fontSize="24px" color="brand.600" mt={1} />
                <Box>
                  <Heading as="h4" fontSize="lg" mb={2}>
                    Local Florida Experts
                  </Heading>
                  <Text color="gray.600">
                    Our team knows Florida's housing market inside and out. Get personalized local advice.
                  </Text>
                </Box>
              </HStack>
              <HStack
                bg="white"
                p={6}
                borderRadius="lg"
                spacing={4}
                align="flex-start"
              >
                <Box as={FaAward} fontSize="24px" color="brand.600" mt={1} />
                <Box>
                  <Heading as="h4" fontSize="lg" mb={2}>
                    Award-Winning Service
                  </Heading>
                  <Text color="gray.600">
                    Rated #1 in customer satisfaction. Real people, real support, whenever you need it.
                  </Text>
                </Box>
              </HStack>
            </Grid>
          </Container>
        </Box>

        {/* Testimonials Section */}
        <Box py={{ base: 16, md: 20 }} px={4}>
          <Container maxW="container.xl">
            <VStack spacing={4} mb={12} textAlign="center">
              <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }}>
                Stories From Our Happy Homeowners
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Don't just take our word for it. Here's what Florida families are saying.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Box
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="md"
                border="1px"
                borderColor="gray.200"
              >
                <HStack mb={3}>
                  {[...Array(5)].map((_, i) => (
                    <Box key={i} as={FaStar} color="yellow.400" />
                  ))}
                </HStack>
                <Text mb={4} color="gray.700" fontStyle="italic">
                  "PMF made our first home purchase so easy! They answered every question and got us the best rate. Highly recommend!"
                </Text>
                <Text fontWeight="bold">Sarah & Mike Johnson</Text>
                <Text fontSize="sm" color="gray.500">
                  Tampa, FL • First-Time Buyers
                </Text>
              </Box>
              <Box
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="md"
                border="1px"
                borderColor="gray.200"
              >
                <HStack mb={3}>
                  {[...Array(5)].map((_, i) => (
                    <Box key={i} as={FaStar} color="yellow.400" />
                  ))}
                </HStack>
                <Text mb={4} color="gray.700" fontStyle="italic">
                  "The team was professional and responsive. We closed in 3 weeks! They truly care about their clients."
                </Text>
                <Text fontWeight="bold">Maria Rodriguez</Text>
                <Text fontSize="sm" color="gray.500">
                  Miami, FL • Refinance
                </Text>
              </Box>
              <Box
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="md"
                border="1px"
                borderColor="gray.200"
              >
                <HStack mb={3}>
                  {[...Array(5)].map((_, i) => (
                    <Box key={i} as={FaStar} color="yellow.400" />
                  ))}
                </HStack>
                <Text mb={4} color="gray.700" fontStyle="italic">
                  "Stress-free experience from start to finish. They found us a rate lower than we expected. Forever grateful!"
                </Text>
                <Text fontWeight="bold">David & Lisa Chen</Text>
                <Text fontSize="sm" color="gray.500">
                  Orlando, FL • Home Purchase
                </Text>
              </Box>
            </SimpleGrid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box
          bgGradient="linear(to-r, brand.600, brand.800)"
          py={{ base: 16, md: 20 }}
          px={4}
          color="white"
        >
          <Container maxW="container.md">
            <VStack spacing={6} textAlign="center">
              <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }}>
                Ready to Start Your Journey?
              </Heading>
              <Text fontSize={{ base: "lg", md: "xl" }} opacity={0.95}>
                Join thousands of Florida families who've found their dream home with Pioneer Mortgage Funding. 
                Your pre-qualification is just 5 minutes away.
              </Text>
              <Button
                size="lg"
                colorScheme="green"
                px={12}
                py={7}
                fontSize="xl"
                borderRadius="full"
                boxShadow="2xl"
                _hover={{ transform: "translateY(-2px)", boxShadow: "3xl" }}
                transition="all 0.2s"
                onClick={() => navigate("/personal-info")}
              >
                Get Pre-Qualified Now →
              </Button>
              <VStack spacing={2} mt={4}>
                <HStack spacing={6} flexWrap="wrap" justify="center">
                  <HStack>
                    <Box as={FaCheckCircle} />
                    <Text fontSize="sm">No SSN Required</Text>
                  </HStack>
                  <HStack>
                    <Box as={FaCheckCircle} />
                    <Text fontSize="sm">Won't Affect Credit</Text>
                  </HStack>
                  <HStack>
                    <Box as={FaCheckCircle} />
                    <Text fontSize="sm">100% Free & Secure</Text>
                  </HStack>
                </HStack>
                <Text fontSize="xs" opacity={0.7} mt={4}>
                  By selecting Continue, you agree to our{" "}
                  <Link textDecoration="underline">Terms of Use</Link> and{" "}
                  <Link textDecoration="underline">Privacy Policy</Link>.
                </Text>
              </VStack>
            </VStack>
          </Container>
        </Box>

        {/* Footer */}
        <Box bg="gray.900" color="white" py={8} px={4}>
          <Container maxW="container.xl">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} textAlign={{ base: "center", md: "left" }}>
              <Box>
                <Heading as="h5" fontSize="lg" mb={3}>
                  Pioneer Mortgage Funding
                </Heading>
                <Text fontSize="sm" opacity={0.8}>
                  Making homeownership dreams come true across Florida since 2010.
                </Text>
              </Box>
              <Box>
                <Heading as="h5" fontSize="lg" mb={3}>
                  Quick Links
                </Heading>
                <VStack align={{ base: "center", md: "flex-start" }} spacing={2}>
                  <Link fontSize="sm" opacity={0.8} _hover={{ opacity: 1 }}>About Us</Link>
                  <Link fontSize="sm" opacity={0.8} _hover={{ opacity: 1 }}>Loan Programs</Link>
                  <Link fontSize="sm" opacity={0.8} _hover={{ opacity: 1 }}>Contact</Link>
                  <Link fontSize="sm" opacity={0.8} _hover={{ opacity: 1 }}>FAQ</Link>
                </VStack>
              </Box>
              <Box>
                <Heading as="h5" fontSize="lg" mb={3}>
                  Contact Us
                </Heading>
                <VStack align={{ base: "center", md: "flex-start" }} spacing={2}>
                  <Text fontSize="sm" opacity={0.8}>📞 (555) 123-4567</Text>
                  <Text fontSize="sm" opacity={0.8}>📧 info@pmf.com</Text>
                  <Text fontSize="sm" opacity={0.8}>📍 Florida</Text>
                </VStack>
              </Box>
            </SimpleGrid>
            <Divider my={6} opacity={0.2} />
            <Text textAlign="center" fontSize="xs" opacity={0.6}>
              © 2025 Pioneer Mortgage Funding. All rights reserved. NMLS #123456
            </Text>
          </Container>
        </Box>
      </Box>
    </AnimatedPage>
  );
};