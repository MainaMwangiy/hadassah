import React, { useEffect, useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, useTheme } from "@mui/material";
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRange } from '@mui/x-date-pickers-pro';
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
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<DateRange<Dayjs>>([null, null]);
  const [salesAnalytics, setSalesAnalytics] = useState<any>({
    currentPeriod: { totalSales: 0, salesCount: 0, totalProfits: 0 },
    previousPeriod: { totalSales: 0, salesCount: 0, totalProfits: 0 },
    percentageChanges: { salesAmount: 0, salesCount: 0, profits: 0 }
  });

  const dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last1month', label: 'Last 1 Month' },
    { value: 'last3months', label: 'Last 3 Months' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'last1year', label: 'Last 1 Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleDateRangeChange = (event: SelectChangeEvent<string>) => {
    const selectedRange = event.target.value;
    setDateRange(selectedRange);

    if (selectedRange === 'custom') {
      setOpenDatePicker(true);
    } else {
      setOpenDatePicker(false);
      const { startDate, endDate } = calculateDateRange(selectedRange);
      setFilters({ startDate, endDate });
    }
  };

  const handleCustomDateChange = (newValue: DateRange<Dayjs>) => {
    setCustomDateRange(newValue);
    if (newValue[0] && newValue[1]) {
      setFilters({
        startDate: newValue[0].format('YYYY-MM-DD'),
        endDate: newValue[1].format('YYYY-MM-DD')
      });
      setOpenDatePicker(false);
    }
  };

  const calculateDateRange = (range: string) => {
    const currentDate = dayjs();
    let startDate = currentDate;

    const rangeCalculations: Record<string, () => Dayjs> = {
      last7days: () => startDate.subtract(7, 'day'),
      last1month: () => startDate.subtract(1, 'month'),
      last3months: () => startDate.subtract(3, 'month'),
      last6months: () => startDate.subtract(6, 'month'),
      last1year: () => startDate.subtract(1, 'year')
    };

    if (rangeCalculations[range]) {
      startDate = rangeCalculations[range]();
    }

    return {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: currentDate.format('YYYY-MM-DD')
    };
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
        <Grid container spacing={3}>
          {/* @ts-ignore */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl
              variant="outlined"
              size="small"
              fullWidth
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
            >
              <InputLabel className="text-gray-900 dark:text-gray-200">
                Filter by Date Range
              </InputLabel>
              <Select
                value={dateRange}
                onChange={handleDateRangeChange}
                label="Filter by Date Range"
                className="text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                MenuProps={{
                  PaperProps: {
                    className: 'bg-white dark:bg-gray-800'
                  }
                }}
              >
                {dateRangeOptions.map(option => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    className="text-gray-900 dark:text-white"
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {openDatePicker && (
            // @ts-ignore
            <Grid item xs={12} sm={6} md={4}>
              <DateRangePicker
                open={openDatePicker}
                onClose={() => setOpenDatePicker(false)}
                value={customDateRange}
                onChange={handleCustomDateChange}
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    size: 'small',
                    fullWidth: true,
                    className: 'bg-white dark:bg-gray-800'
                  }
                }}
              />
            </Grid>
          )}
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