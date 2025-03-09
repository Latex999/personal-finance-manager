import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Progress,
  IconButton,
  Badge,
  HStack,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  Textarea,
  Skeleton,
  useToast,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useColorModeValue,
  Tooltip,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Alert,
  AlertIcon,
  AlertDescription,
  Switch,
  Radio,
  RadioGroup
} from '@chakra-ui/react';
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  CheckIcon,
  TimeIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@chakra-ui/icons';
import { 
  FiTarget, 
  FiCalendar, 
  FiDollarSign, 
  FiPlusCircle, 
  FiTrendingUp,
  FiFlag,
  FiMoreVertical,
  FiClock
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { format, differenceInMonths, addMonths, parseISO } from 'date-fns';

// Helper function to format currency
const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(value);
};

// Validation schema for goals form
const GoalSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Goal name is required'),
  targetAmount: Yup.number()
    .positive('Amount must be positive')
    .required('Target amount is required'),
  currentAmount: Yup.number()
    .min(0, 'Current amount cannot be negative')
    .max(Yup.ref('targetAmount'), 'Current amount cannot exceed target amount')
    .required('Current amount is required'),
  targetDate: Yup.date()
    .min(new Date(), 'Target date must be in the future')
    .required('Target date is required'),
  category: Yup.string()
    .required('Category is required'),
  notes: Yup.string()
});

// Goal categories
const goalCategories = [
  'Emergency Fund',
  'Retirement',
  'House Down Payment',
  'Car',
  'Vacation',
  'Education',
  'Wedding',
  'Technology',
  'Medical',
  'Home Improvement',
  'Business',
  'Other'
];

