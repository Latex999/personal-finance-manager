import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Center, Spinner } from '@chakra-ui/react';

// Protected route component that redirects to login page if not authenticated
export default function ProtectedRoute() {
  const { currentUser } = useAuth();
  
  if (currentUser === null) {
    // Still loading, show spinner
    return (
      <Center h="100vh">
        <Spinner 
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
        />
      </Center>
    );
  }
  
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}