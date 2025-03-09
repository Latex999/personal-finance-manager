import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  SimpleGrid,
  Divider,
  Progress,
  HStack,
  Tag,
  List,
  ListItem,
  useColorModeValue,
  Icon,
  Skeleton
} from '@chakra-ui/react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  InfoIcon,
  ChevronRightIcon
} from '@chakra-ui/icons';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiPieChart,
  FiCalendar,
  FiCreditCard,
  FiShoppingBag,
  FiHome,
  FiAlertCircle
} from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip as ChartTooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  ChartTooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netSavings, setNetSavings] = useState(0);
  const [savingsRate, setSavingsRate] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState({
    labels: [],
    income: [],
    expenses: []
  });
  const [categoryData, setCategoryData] = useState({
    labels: [],
    values: [],
    colors: []
  });
  const [budgetProgress, setBudgetProgress] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const bgCard = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Mock data for demonstration - in real app this would come from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // In a real application, this would fetch actual data from Firebase
        // For demo purposes, we'll use mock data
        
        // Set total income
        setTotalIncome(5250.75);
        
        // Set total expenses
        setTotalExpenses(3186.42);
        
        // Calculate net savings
        const savings = 5250.75 - 3186.42;
        setNetSavings(savings);
        
        // Calculate savings rate
        const rate = (savings / 5250.75) * 100;
        setSavingsRate(rate);
        
        // Set mock recent transactions
        setRecentTransactions([
          { id: 1, type: 'expense', category: 'Housing', amount: 1200, date: '2023-05-01', description: 'Monthly Rent' },
          { id: 2, type: 'income', category: 'Salary', amount: 3500, date: '2023-05-01', description: 'Monthly Salary' },
          { id: 3, type: 'expense', category: 'Groceries', amount: 175.50, date: '2023-05-03', description: 'Weekly Groceries' },
          { id: 4, type: 'expense', category: 'Utilities', amount: 95.40, date: '2023-05-05', description: 'Electricity Bill' },
          { id: 5, type: 'income', category: 'Freelance', amount: 750, date: '2023-05-10', description: 'Website Project' }
        ]);
        
        // Set monthly data for the chart
        setMonthlyData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          income: [4800, 4950, 5100, 4900, 5250],
          expenses: [3500, 3200, 3100, 3300, 3186]
        });
        
        // Set category data for the doughnut chart
        setCategoryData({
          labels: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities', 'Other'],
          values: [1200, 550, 450, 300, 350, 336.42],
          colors: ['#4FD1C5', '#F56565', '#ED8936', '#9F7AEA', '#38B2AC', '#718096']
        });
        
        // Set budget progress data
        setBudgetProgress([
          { category: 'Housing', spent: 1200, budget: 1200, percent: 100 },
          { category: 'Food', spent: 550, budget: 600, percent: 91.67 },
          { category: 'Transportation', spent: 450, budget: 500, percent: 90 },
          { category: 'Entertainment', spent: 300, budget: 300, percent: 100 },
          { category: 'Utilities', spent: 350, budget: 400, percent: 87.5 }
        ]);
        
        // Set alerts
        setAlerts([
          { id: 1, type: 'warning', message: 'Entertainment budget reached 100%' },
          { id: 2, type: 'info', message: 'Housing payment due in 3 days' },
          { id: 3, type: 'success', message: 'You saved 39% of your income this month!' }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Line chart configuration
  const lineChartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Income',
        data: monthlyData.income,
        borderColor: 'rgb(56, 161, 105)',
        backgroundColor: 'rgba(56, 161, 105, 0.5)',
        tension: 0.3
      },
      {
        label: 'Expenses',
        data: monthlyData.expenses,
        borderColor: 'rgb(229, 62, 62)',
        backgroundColor: 'rgba(229, 62, 62, 0.5)',
        tension: 0.3
      }
    ]
  };

  // Line chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Income vs Expenses'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    },
    maintainAspectRatio: false
  };

  // Doughnut chart configuration
  const doughnutChartData = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.values,
        backgroundColor: categoryData.colors,
        borderColor: categoryData.colors.map(color => color.replace('0.5', '1')),
        borderWidth: 1
      }
    ]
  };

  // Doughnut chart options
  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      },
      title: {
        display: true,
        text: 'Expense Distribution'
      }
    },
    maintainAspectRatio: false
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={6}>
        Dashboard
      </Heading>

      {/* Financial Summary */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Stat
          px={4}
          py={5}
          bg={bgCard}
          shadow="md"
          rounded="lg"
          borderColor={borderColor}
          borderWidth="1px"
        >
          <StatLabel fontSize="sm" fontWeight="medium" isTruncated>
            Monthly Income
          </StatLabel>
          <Skeleton isLoaded={!isLoading}>
            <StatNumber fontSize="3xl" fontWeight="semibold">
              {formatCurrency(totalIncome)}
            </StatNumber>
          </Skeleton>
          <StatHelpText>
            <StatArrow type="increase" />
            7.2% from last month
          </StatHelpText>
        </Stat>

        <Stat
          px={4}
          py={5}
          bg={bgCard}
          shadow="md"
          rounded="lg"
          borderColor={borderColor}
          borderWidth="1px"
        >
          <StatLabel fontSize="sm" fontWeight="medium" isTruncated>
            Monthly Expenses
          </StatLabel>
          <Skeleton isLoaded={!isLoading}>
            <StatNumber fontSize="3xl" fontWeight="semibold">
              {formatCurrency(totalExpenses)}
            </StatNumber>
          </Skeleton>
          <StatHelpText>
            <StatArrow type="decrease" />
            3.4% from last month
          </StatHelpText>
        </Stat>

        <Stat
          px={4}
          py={5}
          bg={bgCard}
          shadow="md"
          rounded="lg"
          borderColor={borderColor}
          borderWidth="1px"
        >
          <StatLabel fontSize="sm" fontWeight="medium" isTruncated>
            Net Savings
          </StatLabel>
          <Skeleton isLoaded={!isLoading}>
            <StatNumber fontSize="3xl" fontWeight="semibold" color="green.500">
              {formatCurrency(netSavings)}
            </StatNumber>
          </Skeleton>
          <StatHelpText>
            <StatArrow type="increase" />
            12.5% from last month
          </StatHelpText>
        </Stat>

        <Stat
          px={4}
          py={5}
          bg={bgCard}
          shadow="md"
          rounded="lg"
          borderColor={borderColor}
          borderWidth="1px"
        >
          <StatLabel fontSize="sm" fontWeight="medium" isTruncated>
            Savings Rate
          </StatLabel>
          <Skeleton isLoaded={!isLoading}>
            <StatNumber fontSize="3xl" fontWeight="semibold" color={savingsRate > 20 ? "green.500" : "yellow.500"}>
              {savingsRate.toFixed(1)}%
            </StatNumber>
          </Skeleton>
          <StatHelpText>
            <StatArrow type="increase" />
            5.3% from last month
          </StatHelpText>
        </Stat>
      </SimpleGrid>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} mb={8}>
        {/* Income vs Expenses Chart */}
        <GridItem>
          <Card>
            <CardHeader>
              <Heading size="md">Income vs Expenses Trend</Heading>
            </CardHeader>
            <CardBody>
              <Box h="300px">
                {isLoading ? (
                  <Skeleton height="100%" />
                ) : (
                  <Line data={lineChartData} options={lineChartOptions} />
                )}
              </Box>
            </CardBody>
          </Card>
        </GridItem>

        {/* Expense by Category Doughnut Chart */}
        <GridItem>
          <Card>
            <CardHeader>
              <Heading size="md">Expense Distribution</Heading>
            </CardHeader>
            <CardBody>
              <Box h="300px">
                {isLoading ? (
                  <Skeleton height="100%" />
                ) : (
                  <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                )}
              </Box>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Budget Progress */}
      <Card mb={8}>
        <CardHeader>
          <Heading size="md">Monthly Budget Progress</Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={4}>
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <Box key={index}>
                  <Skeleton height="20px" mb={2} />
                  <Skeleton height="12px" />
                </Box>
              ))
            ) : (
              budgetProgress.map((item, index) => (
                <Box key={index}>
                  <Flex justify="space-between" mb={1}>
                    <Text fontWeight="medium">{item.category}</Text>
                    <Text>
                      {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                    </Text>
                  </Flex>
                  <Progress 
                    value={item.percent} 
                    size="sm" 
                    colorScheme={
                      item.percent < 70 ? "green" : 
                      item.percent < 90 ? "yellow" : 
                      "red"
                    }
                    borderRadius="md"
                  />
                </Box>
              ))
            )}
          </Stack>
        </CardBody>
        <CardFooter>
          <Button as={RouterLink} to="/budget" rightIcon={<ChevronRightIcon />} colorScheme="brand" variant="outline">
            View Full Budget
          </Button>
        </CardFooter>
      </Card>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <Heading size="md">Recent Transactions</Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<Divider />} spacing="4">
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <Skeleton key={index} height="50px" />
                ))
              ) : (
                recentTransactions.map((transaction) => (
                  <Flex key={transaction.id} justify="space-between" align="center">
                    <HStack>
                      <Box
                        p={2}
                        borderRadius="md"
                        bg={transaction.type === 'income' ? 'green.100' : 'red.100'}
                        color={transaction.type === 'income' ? 'green.500' : 'red.500'}
                      >
                        <Icon 
                          as={transaction.type === 'income' ? FiTrendingUp : FiTrendingDown} 
                          boxSize={5} 
                        />
                      </Box>
                      <Box>
                        <Text fontWeight="medium">{transaction.description}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {transaction.category} • {transaction.date}
                        </Text>
                      </Box>
                    </HStack>
                    <Text
                      fontWeight="semibold"
                      color={transaction.type === 'income' ? 'green.500' : 'red.500'}
                    >
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </Text>
                  </Flex>
                ))
              )}
            </Stack>
          </CardBody>
          <CardFooter>
            <Button as={RouterLink} to="/transactions" rightIcon={<ChevronRightIcon />} colorScheme="brand" variant="outline">
              View All Transactions
            </Button>
          </CardFooter>
        </Card>

        {/* Alerts and Notifications */}
        <Card>
          <CardHeader>
            <Heading size="md">Alerts & Reminders</Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<Divider />} spacing="4">
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <Skeleton key={index} height="50px" />
                ))
              ) : (
                alerts.map((alert) => (
                  <HStack key={alert.id} spacing={3}>
                    <Icon 
                      as={FiAlertCircle} 
                      color={
                        alert.type === 'warning' ? 'yellow.500' : 
                        alert.type === 'info' ? 'blue.500' : 'green.500'
                      } 
                      boxSize={5} 
                    />
                    <Text>{alert.message}</Text>
                  </HStack>
                ))
              )}
            </Stack>
          </CardBody>
          <CardFooter>
            <Button as={RouterLink} to="/goals" rightIcon={<ChevronRightIcon />} colorScheme="brand" variant="outline">
              View Savings Goals
            </Button>
          </CardFooter>
        </Card>
      </Grid>
    </Box>
  );
}