export default function Goals() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState([]);
  const [totalSaved, setTotalSaved] = useState(0);
  const [totalTargeted, setTotalTargeted] = useState(0);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'
  const [sortOption, setSortOption] = useState('progress');

  // Modal for adding/editing goals
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  
  // Contribution modal
  const { 
    isOpen: isContributeOpen, 
    onOpen: onContributeOpen, 
    onClose: onContributeClose 
  } = useDisclosure();
  const [goalToContribute, setGoalToContribute] = useState(null);
  
  // Custom colors
  const bgCard = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const progressBg = useColorModeValue('gray.100', 'gray.600');
  const progressTrackColor = useColorModeValue('gray.100', 'gray.600');

  // Mock data for demonstration - in real app this would come from Firebase
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setIsLoading(true);
        
        // In a real application, this would fetch actual data from Firebase
        setTimeout(() => {
          // Mock goals
          const mockGoals = [
            {
              id: 1,
              name: 'Emergency Fund',
              targetAmount: 10000,
              currentAmount: 5000,
              targetDate: '2023-12-31',
              category: 'Emergency Fund',
              notes: '6 months of expenses',
              createdAt: '2023-01-15'
            },
            {
              id: 2,
              name: 'Dream Vacation',
              targetAmount: 3000,
              currentAmount: 1200,
              targetDate: '2023-08-15',
              category: 'Vacation',
              notes: 'Trip to Europe',
              createdAt: '2023-02-01'
            },
            {
              id: 3,
              name: 'New Laptop',
              targetAmount: 1500,
              currentAmount: 800,
              targetDate: '2023-07-01',
              category: 'Technology',
              notes: 'MacBook Pro',
              createdAt: '2023-03-10'
            },
            {
              id: 4,
              name: 'Car Down Payment',
              targetAmount: 5000,
              currentAmount: 2000,
              targetDate: '2024-03-01',
              category: 'Car',
              notes: 'For a reliable used car',
              createdAt: '2023-04-01'
            },
            {
              id: 5,
              name: 'Home Renovation',
              targetAmount: 15000,
              currentAmount: 3000,
              targetDate: '2024-06-15',
              category: 'Home Improvement',
              notes: 'Kitchen remodel',
              createdAt: '2023-01-20'
            }
          ];
          
          setGoals(mockGoals);
          
          // Calculate totals
          const saved = mockGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
          const targeted = mockGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
          
          setTotalSaved(saved);
          setTotalTargeted(targeted);
          
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching goals:", error);
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [currentUser]);

  // Handle add new goal
  const handleAddGoal = () => {
    setIsEditing(false);
    setCurrentGoal(null);
    onOpen();
  };
  
  // Handle edit goal
  const handleEditGoal = (goal) => {
    setIsEditing(true);
    setCurrentGoal(goal);
    onOpen();
  };
  
  // Handle delete goal
  const handleDeleteGoal = (goalId) => {
    // In a real app, this would delete from Firebase
    const updatedGoals = goals.filter(g => g.id !== goalId);
    setGoals(updatedGoals);
    
    // Recalculate totals
    const saved = updatedGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const targeted = updatedGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    
    setTotalSaved(saved);
    setTotalTargeted(targeted);
    
    toast({
      title: "Goal deleted.",
      description: "The goal has been removed.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Handle contribution to a goal
  const handleContribute = (goal) => {
    setGoalToContribute(goal);
    onContributeOpen();
  };
  
  // Submit contribution
  const submitContribution = (values, actions) => {
    if (!goalToContribute) return;
    
    // Update the goal with new contribution
    const newAmount = goalToContribute.currentAmount + parseFloat(values.amount);
    const updatedGoals = goals.map(g => 
      g.id === goalToContribute.id ? { ...g, currentAmount: newAmount } : g
    );
    
    setGoals(updatedGoals);
    
    // Recalculate totals
    const saved = updatedGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    setTotalSaved(saved);
    
    toast({
      title: "Contribution added.",
      description: `Added ${formatCurrency(parseFloat(values.amount))} to "${goalToContribute.name}"`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    actions.setSubmitting(false);
    onContributeClose();
  };
  
  // Handle form submission for adding/editing goal
  const handleSubmit = (values, actions) => {
    if (isEditing && currentGoal) {
      // Update existing goal
      const updatedGoals = goals.map(g => 
        g.id === currentGoal.id ? { ...values, id: currentGoal.id } : g
      );
      setGoals(updatedGoals);
      
      // Recalculate totals
      const saved = updatedGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
      const targeted = updatedGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
      
      setTotalSaved(saved);
      setTotalTargeted(targeted);
      
      toast({
        title: "Goal updated.",
        description: "Your changes have been saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Create new goal
      const newGoal = {
        ...values,
        id: goals.length + 1, // In a real app, this would be a Firebase-generated ID
        createdAt: new Date().toISOString().split('T')[0],
      };
      const updatedGoals = [...goals, newGoal];
      setGoals(updatedGoals);
      
      // Recalculate totals
      const saved = updatedGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
      const targeted = updatedGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
      
      setTotalSaved(saved);
      setTotalTargeted(targeted);
      
      toast({
        title: "Goal created.",
        description: "Your new savings goal has been created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    
    actions.setSubmitting(false);
    onClose();
  };

  // Get progress for a goal
  const getGoalProgress = (goal) => {
    const percentage = goal.targetAmount > 0 
      ? Math.round((goal.currentAmount / goal.targetAmount) * 100) 
      : 0;
    
    return {
      percentage,
      remaining: goal.targetAmount - goal.currentAmount,
      isComplete: percentage >= 100
    };
  };
  
  // Calculate monthly contribution needed
  const getMonthlyContribution = (goal) => {
    if (!goal.targetDate) return 0;
    
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const monthsLeft = Math.max(1, differenceInMonths(targetDate, today));
    const amountLeft = goal.targetAmount - goal.currentAmount;
    
    return amountLeft > 0 ? amountLeft / monthsLeft : 0;
  };
  
  // Sort goals based on selected option
  const getSortedGoals = () => {
    if (!goals || goals.length === 0) return [];
    
    const sortedGoals = [...goals];
    
    switch (sortOption) {
      case 'progress':
        // Sort by completion percentage (highest first)
        sortedGoals.sort((a, b) => {
          const aProgress = getGoalProgress(a).percentage;
          const bProgress = getGoalProgress(b).percentage;
          return bProgress - aProgress;
        });
        break;
        
      case 'deadline':
        // Sort by target date (soonest first)
        sortedGoals.sort((a, b) => {
          return new Date(a.targetDate) - new Date(b.targetDate);
        });
        break;
        
      case 'amount':
        // Sort by target amount (highest first)
        sortedGoals.sort((a, b) => {
          return b.targetAmount - a.targetAmount;
        });
        break;
        
      case 'name':
        // Sort alphabetically by name
        sortedGoals.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        break;
        
      default:
        // Default to progress sorting
        sortedGoals.sort((a, b) => {
          const aProgress = getGoalProgress(a).percentage;
          const bProgress = getGoalProgress(b).percentage;
          return bProgress - aProgress;
        });
    }
    
    return sortedGoals;
  };

  return (
    <Box p={4}>
      <Stack spacing={6}>
        <Flex 
          justify="space-between" 
          align="center" 
          wrap={{ base: "wrap", md: "nowrap" }}
          gap={4}
        >
          <Heading as="h1" size="xl">
            Savings Goals
          </Heading>
          
          <HStack spacing={4} ml="auto">
            <HStack spacing={2}>
              <Text fontSize="sm">View:</Text>
              <Button 
                size="sm" 
                variant={viewMode === 'cards' ? 'solid' : 'outline'} 
                colorScheme="brand"
                onClick={() => setViewMode('cards')}
              >
                Cards
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === 'list' ? 'solid' : 'outline'} 
                colorScheme="brand"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </HStack>
            
            <Select 
              size="sm" 
              width="auto" 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="progress">Sort by: Progress</option>
              <option value="deadline">Sort by: Deadline</option>
              <option value="amount">Sort by: Amount</option>
              <option value="name">Sort by: Name</option>
            </Select>
            
            <Button
              leftIcon={<AddIcon />}
              colorScheme="brand"
              onClick={handleAddGoal}
            >
              Add Goal
            </Button>
          </HStack>
        </Flex>

        {/* Goals Summary */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card bg={bgCard}>
            <CardBody>
              <Stat>
                <StatLabel>Total Saved</StatLabel>
                <Skeleton isLoaded={!isLoading}>
                  <StatNumber color="green.500">
                    {formatCurrency(totalSaved)}
                  </StatNumber>
                </Skeleton>
                <StatHelpText>
                  {totalTargeted > 0 && `${Math.round((totalSaved / totalTargeted) * 100)}% of goal`}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={bgCard}>
            <CardBody>
              <Stat>
                <StatLabel>Total Target</StatLabel>
                <Skeleton isLoaded={!isLoading}>
                  <StatNumber>
                    {formatCurrency(totalTargeted)}
                  </StatNumber>
                </Skeleton>
                <StatHelpText>
                  Across {goals.length} goals
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={bgCard}>
            <CardBody>
              <Stat>
                <StatLabel>Remaining to Save</StatLabel>
                <Skeleton isLoaded={!isLoading}>
                  <StatNumber color="blue.500">
                    {formatCurrency(totalTargeted - totalSaved)}
                  </StatNumber>
                </Skeleton>
                <StatHelpText>
                  {goals.filter(g => getGoalProgress(g).percentage === 100).length} goals completed
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Goals Section */}
        {isLoading ? (
          viewMode === 'cards' ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {Array(3).fill(0).map((_, index) => (
                <Skeleton key={index} height="200px" />
              ))}
            </SimpleGrid>
          ) : (
            <Card bg={bgCard}>
              <CardBody>
                <Stack spacing={4}>
                  {Array(5).fill(0).map((_, index) => (
                    <Skeleton key={index} height="60px" />
                  ))}
                </Stack>
              </CardBody>
            </Card>
          )
        ) : goals.length === 0 ? (
          <Card bg={bgCard}>
            <CardBody>
              <Stack spacing={4} align="center" p={6}>
                <Box fontSize="4xl">
                  <FiTarget />
                </Box>
                <Heading size="md">No savings goals yet</Heading>
                <Text align="center">
                  Create your first savings goal to start tracking your progress towards financial objectives.
                </Text>
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="brand"
                  onClick={handleAddGoal}
                  mt={2}
                >
                  Add Your First Goal
                </Button>
              </Stack>
            </CardBody>
          </Card>
        ) : viewMode === 'cards' ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {getSortedGoals().map(goal => {
              const { percentage, remaining, isComplete } = getGoalProgress(goal);
              const monthlyNeeded = getMonthlyContribution(goal);
              
              return (
                <Card key={goal.id} bg={bgCard} height="100%">
                  <CardHeader pb={0}>
                    <Flex justify="space-between" align="start">
                      <Heading size="md">{goal.name}</Heading>
                      <HStack>
                        {isComplete && (
                          <Badge colorScheme="green" variant="solid">
                            Completed
                          </Badge>
                        )}
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<FiMoreVertical />}
                            variant="ghost"
                            size="sm"
                            aria-label="More options"
                          />
                          <MenuList>
                            <MenuItem 
                              icon={<FiPlusCircle />} 
                              onClick={() => handleContribute(goal)}
                              isDisabled={isComplete}
                            >
                              Add Contribution
                            </MenuItem>
                            <MenuItem icon={<EditIcon />} onClick={() => handleEditGoal(goal)}>
                              Edit Goal
                            </MenuItem>
                            <MenuItem icon={<DeleteIcon />} onClick={() => handleDeleteGoal(goal.id)}>
                              Delete Goal
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </Flex>
                    <Badge colorScheme="blue" mt={2}>{goal.category}</Badge>
                  </CardHeader>
                  
                  <CardBody py={4}>
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">Target:</Text>
                        <Text fontWeight="semibold">{formatCurrency(goal.targetAmount)}</Text>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">Current:</Text>
                        <Text fontWeight="semibold">{formatCurrency(goal.currentAmount)}</Text>
                      </HStack>
                      
                      <Box>
                        <Flex justify="space-between" mb={1}>
                          <Text fontSize="sm" color="gray.500">Progress:</Text>
                          <Text fontWeight="semibold">{percentage}%</Text>
                        </Flex>
                        <Progress 
                          value={percentage} 
                          size="sm" 
                          colorScheme={isComplete ? "green" : "brand"}
                          bg={progressTrackColor}
                          borderRadius="md"
                        />
                      </Box>
                      
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">Remaining:</Text>
                        <Text fontWeight="semibold">{isComplete ? "Completed!" : formatCurrency(remaining)}</Text>
                      </HStack>
                      
                      {!isComplete && (
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.500">Monthly needed:</Text>
                          <Text fontWeight="semibold">{formatCurrency(monthlyNeeded)}</Text>
                        </HStack>
                      )}
                      
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">Target date:</Text>
                        <Text fontWeight="semibold">{format(new Date(goal.targetDate), 'MMM d, yyyy')}</Text>
                      </HStack>
                    </VStack>
                    
                    {goal.notes && (
                      <Box mt={3}>
                        <Divider my={2} />
                        <Text fontSize="sm">{goal.notes}</Text>
                      </Box>
                    )}
                  </CardBody>
                  
                  {!isComplete && (
                    <CardFooter pt={0}>
                      <Button 
                        leftIcon={<FiPlusCircle />} 
                        colorScheme="brand" 
                        variant="outline" 
                        size="sm"
                        w="full"
                        onClick={() => handleContribute(goal)}
                      >
                        Add Contribution
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              );
            })}
          </SimpleGrid>
        ) : (
          <Card bg={bgCard}>
            <CardBody>
              <Stack spacing={4} divider={<Divider />}>
                {getSortedGoals().map(goal => {
                  const { percentage, remaining, isComplete } = getGoalProgress(goal);
                  
                  return (
                    <Flex key={goal.id} direction={{ base: 'column', md: 'row' }} gap={4}>
                      <VStack align="stretch" flex="1">
                        <Flex justify="space-between" align="center">
                          <Heading size="sm">{goal.name}</Heading>
                          <HStack>
                            {isComplete && (
                              <Badge colorScheme="green" variant="solid">
                                Completed
                              </Badge>
                            )}
                            <Badge colorScheme="blue">{goal.category}</Badge>
                          </HStack>
                        </Flex>
                        
                        <Box>
                          <Flex justify="space-between" mb={1}>
                            <Text fontSize="sm" color="gray.500">
                              {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                            </Text>
                            <Text fontWeight="semibold">{percentage}%</Text>
                          </Flex>
                          <Progress 
                            value={percentage} 
                            size="sm" 
                            colorScheme={isComplete ? "green" : "brand"}
                            bg={progressTrackColor}
                            borderRadius="md"
                          />
                        </Box>
                        
                        <Flex justify="space-between" fontSize="sm">
                          <HStack>
                            <FiCalendar />
                            <Text>{format(new Date(goal.targetDate), 'MMM d, yyyy')}</Text>
                          </HStack>
                          
                          <Text>
                            {isComplete 
                              ? "Goal Completed!" 
                              : `Remaining: ${formatCurrency(remaining)}`}
                          </Text>
                        </Flex>
                      </VStack>
                      
                      <HStack spacing={2} alignSelf={{ base: 'flex-end', md: 'center' }}>
                        {!isComplete && (
                          <Tooltip label="Add Contribution">
                            <IconButton
                              icon={<FiPlusCircle />}
                              aria-label="Add contribution"
                              onClick={() => handleContribute(goal)}
                              colorScheme="brand"
                              variant="outline"
                              size="sm"
                            />
                          </Tooltip>
                        )}
                        <Tooltip label="Edit Goal">
                          <IconButton
                            icon={<EditIcon />}
                            aria-label="Edit goal"
                            onClick={() => handleEditGoal(goal)}
                            variant="ghost"
                            size="sm"
                          />
                        </Tooltip>
                        <Tooltip label="Delete Goal">
                          <IconButton
                            icon={<DeleteIcon />}
                            aria-label="Delete goal"
                            onClick={() => handleDeleteGoal(goal.id)}
                            variant="ghost"
                            colorScheme="red"
                            size="sm"
                          />
                        </Tooltip>
                      </HStack>
                    </Flex>
                  );
                })}
              </Stack>
            </CardBody>
          </Card>
        )}
        
        {/* Tips Section */}
        {goals.length > 0 && (
          <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="start"
            p={4}
            borderRadius="md"
            bg={useColorModeValue('blue.50', 'blue.900')}
          >
            <AlertIcon />
            <AlertDescription>
              <Text mb={2} fontWeight="medium">Savings Tips:</Text>
              <Text mb={1}>• Set up automatic transfers to your savings accounts to stay consistent</Text>
              <Text mb={1}>• Create specific goals for different purposes rather than one general savings pool</Text>
              <Text>• Consider setting aside a percentage of any unexpected income towards your goals</Text>
            </AlertDescription>
          </Alert>
        )}
      </Stack>

      {/* Add/Edit Goal Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditing ? 'Edit Savings Goal' : 'Create New Savings Goal'}
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={
              currentGoal
                ? {
                    name: currentGoal.name,
                    targetAmount: currentGoal.targetAmount,
                    currentAmount: currentGoal.currentAmount,
                    targetDate: currentGoal.targetDate,
                    category: currentGoal.category,
                    notes: currentGoal.notes || '',
                  }
                : {
                    name: '',
                    targetAmount: '',
                    currentAmount: '0',
                    targetDate: addMonths(new Date(), 6).toISOString().split('T')[0],
                    category: '',
                    notes: '',
                  }
            }
            validationSchema={GoalSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form>
                <ModalBody>
                  <Stack spacing={4}>
                    <Field name="name">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                          <FormLabel>Goal Name</FormLabel>
                          <Input
                            {...field}
                            placeholder="e.g., Emergency Fund, New Car, etc."
                          />
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="category">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.category && form.touched.category}>
                          <FormLabel>Category</FormLabel>
                          <Select {...field} placeholder="Select category">
                            {goalCategories.map(
                              (category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              )
                            )}
                          </Select>
                          <FormErrorMessage>{form.errors.category}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="targetAmount">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.targetAmount && form.touched.targetAmount}>
                          <FormLabel>Target Amount</FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none" color="gray.400">
                              $
                            </InputLeftElement>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              onBlur={e => {
                                field.onBlur(e);
                                // Format to 2 decimal places
                                if (e.target.value) {
                                  form.setFieldValue('targetAmount', parseFloat(e.target.value).toFixed(2));
                                }
                              }}
                            />
                          </InputGroup>
                          <FormErrorMessage>{form.errors.targetAmount}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="currentAmount">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.currentAmount && form.touched.currentAmount}>
                          <FormLabel>Current Amount Saved</FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none" color="gray.400">
                              $
                            </InputLeftElement>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              onBlur={e => {
                                field.onBlur(e);
                                // Format to 2 decimal places
                                if (e.target.value) {
                                  form.setFieldValue('currentAmount', parseFloat(e.target.value).toFixed(2));
                                }
                              }}
                            />
                          </InputGroup>
                          <FormErrorMessage>{form.errors.currentAmount}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="targetDate">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.targetDate && form.touched.targetDate}>
                          <FormLabel>Target Date</FormLabel>
                          <Input {...field} type="date" />
                          <FormErrorMessage>{form.errors.targetDate}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="notes">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.notes && form.touched.notes}>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <Textarea
                            {...field}
                            placeholder="Add any details about this savings goal"
                            rows={3}
                          />
                          <FormErrorMessage>{form.errors.notes}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                </ModalBody>

                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="brand"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    {isEditing ? 'Update' : 'Create'} Goal
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>

      {/* Add Contribution Modal */}
      <Modal
        isOpen={isContributeOpen}
        onClose={onContributeClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Add Contribution
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{
              amount: '',
              date: new Date().toISOString().split('T')[0],
            }}
            validationSchema={Yup.object().shape({
              amount: Yup.number()
                .positive('Amount must be positive')
                .max(
                  goalToContribute 
                    ? goalToContribute.targetAmount - goalToContribute.currentAmount 
                    : Number.MAX_SAFE_INTEGER,
                  'Amount exceeds remaining goal amount'
                )
                .required('Amount is required'),
              date: Yup.date().required('Date is required'),
            })}
            onSubmit={submitContribution}
          >
            {(props) => (
              <Form>
                <ModalBody>
                  <Stack spacing={4}>
                    {goalToContribute && (
                      <Box>
                        <Text fontWeight="medium">Goal: {goalToContribute.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          Remaining: {formatCurrency(goalToContribute.targetAmount - goalToContribute.currentAmount)}
                        </Text>
                      </Box>
                    )}
                    
                    <Field name="amount">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.amount && form.touched.amount}>
                          <FormLabel>Amount</FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none" color="gray.400">
                              $
                            </InputLeftElement>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              onBlur={e => {
                                field.onBlur(e);
                                // Format to 2 decimal places
                                if (e.target.value) {
                                  form.setFieldValue('amount', parseFloat(e.target.value).toFixed(2));
                                }
                              }}
                            />
                          </InputGroup>
                          <FormErrorMessage>{form.errors.amount}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="date">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.date && form.touched.date}>
                          <FormLabel>Date</FormLabel>
                          <Input {...field} type="date" />
                          <FormErrorMessage>{form.errors.date}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                </ModalBody>

                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={onContributeClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="brand"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    Add Contribution
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </Box>
  );
}