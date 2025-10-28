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
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useLoanApp } from "../hooks/useLoanApp";
import { AnimatedPage } from "../ui/AnimatedPage";
import { NumericFormat } from "react-number-format";

// Validation schema
const schema = yup.object({
  ownsRealEstate: yup.string().required("Please select Yes or No"),
  properties: yup.array().of(
    yup.object({
      address: yup.string().required("Address is required"),
      value: yup.string().required("Property value is required"),
      status: yup.string().required("Status is required"),
      occupancy: yup.string().required("Intended occupancy is required"),
      monthlyPayment: yup.string().required("Monthly payment is required"),
      rentalIncome: yup.string().required("Rental income is required"),
    })
  ),
});

// Helper for error messages
const getErrorMessage = (err: any) => {
  if (typeof err === "string") return err;
  if (typeof err === "object" && err !== null && "message" in err) return err.message;
  return "";
};

export const RealEstateInfo: React.FC = () => {
  const navigate = useNavigate();
  const { data, updateRealEstate } = useLoanApp();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      ownsRealEstate: "",
      properties: [],
      ...data.realEstate, // ✅ merge saved data if editing
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "properties",
  });

  const ownsRealEstate = watch("ownsRealEstate");

  const onSubmit = (data: any) => {
    console.log("Submitted Real Estate Info:", data);
    updateRealEstate(data);
    navigate("/loan-property-info"); // Adjust to your next route
  };

  return (
    <AnimatedPage>
      <Flex direction="column" minH="100vh" align="center" bg="white" px={4} py={6}>
        <VStack spacing={4} maxW="700px" w="100%">
          <Heading as="h2" size="lg" textAlign="center">
            Real Estate Owned
          </Heading>
          <Text textAlign="center" color="gray.600">
            Please provide information about any real estate you own.
          </Text>

          <Box w="100%" as="form" onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={6} align="stretch">
              {/* Do you own real estate */}
              <FormControl isInvalid={!!errors.ownsRealEstate}>
                <FormLabel>Do you own any real estate?</FormLabel>
                <Controller
                  name="ownsRealEstate"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <Stack direction="row">
                        <Radio value="Yes">Yes</Radio>
                        <Radio value="No">No</Radio>
                      </Stack>
                    </RadioGroup>
                  )}
                />
                <FormErrorMessage>
                  {getErrorMessage(errors.ownsRealEstate)}
                </FormErrorMessage>
              </FormControl>

              {/* If Yes, show property fields */}
              {ownsRealEstate === "Yes" && (
                <>
                  {fields.map((item, index) => (
                    <Box key={item.id} p={4} border="1px solid #E2E8F0" borderRadius="md">
                      <Heading as="h4" size="sm" mb={2}>
                        Property {index + 1}
                      </Heading>
                      <VStack spacing={3}>
                        <FormControl isInvalid={!!errors.properties?.[index]?.address}>
                          <FormLabel>Address</FormLabel>
                          <Controller
                            name={`properties.${index}.address`}
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                          <FormErrorMessage>
                            {getErrorMessage(errors.properties?.[index]?.address)}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.properties?.[index]?.value}>
                          <FormLabel>Property Value</FormLabel>
                          <Controller
                            name={`properties.${index}.value`}
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
                                onValueChange={(values) => field.onChange(values.value)}
                                value={field.value ?? ""}
                              />
                            )}
                          />
                          <FormErrorMessage>
                            {getErrorMessage(errors.properties?.[index]?.value)}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.properties?.[index]?.status}>
                          <FormLabel>Status</FormLabel>
                          <Controller
                            name={`properties.${index}.status`}
                            control={control}
                            render={({ field }) => (
                              <Input as="select" {...field} value={field.value ?? ""}>
                                <option value="">Select</option>
                                <option value="Sold">Sold</option>
                                <option value="Pending Sale">Pending Sale</option>
                                <option value="Retained">Retained</option>
                              </Input>
                            )}
                          />
                          <FormErrorMessage>
                            {getErrorMessage(errors.properties?.[index]?.status)}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.properties?.[index]?.occupancy}>
                          <FormLabel>Intended Occupancy</FormLabel>
                          <Controller
                            name={`properties.${index}.occupancy`}
                            control={control}
                            render={({ field }) => (
                              <Input as="select" {...field} value={field.value ?? ""}>
                                <option value="">Select</option>
                                <option value="Primary Residence">Primary Residence</option>
                                <option value="Second Home">Second Home</option>
                                <option value="Investment">Investment</option>
                                <option value="Other">Other</option>
                              </Input>
                            )}
                          />
                          <FormErrorMessage>
                            {getErrorMessage(errors.properties?.[index]?.occupancy)}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.properties?.[index]?.monthlyPayment}>
                          <FormLabel>Total Monthly Payment</FormLabel>
                          <Controller
                            name={`properties.${index}.monthlyPayment`}
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
                                onValueChange={(values) => field.onChange(values.value)}
                                value={field.value ?? ""}
                              />
                            )}
                          />
                          <FormErrorMessage>
                            {getErrorMessage(errors.properties?.[index]?.monthlyPayment)}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.properties?.[index]?.rentalIncome}>
                          <FormLabel>Monthly Rental Income</FormLabel>
                          <Controller
                            name={`properties.${index}.rentalIncome`}
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
                                onValueChange={(values) => field.onChange(values.value)}
                                value={field.value ?? ""}
                              />
                            )}
                          />
                          <FormErrorMessage>
                            {getErrorMessage(errors.properties?.[index]?.rentalIncome)}
                          </FormErrorMessage>
                        </FormControl>

                        <Button
                          variant="outline"
                          colorScheme="red"
                          onClick={() => remove(index)}
                        >
                          Remove Property
                        </Button>
                      </VStack>
                    </Box>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() =>
                      append({
                        address: "",
                        value: "",
                        status: "",
                        occupancy: "",
                        monthlyPayment: "",
                        rentalIncome: "",
                      })
                    }
                  >
                    Add Property
                  </Button>
                </>
              )}

              {/* Navigation Buttons */}
              <Flex justify="space-between" mt={8}>
                <Button
                  colorScheme="brand"
                  variant="solid"
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
                <Button
                  colorScheme="brand"
                  variant="solid"
                  type="submit"
                  isDisabled={
                    ownsRealEstate === ""
                    || (ownsRealEstate === "Yes" && !isValid)
                  }
                >
                  Continue
                </Button>
              </Flex>
            </VStack>
          </Box>
        </VStack>
      </Flex>
    </AnimatedPage>
  );
};