import React from "react";
import {
  Box,
  Button,
  Flex,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  RadioGroup,
  Radio,
  Stack,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoanApp } from "../hooks/useLoanApp";
import { useNavigate } from "react-router-dom";
import { AnimatedPage } from "../ui/AnimatedPage";

const schema = yup.object({
  occupyAsPrimary: yup.string().required(),
  ownedPropertyLast3Years: yup.string().required(),
  typeOfProperty: yup.string().nullable(),
  titleHeld: yup.string().nullable(),
  relationshipWithSeller: yup.string().required(),
  borrowingMoney: yup.string().required(),
  borrowingMoneyAmount: yup.string().nullable(),
  mortgageOnOtherProperty: yup.string().required(),
  obligatedOnLoan: yup.string().required(),
  cosigner: yup.string().required(),
  borrowedDownPayment: yup.string().required(),
  declaredForeclosure: yup.string().required(),
  declaredBankruptcy: yup.string().required(),
  bankruptcyTypes: yup.array().of(yup.string()).nullable(),
});

export const Declarations: React.FC = () => {
  const navigate = useNavigate();
  const { data, updateDeclarations } = useLoanApp();

  const {
  handleSubmit,
  control,
  watch,
  formState: { errors, isValid },
} = useForm({
  resolver: yupResolver(schema),
  mode: "onChange",
  defaultValues: {
    occupyAsPrimary: "",
    ownedPropertyLast3Years: "",
    typeOfProperty: "",
    titleHeld: "",
    relationshipWithSeller: "",
    borrowingMoney: "",
    borrowingMoneyAmount: "",
    mortgageOnOtherProperty: "",
    obligatedOnLoan: "",
    cosigner: "",
    borrowedDownPayment: "",
    declaredForeclosure: "",
    declaredBankruptcy: "",
    bankruptcyTypes: [],
    ...data.declarations, // ✅ prefill from context
  },
});

  const watchBorrowingMoney = watch("borrowingMoney");
  const watchDeclaredBankruptcy = watch("declaredBankruptcy");

  const onSubmit = (data: any) => {
    console.log("Declarations submitted:", data);
    updateDeclarations(data);
    navigate("/review");
  };

  return (
    <AnimatedPage>
      <Flex direction="column" minH="100vh" align="center" bg="white" px={4} py={6}>
        <VStack spacing={4} maxW="700px" w="100%">
          <Heading as="h2" size="lg" textAlign="center">
            Declarations
          </Heading>
          <Text textAlign="center" color="gray.600">
            Please answer the following questions.
          </Text>

          <Box w="100%" as="form" onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={6} align="stretch">
              {[
                { name: "occupyAsPrimary", label: "Will you occupy the property as your primary residence?" },
                { name: "ownedPropertyLast3Years", label: "Have you had ownership interest in a property in the last 3 years?" },
                { name: "relationshipWithSeller", label: "Are you related to the seller?" },
                { name: "borrowingMoney", label: "Are you borrowing any money for this transaction?" },
                { name: "mortgageOnOtherProperty", label: "Do you have a mortgage on any other property?" },
                { name: "obligatedOnLoan", label: "Are you obligated on any loan not included in this application?" },
                { name: "cosigner", label: "Are you a cosigner or guarantor on any debt?" },
                { name: "borrowedDownPayment", label: "Have you borrowed any part of the down payment?" },
                { name: "declaredForeclosure", label: "Have you declared foreclosure in the last 7 years?" },
                { name: "declaredBankruptcy", label: "Have you declared bankruptcy in the last 7 years?" },
              ].map(({ name, label }) => (
                <React.Fragment key={name}>
                  <FormControl isInvalid={!!errors[name as keyof typeof errors]}>
                    <FormLabel>{label}</FormLabel>
                    <Controller
                      name={name as any}
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          value={typeof field.value === "string" ? field.value : ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        >
                          <Stack direction="row">
                            <Radio value="Yes">Yes</Radio>
                            <Radio value="No">No</Radio>
                          </Stack>
                        </RadioGroup>
                      )}
                    />
                    <FormErrorMessage>
                      {errors[name as keyof typeof errors]?.message as string}
                    </FormErrorMessage>
                  </FormControl>

                  {name === "borrowingMoney" && watchBorrowingMoney === "Yes" && (
                    <FormControl isInvalid={!!errors.borrowingMoneyAmount}>
                      <FormLabel>How much are you borrowing?</FormLabel>
                      <Controller
                        name="borrowingMoneyAmount"
                        control={control}
                        render={({ field }) => (
                          <Input {...field} value={field.value ?? ""} />
                        )}
                      />
                      <FormErrorMessage>{errors.borrowingMoneyAmount?.message}</FormErrorMessage>
                    </FormControl>
                  )}
                </React.Fragment>
              ))}

              {watchDeclaredBankruptcy === "Yes" && (
                <FormControl>
                  <FormLabel>Select all that apply</FormLabel>
                  <Controller
                    name="bankruptcyTypes"
                    control={control}
                    render={({ field }) => (
                      <Stack spacing={2}>
                        {["Chapter 7", "Chapter 11", "Chapter 13"].map((type) => (
                          <Checkbox
                            key={type}
                            isChecked={field.value?.includes(type) ?? false}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              const current = field.value ?? [];
                              if (checked) {
                                field.onChange([...current, type]);
                              } else {
                                field.onChange(current.filter((i) => i !== type));
                              }
                            }}
                          >
                            {type}
                          </Checkbox>
                        ))}
                      </Stack>
                    )}
                  />
                </FormControl>
              )}

              <Flex justify="space-between" mt={8}>
                <Button colorScheme="brand" variant="solid" onClick={() => navigate(-1)}>
                  Back
                </Button>
                <Button colorScheme="brand" type="submit" isDisabled={!isValid}>
                  Review
                </Button>
              </Flex>
            </VStack>
          </Box>
        </VStack>
      </Flex>
    </AnimatedPage>
  );
};