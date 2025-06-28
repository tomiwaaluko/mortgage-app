import React from "react";
import { Flex, Image, Button, Text } from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";

export const Header: React.FC = () => {
  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      width="100%"
      justify="space-between"
      align="center"
      px={4}
      py={3}
      bg="white"
      boxShadow="sm"
      zIndex={10}
    >
      {/* Logo */}
      <Image src="/pmf-logo.png" alt="Logo" h="40px" />

      {/* Center Text */}
      <Text fontSize="lg" fontWeight="medium" color="blue.600">
        PMF Home Loan Application
      </Text>

      {/* Contact Me */}
      <Button
        leftIcon={<PhoneIcon />}
        variant="outline"
        colorScheme="blue"
        size="sm"
      >
        Contact Me
      </Button>
    </Flex>
  );
};