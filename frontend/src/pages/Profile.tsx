import {
  Box,
  Button,
  Card,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  useToast,
  Spinner,
  Text,
  Divider,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { updateProfile, changePassword } from "../lib/api";
import { AnimatedPage } from "../ui/AnimatedPage";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { signOut } from "../lib/api";
import { useNavigate } from "react-router-dom";

type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
};

type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const profileSchema = yup.object({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Please include at least one uppercase letter")
    .matches(/[a-z]/, "Please include at least one lowercase letter")
    .matches(/[0-9]/, "Please include at least one number"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your new password"),
});

export default function Profile() {
  const { user, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isSavingProfile },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isChangingPassword },
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Prefill profile form when user loads
  useEffect(() => {
    if (user) {
      resetProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user, resetProfile]);

  const onSubmitProfile = async (values: ProfileFormData) => {
    try {
      await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
      });

      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.message || "Something went wrong.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const onSubmitPassword = async (values: PasswordFormData) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      toast({
        title: "Password changed",
        description: "You can now sign in with your new password.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      resetPassword({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err: any) {
      toast({
        title: "Password change failed",
        description: err?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loading && !user) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Card p={8} borderRadius="xl" boxShadow="xl">
          <Heading size="md" mb={4}>
            Not signed in
          </Heading>
          <Text>Please sign in to edit your profile.</Text>
        </Card>
      </Box>
    );
  }

  return (
    <AnimatedPage>
      <Box
        minH="80vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Card p={10} boxShadow="2xl" borderRadius="xl" maxW="lg" w="full">
          <Heading mb={6}>Your Profile</Heading>

          {/* Profile form */}
          <form noValidate onSubmit={handleSubmitProfile(onSubmitProfile)}>
            <VStack spacing={5} align="stretch">
              <FormControl isInvalid={!!profileErrors.firstName} isRequired>
                <FormLabel>First Name</FormLabel>
                <Input placeholder="John" {...registerProfile("firstName")} />
                <FormErrorMessage>
                  {profileErrors.firstName?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!profileErrors.lastName} isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input placeholder="Aedo" {...registerProfile("lastName")} />
                <FormErrorMessage>
                  {profileErrors.lastName?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!profileErrors.email} isRequired isDisabled>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="john.aedo@ucf.edu"
                  {...registerProfile("email")}
                  readOnly
                />
                <FormErrorMessage>
                  {profileErrors.email?.message}
                </FormErrorMessage>
              </FormControl>

              <Box display="flex" justifyContent="flex-end" mt={2} gap={3}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSavingProfile}
                >
                  Save Changes
                </Button>
              </Box>
            </VStack>
          </form>

          <Divider my={8} />

          {/* Change password form */}
          <Heading size="md" mb={4}>
            Change Password
          </Heading>
          <form noValidate onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <VStack spacing={5} align="stretch">
              <FormControl isInvalid={!!passwordErrors.currentPassword} isRequired>
                <FormLabel>Current Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showCurrentPw ? "text" : "password"}
                    placeholder="Current password"
                    autoComplete="current-password"
                    {...registerPassword("currentPassword")}
                  />
                  <InputRightElement width="3rem">
                    <IconButton
                      aria-label={
                        showCurrentPw ? "Hide password" : "Show password"
                      }
                      icon={showCurrentPw ? <ImEye /> : <ImEyeBlocked />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCurrentPw((v) => !v)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {passwordErrors.currentPassword?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!passwordErrors.newPassword} isRequired>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showNewPw ? "text" : "password"}
                    placeholder="New password"
                    autoComplete="new-password"
                    {...registerPassword("newPassword")}
                  />
                  <InputRightElement width="3rem">
                    <IconButton
                      aria-label={showNewPw ? "Hide password" : "Show password"}
                      icon={showNewPw ? <ImEye /> : <ImEyeBlocked />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewPw((v) => !v)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {passwordErrors.newPassword?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!passwordErrors.confirmNewPassword}
                isRequired
              >
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPw ? "text" : "password"}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    {...registerPassword("confirmNewPassword")}
                  />
                  <InputRightElement width="3rem">
                    <IconButton
                      aria-label={
                        showConfirmPw ? "Hide password" : "Show password"
                      }
                      icon={showConfirmPw ? <ImEye /> : <ImEyeBlocked />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPw((v) => !v)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {passwordErrors.confirmNewPassword?.message}
                </FormErrorMessage>
              </FormControl>

              <Box display="flex" justifyContent="flex-end" mt={2} gap={3}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  variant="outline"
                  isLoading={isChangingPassword}
                >
                  Update Password
                </Button>
              </Box>
            </VStack>
          </form>

            <Divider my={8} />

            <Button
                onClick={async () => {
                    await signOut();
                    navigate("/");
                }}
                colorScheme="red"
                size="md"
                isLoading={loading}
                >
                Sign Out
            </Button>
        </Card>
      </Box>
    </AnimatedPage>
  );
}
