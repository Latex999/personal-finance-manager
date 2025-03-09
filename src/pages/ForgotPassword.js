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
  useToast,
  Alert,
  AlertIcon,
  Container
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Validation schema
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
});

export default function ForgotPassword() {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();
  const toast = useToast();

  const handleSubmit = async (values, actions) => {
    setError('');
    setMessage('');
    setIsLoading(true);
    
    try {
      await resetPassword(values.email);
      setMessage('Please check your email for password reset instructions');
      toast({
        title: 'Email sent.',
        description: 'Check your inbox for password reset instructions.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to reset password. Please make sure your email is correct.');
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
              Reset Password
            </Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              We'll send you an email with instructions
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
            
            {message && (
              <Alert status="success" mb={4} borderRadius="md">
                <AlertIcon />
                {message}
              </Alert>
            )}
            
            <Formik
              initialValues={{ email: '' }}
              validationSchema={ForgotPasswordSchema}
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
                    
                    <Stack spacing={10} pt={2}>
                      <Button
                        type="submit"
                        loadingText="Sending..."
                        isLoading={isLoading}
                        size="lg"
                        bg={'brand.500'}
                        color={'white'}
                        _hover={{
                          bg: 'brand.600',
                        }}
                        isDisabled={props.isSubmitting}
                      >
                        Reset Password
                      </Button>
                    </Stack>
                    
                    <Stack pt={6} direction={'row'} justify={'space-between'}>
                      <Link as={RouterLink} to="/login" color={'brand.500'}>
                        Back to login
                      </Link>
                      <Link as={RouterLink} to="/signup" color={'brand.500'}>
                        Create account
                      </Link>
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