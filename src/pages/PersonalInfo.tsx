import React from "react";
import {
  Box,
  Button,
  Flex,
  VStack,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AnimatedPage } from "../ui/AnimatedPage";
import { useLoanApp } from "../hooks/useLoanApp";
import { NumericFormat } from "react-number-format";

const schema = yup.object({
  fullName: yup.string().required("Name is required"),
  ssn: yup
    .string()
    .required("SSN is required")
    .matches(/^\d+$/, "SSN must contain only numbers")
    .length(9, "SSN must be exactly 9 digits"),
  dob: yup.string().required("Date of birth is required"),
  citizenship: yup.string().required("Citizenship status is required"),
  maritalStatus: yup.string().required("Marital status is required"),
  phone: yup.string().required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  street: yup.string().required("Street is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zip: yup.string().required("Zip code is required"),
  residencyYears: yup.string().required("Years is required"),
  residencyMonths: yup.string().required("Months is required"),
  housingType: yup.string().required("Housing type is required"),
  monthlyPayment: yup.string().when("housingType", {
    is: (val: string) => val === "Own" || val === "Rent",
    then: (schema) => schema.required("Monthly payment is required"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  previousAddress: yup.string().when("residencyYears", {
    is: (val: string) => val === "0" || val === "1",
    then: (schema) => schema.required("Previous address is required"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
});

export const PersonalInfo: React.FC = () => {
  const navigate = useNavigate();
  const { data, updatePersonalInfo } = useLoanApp();

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      ssn: "",
      dob: "",
      citizenship: "",
      maritalStatus: "",
      phone: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      residencyYears: "",
      residencyMonths: "",
      housingType: "",
      monthlyPayment: "",
      previousAddress: "",
      ...data.personalInfo, // prefill saved data
    },
  });

  const onSubmit = (values: any) => {
    updatePersonalInfo(values);
    navigate("/employment-info");
  };

  const residencyYears = watch("residencyYears");
  const housingType = watch("housingType");

  return (
    <AnimatedPage>
      <Flex
        direction="column"
        minH="100vh"
        align="center"
        bgGradient="linear(to-br, gray.50, blue.50)"
        px={4}
        py={12}
      >
        <VStack spacing={6} maxW="900px" w="100%">
          {/* Progress Indicator */}
          <Box w="100%" textAlign="center" mb={2}>
            <Text fontSize="sm" color="brand.600" fontWeight="semibold" mb={1}>
              STEP 1 OF 7
            </Text>
            <Box
              w="100%"
              h="2px"
              bg="gray.200"
              borderRadius="full"
              position="relative"
            >
              <Box w="14%" h="100%" bg="brand.500" borderRadius="full" />
            </Box>
          </Box>

          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="2xl"
            p={{ base: 6, md: 10 }}
            w="100%"
          >
            <VStack spacing={2} mb={8}>
              <Heading
                as="h2"
                size="xl"
                textAlign="center"
                bgGradient="linear(to-r, brand.500, brand.700)"
                bgClip="text"
              >
                Personal Information
              </Heading>
              <Text textAlign="center" color="gray.600" fontSize="lg">
                Let's start with some basic information about you
              </Text>
            </VStack>

            <Box w="100%" as="form" onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={6}>
                {/* Full Name */}
                <FormControl isInvalid={!!errors.fullName}>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    Full Legal Name
                  </FormLabel>
                  <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px #2196f3",
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage>
                    {errors.fullName?.message}
                  </FormErrorMessage>
                </FormControl>

                {/* SSN */}
                <FormControl isInvalid={!!errors.ssn}>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    Social Security Number
                  </FormLabel>
                  <Controller
                    name="ssn"
                    control={control}
                    render={({ field }) => (
                      <Input
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 9) {
                            field.onChange(value);
                          }
                        }}
                        onBlur={field.onBlur}
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px #2196f3",
                        }}
                        placeholder="###-##-####"
                        type="password"
                        inputMode="numeric"
                        css={{
                          "&::placeholder": {
                            WebkitTextSecurity: "none !important",
                            textSecurity: "none !important",
                          },
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage>{errors.ssn?.message}</FormErrorMessage>
                </FormControl>

                {/* DOB */}
                <FormControl isInvalid={!!errors.dob}>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    Date of Birth
                  </FormLabel>
                  <Controller
                    name="dob"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="date"
                        {...field}
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px #2196f3",
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage>{errors.dob?.message}</FormErrorMessage>
                </FormControl>

                {/* Citizenship */}
                <FormControl isInvalid={!!errors.citizenship}>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    Citizenship Status
                  </FormLabel>
                  <Controller
                    name="citizenship"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field}>
                        <Stack direction="column" spacing={3}>
                          <Radio
                            value="US Citizen"
                            size="lg"
                            colorScheme="brand"
                            borderColor="gray.300"
                          >
                            <Text ml={2}>US Citizen</Text>
                          </Radio>
                          <Radio
                            value="Permanent Resident Alien"
                            size="lg"
                            colorScheme="brand"
                            borderColor="gray.300"
                          >
                            <Text ml={2}>Permanent Resident Alien</Text>
                          </Radio>
                          <Radio
                            value="Non-Permanent Resident Alien"
                            size="lg"
                            colorScheme="brand"
                            borderColor="gray.300"
                          >
                            <Text ml={2}>Non-Permanent Resident Alien</Text>
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    )}
                  />
                  <FormErrorMessage>
                    {errors.citizenship?.message}
                  </FormErrorMessage>
                </FormControl>

                {/* Marital Status */}
                <FormControl isInvalid={!!errors.maritalStatus}>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    Marital Status
                  </FormLabel>
                  <Controller
                    name="maritalStatus"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select status"
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px #2196f3",
                        }}
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </Select>
                    )}
                  />
                  <FormErrorMessage>
                    {errors.maritalStatus?.message}
                  </FormErrorMessage>
                </FormControl>

                {/* Phone & Email in 2 columns on desktop */}
                <Flex
                  gap={4}
                  w="100%"
                  direction={{ base: "column", md: "row" }}
                >
                  <FormControl isInvalid={!!errors.phone} flex={1}>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Phone Number
                    </FormLabel>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px #2196f3",
                          }}
                        />
                      )}
                    />
                    <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.email} flex={1}>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Email Address
                    </FormLabel>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px #2196f3",
                          }}
                        />
                      )}
                    />
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                  </FormControl>
                </Flex>

                {/* Current Address Section Header */}
                <Box w="100%" pt={4}>
                  <Heading size="md" color="brand.600" mb={4}>
                    Current Address
                  </Heading>
                </Box>
                {/* Street Address */}
                <FormControl isInvalid={!!errors.street}>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    Street Address
                  </FormLabel>
                  <Controller
                    name="street"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px #2196f3",
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage>{errors.street?.message}</FormErrorMessage>
                </FormControl>

                {/* City, State, Zip in responsive grid */}
                <Flex
                  gap={4}
                  w="100%"
                  direction={{ base: "column", md: "row" }}
                >
                  <FormControl isInvalid={!!errors.city} flex={2}>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      City
                    </FormLabel>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px #2196f3",
                          }}
                        />
                      )}
                    />
                    <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.state} flex={1}>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      State
                    </FormLabel>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px #2196f3",
                          }}
                        />
                      )}
                    />
                    <FormErrorMessage>{errors.state?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.zip} flex={1}>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Zip Code
                    </FormLabel>
                    <Controller
                      name="zip"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px #2196f3",
                          }}
                        />
                      )}
                    />
                    <FormErrorMessage>{errors.zip?.message}</FormErrorMessage>
                  </FormControl>
                </Flex>

                {/* Residency */}
                <FormControl>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    How long have you lived here?
                  </FormLabel>
                  <Flex gap={4}>
                    <Controller
                      name="residencyYears"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Years"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px #2196f3",
                          }}
                        >
                          {Array.from({ length: 31 }, (_, i) => (
                            <option key={i} value={i.toString()}>
                              {i}
                            </option>
                          ))}
                        </Select>
                      )}
                    />
                    <Controller
                      name="residencyMonths"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Months"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px #2196f3",
                          }}
                        >
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i.toString()}>
                              {i}
                            </option>
                          ))}
                        </Select>
                      )}
                    />
                  </Flex>
                </FormControl>

                {["0", "1"].includes(residencyYears) && (
                  <FormControl isInvalid={!!errors.previousAddress}>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Previous Address
                    </FormLabel>
                    <Controller
                      name="previousAddress"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px #2196f3",
                          }}
                        />
                      )}
                    />
                    <FormErrorMessage>
                      {errors.previousAddress?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}

                {/* Housing Section Header */}
                <Box w="100%" pt={4}>
                  <Heading size="md" color="brand.600" mb={4}>
                    Housing Information
                  </Heading>
                </Box>

                {/* Housing */}
                <FormControl isInvalid={!!errors.housingType}>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    Type of Housing
                  </FormLabel>
                  <Controller
                    name="housingType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select type"
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px #2196f3",
                        }}
                      >
                        <option value="Own">Own</option>
                        <option value="Rent">Rent</option>
                        <option value="No primary housing expense">
                          No primary housing expense
                        </option>
                      </Select>
                    )}
                  />
                  <FormErrorMessage>
                    {errors.housingType?.message}
                  </FormErrorMessage>
                </FormControl>

                {(housingType === "Own" || housingType === "Rent") && (
                  <FormControl isInvalid={!!errors.monthlyPayment}>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      How much do you pay monthly?
                    </FormLabel>
                    <Controller
                      name="monthlyPayment"
                      control={control}
                      render={({ field }) => (
                        <NumericFormat
                          {...field}
                          thousandSeparator
                          prefix="$"
                          allowNegative={false}
                          decimalScale={2}
                          fixedDecimalScale
                          customInput={Input}
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px #2196f3",
                          }}
                          onValueChange={(values) => {
                            field.onChange(values.value);
                          }}
                          value={field.value || ""}
                        />
                      )}
                    />
                    <FormErrorMessage>
                      {errors.monthlyPayment?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </VStack>

              <Flex justify="space-between" mt={10} gap={4}>
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="brand"
                  onClick={() => navigate(-1)}
                  borderRadius="lg"
                  px={8}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  colorScheme="brand"
                  type="submit"
                  isDisabled={!isValid}
                  borderRadius="lg"
                  px={8}
                  boxShadow="lg"
                  _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
                >
                  Continue →
                </Button>
              </Flex>
            </Box>
          </Box>
        </VStack>
      </Flex>
    </AnimatedPage>
  );
};
