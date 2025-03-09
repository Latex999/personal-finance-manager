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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  HStack,
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
  Skeleton,
  useToast,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tooltip,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Grid,
  GridItem
} from '@chakra-ui/react';
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  ChevronDownIcon,
  InfoIcon,
  WarningIcon,
  CheckIcon
} from '@chakra-ui/icons';
import { FiDollarSign, FiPercent, FiClipboard, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip as ChartTooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  ChartTooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Helper function to format currency
const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(value);
};

// Validation schema for budget form
const BudgetSchema = Yup.object().shape({
  category: Yup.string().required('Category is required'),
  amount: Yup.number()
    .positive('Amount must be positive')
    .required('Amount is required'),
  notes: Yup.string()
});

// Available categories (matches expense categories from Transactions.js)
const expenseCategories = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Entertainment',
  'Personal',
  'Education',
  'Debt',
  'Savings',
  'Gifts/Donations',
  'Other'
];

export default function Budget() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

  // Modal for adding/editing budgets
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);

  // Custom colors
  const bgCard = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const progressBg = useColorModeValue('gray.100', 'gray.600');

  // Mock data for demonstration - in real app this would come from Firebase
  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setIsLoading(true);
        
        // In a real application, this would fetch actual data from Firebase
        // For demo purposes, we'll use mock data
        
        // Simulate a delay to show loading state
        setTimeout(() => {
          // Mock budgets
          const mockBudgets = [
            { id: 1, category: 'Housing', amount: 1200, notes: 'Rent and utilities' },
            { id: 2, category: 'Food', amount: 600, notes: 'Groceries and dining out' },
            { id: 3, category: 'Transportation', amount: 500, notes: 'Gas, car payment, public transit' },
            { id: 4, category: 'Entertainment', amount: 300, notes: 'Movies, events, subscriptions' },
            { id: 5, category: 'Utilities', amount: 400, notes: 'Electricity, water, internet' },
            { id: 6, category: 'Personal', amount: 200, notes: 'Clothing, haircuts, etc.' },
            { id: 7, category: 'Healthcare', amount: 250, notes: 'Medications and copays' },
            { id: 8, category: 'Savings', amount: 500, notes: 'Emergency fund' }
          ];
          
          // Mock expenses (typically this would be filtered from transactions)
          const mockExpenses = [
            { id: 1, category: 'Housing', amount: 1200 },
            { id: 2, category: 'Food', amount: 550 },
            { id: 3, category: 'Transportation', amount: 450 },
            { id: 4, category: 'Entertainment', amount: 300 },
            { id: 5, category: 'Utilities', amount: 350 },
            { id: 6, category: 'Personal', amount: 120 },
            { id: 7, category: 'Healthcare', amount: 150 },
            { id: 8, category: 'Savings', amount: 500 }
          ];
          
          setBudgets(mockBudgets);
          setExpenses(mockExpenses);
          
          // Calculate totals
          const budgetTotal = mockBudgets.reduce((sum, item) => sum + item.amount, 0);
          const spentTotal = mockExpenses.reduce((sum, item) => sum + item.amount, 0);
          
          setTotalBudget(budgetTotal);
          setTotalSpent(spentTotal);
          setRemainingBudget(budgetTotal - spentTotal);
          
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching budget data:", error);
        setIsLoading(false);
      }
    };

    fetchBudgetData();
  }, [currentUser, selectedMonth]);

  // Handle add new budget
  const handleAddBudget = () => {
    setIsEditing(false);
    setCurrentBudget(null);
    onOpen();
  };
  
  // Handle edit budget
  const handleEditBudget = (budget) => {
    setIsEditing(true);
    setCurrentBudget(budget);
    onOpen();
  };
  
  // Handle delete budget
  const handleDeleteBudget = (budgetId) => {
    // In a real app, this would delete from Firebase
    const updatedBudgets = budgets.filter(b => b.id !== budgetId);
    setBudgets(updatedBudgets);
    
    toast({
      title: "Budget deleted.",
      description: "The budget category has been removed.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    // Recalculate totals
    const budgetTotal = updatedBudgets.reduce((sum, item) => sum + item.amount, 0);
    setTotalBudget(budgetTotal);
    setRemainingBudget(budgetTotal - totalSpent);
  };
  
  // Handle form submission for adding/editing budget
  const handleSubmit = (values, actions) => {
    if (isEditing && currentBudget) {
      // Update existing budget
      const updatedBudgets = budgets.map(b => 
        b.id === currentBudget.id ? { ...values, id: currentBudget.id } : b
      );
      setBudgets(updatedBudgets);
      
      // Recalculate totals
      const budgetTotal = updatedBudgets.reduce((sum, item) => sum + item.amount, 0);
      setTotalBudget(budgetTotal);
      setRemainingBudget(budgetTotal - totalSpent);
      
      toast({
        title: "Budget updated.",
        description: "Your changes have been saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Check if category already has a budget
      const existingCategory = budgets.find(b => b.category === values.category);
      if (existingCategory) {
        toast({
          title: "Category already exists.",
          description: "Please edit the existing budget or choose a different category.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        actions.setSubmitting(false);
        return;
      }
      
      // Create new budget
      const newBudget = {
        ...values,
        id: budgets.length + 1, // In a real app, this would be a Firebase-generated ID
      };
      const updatedBudgets = [...budgets, newBudget];
      setBudgets(updatedBudgets);
      
      // Recalculate totals
      const budgetTotal = updatedBudgets.reduce((sum, item) => sum + item.amount, 0);
      setTotalBudget(budgetTotal);
      setRemainingBudget(budgetTotal - totalSpent);
      
      toast({
        title: "Budget added.",
        description: "Your new budget category has been created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    
    actions.setSubmitting(false);
    onClose();
  };

  // Get budget progress data (combine budgets and expenses)
  const getBudgetProgress = () => {
    return budgets.map(budget => {
      const expense = expenses.find(e => e.category === budget.category);
      const spent = expense ? expense.amount : 0;
      const percentage = budget.amount > 0 ? Math.min(100, (spent / budget.amount) * 100) : 0;
      
      return {
        ...budget,
        spent,
        remaining: budget.amount - spent,
        percentage
      };
    });
  };

  // Data for the bar chart
  const getChartData = () => {
    const budgetProgress = getBudgetProgress();
    
    return {
      labels: budgetProgress.map(item => item.category),
      datasets: [
        {
          label: 'Budget',
          data: budgetProgress.map(item => item.amount),
          backgroundColor: 'rgba(49, 151, 149, 0.6)',
          borderColor: 'rgba(49, 151, 149, 1)',
          borderWidth: 1
        },
        {
          label: 'Spent',
          data: budgetProgress.map(item => item.spent),
          backgroundColor: 'rgba(229, 62, 62, 0.6)',
          borderColor: 'rgba(229, 62, 62, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Budget vs Actual Spending'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Box p={4}>
      <Stack spacing={6}>
        <Flex justify="space-between" align="center" wrap="wrap">
          <Heading as="h1" size="xl" mb={{ base: 4, md: 0 }}>
            Budget Planner
          </Heading>
          <HStack spacing={4}>
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              width="auto"
            />
            <Button
              leftIcon={<AddIcon />}
              colorScheme="brand"
              onClick={handleAddBudget}
            >
              Add Budget Category
            </Button>
          </HStack>
        </Flex>

        {/* Budget Overview Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card bg={bgCard}>
            <CardBody>
              <Stat>
                <StatLabel>Total Budget</StatLabel>
                <Skeleton isLoaded={!isLoading}>
                  <StatNumber color="brand.500">
                    {formatCurrency(totalBudget)}
                  </StatNumber>
                </Skeleton>
                <StatHelpText>Monthly allocation</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={bgCard}>
            <CardBody>
              <Stat>
                <StatLabel>Total Spent</StatLabel>
                <Skeleton isLoaded={!isLoading}>
                  <StatNumber color="red.500">
                    {formatCurrency(totalSpent)}
                  </StatNumber>
                </Skeleton>
                <StatHelpText>
                  <StatArrow type={totalSpent <= totalBudget ? 'decrease' : 'increase'} />
                  {Math.round((totalSpent / totalBudget) * 100)}% of budget
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={bgCard}>
            <CardBody>
              <Stat>
                <StatLabel>Remaining</StatLabel>
                <Skeleton isLoaded={!isLoading}>
                  <StatNumber color={remainingBudget >= 0 ? "green.500" : "red.500"}>
                    {formatCurrency(remainingBudget)}
                  </StatNumber>
                </Skeleton>
                <StatHelpText>
                  {remainingBudget >= 0 
                    ? "Available to spend" 
                    : "Over budget"}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Budget Chart */}
        <Card bg={bgCard}>
          <CardHeader>
            <Heading size="md">Budget Overview</Heading>
          </CardHeader>
          <CardBody>
            <Box h="400px">
              {isLoading ? (
                <Skeleton height="100%" />
              ) : (
                <Bar data={getChartData()} options={chartOptions} />
              )}
            </Box>
          </CardBody>
        </Card>

        {/* Category-wise Budget Progress */}
        <Card bg={bgCard}>
          <CardHeader>
            <Heading size="md">Budget Categories</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={6} divider={<Divider />}>
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <Skeleton key={index} height="60px" />
                ))
              ) : getBudgetProgress().length === 0 ? (
                <Box textAlign="center" py={6}>
                  <Text fontSize="lg" mb={4}>No budget categories found</Text>
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="brand"
                    onClick={handleAddBudget}
                  >
                    Add Your First Budget
                  </Button>
                </Box>
              ) : (
                getBudgetProgress().map(item => (
                  <Box key={item.id}>
                    <Flex justify="space-between" mb={2}>
                      <HStack>
                        <Heading size="sm">{item.category}</Heading>
                        {item.percentage >= 90 && (
                          <Badge colorScheme={item.percentage >= 100 ? "red" : "yellow"}>
                            {item.percentage >= 100 ? "EXCEEDED" : "WARNING"}
                          </Badge>
                        )}
                      </HStack>
                      <HStack>
                        <Tooltip label="Edit">
                          <IconButton
                            size="sm"
                            aria-label="Edit budget"
                            icon={<EditIcon />}
                            variant="ghost"
                            onClick={() => handleEditBudget(item)}
                          />
                        </Tooltip>
                        <Tooltip label="Delete">
                          <IconButton
                            size="sm"
                            aria-label="Delete budget"
                            icon={<DeleteIcon />}
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleDeleteBudget(item.id)}
                          />
                        </Tooltip>
                      </HStack>
                    </Flex>
                    
                    <Grid templateColumns="1fr auto" gap={4} alignItems="center">
                      <GridItem>
                        <Progress 
                          value={item.percentage} 
                          size="sm" 
                          colorScheme={
                            item.percentage < 70 ? "green" : 
                            item.percentage < 90 ? "yellow" : 
                            "red"
                          }
                          bg={progressBg}
                          borderRadius="full"
                          mb={2}
                        />
                      </GridItem>
                      <GridItem>
                        <Text fontWeight="medium">
                          {Math.round(item.percentage)}%
                        </Text>
                      </GridItem>
                    </Grid>
                    
                    <Flex justify="space-between" fontSize="sm" color="gray.500">
                      <Text>Spent: {formatCurrency(item.spent)}</Text>
                      <Text>Budget: {formatCurrency(item.amount)}</Text>
                      <Text fontWeight="medium" color={item.remaining >= 0 ? "green.500" : "red.500"}>
                        {item.remaining >= 0 
                          ? `Remaining: ${formatCurrency(item.remaining)}` 
                          : `Over budget: ${formatCurrency(Math.abs(item.remaining))}`}
                      </Text>
                    </Flex>
                    
                    {item.notes && (
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        <b>Note:</b> {item.notes}
                      </Text>
                    )}
                  </Box>
                ))
              )}
            </Stack>
          </CardBody>
        </Card>

        {/* Budget Insights */}
        <Card bg={bgCard}>
          <CardHeader>
            <Heading size="md">Budget Insights</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <Skeleton key={index} height="40px" />
                ))
              ) : (
                <>
                  {getBudgetProgress().some(item => item.percentage >= 100) && (
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      <Box flex="1">
                        <AlertTitle>Budget Exceeded!</AlertTitle>
                        <AlertDescription display="block">
                          You've exceeded your budget in the following categories: 
                          {getBudgetProgress()
                            .filter(item => item.percentage >= 100)
                            .map(item => ` ${item.category}`)
                            .join(', ')}.
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}
                  
                  {getBudgetProgress().some(item => item.percentage >= 90 && item.percentage < 100) && (
                    <Alert status="warning" borderRadius="md">
                      <AlertIcon />
                      <Box flex="1">
                        <AlertTitle>Budget Warning</AlertTitle>
                        <AlertDescription display="block">
                          You're close to exceeding your budget in: 
                          {getBudgetProgress()
                            .filter(item => item.percentage >= 90 && item.percentage < 100)
                            .map(item => ` ${item.category}`)
                            .join(', ')}.
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}
                  
                  {remainingBudget > 0 && (
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <Box flex="1">
                        <AlertTitle>Budget Status</AlertTitle>
                        <AlertDescription display="block">
                          You have {formatCurrency(remainingBudget)} remaining in your budget for this month.
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}
                  
                  {budgets.length === 0 && (
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <Box flex="1">
                        <AlertTitle>No Budgets Set</AlertTitle>
                        <AlertDescription display="block">
                          Get started by creating your first budget category.
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}
                </>
              )}
            </Stack>
          </CardBody>
        </Card>
      </Stack>

      {/* Add/Edit Budget Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditing ? 'Edit Budget' : 'Add New Budget Category'}
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={
              currentBudget
                ? {
                    category: currentBudget.category,
                    amount: currentBudget.amount,
                    notes: currentBudget.notes || '',
                  }
                : {
                    category: '',
                    amount: '',
                    notes: '',
                  }
            }
            validationSchema={BudgetSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form>
                <ModalBody>
                  <Stack spacing={4}>
                    <Field name="category">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.category && form.touched.category}>
                          <FormLabel>Category</FormLabel>
                          <Select {...field} placeholder="Select category" isDisabled={isEditing}>
                            {expenseCategories.map(
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

                    <Field name="amount">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.amount && form.touched.amount}>
                          <FormLabel>Budget Amount</FormLabel>
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

                    <Field name="notes">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.notes && form.touched.notes}>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <Input
                            {...field}
                            placeholder="Add notes about this budget category"
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
                    {isEditing ? 'Update' : 'Add'} Budget
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