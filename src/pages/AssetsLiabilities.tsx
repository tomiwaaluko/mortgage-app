import React, { useState } from "react";
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
  Checkbox,
} from "@chakra-ui/react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useLoanApp } from "../hooks/useLoanApp";
import { AnimatedPage } from "../ui/AnimatedPage";
import { NumericFormat } from "react-number-format";

const accountTypes = [
  "Checking",
  "Savings",
  "Money Market",
  "Certificate of Deposit",
  "Mutual Fund",
  "Stock Options",
  "Bonds",
  "Retirement",
  "Bridge Loan Proceeds",
  "Trust Account",
];

const assetCreditTypes = [
  "Proceeds from Real Estate",
  "Proceeds from Sale of Non-Real Estate Asset",
  "Secured Borrowed Funds",
  "Unsecured Borrowed Funds",
  "Earnest Money",
  "Employer Assistance",
  "Lot Equity",
  "Relocation Funds",
  "Rent Credit",
  "Trade Equity",
];

const liabilityTypes = [
  "Revolving",
  "Installment",
  "Mortgage",
  "Lease",
  "Student Loan",
  "Home Equity Line of Credit",
  "Other",
];

const otherLiabilityTypes = [
  "Alimony",
  "Child Support",
  "Separate Maintenance",
  "Job Related Expenses",
  "Other",
];

const schema = yup.object({
  assetsAccounts: yup
    .array()
    .of(
      yup.object({
        accountType: yup.string().required("Required"),
        institution: yup.string().required("Required"),
        accountNumber: yup.string().required("Required"),
        value: yup.string().required("Required"),
      })
    )
    .min(1, "At least one account is required"),
  otherAssets: yup
    .array()
    .of(
      yup.object({
        type: yup.string().required("Required"),
        value: yup.string().required("Required"),
      })
    ),
  liabilities: yup
    .array()
    .of(
      yup.object({
        accountType: yup.string().required("Required"),
        company: yup.string().required("Required"),
        accountNumber: yup.string().required("Required"),
        balance: yup.string().required("Required"),
        payment: yup.string().required("Required"),
        toBePaidOff: yup.boolean(),
      })
    ),
  otherLiabilities: yup
    .array()
    .of(
      yup.object({
        type: yup.string().required("Required"),
        payment: yup.string().required("Required"),
      })
    ),
});

// ✅ Universal helper to get error messages safely
const getErrorMessage = (err: any) => {
  if (typeof err === "string") return err;
  if (typeof err === "object" && err !== null && "message" in err) return err.message;
  return "";
};

