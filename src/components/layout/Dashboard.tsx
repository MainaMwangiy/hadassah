import React, { useEffect, useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Paper, List, ListItemButton, ListItemText, Collapse, Button, Box, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ChartComponent from "../Charts/Charts";
import axios from "axios";
import { useSnackbar } from "notistack";
import utils from "../../utils";
import { useApi } from "../../hooks/Apis";
import Loader from "../../hooks/Loader";
import dayjs, { Dayjs } from 'dayjs';

interface ChartData {
  name: string;
  y: number;
}

const TotalSales = ({ total, days, percentageChange }: { total: number, days: any, percentageChange: number }) => {
  let daysNo = utils.getLasDays(days);
  return (
    <div className="w-full sm:w-1/4 p-4 text-center bg-white dark:bg-gray-800 shadow-md dark:shadow-inner rounded-lg">
      <p className="text-sm text-gray-400 dark:text-gray-500">Total Sales Amount</p>
      <h2 className="text-4xl font-bold text-black dark:text-white">{`KES ${new Intl.NumberFormat('en-KE').format(total)}`}</h2>
      <p className={`text-sm ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{`vs previous ${daysNo} days`}</p>
    </div>
  );
};

const SalesPerPeriod = ({ salesCount, days, percentageChange }: { salesCount: number, days: any, percentageChange: number }) => {
  let daysNo = utils.getLasDays(days);
  return (
    <div className="w-full sm:w-1/4 p-4 text-center bg-white dark:bg-gray-800 shadow-md dark:shadow-inner rounded-lg">
      <p className="text-sm text-gray-400 dark:text-gray-500">{`Total Sales Count in ${daysNo} Last Days`}</p>
      <h2 className="text-4xl font-bold text-black dark:text-white">{salesCount}</h2>
      <p className={`text-sm ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{`vs previous ${daysNo} days`}</p>
    </div>
  );
};

const AverageSales = ({ total, days, percentageChange }: { total: number, days: any, percentageChange: number }) => {
  let daysNo = utils.getLasDays(days);
  const averageSales = daysNo ? (total / daysNo) : 'N/A';
  return (
    <div className="w-full sm:w-1/4 p-4 text-center bg-white dark:bg-gray-800 shadow-md dark:shadow-inner rounded-lg">
      <p className="text-sm text-gray-400 dark:text-gray-500">Average Sales</p>
      <h2 className="text-4xl font-bold text-black dark:text-white">
        {typeof averageSales === 'number' ? averageSales.toFixed(2) : averageSales}
      </h2>
      <p className={`text-sm ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{`vs previous ${daysNo} days`}</p>
    </div>
  );
};

const TotalProfits = ({ profits, days, percentageChange }: { profits: number, days: any, percentageChange: number }) => {
  let daysNo = utils.getLasDays(days);
  return (
    <div className="w-full sm:w-1/4 p-4 text-center bg-white dark:bg-gray-800 shadow-md dark:shadow-inner rounded-lg">
      <p className="text-sm text-gray-400 dark:text-gray-500">Total Profits</p>
      <h2 className="text-4xl font-bold text-black dark:text-white">{`KES ${new Intl.NumberFormat('en-KE').format(profits)}`}</h2>
      <p className={`text-sm ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{`vs previous ${daysNo} days`}</p>
    </div>
  );
};

const GrowthRate = ({ days, growthData }: { days: any, growthData: any }) => {
  let daysNo = utils.getLasDays(days);
  const growthPercentage = growthData?.growthPercentage || 0;
  const previousGrowthPercentage = 0;

  return (
    <div className="w-full sm:w-1/4 p-4 text-center bg-white dark:bg-gray-800 shadow-md dark:shadow-inner rounded-lg">
      <p className="text-sm text-gray-400 dark:text-gray-500">Sales Growth Rate</p>
      <h2 className="text-4xl font-bold text-black dark:text-white">{`${growthPercentage.toFixed(2)}%`}</h2>
      <p className={`text-sm ${growthPercentage >= previousGrowthPercentage ? 'text-green-500' : 'text-red-500'}`}>
        {growthPercentage >= previousGrowthPercentage ? '+' : ''}{growthPercentage.toFixed(2)}%
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{`vs previous ${daysNo} days`}</p>
    </div>
  );
};

const SalesGrowthChart = ({ data, seriesData }: { data: any, seriesData: ChartData[] }) => {
  return (
    <div className="w-full mt-6">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Sales Growth Over Time</h3>
      <ChartComponent
        type="line"
        data={data}
        title="Sales Growth Over Time"
        yLabel="Amount (KES)"
        seriesData={seriesData}
      />
    </div>
  );
};

const Top5ProductsSales = ({ data, seriesData }: { data: any, seriesData: ChartData[] }) => {
  return (
    <div className="w-full mt-6">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Top Selling Products</h3>
      <ChartComponent
        type="pie"
        data={data}
        title="Top Selling Products"
        yLabel="Amount"
        seriesData={seriesData}
      />
    </div>
  );
};

const TopSellingProductsChart = ({ data, seriesData }: { data: any, seriesData: ChartData[] }) => {
  return (
    <div className="w-full mt-6">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Top 10 Products Sales</h3>
      <ChartComponent
        type="bar"
        data={data}
        title="Top 10 Products Sales"
        yLabel="Total Sales (KES)"
        seriesData={seriesData}
      />
    </div>
  );
};

const BottomSellingProductsChart = ({ data, seriesData }: { data: any, seriesData: ChartData[] }) => {
  return (
    <div className="w-full mt-6">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Bottom 10 Products Sales</h3>
      <ChartComponent
        type="bar"
        data={data}
        title="Bottom 10 Products Sales"
        yLabel="Total Sales (KES)"
        seriesData={seriesData}
      />
    </div>
  );
};

const DateRangeFilterButton: React.FC<{
  selectedOption: string;
  startDate: string;
  endDate: string;
  isOpen: boolean;
  onClick: () => void;
}> = ({ selectedOption, startDate, endDate, isOpen, onClick }) => {
  const displayText = selectedOption === 'custom'
    ? `${dayjs(startDate).format('MMM D, YYYY')} - ${dayjs(endDate).format('MMM D, YYYY')}`
    : selectedOption.replace('last', 'Last ').replace(/([A-Z])/g, ' $1').trim();

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-700 dark:text-gray-200"
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span className="text-sm font-medium">{displayText}</span>
      {isOpen ? (
        <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
      ) : (
        <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </button>
  );
};

const Dashboard: React.FC = () => {
  const [salesData, setSalesData] = useState<any>([]);
  const [productsData, setProductsData] = useState<any>([]);
  const [totalSalesAnalytics, setTotalSalesAnalytics] = useState<any>([]);
  const [salesGrowth, setSalesGrowth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const { apiRequest } = useApi();
  const [dateRange, setDateRange] = useState("last7days");
  const [filters, setFilters] = useState<{ startDate: string; endDate: string }>({
    startDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD')
  });
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Dayjs | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Dayjs | null>(null);
  const [error, setError] = useState<string>('');
  const [salesAnalytics, setSalesAnalytics] = useState<any>({
    currentPeriod: { totalSales: 0, salesCount: 0, totalProfits: 0 },
    previousPeriod: { totalSales: 0, salesCount: 0, totalProfits: 0 },
    percentageChanges: { salesAmount: 0, salesCount: 0, profits: 0 }
  });

  const dateOptions = ['last7days', 'last1month', 'last3months', 'last1year', 'custom'];

  const calculateDateRange = (range: string): { startDate: string; endDate: string } => {
    const currentDate = dayjs();
    let startDate: Dayjs = currentDate;
    let endDate: Dayjs = currentDate;

    const rangeCalculations: Record<string, () => Dayjs> = {
      last7days: () => startDate.subtract(7, 'day'),
      last1month: () => startDate.subtract(1, 'month'),
      last3months: () => startDate.subtract(3, 'month'),
      last1year: () => startDate.subtract(1, 'year')
    };

    if (rangeCalculations[range]) {
      startDate = rangeCalculations[range]();
    } else if (range === 'custom' && tempStartDate && tempEndDate) {
      startDate = tempStartDate;
      endDate = tempEndDate;
    }

    return {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD')
    };
  };

  const handleOptionSelect = (option: string) => {
    setDateRange(option);
    if (option !== 'custom') {
      const { startDate, endDate } = calculateDateRange(option);
      setFilters({ startDate, endDate });
      setIsOpen(false);
    }
  };

  const handleCustomDateChange = (newStartDate: Dayjs | null, newEndDate: Dayjs | null) => {
    setTempStartDate(newStartDate);
    setTempEndDate(newEndDate);
    if (newStartDate && newEndDate && newEndDate.isBefore(newStartDate)) {
      setError('End date cannot be before start date');
    } else {
      setError('');
    }
  };

  const handleApplyCustomDate = () => {
    if (tempStartDate && tempEndDate) {
      if (tempEndDate.isBefore(tempStartDate)) {
        setError('End date cannot be before start date');
        return;
      }
      const { startDate, endDate } = calculateDateRange('custom');
      setFilters({ startDate, endDate });
      setError('');
      setIsOpen(false);
    } else {
      setError('Please select both start and end dates');
    }
  };

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
    if (!isOpen && dateRange === 'custom') {
      setTempStartDate(dayjs(filters.startDate));
      setTempEndDate(dayjs(filters.endDate));
    }
  };

  const fetchDailySalesData = async () => {
    try {
      const url = `${utils.baseUrl}/api/sales/analytics/total`;
      const response = await axios.post(url, {
        filters,
        headers: { 'Content-Type': 'application/json' },
      });

      setSalesData(response.data.data);
    } catch (error) {
      console.error('Error in fetchDailySalesData:', error);
      enqueueSnackbar("Daily Sales Data Loading Failed. Please try again.", { variant: "error" });
    }
  };

  const fetchSalesAnalytics = async () => {
    try {
      const url = `${utils.baseUrl}/api/sales/analytics`;
      const response = await axios.post(url, {
        filters,
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success && response.data.data) {
        setSalesAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Error in fetchSalesAnalytics:', error);
      enqueueSnackbar("Sales Analytics Loading Failed. Please try again.", { variant: "error" });
    }
  };

  const fetchHarvestsData = async () => {
    try {
      const url = `${utils.baseUrl}/api/products/analytics`;
      const response = await axios.post(url, {
        filters,
        headers: { 'Content-Type': 'application/json' },
      });
      setProductsData(response.data.data);
    } catch (error) {
      enqueueSnackbar("Products Data Loading Failed. Please try again.", { variant: "error" });
    }
  };

  const fetchSalesProductsAnalytics = async () => {
    try {
      const url = `${utils.baseUrl}/api/products/sales/analytics`;
      const response = await axios.post(url, {
        filters,
        headers: { 'Content-Type': 'application/json' },
      });
      setTotalSalesAnalytics(response?.data);
    } catch (error) {
      enqueueSnackbar("Total Sales Loading Failed. Please try again.", { variant: "error" });
    }
  };

  const fetchSalesGrowth = async () => {
    try {
      const url = `${utils.baseUrl}/api/sales/growth`;
      const response = await axios.post(url, {
        filters,
        headers: { 'Content-Type': 'application/json' },
      });
      setSalesGrowth(response.data.data);
    } catch (error) {
      enqueueSnackbar("Sales Growth Data Loading Failed. Please try again.", { variant: "error" });
    }
  };

  const fetchProductsData = async () => {
    setLoading(true);
    const url = `${utils.baseUrl}/api/products/list`;
    const tempPayload = { page: 1, pageSize: 100 };
    const response = await apiRequest({ method: "POST", url: url, data: tempPayload });
    localStorage.setItem('products', JSON.stringify(response?.data));
    setLoading(false);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDailySalesData(),
        fetchSalesAnalytics(),
        fetchHarvestsData(),
        fetchSalesProductsAnalytics(),
        fetchProductsData(),
        fetchSalesGrowth()
      ]);
      setLoading(false);
    };
    fetchAllData();
  }, [filters]);

  if (loading) {
    return <Loader />;
  }

  const prepareLineChartData = (data: any[]): ChartData[] => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    return data.map(item => ({
      name: item.createdon,
      y: Number(item.totalprice)
    }));
  };

  const prepareBarChartData = (data: any[]): { top10: ChartData[], bottom10: ChartData[] } => {
    if (!Array.isArray(data) || data.length === 0) {
      return { top10: [], bottom10: [] };
    }
    const sortedData = data.map(item => ({
      ...item,
      totalsales: Number(item.totalsales || 0)
    }));

    const top10 = [...sortedData]
      .sort((a, b) => b.totalsales - a.totalsales)
      .slice(0, 10)
      .map(item => ({
        name: item.name,
        y: item.totalsales
      }));

    const bottom10 = [...sortedData]
      .sort((a, b) => a.totalsales - b.totalsales)
      .slice(0, 10)
      .map(item => ({
        name: item.name,
        y: item.totalsales
      }));

    return { top10, bottom10 };
  };

  const preparePieChartData = (data: any[]): ChartData[] => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data.map(item => ({
      name: item.name,
      y: Number(item.totalsales)
    }));
  };

  const lineChartData = prepareLineChartData(salesData);
  const { top10: barChartDataTop10, bottom10: barChartDataBottom10 } = prepareBarChartData(totalSalesAnalytics?.data);
  const pieChartData = preparePieChartData(totalSalesAnalytics?.data);

  const calculateAverageSalesPercentage = () => {
    const currentAverage = salesAnalytics.currentPeriod.totalSales / utils.getLasDays(dateRange);
    const previousAverage = salesAnalytics.previousPeriod.totalSales / utils.getLasDays(dateRange);
    return previousAverage === 0 ? 0 : ((currentAverage - previousAverage) / previousAverage) * 100;
  };

  return (
    <div className="space-y-4 p-2 sm:p-4">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={3} alignItems="center">
          {/* @ts-ignore */}
          <Grid item xs={12} sm={6} md={4} lg={3} className="flex justify-end">
            <div className="relative w-85 sm:w-auto">
              <DateRangeFilterButton
                selectedOption={dateRange}
                startDate={filters.startDate}
                endDate={filters.endDate}
                isOpen={isOpen}
                onClick={toggleDropdown}
              />
              {isOpen && (
                <Paper
                  className="absolute left-0 mt-2 w-85 z-10 origin-top-right shadow-lg rounded-lg overflow-hidden transform transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-fadeIn"
                  style={{
                    animation: isOpen ? 'fadeIn 150ms ease-out' : 'none',
                  }}
                >
                  <List component="nav" aria-label="date range options" className="p-0">
                    {dateOptions.map((option) => (
                      <React.Fragment key={option}>
                        <ListItemButton
                          selected={dateRange === option}
                          onClick={() => handleOptionSelect(option)}
                          className={`${dateRange === option
                            ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            } text-gray-700 dark:text-gray-200 px-4 py-2`}
                        >
                          <ListItemText primary={option.replace('last', 'Last ').replace(/([A-Z])/g, ' $1').trim()} />
                        </ListItemButton>
                        {option === 'custom' && dateRange === 'custom' && (
                          <Collapse in={true} timeout="auto" unmountOnExit>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800">
                              <div className="flex items-center gap-2 mb-3">
                                <DatePicker
                                  label="Start"
                                  value={tempStartDate}
                                  onChange={(newValue) => handleCustomDateChange(newValue, tempEndDate)}
                                  maxDate={tempEndDate || undefined}
                                  slotProps={{
                                    textField: {
                                      size: 'small',
                                      margin: 'dense',
                                      className: 'w-[150px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-400 dark:placeholder-gray-300',
                                      InputLabelProps: {
                                        className: 'text-gray-900 dark:text-white',
                                      },
                                      InputProps: {
                                        className: 'text-gray-900 dark:text-white',
                                      },
                                    },
                                  }}
                                />
                                <Typography className="text-gray-700 dark:text-gray-200">-</Typography>
                                <DatePicker
                                  label="End"
                                  value={tempEndDate}
                                  onChange={(newValue) => handleCustomDateChange(tempStartDate, newValue)}
                                  minDate={tempStartDate || undefined}
                                  slotProps={{
                                    textField: {
                                      size: 'small',
                                      margin: 'dense',
                                      className: 'w-[150px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-400 dark:placeholder-gray-300',
                                      InputLabelProps: {
                                        className: 'text-gray-900 dark:text-white',
                                      },
                                      InputProps: {
                                        className: 'text-gray-900 dark:text-white',
                                      },
                                    },
                                  }}
                                />
                              </div>
                              {error && (
                                <Typography className="text-red-500 dark:text-red-400 text-center text-xs mb-3">
                                  {error}
                                </Typography>
                              )}
                              <div className="flex justify-end">
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="primary"
                                  onClick={handleApplyCustomDate}
                                  disabled={!tempStartDate || !tempEndDate}
                                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md px-4 py-1"
                                >
                                  Apply
                                </Button>
                              </div>
                            </div>
                          </Collapse>
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              )}
            </div>
          </Grid>
        </Grid>
      </LocalizationProvider>

      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        {TotalSales({
          total: salesAnalytics.currentPeriod.totalSales,
          days: dateRange,
          percentageChange: salesAnalytics.percentageChanges.salesAmount
        })}
        {SalesPerPeriod({
          salesCount: salesAnalytics.currentPeriod.salesCount,
          days: dateRange,
          percentageChange: salesAnalytics.percentageChanges.salesCount
        })}
        {TotalProfits({
          profits: salesAnalytics.currentPeriod.totalProfits,
          days: dateRange,
          percentageChange: salesAnalytics.percentageChanges.profits
        })}
        {AverageSales({
          total: salesAnalytics.currentPeriod.totalSales,
          days: dateRange,
          percentageChange: calculateAverageSalesPercentage()
        })}
        {GrowthRate({ days: dateRange, growthData: salesGrowth })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full">
          <Top5ProductsSales data={totalSalesAnalytics} seriesData={pieChartData} />
        </div>
        <div className="w-full">
          {lineChartData.length > 0 ? (
            <SalesGrowthChart data={salesData} seriesData={lineChartData} />
          ) : (
            <div className="w-full mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Sales Growth Over Time</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No sales data available for the selected period.</p>
            </div>
          )}
        </div>
        <div className="w-full">
          <TopSellingProductsChart data={productsData} seriesData={barChartDataTop10} />
        </div>
        <div className="w-full">
          <BottomSellingProductsChart data={productsData} seriesData={barChartDataBottom10} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;