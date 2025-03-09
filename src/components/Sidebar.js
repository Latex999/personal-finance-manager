import React from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  CloseButton,
  Icon,
  useColorModeValue,
  Link,
  Tooltip,
  Image,
  VStack
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiDollarSign,
  FiTarget,
  FiPieChart,
  FiSettings,
  FiPlus
} from 'react-icons/fi';

// Navigation items
const LinkItems = [
  { name: 'Dashboard', icon: FiHome, path: '/' },
  { name: 'Transactions', icon: FiTrendingUp, path: '/transactions' },
  { name: 'Budget', icon: FiDollarSign, path: '/budget' },
  { name: 'Goals', icon: FiTarget, path: '/goals' },
  { name: 'Reports', icon: FiPieChart, path: '/reports' },
  { name: 'Profile', icon: FiSettings, path: '/profile' },
];

export default function Sidebar({ collapse, onClose, ...rest }) {
  const location = useLocation();
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box
      transition="0.3s ease"
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      w={collapse ? '80px' : '240px'}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" justifyContent={collapse ? "center" : "space-between"} mx={collapse ? "0" : "8"} mb={5}>
        {!collapse ? (
          <>
            <Text fontSize="2xl" fontWeight="bold" color="brand.500">
              FinTrack
            </Text>
            <CloseButton display={{ base: 'flex', lg: 'none' }} onClick={onClose} />
          </>
        ) : (
          <Text fontSize="2xl" fontWeight="bold" color="brand.500">
            F
          </Text>
        )}
      </Flex>
      
      <VStack align="stretch" spacing={collapse ? 4 : 0}>
        {LinkItems.map((link) => (
          <NavItem 
            key={link.name} 
            icon={link.icon} 
            path={link.path}
            collapsed={collapse}
            active={location.pathname === link.path}
          >
            {link.name}
          </NavItem>
        ))}
        
        {/* Add New Transaction button */}
        <Box px={collapse ? 2 : 4} py={4}>
          <Tooltip label={collapse ? "Add Transaction" : ""} placement="right" hasArrow={collapse}>
            <Link
              as={RouterLink}
              to="/transactions/new"
              rounded="md"
              p={3}
              bg="brand.500"
              color="white"
              _hover={{
                bg: 'brand.600',
              }}
              display="flex"
              alignItems="center"
              justifyContent={collapse ? "center" : "flex-start"}
              textDecoration="none"
            >
              <Icon as={FiPlus} mr={collapse ? 0 : 2} />
              {!collapse && <Text>Add Transaction</Text>}
            </Link>
          </Tooltip>
        </Box>
      </VStack>
    </Box>
  );
}

// Navigation item component
function NavItem({ icon, children, path, active, collapsed, ...rest }) {
  return (
    <Tooltip label={collapsed ? children : ""} placement="right" hasArrow={collapsed}>
      <Link
        as={RouterLink}
        to={path}
        style={{ textDecoration: 'none' }}
        _focus={{ boxShadow: 'none' }}
      >
        <Flex
          align="center"
          p="4"
          mx={collapsed ? 2 : 4}
          my={collapsed ? 2 : 1}
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={active ? 'brand.50' : 'transparent'}
          color={active ? 'brand.500' : 'gray.600'}
          _hover={{
            bg: 'brand.50',
            color: 'brand.500',
          }}
          justifyContent={collapsed ? "center" : "flex-start"}
          {...rest}
        >
          {icon && (
            <Icon
              mr={collapsed ? 0 : 4}
              fontSize="18"
              as={icon}
            />
          )}
          {!collapsed && <Text fontWeight={active ? "semibold" : "medium"}>{children}</Text>}
        </Flex>
      </Link>
    </Tooltip>
  );
}