import React from 'react';
import { Box, Heading, Text, Button, Flex, Image, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.900')}
      p={4}
    >
      <Box textAlign="center" py={10} px={6} maxW="500px">
        <Heading
          display="inline-block"
          as="h1"
          size="4xl"
          bg={useColorModeValue('brand.500', 'brand.300')}
          backgroundClip="text"
          mb={4}
        >
          404
        </Heading>
        <Text fontSize="24px" fontWeight="semibold" mb={6}>
          Page Not Found
        </Text>
        <Text color={'gray.500'} mb={6}>
          Oops! The page you're looking for doesn't exist or might have been moved.
        </Text>

        <Button
          as={RouterLink}
          to="/"
          colorScheme="brand"
          bgGradient="linear(to-r, brand.400, brand.500, brand.600)"
          color="white"
          size="lg"
          variant="solid"
          mb={4}
          _hover={{
            bgGradient: 'linear(to-r, brand.500, brand.600, brand.700)',
          }}
        >
          Go Back Home
        </Button>
      </Box>
    </Flex>
  );
}