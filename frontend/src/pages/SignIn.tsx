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
    VStack
} from "@chakra-ui/react";
import { AnimatedPage } from "../ui/AnimatedPage";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { ImEye, ImEyeBlocked } from "react-icons/im";

export default function SignIn() {
    const navigate = useNavigate();

    const [toggle, setToggle] = useState<boolean>(false);

    return (
        <AnimatedPage>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="80vh"
            >
                <Card p={10} boxShadow="2xl" borderRadius="xl">
                    <Heading mb={"3"}>
                        Sign-In
                    </Heading>
                    <FormControl isRequired>
                        <VStack spacing={5} align="stretch" w="full">
                            <Box>
                                <FormLabel textAlign="left" fontWeight="bold">
                                    Username
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

                                <InputGroup>
                                    <Input
                                        type={toggle ? "text" : "password"}
                                        name="password"
                                        placeholder="********"
                                        autoComplete="current-password"
                                        className="w-full pr-10"
                                        required
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
                            </Box>
                        </VStack>
                        <Box display="flex" justifyContent="flex-end" mt="6" gap={3}>
                            <Button onClick={() => navigate("/sign-up")} variant="outline">
                                Create Account
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