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
  Checkbox,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AnimatedPage } from "../functions/AnimatedPage";
import { useLoanApp } from "../context/LoanAppContext";
import { NumericFormat } from "react-number-format";

const schema = yup.object({
  employerName: yup.string().required("Employer or Business Name is required"),
  phone: yup.string().required("Phone is required"),
  street: yup.string().required("Street is required"),
  unit: yup.string(),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zip: yup.string().required("ZIP is required"),
  country: yup.string().required("Country is required"),
  position: yup.string().required("Position is required"),
  startDate: yup.string().required("Start date is required"),
  yearsInLineOfWork: yup.string().required("Years in line of work is required"),
  monthsInLineOfWork: yup.string().required("Months in line of work is required"),
  isSelfEmployed: yup.boolean(),
  isEmployedByFamily: yup.boolean(),
  ownershipShare: yup.string(),
  monthlyIncomeBase: yup.string().required("Base income is required"),
  monthlyIncomeOvertime: yup.string(),
  monthlyIncomeBonus: yup.string(),
  monthlyIncomeCommission: yup.string(),
  monthlyIncomeMilitary: yup.string(),
  monthlyIncomeOther: yup.string(),
  otherIncome: yup.array().of(
    yup.object({
      source: yup.string().nullable(),
      amount: yup.string().when("source", {
        is: (val: string) => val && val !== "",
        then: (schema) => schema.required("Amount is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    })
  ),
});

export const EmploymentInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { updatePersonalInfo } = useLoanApp();

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      otherIncome: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "otherIncome",
  });

  const onSubmit = (data: any) => {
    updatePersonalInfo(data);
    navigate("/assets-info");
  };

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
        <VStack spacing={4} maxW="700px" w="100%">
          <Heading as="h2" size="lg" textAlign="center">
            Employment Information
          </Heading>
          <Text textAlign="center" color="gray.600">
            Please enter your employment details.
          </Text>

          <Box w="100%" as="form" onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              {/* Employer */}
              <FormControl isInvalid={!!errors.employerName}>
                <FormLabel>Employer or Business Name</FormLabel>
                <Controller
                  name="employerName"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.employerName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.phone}>
                <FormLabel>Phone</FormLabel>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
              </FormControl>

              {/* Address */}
              <FormControl isInvalid={!!errors.street}>
                <FormLabel>Street</FormLabel>
                <Controller
                  name="street"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.street?.message}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Unit #</FormLabel>
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
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
                <FormLabel>ZIP</FormLabel>
                <Controller
                  name="zip"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.zip?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.country}>
                <FormLabel>Country</FormLabel>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.country?.message}</FormErrorMessage>
              </FormControl>

              {/* Position */}
              <FormControl isInvalid={!!errors.position}>
                <FormLabel>Position or Title</FormLabel>
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.position?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.startDate}>
                <FormLabel>Start Date</FormLabel>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => <Input type="date" {...field} />}
                />
                <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
              </FormControl>

              <Flex gap={2} w="100%">
                <FormControl isInvalid={!!errors.yearsInLineOfWork}>
                  <FormLabel>Years in this line of work</FormLabel>
                  <Controller
                    name="yearsInLineOfWork"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <FormErrorMessage>{errors.yearsInLineOfWork?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.monthsInLineOfWork}>
                  <FormLabel>Months</FormLabel>
                  <Controller
                    name="monthsInLineOfWork"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <FormErrorMessage>{errors.monthsInLineOfWork?.message}</FormErrorMessage>
                </FormControl>
              </Flex>

              {/* Checkboxes */}
              <FormControl>
                <Controller
                  name="isSelfEmployed"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      isChecked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    >
                      I am the business owner or self-employed
                    </Checkbox>
                  )}
                />
              </FormControl>

              <FormControl>
                <Controller
                  name="isEmployedByFamily"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      isChecked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    >
                      I am employed by a family member or related party
                    </Checkbox>
                  )}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Ownership Share</FormLabel>
                <Controller
                  name="ownershipShare"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <Stack direction="column">
                        <Radio value="lessThan25">Less than 25%</Radio>
                        <Radio value="25orMore">25% or more</Radio>
                      </Stack>
                    </RadioGroup>
                  )}
                />
              </FormControl>

              {/* Income Fields */}
              {[
                { name: "monthlyIncomeBase", label: "Base Income (Required)" },
                { name: "monthlyIncomeOvertime", label: "Overtime" },
                { name: "monthlyIncomeBonus", label: "Bonus" },
                { name: "monthlyIncomeCommission", label: "Commission" },
                { name: "monthlyIncomeMilitary", label: "Military Entitlements" },
                { name: "monthlyIncomeOther", label: "Other" },
              ].map((field) => (
                <FormControl
                  key={field.name}
                  isInvalid={!!errors[field.name as keyof typeof errors]}
                >
                  <FormLabel>{field.label}</FormLabel>
                  <Controller
                    name={field.name as any}
                    control={control}
                    render={({ field: fieldProps }) => (
                      <NumericFormat
                        {...fieldProps}
                        thousandSeparator
                        prefix="$"
                        allowNegative={false}
                        decimalScale={2}
                        fixedDecimalScale
                        customInput={Input}
                        onValueChange={(values) => {
                          fieldProps.onChange(values.value);
                        }}
                        value={fieldProps.value ?? ""}
                      />
                    )}
                  />
                  <FormErrorMessage>
                    {errors[field.name as keyof typeof errors]?.message}
                  </FormErrorMessage>
                </FormControl>
              ))}

              {/* Income from Other Sources */}
              <VStack spacing={2} align="stretch" w="100%">
                <FormLabel fontWeight="medium">
                  Income from Other Sources
                </FormLabel>

                {fields.map((item, index) => (
                  <Flex key={item.id} gap={2} align="flex-end">
                    <FormControl isInvalid={!!errors.otherIncome?.[index]?.source}>
                      <FormLabel>Source</FormLabel>
                      <Controller
                        name={`otherIncome.${index}.source`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            as="select"
                            {...field}
                            value={field.value ?? ""}
                          >
                            
                            <option value="">Select source</option>
                            <option value="Alimony">Alimony</option>
                            <option value="Child Support">Child Support</option>
                            <option value="VA Compensation">Disability</option>
                            <option value="Social Security">Retirement</option>
                            <option value="Retirement">Social Security</option>
                            <option value="Retirement">VA Compensation</option>
                            <option value="Other">Other</option>
                          </Input>
                        )}
                      />
                      <FormErrorMessage>
                        {errors.otherIncome?.[index]?.source?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.otherIncome?.[index]?.amount}>
                      <FormLabel>Amount</FormLabel>
                      <Controller
                        name={`otherIncome.${index}.amount`}
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
                            value={field.value ?? ""}
                          />
                        )}
                      />
                      <FormErrorMessage>
                        {errors.otherIncome?.[index]?.amount?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <Button
                      variant="outline"
                      colorScheme="red"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  </Flex>
                ))}

                <Button
                  variant="outline"
                  onClick={() => append({ source: "", amount: "" })}
                >
                  Add Another Source
                </Button>
              </VStack>
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