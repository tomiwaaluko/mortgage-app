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
import { AnimatedPage } from "./AnimatedPage";
import { useLoanApp } from "../context/LoanAppContext";
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
  monthlyPayment: yup.string().when(["housingType"], ([housingType], schema) =>
    housingType === "Own" || housingType === "Rent"
      ? schema.required("Monthly payment is required")
      : schema
  ),
  previousAddress: yup.string().when(["residencyYears"], ([years], schema) =>
    years === "0" || years === "1"
      ? schema.required("Previous address is required")
      : schema
  ),
});

export const PersonalInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { updatePersonalInfo } = useLoanApp();

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: any) => {
    updatePersonalInfo(data);
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
        bg="white"
        px={4}
        py={6}
      >
        <VStack spacing={4} maxW="600px" w="100%">
          <Heading as="h2" size="lg" textAlign="center">
            Personal Information
          </Heading>
          <Text textAlign="center" color="gray.600">
            Please complete all fields to continue.
          </Text>

          <Box w="100%" as="form" onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              {/* Full Name */}
              <FormControl isInvalid={!!errors.fullName}>
                <FormLabel>Full Name</FormLabel>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
              </FormControl>

              {/* SSN */}
              <FormControl isInvalid={!!errors.ssn}>
                <FormLabel>Social Security Number</FormLabel>
                <Controller
                  name="ssn"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.ssn?.message}</FormErrorMessage>
              </FormControl>

              {/* Date of Birth */}
              <FormControl isInvalid={!!errors.dob}>
                <FormLabel>Date of Birth</FormLabel>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => <Input type="date" {...field} />}
                />
                <FormErrorMessage>{errors.dob?.message}</FormErrorMessage>
              </FormControl>

              {/* Citizenship */}
              <FormControl isInvalid={!!errors.citizenship}>
                <FormLabel>Citizenship Status</FormLabel>
                <Controller
                  name="citizenship"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <Stack direction="column">
                        <Radio value="US Citizen">US Citizen</Radio>
                        <Radio value="Permanent Resident Alien">Permanent Resident Alien</Radio>
                        <Radio value="Non-Permanent Resident Alien">Non-Permanent Resident Alien</Radio>
                      </Stack>
                    </RadioGroup>
                  )}
                />
                <FormErrorMessage>{errors.citizenship?.message}</FormErrorMessage>
              </FormControl>

              {/* Marital Status */}
              <FormControl isInvalid={!!errors.maritalStatus}>
                <FormLabel>Marital Status</FormLabel>
                <Controller
                  name="maritalStatus"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} placeholder="Select status">
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </Select>
                  )}
                />
                <FormErrorMessage>{errors.maritalStatus?.message}</FormErrorMessage>
              </FormControl>

              {/* Phone */}
              <FormControl isInvalid={!!errors.phone}>
                <FormLabel>Phone Number</FormLabel>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
              </FormControl>

              {/* Email */}
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email Address</FormLabel>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              {/* Address */}
              <FormControl isInvalid={!!errors.street}>
                <FormLabel>Street Address</FormLabel>
                <Controller
                  name="street"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.street?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.city}>
                <FormLabel>City</FormLabel>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.state}>
                <FormLabel>State</FormLabel>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.state?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.zip}>
                <FormLabel>Zip Code</FormLabel>
                <Controller
                  name="zip"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.zip?.message}</FormErrorMessage>
              </FormControl>

              {/* How long have you lived here? */}
              <FormControl>
                <FormLabel>How long have you lived here?</FormLabel>
                <Flex gap={2}>
                  <Controller
                    name="residencyYears"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} placeholder="Years">
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i} value={i.toString()}>{i}</option>
                        ))}
                      </Select>
                    )}
                  />
                  <Controller
                    name="residencyMonths"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} placeholder="Months">
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i.toString()}>{i}</option>
                        ))}
                      </Select>
                    )}
                  />
                </Flex>
              </FormControl>

              {(residencyYears === "0" || residencyYears === "1") && (
                <FormControl isInvalid={!!errors.previousAddress}>
                  <FormLabel>Previous Address</FormLabel>
                  <Controller
                    name="previousAddress"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <FormErrorMessage>{errors.previousAddress?.message}</FormErrorMessage>
                </FormControl>
              )}

              {/* Housing Type */}
              <FormControl isInvalid={!!errors.housingType}>
                <FormLabel>Type of Housing</FormLabel>
                <Controller
                  name="housingType"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} placeholder="Select type">
                      <option value="Own">Own</option>
                      <option value="Rent">Rent</option>
                      <option value="No primary housing expense">No primary housing expense</option>
                    </Select>
                  )}
                />
                <FormErrorMessage>{errors.housingType?.message}</FormErrorMessage>
              </FormControl>

              {/* Monthly Payment */}
              {(housingType === "Own" || housingType === "Rent") && (
                <FormControl isInvalid={!!errors.monthlyPayment}>
                  <FormLabel>How much do you pay monthly?</FormLabel>
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
                        onValueChange={(values) => {
                          field.onChange(values.value);
                        }}
                        value={field.value}
                      />
                    )}
                  />
                  <FormErrorMessage>{errors.monthlyPayment?.message}</FormErrorMessage>
                </FormControl>
              )}
            </VStack>

            <Flex justify="space-between" mt={8}>
              <Button variant="ghost" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button colorScheme="brand" type="submit" isDisabled={!isValid}>
                Continue
              </Button>
            </Flex>
          </Box>
        </VStack>
      </Flex>
    </AnimatedPage>
  );
};