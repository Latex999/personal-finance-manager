import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Select,
  Button,
  Stack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  Icon,
  useColorModeValue,
  Skeleton
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { 
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiDollarSign,
  FiCalendar
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { format, startOfMonth, endOfMonth, subMonths, getYear, getMonth } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
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

// Helper function to get month names for the last 6 months
const getLastSixMonths = () => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    months.push(format(date, 'MMM yyyy'));
  }
  return months;
};

// Helper to get month and year options for dropdowns
const getMonthOptions = () => {
  const months = [];
  const currentDate = new Date();
  const currentYear = getYear(currentDate);
  const currentMonth = getMonth(currentDate);
  
  for (let year = currentYear; year >= currentYear - 2; year--) {
    const monthLimit = year === currentYear ? currentMonth : 11;
    for (let month = monthLimit; month >= 0; month--) {
      const date = new Date(year, month, 1);
      months.push({
        value: `${year}-${month + 1}`,
        label: format(date, 'MMMM yyyy')
      });
    }
  }
  return months;
};

export default function Reports() {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(
    `${getYear(new Date())}-${getMonth(new Date()) + 1}`
  );
  const [incomeVsExpensesData, setIncomeVsExpensesData] = useState({
    labels: [],
    datasets: []
  });
  const [categoryDistributionData, setCategoryDistributionData] = useState({
    labels: [],
    datasets: []
  });
  const [monthlyTrendsData, setMonthlyTrendsData] = useState({
    labels: [],
    datasets: []
  });
  const [topExpensesData, setTopExpensesData] = useState([]);
  const [savingsData, setSavingsData] = useState({
    labels: [],
    datasets: []
  });
  const [reportSummary, setReportSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    savingsRate: 0,
    largestExpense: { category: '', amount: 0 },
    largestIncome: { source: '', amount: 0 }
  });

  const bgCard = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const months = getLastSixMonths();
  const monthOptions = getMonthOptions();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, we would fetch data from Firebase based on the selectedMonth
        // For demonstration, using mock data
        
        // Mock data for Income vs Expenses chart
        setIncomeVsExpensesData({
          labels: ['Income', 'Expenses', 'Savings'],
          datasets: [
            {
              label: 'Amount (USD)',
              data: [5250, 3186, 2064],
              backgroundColor: [
                'rgba(56, 161, 105, 0.6)',
                'rgba(229, 62, 62, 0.6)',
                'rgba(49, 130, 206, 0.6)'
              ],
              borderColor: [
                'rgb(56, 161, 105)',
                'rgb(229, 62, 62)',
                'rgb(49, 130, 206)'
              ],
              borderWidth: 1
            }
          ]
        });
        
        // Mock data for Category Distribution chart
        setCategoryDistributionData({
          labels: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities', 'Other'],
          datasets: [
            {
              data: [1200, 550, 450, 300, 350, 336],
              backgroundColor: [
                'rgba(79, 209, 197, 0.6)',
                'rgba(245, 101, 101, 0.6)',
                'rgba(237, 137, 54, 0.6)',
                'rgba(159, 122, 234, 0.6)',
                'rgba(56, 178, 172, 0.6)',
                'rgba(113, 128, 150, 0.6)'
              ],
              borderWidth: 1
            }
          ]
        });
        
        // Mock data for Monthly Trends
        setMonthlyTrendsData({
          labels: months,
          datasets: [
            {
              label: 'Income',
              data: [4800, 4950, 5100, 4900, 5250, 5300],
              borderColor: 'rgb(56, 161, 105)',
              backgroundColor: 'rgba(56, 161, 105, 0.5)',
              tension: 0.3
            },
            {
              label: 'Expenses',
              data: [3500, 3200, 3100, 3300, 3186, 3220],
              borderColor: 'rgb(229, 62, 62)',
              backgroundColor: 'rgba(229, 62, 62, 0.5)',
              tension: 0.3
            },
            {
              label: 'Savings',
              data: [1300, 1750, 2000, 1600, 2064, 2080],
              borderColor: 'rgb(49, 130, 206)',
              backgroundColor: 'rgba(49, 130, 206, 0.5)',
              tension: 0.3
            }
          ]
        });
        
        // Mock data for Top Expenses
        setTopExpensesData([
          { category: 'Housing', amount: 1200, percentage: 37.66 },
          { category: 'Food', amount: 550, percentage: 17.26 },
          { category: 'Transportation', amount: 450, percentage: 14.12 },
          { category: 'Utilities', amount: 350, percentage: 10.98 },
          { category: 'Entertainment', amount: 300, percentage: 9.42 },
          { category: 'Other', amount: 336, percentage: 10.56 }
        ]);
        
        // Mock data for Savings Rate
        setSavingsData({
          labels: months,
          datasets: [
            {
              label: 'Savings Rate (%)',
              data: [27.08, 35.35, 39.22, 32.65, 39.31, 39.25],
              borderColor: 'rgb(49, 130, 206)',
              backgroundColor: 'rgba(49, 130, 206, 0.5)',
              tension: 0.3
            }
          ]
        });
        
        // Set report summary
        setReportSummary({
          totalIncome: 5250,
          totalExpenses: 3186,
          netSavings: 2064,
          savingsRate: 39.31,
          largestExpense: { category: 'Housing', amount: 1200 },
          largestIncome: { source: 'Salary', amount: 4500 }
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser, selectedMonth, reportType]);

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      }
    }
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={6}>
        Financial Reports
      </Heading>

      {/* Report Controls */}
      <Card mb={6}>
        <CardBody>
          <HStack spacing={4}>
            <Box>
              <Text mb={2} fontWeight="medium">Report Type</Text>
              <Select value={reportType} onChange={handleReportTypeChange} w={200}>
                <option value="monthly">Monthly Report</option>
                <option value="quarterly">Quarterly Report</option>
                <option value="yearly">Yearly Report</option>
                <option value="custom">Custom Period</option>
              </Select>
            </Box>
            
            <Box>
              <Text mb={2} fontWeight="medium">Select Month</Text>
              <Select value={selectedMonth} onChange={handleMonthChange} w={200}>
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Select>
            </Box>
            
            <Button colorScheme="blue" mt={8}>
              Generate Report
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Report Summary */}
      <Card mb={6}>
        <CardHeader>
          <Heading size="md">Report Summary</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <Box p={4} borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
              <HStack>
                <Icon as={FiDollarSign} boxSize={5} color="green.500" />
                <Text fontWeight="bold">Total Income</Text>
              </HStack>
              <Skeleton isLoaded={!isLoading}>
                <Text fontSize="2xl" fontWeight="bold" mt={2}>
                  {formatCurrency(reportSummary.totalIncome)}
                </Text>
              </Skeleton>
            </Box>
            
            <Box p={4} borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
              <HStack>
                <Icon as={FiArrowDown} boxSize={5} color="red.500" />
                <Text fontWeight="bold">Total Expenses</Text>
              </HStack>
              <Skeleton isLoaded={!isLoading}>
                <Text fontSize="2xl" fontWeight="bold" mt={2}>
                  {formatCurrency(reportSummary.totalExpenses)}
                </Text>
              </Skeleton>
            </Box>
            
            <Box p={4} borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
              <HStack>
                <Icon as={FiArrowUp} boxSize={5} color="blue.500" />
                <Text fontWeight="bold">Net Savings</Text>
              </HStack>
              <Skeleton isLoaded={!isLoading}>
                <Text fontSize="2xl" fontWeight="bold" mt={2}>
                  {formatCurrency(reportSummary.netSavings)} ({reportSummary.savingsRate.toFixed(1)}%)
                </Text>
              </Skeleton>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Report Tabs */}
      <Tabs colorScheme="blue" variant="enclosed" isLazy>
        <TabList>
          <Tab><Icon as={FiBarChart2} mr={2} /> Overview</Tab>
          <Tab><Icon as={FiPieChart} mr={2} /> Categories</Tab>
          <Tab><Icon as={FiTrendingUp} mr={2} /> Trends</Tab>
        </TabList>
        
        <TabPanels>
          {/* Overview Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
              <Card>
                <CardHeader>
                  <Heading size="md">Income vs Expenses</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="300px">
                    {isLoading ? (
                      <Skeleton height="100%" />
                    ) : (
                      <Bar data={incomeVsExpensesData} options={barChartOptions} />
                    )}
                  </Box>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <Heading size="md">Expense by Category</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="300px">
                    {isLoading ? (
                      <Skeleton height="100%" />
                    ) : (
                      <Doughnut data={categoryDistributionData} options={doughnutChartOptions} />
                    )}
                  </Box>
                </CardBody>
              </Card>
            </SimpleGrid>
            
            <Card>
              <CardHeader>
                <Heading size="md">Monthly Breakdown</Heading>
              </CardHeader>
              <CardBody>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Category</Th>
                      <Th isNumeric>Amount</Th>
                      <Th isNumeric>% of Total</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isLoading ? (
                      Array(6).fill(0).map((_, index) => (
                        <Tr key={index}>
                          <Td><Skeleton height="20px" width="120px" /></Td>
                          <Td isNumeric><Skeleton height="20px" width="80px" /></Td>
                          <Td isNumeric><Skeleton height="20px" width="60px" /></Td>
                        </Tr>
                      ))
                    ) : (
                      topExpensesData.map((item, index) => (
                        <Tr key={index}>
                          <Td>{item.category}</Td>
                          <Td isNumeric>{formatCurrency(item.amount)}</Td>
                          <Td isNumeric>{item.percentage.toFixed(1)}%</Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPanel>
          
          {/* Categories Tab */}
          <TabPanel>
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
              <Card>
                <CardHeader>
                  <Heading size="md">Top Expense Categories</Heading>
                </CardHeader>
                <CardBody>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Category</Th>
                        <Th isNumeric>Amount</Th>
                        <Th isNumeric>% of Expenses</Th>
                        <Th>Change</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {isLoading ? (
                        Array(6).fill(0).map((_, index) => (
                          <Tr key={index}>
                            <Td><Skeleton height="20px" width="120px" /></Td>
                            <Td isNumeric><Skeleton height="20px" width="80px" /></Td>
                            <Td isNumeric><Skeleton height="20px" width="60px" /></Td>
                            <Td><Skeleton height="20px" width="80px" /></Td>
                          </Tr>
                        ))
                      ) : (
                        topExpensesData.map((item, index) => (
                          <Tr key={index}>
                            <Td>{item.category}</Td>
                            <Td isNumeric>{formatCurrency(item.amount)}</Td>
                            <Td isNumeric>{item.percentage.toFixed(1)}%</Td>
                            <Td>
                              <HStack>
                                <Icon 
                                  as={index % 2 === 0 ? FiArrowUp : FiArrowDown} 
                                  color={index % 2 === 0 ? "red.500" : "green.500"} 
                                />
                                <Text color={index % 2 === 0 ? "red.500" : "green.500"}>
                                  {(Math.random() * 10).toFixed(1)}%
                                </Text>
                              </HStack>
                            </Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <Heading size="md">Category Distribution</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="300px">
                    {isLoading ? (
                      <Skeleton height="100%" />
                    ) : (
                      <Doughnut data={categoryDistributionData} options={doughnutChartOptions} />
                    )}
                  </Box>
                </CardBody>
              </Card>
            </Grid>
          </TabPanel>
          
          {/* Trends Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
              <Card>
                <CardHeader>
                  <Heading size="md">Income & Expenses Trend</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="300px">
                    {isLoading ? (
                      <Skeleton height="100%" />
                    ) : (
                      <Line data={monthlyTrendsData} options={lineChartOptions} />
                    )}
                  </Box>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <Heading size="md">Savings Rate Trend</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="300px">
                    {isLoading ? (
                      <Skeleton height="100%" />
                    ) : (
                      <Line data={savingsData} options={lineChartOptions} />
                    )}
                  </Box>
                </CardBody>
              </Card>
            </SimpleGrid>
            
            <Card>
              <CardHeader>
                <Heading size="md">Monthly Comparison</Heading>
              </CardHeader>
              <CardBody>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Month</Th>
                      <Th isNumeric>Income</Th>
                      <Th isNumeric>Expenses</Th>
                      <Th isNumeric>Savings</Th>
                      <Th isNumeric>Savings Rate</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isLoading ? (
                      Array(6).fill(0).map((_, index) => (
                        <Tr key={index}>
                          <Td><Skeleton height="20px" width="100px" /></Td>
                          <Td isNumeric><Skeleton height="20px" width="80px" /></Td>
                          <Td isNumeric><Skeleton height="20px" width="80px" /></Td>
                          <Td isNumeric><Skeleton height="20px" width="80px" /></Td>
                          <Td isNumeric><Skeleton height="20px" width="60px" /></Td>
                        </Tr>
                      ))
                    ) : (
                      months.map((month, index) => (
                        <Tr key={index}>
                          <Td>{month}</Td>
                          <Td isNumeric>{formatCurrency(monthlyTrendsData.datasets[0].data[index])}</Td>
                          <Td isNumeric>{formatCurrency(monthlyTrendsData.datasets[1].data[index])}</Td>
                          <Td isNumeric>{formatCurrency(monthlyTrendsData.datasets[2].data[index])}</Td>
                          <Td isNumeric>{savingsData.datasets[0].data[index].toFixed(1)}%</Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}