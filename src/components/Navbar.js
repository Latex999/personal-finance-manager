import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Button,
  useColorMode,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon as ChevronIcon
} from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ onOpen, toggleSidebar, isSidebarCollapsed }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onToggle } = useDisclosure();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        align={'center'}
        position="sticky"
        top="0"
        zIndex="999"
      >
        <Flex
          flex={{ base: 1, lg: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', lg: 'none' }}>
          <IconButton
            onClick={onOpen}
            icon={
              <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        
        {/* Desktop: Toggle sidebar collapse button */}
        <Flex display={{ base: 'none', lg: 'flex' }} mr={2}>
          <IconButton
            onClick={toggleSidebar}
            icon={
              isSidebarCollapsed ? 
                <ChevronRightIcon w={5} h={5} /> : 
                <ChevronLeftIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Sidebar'}
          />
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: 'center', lg: 'flex-start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', lg: 'left' })}
            fontWeight="bold"
            color={useColorModeValue('gray.800', 'white')}
            display={{ base: 'flex', lg: 'none' }}
          >
            FinTrack
          </Text>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          
          {/* Notifications */}
          <IconButton
            aria-label="Notifications"
            icon={<BellIcon />}
            bg="transparent"
            rounded="full"
          />

          {/* Color mode toggle */}
          <IconButton
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="Toggle color mode"
          />

          {/* User menu */}
          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}>
              <Avatar
                size={'sm'}
                src={currentUser?.photoURL || 'https://bit.ly/broken-link'}
                name={currentUser?.displayName || currentUser?.email}
                bg="brand.500"
              />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
              <MenuItem onClick={() => navigate('/profile/settings')}>Settings</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Flex>
    </Box>
  );
}