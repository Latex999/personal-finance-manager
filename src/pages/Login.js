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
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (values, actions) => {
    setError('');
    setIsLoading(true);
    
    try {
      await login(values.email, values.password);
      toast({
        title: 'Login successful.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to log in. Please check your credentials.');
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
              Sign in to manage your finances ✌️
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
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {(props) => (
                <Form>
                  <Stack spacing={4}>
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
                              autoComplete="current-password"
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
                    
                    <Stack spacing={10} pt={2}>
                      <Button
                        type="submit"
                        loadingText="Signing in"
                        isLoading={isLoading}
                        size="lg"
                        bg={'brand.500'}
                        color={'white'}
                        _hover={{
                          bg: 'brand.600',
                        }}
                        isDisabled={props.isSubmitting}
                      >
                        Sign in
                      </Button>
                    </Stack>
                    
                    <Stack pt={6} direction={{ base: 'column', sm: 'row' }} spacing={{ base: 4, sm: 2 }} justify={'space-between'}>
                      <Link as={RouterLink} to="/forgot-password" color={'brand.500'}>
                        Forgot password?
                      </Link>
                      <Text align={'center'}>
                        New user?{' '}
                        <Link as={RouterLink} to="/signup" color={'brand.500'}>
                          Sign up
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