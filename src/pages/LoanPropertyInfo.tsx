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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useLoanApp } from "../hooks/useLoanApp";
import { AnimatedPage } from "../ui/AnimatedPage";
import { NumericFormat } from "react-number-format";


// Validation schema
const schema = yup.object({
  underContract: yup.string().required("Please select Yes or No"),

  salesPrice: yup.string().when("underContract", {
    is: (val: string) => val === "Yes",
    then: (schema) => schema.required("Sales Price is required"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  downPayment: yup.string().when("underContract", {
    is: (val: string) => val === "Yes",
    then: (schema) => schema.required("Down Payment is required"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  propertyAddress: yup.string().when("underContract", {
    is: (val: string) => val === "Yes",
    then: (schema) => schema.required("Property Address is required"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  occupancy: yup.string().when("underContract", {
    is: (val: string) => val === "Yes",
    then: (schema) => schema.required("Occupancy is required"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  receivingGift: yup.string().when("underContract", {
    is: (val: string) => val === "Yes",
    then: (schema) => schema.required("Please select Yes or No"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  giftAssetType: yup.string().when(["underContract", "receivingGift"], {
    is: (underContract: string, receivingGift: string) =>
      underContract === "Yes" && receivingGift === "Yes",
    then: (schema) => schema.required("Asset Type is required"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  giftDeposited: yup.string().when(["underContract", "receivingGift"], {
    is: (underContract: string, receivingGift: string) =>
      underContract === "Yes" && receivingGift === "Yes",
    then: (schema) => schema.required("Please select Deposited or Not Deposited"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  giftSource: yup.string().when(["underContract", "receivingGift"], {
    is: (underContract: string, receivingGift: string) =>
      underContract === "Yes" && receivingGift === "Yes",
    then: (schema) => schema.required("Source is required"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  giftValue: yup.string().when(["underContract", "receivingGift"], {
    is: (underContract: string, receivingGift: string) =>
      underContract === "Yes" && receivingGift === "Yes",
    then: (schema) => schema.required("Value is required"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
});

// Helper for error messages
const getErrorMessage = (err: any) => {
  if (typeof err === "string") return err;
  if (typeof err === "object" && err !== null && "message" in err) return err.message;
  return "";
};

export const LoanPropertyInfo: React.FC = () => {
  const navigate = useNavigate();
  const { data, updateLoanProperty } = useLoanApp();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      underContract: "",
      salesPrice: "",
      downPayment: "",
      propertyAddress: "",
      occupancy: "",
      receivingGift: "",
      giftAssetType: "",
      giftDeposited: "",
      giftSource: "",
      giftValue: "",
      ...data.loanProperty, // ✅ merge existing data
    },
  });

  const underContract = watch("underContract");
  const receivingGift = watch("receivingGift");

  const onSubmit = (data: any) => {
    console.log("Submitted data:", data);
    updateLoanProperty(data);
    navigate("/declarations");
  };

  return (
    <AnimatedPage>
      <Flex direction="column" minH="100vh" align="center" bg="white" px={4} py={6}>
        <VStack spacing={4} maxW="700px" w="100%">
          <Heading as="h2" size="lg" textAlign="center">
            Loan Property Information
          </Heading>
          <Text textAlign="center" color="gray.600">
            Please provide information about the property related to your loan.
          </Text>

          <Box w="100%" as="form" onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={6} align="stretch">
              {/* Under contract */}
              <FormControl isInvalid={!!errors.underContract}>
                <FormLabel>Are you currently under contract?</FormLabel>
                <Controller
                  name="underContract"
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
                  {getErrorMessage(errors.underContract)}
                </FormErrorMessage>
              </FormControl>

              {/* Show fields if Yes */}
              {underContract === "Yes" && (
                <>
                  <FormControl isInvalid={!!errors.salesPrice}>
                    <FormLabel>Sales Price</FormLabel>
                    <Controller
                      name="salesPrice"
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
                      {getErrorMessage(errors.salesPrice)}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.downPayment}>
                    <FormLabel>Down Payment (%)</FormLabel>
                    <Controller
                      name="downPayment"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="e.g. 5%"
                        />
                      )}
                    />
                    <FormErrorMessage>
                      {getErrorMessage(errors.downPayment)}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.propertyAddress}>
                    <FormLabel>Property Address</FormLabel>
                    <Controller
                      name="propertyAddress"
                      control={control}
                      render={({ field }) => <Input {...field} />}
                    />
                    <FormErrorMessage>
                      {getErrorMessage(errors.propertyAddress)}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.occupancy}>
                    <FormLabel>Occupancy</FormLabel>
                    <Controller
                      name="occupancy"
                      control={control}
                      render={({ field }) => (
                        <Input as="select" {...field} value={field.value ?? ""}>
                          <option value="">Select</option>
                          <option value="Primary Residence">Primary Residence</option>
                          <option value="Second Home">Second Home</option>
                          <option value="Investment">Investment</option>
                        </Input>
                      )}
                    />
                    <FormErrorMessage>
                      {getErrorMessage(errors.occupancy)}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.receivingGift}>
                    <FormLabel>Are you receiving a gift for this loan?</FormLabel>
                    <Controller
                      name="receivingGift"
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
                      {getErrorMessage(errors.receivingGift)}
                    </FormErrorMessage>
                  </FormControl>

                  {receivingGift === "Yes" && (
                    <>
                      <FormControl isInvalid={!!errors.giftAssetType}>
                        <FormLabel>Asset Type</FormLabel>
                        <Controller
                          name="giftAssetType"
                          control={control}
                          render={({ field }) => (
                            <Input as="select" {...field} value={field.value ?? ""}>
                              <option value="">Select</option>
                              <option value="Cash Gift">Cash Gift</option>
                              <option value="Gift of Equity">Gift of Equity</option>
                              <option value="Grant">Grant</option>
                            </Input>
                          )}
                        />
                        <FormErrorMessage>
                          {getErrorMessage(errors.giftAssetType)}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.giftDeposited}>
                        <FormLabel>Deposited?</FormLabel>
                        <Controller
                          name="giftDeposited"
                          control={control}
                          render={({ field }) => (
                            <Input as="select" {...field} value={field.value ?? ""}>
                              <option value="">Select</option>
                              <option value="Deposited">Deposited</option>
                              <option value="Not Deposited">Not Deposited</option>
                            </Input>
                          )}
                        />
                        <FormErrorMessage>
                          {getErrorMessage(errors.giftDeposited)}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.giftSource}>
                        <FormLabel>Source</FormLabel>
                        <Controller
                          name="giftSource"
                          control={control}
                          render={({ field }) => <Input {...field} />}
                        />
                        <FormErrorMessage>
                          {getErrorMessage(errors.giftSource)}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.giftValue}>
                        <FormLabel>Cash or Market Value</FormLabel>
                        <Controller
                          name="giftValue"
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
                          {getErrorMessage(errors.giftValue)}
                        </FormErrorMessage>
                      </FormControl>
                    </>
                  )}
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
                    !underContract ||
                    (underContract === "Yes" && !isValid)
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