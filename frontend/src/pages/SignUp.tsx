import { 
    Box,
    Button,
    Card,
    Heading,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    VStack
} from "@chakra-ui/react";
import { AnimatedPage } from "../ui/AnimatedPage";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const navigate = useNavigate();

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
                    <FormControl isRequired>
                        <VStack spacing={5} align="stretch" w="full">
                            <Box>
                                <FormLabel textAlign="left" fontWeight="bold">
                                    First Name
                                </FormLabel>
                                <Input
                                    name="firstname"
                                    placeholder="John"
                                    autoComplete="given-name"
                                    required
                                />
                            </Box>
                            <Box>
                                <FormLabel textAlign="left" fontWeight="bold">
                                    Last Name
                                </FormLabel>
                                <Input
                                    name="lastname"
                                    placeholder="Aedo"
                                    autoComplete="family-name"
                                    required
                                />
                            </Box>
                            <Box>
                                <FormLabel textAlign="left" fontWeight="bold">
                                    Email
                                </FormLabel>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="john.aedo@ucf.edu"
                                    autoComplete="email"
                                    required
                                />
                            </Box>
                            <Box>
                                <FormLabel textAlign="left" fontWeight="bold">
                                    Password
                                </FormLabel>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="********"
                                    autoComplete="new-password"
                                    required
                                />
                            </Box>
                        </VStack>
                        <Box display="flex" justifyContent="flex-end" mt="6" gap={3}>
                            <Button onClick={() => navigate("/sign-in")} variant="outline">
                                Sign-In
                            </Button>
                            <Button variant="solid" type="submit" colorScheme="blue">
                                Continue
                            </Button>
                        </Box>
                    </FormControl>
                </Card>
            </Box>
        </AnimatedPage>
    );
}