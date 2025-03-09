import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Flex,
  useColorModeValue,
  useDisclosure,
  Drawer,
  DrawerContent,
  useBreakpointValue
} from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [collapse, setCollapse] = useState(false);

  // Determine if the sidebar should be shown as a drawer on mobile
  const isMobile = useBreakpointValue({ base: true, lg: false });
  
  // Background colors based on color mode
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const toggleSidebar = () => {
    setCollapse(!collapse);
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      {/* Mobile sidebar as drawer */}
      {isMobile && (
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <Sidebar
              onClose={onClose}
              display={{ base: 'block', lg: 'none' }}
            />
          </DrawerContent>
        </Drawer>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <Sidebar
          collapse={collapse}
          display={{ base: 'none', lg: 'block' }}
        />
      )}

      {/* Main content */}
      <Box
        ml={{ base: 0, lg: collapse ? '80px' : '240px' }}
        transition="margin-left 0.2s"
      >
        {/* Navbar */}
        <Navbar 
          onOpen={onOpen} 
          toggleSidebar={toggleSidebar} 
          isSidebarCollapsed={collapse}
        />

        {/* Content */}
        <Box 
          as="main" 
          p="4"
          minH="calc(100vh - 4rem)"
          bg={useColorModeValue("gray.50", "gray.900")}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}