export const AssetsLiabilities: React.FC = () => {
  const navigate = useNavigate();
  const { data, updateAssetsLiabilities } = useLoanApp();

  const [hideOtherAssets, setHideOtherAssets] = useState(false);
  const [hideLiabilities, setHideLiabilities] = useState(false);
  const [hideOtherLiabilities, setHideOtherLiabilities] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      assetsAccounts: [],
      otherAssets: [],
      liabilities: [],
      otherLiabilities: [],
      ...data.assetsLiabilities, // ✅ merge saved data
    },
  });

  const assetsAccounts = useFieldArray({ control, name: "assetsAccounts" });
  const otherAssets = useFieldArray({ control, name: "otherAssets" });
  const liabilities = useFieldArray({ control, name: "liabilities" });
  const otherLiabilities = useFieldArray({ control, name: "otherLiabilities" });

  const onSubmit = (data: any) => {
    console.log("Submitted data:", data);
    updateAssetsLiabilities(data);
    navigate("/real-estate-info");
  };

  return (
    <AnimatedPage>
      <Flex direction="column" minH="100vh" align="center" bg="white" px={4} py={6}>
        <VStack spacing={4} maxW="700px" w="100%">
          <Heading as="h2" size="lg" textAlign="center">
            Assets and Liabilities
          </Heading>
          <Text textAlign="center" color="gray.600">
            Please enter your asset and liability details.
          </Text>

          <Box w="100%" as="form" onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={6} align="stretch">
              {/* Section 2a */}
              <Heading as="h3" size="md">
                2a. Bank Accounts, Retirement, Other Accounts
              </Heading>
              {assetsAccounts.fields.map((item, index) => (
                <Flex key={item.id} gap={2} flexWrap="wrap">
                  <FormControl isInvalid={!!errors.assetsAccounts?.[index]?.accountType}>
                    <FormLabel>Account Type</FormLabel>
                    <Controller
                      name={`assetsAccounts.${index}.accountType`}
                      control={control}
                      render={({ field }) => (
                        <Input as="select" {...field} value={field.value ?? ""}>
                          <option value="">Select</option>
                          {accountTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </Input>
                      )}
                    />
                    <FormErrorMessage>
                      {getErrorMessage(errors.assetsAccounts?.[index]?.accountType)}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.assetsAccounts?.[index]?.institution}>
                    <FormLabel>Financial Institution</FormLabel>
                    <Controller
                      name={`assetsAccounts.${index}.institution`}
                      control={control}
                      render={({ field }) => <Input {...field} />}
                    />
                    <FormErrorMessage>
                      {getErrorMessage(errors.assetsAccounts?.[index]?.institution)}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.assetsAccounts?.[index]?.accountNumber}>
                    <FormLabel>Account Number</FormLabel>
                    <Controller
                      name={`assetsAccounts.${index}.accountNumber`}
                      control={control}
                      render={({ field }) => <Input {...field} />}
                    />
                    <FormErrorMessage>
                      {getErrorMessage(errors.assetsAccounts?.[index]?.accountNumber)}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.assetsAccounts?.[index]?.value}>
                    <FormLabel>Cash or Market Value</FormLabel>
                    <Controller
                      name={`assetsAccounts.${index}.value`}
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
                      {getErrorMessage(errors.assetsAccounts?.[index]?.value)}
                    </FormErrorMessage>
                  </FormControl>
                  <Button
                    variant="outline"
                    colorScheme="red"
                    onClick={() => assetsAccounts.remove(index)}
                  >
                    Remove
                  </Button>
                </Flex>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  assetsAccounts.append({
                    accountType: "",
                    institution: "",
                    accountNumber: "",
                    value: "",
                  })
                }
              >
                Add Account
              </Button>

              {/* Section 2b */}
              <Flex align="center" gap={2}>
                <Heading as="h3" size="md">
                  2b. Other Assets and Credits
                </Heading>
                <Checkbox
                  isChecked={hideOtherAssets}
                  onChange={(e) => setHideOtherAssets(e.target.checked)}
                >
                  Does not apply
                </Checkbox>
              </Flex>
              {!hideOtherAssets && (
                <>
                  {otherAssets.fields.map((item, index) => (
                    <Flex key={item.id} gap={2} flexWrap="wrap">
                      <FormControl isInvalid={!!errors.otherAssets?.[index]?.type}>
                        <FormLabel>Asset or Credit Type</FormLabel>
                        <Controller
                          name={`otherAssets.${index}.type`}
                          control={control}
                          render={({ field }) => (
                            <Input as="select" {...field} value={field.value ?? ""}>
                              <option value="">Select</option>
                              {assetCreditTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </Input>
                          )}
                        />
                        <FormErrorMessage>
                          {getErrorMessage(errors.otherAssets?.[index]?.type)}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!errors.otherAssets?.[index]?.value}>
                        <FormLabel>Cash or Market Value</FormLabel>
                        <Controller
                          name={`otherAssets.${index}.value`}
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
                          {getErrorMessage(errors.otherAssets?.[index]?.value)}
                        </FormErrorMessage>
                      </FormControl>
                      <Button
                        variant="outline"
                        colorScheme="red"
                        onClick={() => otherAssets.remove(index)}
                      >
                        Remove
                      </Button>
                    </Flex>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() =>
                      otherAssets.append({
                        type: "",
                        value: "",
                      })
                    }
                  >
                    Add Other Asset or Credit
                  </Button>
                </>
              )}

              {/* Section 2c */}
              <Flex align="center" gap={2}>
                <Heading as="h3" size="md">
                  2c. Liabilities – Credit Cards, Other Debts, and Leases
                </Heading>
                <Checkbox
                  isChecked={hideLiabilities}
                  onChange={(e) => setHideLiabilities(e.target.checked)}
                >
                  Does not apply
                </Checkbox>
              </Flex>
              {!hideLiabilities && (
                <>
                  {liabilities.fields.map((item, index) => (
                    <Flex key={item.id} gap={2} flexWrap="wrap">
                      <FormControl isInvalid={!!errors.liabilities?.[index]?.accountType}>
                        <FormLabel>Account Type</FormLabel>
                        <Controller
                          name={`liabilities.${index}.accountType`}
                          control={control}
                          render={({ field }) => (
                            <Input as="select" {...field} value={field.value ?? ""}>
                              <option value="">Select</option>
                              {liabilityTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </Input>
                          )}
                        />
                        <FormErrorMessage>
                          {getErrorMessage(errors.liabilities?.[index]?.accountType)}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.liabilities?.[index]?.company}>
                        <FormLabel>Company Name</FormLabel>
                        <Controller
                          name={`liabilities.${index}.company`}
                          control={control}
                          render={({ field }) => <Input {...field} />}
                        />
                        <FormErrorMessage>
                          {getErrorMessage(errors.liabilities?.[index]?.company)}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.liabilities?.[index]?.accountNumber}>
                        <FormLabel>Account Number</FormLabel>
                        <Controller
                          name={`liabilities.${index}.accountNumber`}
                          control={control}
                          render={({ field }) => <Input {...field} />}
                        />
                        <FormErrorMessage>
                          {getErrorMessage(errors.liabilities?.[index]?.accountNumber)}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.liabilities?.[index]?.balance}>
                        <FormLabel>Unpaid Balance</FormLabel>
                        <Controller
                          name={`liabilities.${index}.balance`}
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
                          {getErrorMessage(errors.liabilities?.[index]?.balance)}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl>
                        <FormLabel>To be paid off at or before closing?</FormLabel>
                        <Controller
                          name={`liabilities.${index}.toBePaidOff`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              isChecked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            >
                              Yes
                            </Checkbox>
                          )}
                        />
                      </FormControl>

                      <FormControl isInvalid={!!errors.liabilities?.[index]?.payment}>
                        <FormLabel>Monthly Payment</FormLabel>
                        <Controller
                          name={`liabilities.${index}.payment`}
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
                          {getErrorMessage(errors.liabilities?.[index]?.payment)}
                        </FormErrorMessage>
                      </FormControl>

                      <Button
                        variant="outline"
                        colorScheme="red"
                        onClick={() => liabilities.remove(index)}
                      >
                        Remove
                      </Button>
                    </Flex>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() =>
                      liabilities.append({
                        accountType: "",
                        company: "",
                        accountNumber: "",
                        balance: "",
                        payment: "",
                        toBePaidOff: false,
                      })
                    }
                  >
                    Add Liability
                  </Button>
                </>
              )}

              {/* Section 2d */}
              <Flex align="center" gap={2}>
                <Heading as="h3" size="md">
                  2d. Other Liabilities and Expenses
                </Heading>
                <Checkbox
                  isChecked={hideOtherLiabilities}
                  onChange={(e) => setHideOtherLiabilities(e.target.checked)}
                >
                  Does not apply
                </Checkbox>
              </Flex>
              {!hideOtherLiabilities && (
                <>
                  {otherLiabilities.fields.map((item, index) => (
                    <Flex key={item.id} gap={2} flexWrap="wrap">
                      <FormControl isInvalid={!!errors.otherLiabilities?.[index]?.type}>
                        <FormLabel>Liability Type</FormLabel>
                        <Controller
                          name={`otherLiabilities.${index}.type`}
                          control={control}
                          render={({ field }) => (
                            <Input as="select" {...field} value={field.value ?? ""}>
                              <option value="">Select</option>
                              {otherLiabilityTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </Input>
                          )}
                        />
                        <FormErrorMessage>
                          {getErrorMessage(errors.otherLiabilities?.[index]?.type)}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.otherLiabilities?.[index]?.payment}>
                        <FormLabel>Monthly Payment</FormLabel>
                        <Controller
                          name={`otherLiabilities.${index}.payment`}
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
                          {getErrorMessage(errors.otherLiabilities?.[index]?.payment)}
                        </FormErrorMessage>
                      </FormControl>

                      <Button
                        variant="outline"
                        colorScheme="red"
                        onClick={() => otherLiabilities.remove(index)}
                      >
                        Remove
                      </Button>
                    </Flex>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() =>
                      otherLiabilities.append({
                        type: "",
                        payment: "",
                      })
                    }
                  >
                    Add Other Liability
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
                  !isValid ||
                  assetsAccounts.fields.length === 0 ||
                  (
                    !hideOtherAssets && otherAssets.fields.length === 0
                  ) ||
                  (
                    !hideLiabilities && liabilities.fields.length === 0
                  ) ||
                  (
                    !hideOtherLiabilities && otherLiabilities.fields.length === 0
                  )
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