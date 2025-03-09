import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Link,
  useColorModeValue,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Alert,
  AlertIcon,
  Container
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Validation schema
const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (values, actions) => {
    setError('');
    setIsLoading(true);
    
    try {
      await signup(values.email, values.password, values.name);
      toast({
        title: 'Account created successfully.',
        description: 'Welcome to FinTrack!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please use a different email or login.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } finally {
      setIsLoading(false);
      actions.setSubmitting(false);
    }
  };

  return (
    <Container maxW={'lg'} py={{ base: 12, md: 24 }}>
      <Flex
        minH={'100%'}
        align={'center'}
        justify={'center'}
        direction={'column'}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading
              fontSize={'4xl'}
              textAlign={'center'}
              color={'brand.500'}
            >
              FinTrack
            </Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              Create an account to start managing your finances ✌️
            </Text>
          </Stack>
          
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
            w={{ base: 'full', md: 'md' }}
          >
            {error && (
              <Alert status="error" mb={4} borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
            
            <Formik
              initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={SignupSchema}
              onSubmit={handleSubmit}
            >
              {(props) => (
                <Form>
                  <Stack spacing={4}>
                    <Field name="name">
                      {({ field, form }) => (
                        <FormControl 
                          id="name" 
                          isInvalid={form.errors.name && form.touched.name}
                        >
                          <FormLabel>Full Name</FormLabel>
                          <Input 
                            {...field} 
                            type="text"
                            autoComplete="name"
                          />
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    
                    <Field name="email">
                      {({ field, form }) => (
                        <FormControl 
                          id="email" 
                          isInvalid={form.errors.email && form.touched.email}
                        >
                          <FormLabel>Email address</FormLabel>
                          <Input 
                            {...field} 
                            type="email"
                            autoComplete="email"
                          />
                          <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    
                    <Field name="password">
                      {({ field, form }) => (
                        <FormControl 
                          id="password"
                          isInvalid={form.errors.password && form.touched.password}
                        >
                          <FormLabel>Password</FormLabel>
                          <InputGroup>
                            <Input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                            />
                            <InputRightElement h={'full'}>
                              <IconButton
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                variant={'ghost'}
                                icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                onClick={() => setShowPassword(!showPassword)}
                              />
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    
                    <Field name="confirmPassword">
                      {({ field, form }) => (
                        <FormControl 
                          id="confirmPassword"
                          isInvalid={form.errors.confirmPassword && form.touched.confirmPassword}
                        >
                          <FormLabel>Confirm Password</FormLabel>
                          <InputGroup>
                            <Input
                              {...field}
                              type={showConfirmPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                            />
                            <InputRightElement h={'full'}>
                              <IconButton
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                variant={'ghost'}
                                icon={showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              />
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>{form.errors.confirmPassword}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    
                    <Stack spacing={10} pt={2}>
                      <Button
                        type="submit"
                        loadingText="Creating Account"
                        isLoading={isLoading}
                        size="lg"
                        bg={'brand.500'}
                        color={'white'}
                        _hover={{
                          bg: 'brand.600',
                        }}
                        isDisabled={props.isSubmitting}
                      >
                        Sign up
                      </Button>
                    </Stack>
                    
                    <Stack pt={6}>
                      <Text align={'center'}>
                        Already a user?{' '}
                        <Link as={RouterLink} to="/login" color={'brand.500'}>
                          Sign in
                        </Link>
                      </Text>
                    </Stack>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Box>
        </Stack>
      </Flex>
    </Container>
  );
}