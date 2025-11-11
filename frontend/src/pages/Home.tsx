import React, { useState, useEffect } from "react";
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
  IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AnimatedPage } from "../ui/AnimatedPage";
import {
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaStar,
  FaHandshake,
  FaChartLine,
  FaUserTie,
  FaAward,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const heroImages = [
  { src: "/home1.jpg", alt: "Beautiful modern home" },
  { src: "/home2.avif", alt: "Elegant family residence" },
  { src: "/home3.webp", alt: "Cozy suburban house" },
  { src: "/home4.webp", alt: "Contemporary dream home" },
  { src: "/home5.webp", alt: "Charming property" },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length
    );
  };

  return (
    <AnimatedPage>
      <Box bg="white">
        {/* Hero Section with Carousel */}
        <Box
          position="relative"
          overflow="hidden"
          h={{ base: "auto", md: "700px" }}
        >
          {/* Background Image Carousel */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={0}
          >
            {heroImages.map((img, index) => (
              <Image
                key={index}
                src={img.src}
                alt={img.alt}
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                objectFit="cover"
                opacity={currentImageIndex === index ? 1 : 0}
                transition="opacity 1s ease-in-out"
              />
            ))}
            {/* Dark overlay for text readability */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.600"
            />
          </Box>

          {/* Carousel Controls */}
          <IconButton
            aria-label="Previous image"
            icon={<FaChevronLeft />}
            position="absolute"
            left={4}
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            onClick={prevImage}
            colorScheme="whiteAlpha"
            size="lg"
            display={{ base: "none", md: "flex" }}
          />
          <IconButton
            aria-label="Next image"
            icon={<FaChevronRight />}
            position="absolute"
            right={4}
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            onClick={nextImage}
            colorScheme="whiteAlpha"
            size="lg"
            display={{ base: "none", md: "flex" }}
          />

          {/* Carousel Indicators */}
          <HStack
            position="absolute"
            bottom={4}
            left="50%"
            transform="translateX(-50%)"
            zIndex={2}
            spacing={2}
          >
            {heroImages.map((_, index) => (
              <Box
                key={index}
                w={currentImageIndex === index ? "24px" : "8px"}
                h="8px"
                bg={currentImageIndex === index ? "white" : "whiteAlpha.500"}
                borderRadius="full"
                cursor="pointer"
                onClick={() => setCurrentImageIndex(index)}
                transition="all 0.3s"
              />
            ))}
          </HStack>

          {/* Hero Content */}
          <Container
            maxW="container.xl"
            position="relative"
            zIndex={1}
            h="100%"
            display="flex"
            alignItems="center"
            py={{ base: 16, md: 0 }}
          >
            <VStack
              align={{ base: "center", md: "flex-start" }}
              spacing={6}
              textAlign={{ base: "center", md: "left" }}
              maxW={{ base: "100%", md: "600px" }}
              color="white"
            >
              <Badge
                colorScheme="green"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
              >
                ⚡ Free Pre-Qualification in 5 Minutes
              </Badge>
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="bold"
                lineHeight="1.2"
              >
                Your Dream Home is Closer Than You Think
              </Heading>
              <Text fontSize={{ base: "lg", md: "xl" }}>
                Get pre-qualified in minutes with Florida's most trusted
                mortgage lender. No impact to your credit score. No hidden fees.
                Just honest answers.
              </Text>
              <HStack
                spacing={4}
                flexWrap="wrap"
                justify={{ base: "center", md: "flex-start" }}
              >
                <HStack>
                  <FaShieldAlt />
                  <Text fontSize="sm">Secure & Private</Text>
                </HStack>
                <HStack>
                  <FaCheckCircle />
                  <Text fontSize="sm">No Credit Impact</Text>
                </HStack>
                <HStack>
                  <FaCheckCircle />
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
                onClick={() => navigate("/auth-prompt")}
              >
                Get Pre-Qualified Now →
              </Button>
            </VStack>
          </Container>
        </Box>

        {/* Trust Bar */}
        <Box bg="gray.50" py={6} borderBottom="1px" borderColor="gray.200">
          <Container maxW="container.xl">
            <SimpleGrid
              columns={{ base: 2, md: 4 }}
              spacing={4}
              textAlign="center"
            >
              <VStack>
                <Text fontSize="3xl" fontWeight="bold" color="brand.600">
                  $2.5M+
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
                  &lt;24hr
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
                Get Pre-Qualified in 3 Simple Steps
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                No complicated paperwork. No confusing jargon. Just a fast, easy
                path to your pre-qualification letter.
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
                  fontSize="32px"
                >
                  <FaClock />
                </Box>
                <Heading as="h3" fontSize="xl">
                  1. Tell Us About You
                </Heading>
                <Text textAlign="center" color="gray.600">
                  Answer a few quick questions about your income, assets, and
                  dream home. Takes just 5 minutes.
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
                  fontSize="32px"
                >
                  <FaChartLine />
                </Box>
                <Heading as="h3" fontSize="xl">
                  2. See Your Options
                </Heading>
                <Text textAlign="center" color="gray.600">
                  Get your personalized pre-qualification amount and explore
                  loan options tailored for you.
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
                  fontSize="32px"
                >
                  <FaHandshake />
                </Box>
                <Heading as="h3" fontSize="xl" textAlign="center">
                  3. Connect With an Expert
                </Heading>
                <Text textAlign="center" color="gray.600">
                  Speak with a local Florida loan officer who will guide you
                  from pre-qualification to closing.
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
                Why 10,000+ Floridians Choose PMF
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                We're more than a lender—we're your partner in achieving the
                American Dream.
              </Text>
            </VStack>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={6}
            >
              <HStack
                bg="white"
                p={6}
                borderRadius="lg"
                spacing={4}
                align="flex-start"
              >
                <Box color="brand.600" mt={1} fontSize="24px">
                  <FaShieldAlt />
                </Box>
                <Box>
                  <Heading as="h4" fontSize="lg" mb={2}>
                    Your Privacy is Sacred
                  </Heading>
                  <Text color="gray.600">
                    Bank-level 256-bit encryption protects your data. We never
                    sell your information. Ever.
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
                <Box color="brand.600" mt={1} fontSize="24px">
                  <FaStar />
                </Box>
                <Box>
                  <Heading as="h4" fontSize="lg" mb={2}>
                    Lowest Rates, Guaranteed
                  </Heading>
                  <Text color="gray.600">
                    We compare offers from 50+ lenders to ensure you get the
                    absolute best rate available.
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
                <Box color="brand.600" mt={1} fontSize="24px">
                  <FaUserTie />
                </Box>
                <Box>
                  <Heading as="h4" fontSize="lg" mb={2}>
                    Florida Market Experts
                  </Heading>
                  <Text color="gray.600">
                    Born and raised in Florida. We know every neighborhood,
                    school district, and market trend.
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
                <Box color="brand.600" mt={1} fontSize="24px">
                  <FaAward />
                </Box>
                <Box>
                  <Heading as="h4" fontSize="lg" mb={2}>
                    White-Glove Service
                  </Heading>
                  <Text color="gray.600">
                    Rated #1 for customer care. Your dedicated loan officer
                    answers calls, texts, and emails 7 days a week.
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
                Real Stories From Real Homeowners
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Don't just take our word for it. Here's what your future
                neighbors are saying.
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
                    <Box key={i} color="yellow.400">
                      <FaStar />
                    </Box>
                  ))}
                </HStack>
                <Text mb={4} color="gray.700" fontStyle="italic">
                  "As first-time buyers, we were terrified. PMF made everything
                  so simple. Our loan officer answered every question, no matter
                  how small. We closed in 3 weeks!"
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
                    <Box key={i} color="yellow.400">
                      <FaStar />
                    </Box>
                  ))}
                </HStack>
                <Text mb={4} color="gray.700" fontStyle="italic">
                  "I refinanced with PMF and saved $400/month. The process was
                  seamless, and they beat every other lender's rate. Can't
                  recommend them enough!"
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
                    <Box key={i} color="yellow.400">
                      <FaStar />
                    </Box>
                  ))}
                </HStack>
                <Text mb={4} color="gray.700" fontStyle="italic">
                  "After being rejected by two banks, PMF found a program that
                  worked for us. They fought for our approval and we're now in
                  our dream home!"
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
                Ready to Take the Next Step?
              </Heading>
              <Text fontSize={{ base: "lg", md: "xl" }} opacity={0.95}>
                Join 10,000+ Florida families who trusted PMF to make their
                homeownership dreams a reality. Start your free
                pre-qualification now—no obligation, no credit check.
              </Text>
              <Button
                size="lg"
                colorScheme="green"
                px={12}
                py={7}
                width="16.5em"
                fontSize="xl"
                borderRadius="full"
                boxShadow="2xl"
                _hover={{ transform: "translateY(-2px)", boxShadow: "3xl" }}
                transition="all 0.2s"
                onClick={() => navigate("/auth-prompt")}
              >
                Get My Free Pre-Qualification →
              </Button>
              <VStack spacing={2} mt={4}>
                <HStack spacing={6} flexWrap="wrap" justify="center">
                  <HStack>
                    <FaShieldAlt />
                    <Text fontSize="sm">Bank‑grade encryption</Text>
                  </HStack>
                  <HStack>
                    <FaCheckCircle />
                    <Text fontSize="sm">Won't Affect Credit</Text>
                  </HStack>
                  <HStack>
                    <FaCheckCircle />
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
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={8}
              textAlign={{ base: "center", md: "left" }}
            >
              <Box>
                <Heading as="h5" fontSize="lg" mb={3}>
                  APEX Residential Finance
                </Heading>
                <Text fontSize="sm" opacity={0.8}>
                  Making homeownership dreams come true across Florida since who
                  knows whens.
                </Text>
              </Box>
              <Box>
                <Heading as="h5" fontSize="lg" mb={3}>
                  Quick Links
                </Heading>
                <VStack
                  align={{ base: "center", md: "flex-start" }}
                  spacing={2}
                >
                  <Link fontSize="sm" opacity={0.8} _hover={{ opacity: 1 }}>
                    About Us
                  </Link>
                  <Link fontSize="sm" opacity={0.8} _hover={{ opacity: 1 }}>
                    Loan Programs
                  </Link>
                  <Link fontSize="sm" opacity={0.8} _hover={{ opacity: 1 }}>
                    Contact
                  </Link>
                  <Link fontSize="sm" opacity={0.8} _hover={{ opacity: 1 }}>
                    FAQ
                  </Link>
                </VStack>
              </Box>
              <Box>
                <Heading as="h5" fontSize="lg" mb={3}>
                  Contact Us
                </Heading>
                <VStack
                  align={{ base: "center", md: "flex-start" }}
                  spacing={2}
                >
                  <Text fontSize="sm" opacity={0.8}>
                    📞 123-456-7890
                  </Text>
                  <Text fontSize="sm" opacity={0.8}>
                    📧 apex@homes.com
                  </Text>
                  <Text fontSize="sm" opacity={0.8}>
                    📍 Florida
                  </Text>
                </VStack>
              </Box>
            </SimpleGrid>
            <Divider my={6} opacity={0.2} />
            <Text textAlign="center" fontSize="xs" opacity={0.6}>
              © 2025 APEX Residential Finance. All rights reserved. NMLS #123456
            </Text>
          </Container>
        </Box>
      </Box>
    </AnimatedPage>
  );
};
