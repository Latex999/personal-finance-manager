import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  Switch,
  VStack,
  HStack,
  useToast,
  Avatar,
  Center,
  Flex,
  Icon,
  useColorMode,
  useColorModeValue,
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { FiUser, FiMail, FiLock, FiDollarSign, FiFileText, FiSettings, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Profile update validation schema
const ProfileSchema = Yup.object().shape({
  displayName: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  currentPassword: Yup.string()
    .min(6, 'Password should be at least 6 characters')
    .when('newPassword', {
      is: val => val && val.length > 0,
      then: Yup.string().required('Current password is required to change password')
    }),
  newPassword: Yup.string()
    .min(6, 'Password should be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});

// Settings validation schema
const SettingsSchema = Yup.object().shape({
  currency: Yup.string().required('Currency is required'),
  notificationsEnabled: Yup.boolean(),
  dataExportFormat: Yup.string()
});

export default function Profile() {
  const { currentUser, updateUserProfile, updateUserEmail, updateUserPassword, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const cancelRef = React.useRef();

  const bgCard = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // In a real app, fetch user data from Firestore
        // For demo, using mock data
        setUserData({
          displayName: currentUser?.displayName || '',
          email: currentUser?.email || '',
          photoURL: currentUser?.photoURL || '',
          settings: {
            currency: 'USD',
            theme: colorMode,
            notifications: true,
            dataExportFormat: 'CSV'
          },
          stats: {
            accountCreated: 'May 1, 2023',
            transactionsRecorded: 125,
            totalBudgets: 6,
            savingsGoals: 3
          }
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error fetching profile",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true
        });
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser, colorMode, toast]);

  const handleProfileUpdate = async (values, actions) => {
    try {
      setUpdateSuccess(false);
      const { displayName, email, currentPassword, newPassword } = values;
      
      // Update profile if display name changed
      if (currentUser.displayName !== displayName) {
        await updateUserProfile(currentUser, { displayName });
      }
      
      // Update email if changed
      if (currentUser.email !== email) {
        await updateUserEmail(currentUser, email);
      }
      
      // Update password if provided
      if (newPassword) {
        await updateUserPassword(currentUser, newPassword);
      }
      
      // In a real app, you would also update the Firestore document
      // For this demo, we'll just simulate success
      
      setUpdateSuccess(true);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleSettingsUpdate = async (values, actions) => {
    try {
      // In a real app, update settings in Firestore
      // For this demo, we'll just simulate success
      
      setUserData(prevData => ({
        ...prevData,
        settings: {
          ...prevData.settings,
          currency: values.currency,
          notifications: values.notificationsEnabled,
          dataExportFormat: values.dataExportFormat
        }
      }));
      
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error updating settings",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleThemeToggle = () => {
    toggleColorMode();
    setUserData(prevData => ({
      ...prevData,
      settings: {
        ...prevData.settings,
        theme: colorMode === 'light' ? 'dark' : 'light'
      }
    }));
  };

  const handleDeleteAccount = () => {
    // In a real app, implement account deletion logic
    toast({
      title: "Demo Mode",
      description: "Account deletion is disabled in the demo",
      status: "info",
      duration: 5000,
      isClosable: true
    });
    setIsDeleteAccountDialogOpen(false);
  };

  if (isLoading || !userData) {
    return (
      <Box p={4}>
        <Heading as="h1" size="xl" mb={6}>
          Profile
        </Heading>
        <Text>Loading profile data...</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={6}>
        Profile
      </Heading>

      <Stack spacing={6} direction={{ base: 'column', lg: 'row' }}>
        {/* Left column - Profile info */}
        <Box flex="1">
          <Card bg={bgCard} shadow="md" mb={6}>
            <CardHeader>
              <Heading size="md">Profile Information</Heading>
            </CardHeader>
            <CardBody>
              <Center mb={6}>
                <VStack>
                  <Avatar 
                    size="2xl" 
                    name={userData.displayName} 
                    src={userData.photoURL || `https://avatars.dicebear.com/api/initials/${userData.displayName}.svg`} 
                  />
                  <Text mt={2} fontWeight="medium" fontSize="lg">
                    {userData.displayName}
                  </Text>
                  <Badge colorScheme="green">Active Account</Badge>
                </VStack>
              </Center>

              <Divider my={4} />

              <HStack spacing={10} justifyContent="center" mt={4}>
                <VStack align="center">
                  <Text fontSize="sm" color="gray.500">Account Created</Text>
                  <Text fontWeight="bold">{userData.stats.accountCreated}</Text>
                </VStack>
                <VStack align="center">
                  <Text fontSize="sm" color="gray.500">Transactions</Text>
                  <Text fontWeight="bold">{userData.stats.transactionsRecorded}</Text>
                </VStack>
                <VStack align="center">
                  <Text fontSize="sm" color="gray.500">Budgets</Text>
                  <Text fontWeight="bold">{userData.stats.totalBudgets}</Text>
                </VStack>
                <VStack align="center">
                  <Text fontSize="sm" color="gray.500">Goals</Text>
                  <Text fontWeight="bold">{userData.stats.savingsGoals}</Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card bg={bgCard} shadow="md">
            <CardHeader>
              <Heading size="md">Account Settings</Heading>
            </CardHeader>
            <CardBody>
              <Formik
                initialValues={{
                  currency: userData.settings.currency,
                  notificationsEnabled: userData.settings.notifications,
                  dataExportFormat: userData.settings.dataExportFormat
                }}
                validationSchema={SettingsSchema}
                onSubmit={handleSettingsUpdate}
              >
                {(props) => (
                  <Form>
                    <Stack spacing={4}>
                      <HStack>
                        <Icon as={FiDollarSign} />
                        <Field name="currency">
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.currency && form.touched.currency}>
                              <FormLabel>Preferred Currency</FormLabel>
                              <Select {...field}>
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="JPY">JPY - Japanese Yen</option>
                                <option value="CAD">CAD - Canadian Dollar</option>
                                <option value="AUD">AUD - Australian Dollar</option>
                              </Select>
                              <FormErrorMessage>{form.errors.currency}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </HStack>

                      <HStack>
                        <Icon as={FiSettings} />
                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="theme-toggle" mb="0">
                            Toggle Theme (Current: {colorMode})
                          </FormLabel>
                          <Switch 
                            id="theme-toggle" 
                            isChecked={colorMode === 'dark'} 
                            onChange={handleThemeToggle} 
                          />
                        </FormControl>
                      </HStack>

                      <HStack>
                        <Icon as={FiFileText} />
                        <Field name="dataExportFormat">
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.dataExportFormat && form.touched.dataExportFormat}>
                              <FormLabel>Data Export Format</FormLabel>
                              <Select {...field}>
                                <option value="CSV">CSV</option>
                                <option value="PDF">PDF</option>
                                <option value="EXCEL">Excel</option>
                                <option value="JSON">JSON</option>
                              </Select>
                              <FormErrorMessage>{form.errors.dataExportFormat}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </HStack>

                      <HStack>
                        <Icon as={FiSettings} />
                        <Field name="notificationsEnabled">
                          {({ field, form }) => (
                            <FormControl display="flex" alignItems="center">
                              <FormLabel htmlFor="notifications" mb="0">
                                Enable Notifications
                              </FormLabel>
                              <Switch 
                                id="notifications" 
                                isChecked={field.value} 
                                onChange={(e) => form.setFieldValue('notificationsEnabled', e.target.checked)} 
                              />
                            </FormControl>
                          )}
                        </Field>
                      </HStack>
                    </Stack>

                    <Button
                      mt={6}
                      colorScheme="blue"
                      isLoading={props.isSubmitting}
                      type="submit"
                    >
                      Save Settings
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Box>

        {/* Right column - Edit profile */}
        <Box flex="1">
          <Card bg={bgCard} shadow="md">
            <CardHeader>
              <Heading size="md">Edit Profile</Heading>
            </CardHeader>
            <CardBody>
              <Formik
                initialValues={{
                  displayName: userData.displayName,
                  email: userData.email,
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                }}
                validationSchema={ProfileSchema}
                onSubmit={handleProfileUpdate}
              >
                {(props) => (
                  <Form>
                    <Stack spacing={4}>
                      <HStack>
                        <Icon as={FiUser} />
                        <Field name="displayName">
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.displayName && form.touched.displayName}>
                              <FormLabel>Display Name</FormLabel>
                              <Input {...field} />
                              <FormErrorMessage>{form.errors.displayName}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </HStack>

                      <HStack>
                        <Icon as={FiMail} />
                        <Field name="email">
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.email && form.touched.email}>
                              <FormLabel>Email Address</FormLabel>
                              <Input {...field} type="email" />
                              <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </HStack>

                      <Divider my={2} />
                      <Text fontWeight="medium">Change Password (Optional)</Text>

                      <HStack>
                        <Icon as={FiLock} />
                        <Field name="currentPassword">
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.currentPassword && form.touched.currentPassword}>
                              <FormLabel>Current Password</FormLabel>
                              <Input {...field} type="password" />
                              <FormErrorMessage>{form.errors.currentPassword}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </HStack>

                      <HStack>
                        <Icon as={FiLock} />
                        <Field name="newPassword">
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.newPassword && form.touched.newPassword}>
                              <FormLabel>New Password</FormLabel>
                              <Input {...field} type="password" />
                              <FormErrorMessage>{form.errors.newPassword}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </HStack>

                      <HStack>
                        <Icon as={FiLock} />
                        <Field name="confirmPassword">
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.confirmPassword && form.touched.confirmPassword}>
                              <FormLabel>Confirm New Password</FormLabel>
                              <Input {...field} type="password" />
                              <FormErrorMessage>{form.errors.confirmPassword}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </HStack>
                    </Stack>

                    {updateSuccess && (
                      <Box mt={4} p={3} bg="green.100" color="green.800" borderRadius="md">
                        Profile updated successfully!
                      </Box>
                    )}

                    <Button
                      mt={6}
                      colorScheme="blue"
                      isLoading={props.isSubmitting}
                      type="submit"
                    >
                      Update Profile
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>

          <Card bg={bgCard} shadow="md" mt={6}>
            <CardHeader>
              <Heading size="md" color="red.500">Danger Zone</Heading>
            </CardHeader>
            <CardBody>
              <HStack>
                <Icon as={FiAlertTriangle} color="red.500" />
                <Text>Delete your account and all associated data.</Text>
              </HStack>
              <Text fontSize="sm" color="gray.500" mt={2}>
                This action cannot be undone. All your data will be permanently removed.
              </Text>
              <Button
                mt={4}
                colorScheme="red"
                variant="outline"
                onClick={() => setIsDeleteAccountDialogOpen(true)}
              >
                Delete Account
              </Button>
            </CardBody>
          </Card>
        </Box>
      </Stack>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteAccountDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteAccountDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This action cannot be undone. All your financial data, 
              transactions, budgets, and goals will be permanently deleted.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteAccountDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}