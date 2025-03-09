import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
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
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Skeleton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useColorModeValue,
  Tag,
  TagLabel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tooltip
} from '@chakra-ui/react';
import {
  AddIcon,
  SearchIcon,
  ChevronDownIcon,
  EditIcon,
  DeleteIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SunIcon,
  RepeatIcon
} from '@chakra-ui/icons';
import { FiFilter, FiDownload, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { format, parseISO } from 'date-fns';

// Validation schema for transaction form
const TransactionSchema = Yup.object().shape({
  type: Yup.string().required('Transaction type is required'),
  category: Yup.string().required('Category is required'),
  amount: Yup.number()
    .positive('Amount must be positive')
    .required('Amount is required'),
  date: Yup.date().required('Date is required'),
  description: Yup.string()
    .min(3, 'Description too short')
    .max(100, 'Description too long')
    .required('Description is required'),
});

// Helper function to format currency
const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(value);
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'MMM dd, yyyy');
};

// Available categories
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

const incomeCategories = [
  'Salary',
  'Freelance',
  'Investments',
  'Rental Income',
  'Interest',
  'Gifts',
  'Other'
];

export default function Transactions() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Modal for adding/editing transactions
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // Delete confirmation dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const cancelRef = React.useRef();

  // Custom colors
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');

  // Mock data for demonstration - in real app this would come from Firebase
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        
        // In a real application, this would fetch actual data from Firebase
        // For demo purposes, we'll use mock data
        const mockTransactions = [
          { id: 1, type: 'expense', category: 'Housing', amount: 1200, date: '2023-05-01', description: 'Monthly Rent' },
          { id: 2, type: 'income', category: 'Salary', amount: 3500, date: '2023-05-01', description: 'Monthly Salary' },
          { id: 3, type: 'expense', category: 'Groceries', amount: 175.50, date: '2023-05-03', description: 'Weekly Groceries' },
          { id: 4, type: 'expense', category: 'Utilities', amount: 95.40, date: '2023-05-05', description: 'Electricity Bill' },
          { id: 5, type: 'income', category: 'Freelance', amount: 750, date: '2023-05-10', description: 'Website Project' },
          { id: 6, type: 'expense', category: 'Transportation', amount: 55.20, date: '2023-05-12', description: 'Gas' },
          { id: 7, type: 'expense', category: 'Entertainment', amount: 35.99, date: '2023-05-15', description: 'Movie Tickets' },
          { id: 8, type: 'expense', category: 'Food', amount: 52.45, date: '2023-05-17', description: 'Dinner with Friends' },
          { id: 9, type: 'expense', category: 'Healthcare', amount: 120, date: '2023-05-20', description: 'Prescription Medications' },
          { id: 10, type: 'expense', category: 'Personal', amount: 85.65, date: '2023-05-22', description: 'Haircut and Grooming' },
          { id: 11, type: 'expense', category: 'Education', amount: 200, date: '2023-05-25', description: 'Online Course' },
          { id: 12, type: 'income', category: 'Interest', amount: 25.75, date: '2023-05-28', description: 'Savings Account Interest' },
          { id: 13, type: 'expense', category: 'Gifts/Donations', amount: 50, date: '2023-05-30', description: 'Birthday Gift' },
          { id: 14, type: 'expense', category: 'Insurance', amount: 175, date: '2023-05-30', description: 'Car Insurance' },
          { id: 15, type: 'income', category: 'Salary', amount: 1000, date: '2023-05-15', description: 'Bonus' }
        ];
        
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
        setTotalPages(Math.ceil(mockTransactions.length / itemsPerPage));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser]);

  // Filter transactions based on search term, category, and type
  useEffect(() => {
    let filtered = [...transactions];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(transaction => 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(transaction => 
        transaction.category === categoryFilter
      );
    }
    
    // Filter by type
    if (typeFilter) {
      filtered = filtered.filter(transaction => 
        transaction.type === typeFilter
      );
    }
    
    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(transaction => 
        transaction.date.includes(dateFilter)
      );
    }
    
    setFilteredTransactions(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, categoryFilter, typeFilter, dateFilter, transactions]);

  // Get current page transactions
  const getCurrentTransactions = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  };

  // Handle add new transaction
  const handleAddTransaction = () => {
    setIsEditing(false);
    setCurrentTransaction(null);
    onOpen();
  };
  
  // Handle edit transaction
  const handleEditTransaction = (transaction) => {
    setIsEditing(true);
    setCurrentTransaction(transaction);
    onOpen();
  };
  
  // Handle delete transaction
  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteOpen(true);
  };
  
  // Confirm delete transaction
  const confirmDelete = () => {
    if (transactionToDelete) {
      // In a real app, this would delete from Firebase
      const updatedTransactions = transactions.filter(t => t.id !== transactionToDelete.id);
      setTransactions(updatedTransactions);
      
      toast({
        title: "Transaction deleted.",
        description: "The transaction has been removed successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsDeleteOpen(false);
  };
  
  // Handle form submission for adding/editing transaction
  const handleSubmit = (values, actions) => {
    if (isEditing && currentTransaction) {
      // Update existing transaction
      const updatedTransactions = transactions.map(t => 
        t.id === currentTransaction.id ? { ...values, id: currentTransaction.id } : t
      );
      setTransactions(updatedTransactions);
      
      toast({
        title: "Transaction updated.",
        description: "Your changes have been saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Create new transaction
      const newTransaction = {
        ...values,
        id: transactions.length + 1, // In a real app, this would be a Firebase-generated ID
      };
      setTransactions([...transactions, newTransaction]);
      
      toast({
        title: "Transaction added.",
        description: "Your transaction has been recorded successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    
    actions.setSubmitting(false);
    onClose();
  };
  
  // Calculate income, expense, and balance totals
  const calculateTotals = () => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
      
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
      
    return {
      income,
      expense,
      balance: income - expense
    };
  };
  
  const { income, expense, balance } = calculateTotals();

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setTypeFilter('');
    setDateFilter('');
  };

  return (
    <Box p={4}>
      <Stack spacing={6}>
        <Flex justify="space-between" align="center" wrap="wrap">
          <Heading as="h1" size="xl" mb={{ base: 4, md: 0 }}>
            Transactions
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="brand"
            onClick={handleAddTransaction}
          >
            Add Transaction
          </Button>
        </Flex>

        {/* Totals Cards */}
        <Flex 
          direction={{ base: 'column', md: 'row' }}
          gap={4}
        >
          <Box
            p={4}
            bg="green.50"
            borderRadius="lg"
            flex="1"
            borderWidth="1px"
            borderColor="green.200"
          >
            <Text color="gray.600" fontSize="sm">Total Income</Text>
            <Text color="green.500" fontSize="2xl" fontWeight="bold">
              {formatCurrency(income)}
            </Text>
          </Box>
          
          <Box
            p={4}
            bg="red.50"
            borderRadius="lg"
            flex="1"
            borderWidth="1px"
            borderColor="red.200"
          >
            <Text color="gray.600" fontSize="sm">Total Expenses</Text>
            <Text color="red.500" fontSize="2xl" fontWeight="bold">
              {formatCurrency(expense)}
            </Text>
          </Box>
          
          <Box
            p={4}
            bg={balance >= 0 ? "blue.50" : "yellow.50"}
            borderRadius="lg"
            flex="1"
            borderWidth="1px"
            borderColor={balance >= 0 ? "blue.200" : "yellow.200"}
          >
            <Text color="gray.600" fontSize="sm">Net Balance</Text>
            <Text 
              color={balance >= 0 ? "blue.500" : "yellow.600"} 
              fontSize="2xl" 
              fontWeight="bold"
            >
              {formatCurrency(balance)}
            </Text>
          </Box>
        </Flex>

        {/* Filters */}
        <Flex 
          gap={4} 
          direction={{ base: 'column', md: 'row' }} 
          align={{ base: 'stretch', md: 'center' }}
          wrap="wrap"
        >
          <InputGroup maxW={{ base: '100%', md: '300px' }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          
          <Select 
            placeholder="Select category" 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            maxW={{ base: '100%', md: '200px' }}
          >
            {[...new Set([...expenseCategories, ...incomeCategories])].sort().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
          
          <Select 
            placeholder="Select type" 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            maxW={{ base: '100%', md: '150px' }}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
          
          <Input 
            type="month"
            placeholder="Filter by month"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            maxW={{ base: '100%', md: '180px' }}
          />
          
          <Button 
            leftIcon={<RepeatIcon />} 
            onClick={resetFilters}
            variant="outline"
          >
            Reset
          </Button>
        </Flex>

        {/* Transactions Table */}
        <Box
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          overflow="hidden"
        >
          <Tabs isFitted variant="enclosed">
            <TabList>
              <Tab>All</Tab>
              <Tab>Income</Tab>
              <Tab>Expenses</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel p={0}>
                <TransactionsTable 
                  transactions={getCurrentTransactions()}
                  isLoading={isLoading}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteClick}
                />
              </TabPanel>
              
              <TabPanel p={0}>
                <TransactionsTable 
                  transactions={getCurrentTransactions().filter(t => t.type === 'income')}
                  isLoading={isLoading}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteClick}
                />
              </TabPanel>
              
              <TabPanel p={0}>
                <TransactionsTable 
                  transactions={getCurrentTransactions().filter(t => t.type === 'expense')}
                  isLoading={isLoading}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteClick}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* Pagination */}
        <Flex justify="space-between" align="center" mt={4}>
          <Text color="gray.500">
            Showing {Math.min(itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </Text>
          <HStack>
            <IconButton
              icon={<ChevronLeftIcon />}
              isDisabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              aria-label="Previous page"
            />
            <Text>{currentPage} of {totalPages}</Text>
            <IconButton
              icon={<ChevronRightIcon />}
              isDisabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              aria-label="Next page"
            />
          </HStack>
        </Flex>
      </Stack>

      {/* Add/Edit Transaction Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={
              currentTransaction
                ? {
                    type: currentTransaction.type,
                    category: currentTransaction.category,
                    amount: currentTransaction.amount,
                    date: currentTransaction.date,
                    description: currentTransaction.description,
                  }
                : {
                    type: 'expense',
                    category: '',
                    amount: '',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                  }
            }
            validationSchema={TransactionSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form>
                <ModalBody>
                  <Stack spacing={4}>
                    <Field name="type">
                      {({ field, form }) => (
                        <FormControl>
                          <FormLabel>Transaction Type</FormLabel>
                          <HStack spacing={4}>
                            <Button
                              colorScheme={field.value === 'income' ? 'green' : 'gray'}
                              variant={field.value === 'income' ? 'solid' : 'outline'}
                              onClick={() => form.setFieldValue('type', 'income')}
                              size="md"
                              flex="1"
                            >
                              Income
                            </Button>
                            <Button
                              colorScheme={field.value === 'expense' ? 'red' : 'gray'}
                              variant={field.value === 'expense' ? 'solid' : 'outline'}
                              onClick={() => form.setFieldValue('type', 'expense')}
                              size="md"
                              flex="1"
                            >
                              Expense
                            </Button>
                          </HStack>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="category">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.category && form.touched.category}>
                          <FormLabel>Category</FormLabel>
                          <Select {...field} placeholder="Select category">
                            {(form.values.type === 'income' ? incomeCategories : expenseCategories).map(
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

                    <Field name="description">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.description && form.touched.description}>
                          <FormLabel>Description</FormLabel>
                          <Textarea {...field} placeholder="Enter a description" rows={3} />
                          <FormErrorMessage>{form.errors.description}</FormErrorMessage>
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
                    {isEditing ? 'Update' : 'Add'} Transaction
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Transaction
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

// TransactionsTable component for displaying transactions
function TransactionsTable({ transactions, isLoading, onEdit, onDelete }) {
  const bgHover = useColorModeValue('gray.50', 'gray.700');

  if (isLoading) {
    return (
      <Stack p={4}>
        {Array(5).fill(0).map((_, i) => (
          <Skeleton key={i} height="60px" />
        ))}
      </Stack>
    );
  }

  if (transactions.length === 0) {
    return (
      <Flex justify="center" align="center" p={8} direction="column">
        <Text fontSize="lg" mb={4}>No transactions found</Text>
        <Text color="gray.500">Try adjusting your filters or add a new transaction</Text>
      </Flex>
    );
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Description</Th>
            <Th>Category</Th>
            <Th isNumeric>Amount</Th>
            <Th width="100px">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <Tr 
              key={transaction.id}
              _hover={{ bg: bgHover }}
            >
              <Td>{formatDate(transaction.date)}</Td>
              <Td>
                <Text fontWeight="medium">{transaction.description}</Text>
              </Td>
              <Td>
                <Tag
                  size="md"
                  variant="subtle"
                  colorScheme={transaction.type === 'income' ? 'green' : 'red'}
                >
                  <TagLabel>{transaction.category}</TagLabel>
                </Tag>
              </Td>
              <Td isNumeric>
                <Text
                  fontWeight="semibold"
                  color={transaction.type === 'income' ? 'green.500' : 'red.500'}
                >
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                </Text>
              </Td>
              <Td>
                <HStack spacing={1}>
                  <Tooltip label="Edit">
                    <IconButton
                      size="sm"
                      aria-label="Edit transaction"
                      icon={<EditIcon />}
                      onClick={() => onEdit(transaction)}
                      variant="ghost"
                    />
                  </Tooltip>
                  <Tooltip label="Delete">
                    <IconButton
                      size="sm"
                      aria-label="Delete transaction"
                      icon={<DeleteIcon />}
                      onClick={() => onDelete(transaction)}
                      variant="ghost"
                      colorScheme="red"
                    />
                  </Tooltip>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}