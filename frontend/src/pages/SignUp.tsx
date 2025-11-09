import { 
    Box,
    Button,
    Card,
    Heading,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    InputGroup,
    InputRightElement,
    IconButton,
    useToast,
    VStack
} from "@chakra-ui/react";
import { AnimatedPage } from "../ui/AnimatedPage";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useState, useMemo } from "react";
import { ImEye, ImEyeBlocked } from "react-icons/im";

import { signUp } from "../lib/api";

type UserValues = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const schema = yup.object({
    firstName: yup.string().trim().required("First name is required!"),
    lastName: yup.string().trim().required("Last name is required!"),
    email: yup.string().trim().email("Enter a valid email!").required("Email is required!"),
    password: yup.string().required().min(8, "Password must be at least 8 characters!")
        .matches(/[A-Z]/, "Please include at least one uppercase letter!")
        .matches(/[a-z]/, "Please include at least one lowercase letter!")
        .matches(/[0-9]/, "Please include at least one number!"),
}).required();

export default function SignUp() {
    const navigate = useNavigate();
    const toast = useToast();
    const [toggle, setToggle] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid, isSubmitting },
    } = useForm<UserValues>({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

    const controller = useMemo(() => new AbortController(), []);

    const onSubmit = async (values: UserValues) => {
        try {
            await signUp(values, controller.signal);

            toast({
                title: "Account created",
                description: "Welcome! You're all set!",
                status: "success",
                duration: 3000,
                isClosable: true
            });

            navigate("/dashboard");
        } catch (e: any) {
            const fieldErrors = e?.details?.fieldErrors as Record<string, string> | undefined;
            if (fieldErrors) {
                Object.entries(fieldErrors).forEach(([field, message]) => {
                if (field in values) {
                    setError(field as keyof UserValues, { type: "server", message });
                }
                });
            }

            if (e?.status === 409 && !fieldErrors?.email) {
                setError("email", { type: "server", message: "Email already in use" });
            }

            toast({
                title: "Sign Up failed",
                description: e?.message || "Please try again.",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        }
    }

    return (
        <AnimatedPage>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="80vh"
            >
                <Card p={10} boxShadow="2xl" borderRadius="xl">
                    <Heading mb={"8"}>
                        Create an Account
                    </Heading>

                    <Box as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                        <VStack spacing={5} align="stretch" w="full">
                            <FormControl isInvalid={!!errors.firstName} isRequired>
                                <FormLabel textAlign="left" fontWeight="bold">
                                    First Name
                                </FormLabel>
                                <Input
                                    placeholder="John"
                                    autoComplete="given-name"
                                    {...register("firstName")}
                                />
                                <FormErrorMessage>
                                    {errors.firstName?.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.lastName} isRequired>
                                <FormLabel textAlign="left" fontWeight="bold">
                                    Last Name
                                </FormLabel>
                                <Input
                                    placeholder="Aedo"
                                    autoComplete="family-name"
                                    {...register("lastName")}
                                />
                                <FormErrorMessage>
                                    {errors.lastName?.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.email} isRequired>
                                <FormLabel textAlign="left" fontWeight="bold">
                                    Email
                                </FormLabel>
                                <Input
                                    type="email"
                                    placeholder="john.aedo@ucf.edu"
                                    autoComplete="email"
                                    {...register("email")}
                                />
                                <FormErrorMessage>
                                    {errors.email?.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.password} isRequired>
                                <FormLabel textAlign="left" fontWeight="bold">
                                    Password
                                </FormLabel>
                                
                                <InputGroup>
                                    <Input
                                        type={toggle ? "text" : "password"}
                                        placeholder="********"
                                        autoComplete="new-password"
                                        className="w-full pr-10"
                                        {...register("password")}
                                    />

                                    <InputRightElement width="3rem">
                                        <IconButton
                                            aria-label={toggle ? "Hide Password" : "Show Password"}
                                            icon={toggle ? <ImEye /> : <ImEyeBlocked />}
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setToggle(!toggle)}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage>
                                    {errors.password?.message}
                                </FormErrorMessage>
                            </FormControl>
                        </VStack>
                        <Box display="flex" justifyContent="flex-end" mt="6" gap={3}>
                            <Button onClick={() => navigate("/sign-in")} variant="outline">
                                Sign-In
                            </Button>
                            <Button 
                                variant="solid" 
                                type="submit" 
                                colorScheme="blue"
                                isDisabled={!isValid || isSubmitting}
                                isLoading={isSubmitting}
                            >
                                Continue
                            </Button>
                        </Box>
                    </Box>
                </Card>
            </Box>
        </AnimatedPage>
    );
}