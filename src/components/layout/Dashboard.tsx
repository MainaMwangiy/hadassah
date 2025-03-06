import React, { useEffect, useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, useTheme } from "@mui/material";
import ChartComponent from "../Charts/Charts";
import axios from "axios";
import { useSnackbar } from "notistack";
import utils from "../../utils";
import { useApi } from "../../hooks/Apis";
import Loader from "../../hooks/Loader";

interface SalesData {
  totalsalescount: string;
  productid: number;
  name: string;
  totalsales: string;
}

interface ChartData {
  name: string;
  y: number;
}

const TotalSales = ({ total, days }: { total: any, days:any }) => {
  let daysNo = utils.getLasDays(days);
  return (
    <div className="w-full sm:w-1/4 p-4 text-center bg-white dark:bg-gray-800 shadow-md dark:shadow-inner rounded-lg">
      <p className="text-sm text-gray-400 dark:text-gray-500">Total Sales Amount</p>
      <h2 className="text-4xl font-bold text-black dark:text-white">{`KES ${new Intl.NumberFormat('en-KE').format(total)}`}</h2>
      <p className="text-sm text-green-500">+20%</p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{`vs previous ${daysNo} days`}</p>
    </div>
  );
};

const SalesPerPeriod = ({ salesData, days }: { salesData: any, days:any }) => {
  let daysNo = utils.getLasDays(days);
  return (
    <div className="w-full sm:w-1/4 p-4 text-center bg-white dark:bg-gray-800 shadow-md dark:shadow-inner rounded-lg">
      <p className="text-sm text-gray-400 dark:text-gray-500">{`Total Sales Count in ${daysNo} Last Days`}</p>
      <h2 className="text-4xl font-bold text-black dark:text-white">{salesData.length || 0}</h2>
      <p className="text-sm text-green-500">+15</p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{`vs previous ${daysNo} days`}</p>
    </div>
  );
};

const AverageSales = ({ total, days }: { total: any, days:any }) => {
  let daysNo = utils.getLasDays(days);
  const averageSales = daysNo ? (total / daysNo) : 'N/A';
  return (
    <div className="w-full sm:w-1/4 p-4 text-center bg-white dark:bg-gray-800 shadow-md dark:shadow-inner rounded-lg">
      <p className="text-sm text-gray-400 dark:text-gray-500">Average Sales</p>
      <h2 className="text-4xl font-bold text-black dark:text-white">
        {typeof averageSales === 'number' ? averageSales.toFixed(2) : averageSales}
      </h2>
      <p className="text-sm text-green-500">+7.3%</p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{`vs previous ${daysNo} days`}</p>
    </div>
  );
};

const GrowthRate = ({ days }: { days:any }) => {
  let daysNo = utils.getLasDays(days);
  return (
    <div className="w-full sm:w-1/4 p-4 text-center bg-white dark:bg-gray-800 shadow-md dark:shadow-inner rounded-lg">
      <p className="text-sm text-gray-400 dark:text-gray-500">Sales Growth Rate</p>
      <h2 className="text-4xl font-bold text-black dark:text-white">8.29%</h2>
      <p className="text-sm text-green-500">+1.3%</p>
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
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Top 5 Products Sales</h3>
      <ChartComponent
        type="bar"
        data={data}
        title="Top 5 Products Sales"
        yLabel="Total Sales (KES)"
        seriesData={seriesData}
      />
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [salesData, setSalesData] = useState<any>([]);
  const [productsData, setProductsData] = useState<any>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalSalesAnalytics, setTotalSalesAnalytics] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const { apiRequest } = useApi();
  const [dateRange, setDateRange] = useState("Last7Days");
  const [filters, setFilters] = useState<{ startDate: string; endDate: string }>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0], 
    endDate: new Date().toISOString().split('T')[0]
  });
  

  const handleDateRangeChange = (event: SelectChangeEvent<string>) => {
    const selectedRange = event.target.value;
    setDateRange(selectedRange);
    const { startDate, endDate } = calculateDateRange(selectedRange);
    setFilters({ startDate, endDate });
  };

  const calculateDateRange = (range: string) => {
    const currentDate = new Date();
    let startDate = new Date();
    let endDate = currentDate;

    switch (range) {
      case "Last7Days":
        startDate.setDate(currentDate.getDate() - 7);
        break;
      case "Last14Days":
        startDate.setDate(currentDate.getDate() - 14);
        break;
      case "Last30Days":
        startDate.setDate(currentDate.getDate() - 30);
        break;
      case "Last90Days":
        startDate.setDate(currentDate.getDate() - 90);
        break;
      default:
        break;
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  const fetchData = async () => {
    try {
      const url = `${utils.baseUrl}/api/sales/analytics`;
      const response = await axios.post(url, {
        filters,
        headers: { 'Content-Type': 'application/json' },
      });

      setSalesData(response.data.data);
    } catch (error) {
      enqueueSnackbar("Sales Data Loading Failed. Please try again.", { variant: "error" });
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

  const fetchTotalSales = async () => {
    try {
      const url = `${utils.baseUrl}/api/sales/total`;
      const response = await axios.post(url, {
        filters,
        headers: { 'Content-Type': 'application/json' },
      });
      setTotalSales(response?.data?.data[0].total);
    } catch (error) {
      enqueueSnackbar("Total Sales Loading Failed. Please try again.", { variant: "error" });
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

  const fetchProductsData = async () => {
    setLoading(true);
    const url =  `${utils.baseUrl}/api/products/list`
    const tempPayload = {page:1, pageSize: 100};
    const response = await apiRequest({ method: "POST", url: url, data: tempPayload });
    localStorage.setItem('products', JSON.stringify(response?.data))
    setLoading(false);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([fetchData(), fetchHarvestsData(), fetchTotalSales(), fetchSalesProductsAnalytics(), fetchProductsData()]);
      setLoading(false);
    };
    fetchAllData();
  }, [filters]);

  if (loading) {
    return <Loader /> ;
  }

  const prepareLineChartData = (data: any[]): ChartData[] => {
    return data.map(item => ({
      name: item.createdon, 
      y: Number(item.totalprice) 
    }));
  };

  const prepareBarChartData = (data: any[]): ChartData[] => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    const sortedData = data.map(item => ({
      ...item,
      totalsales: Number(item.totalsales)
    })).sort((a, b) => b.totalsales - a.totalsales).slice(0, 5);
  
    return sortedData.map(item => ({
      name: item.name,
      y: item.totalsales
    }));
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
  const barChartData = prepareBarChartData(totalSalesAnalytics?.data);
  const pieChartData = preparePieChartData(totalSalesAnalytics?.data);

  return (
    <div className="space-y-4 p-2 sm:p-4">
      <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
          <FormControl 
            variant="outlined" 
            size="small" 
            fullWidth
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
          >
            <InputLabel 
              className="text-gray-900 dark:text-gray-200"
            >
              Filter by Date Range
            </InputLabel>
            <Select
              value={dateRange}
              onChange={handleDateRangeChange}
              label="Auto date range"
              className="text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              MenuProps={{
                PaperProps: {
                  className: 'bg-white dark:bg-gray-800'
                }
              }}
            >
              <MenuItem value="Last7Days" className="text-gray-900 dark:text-white">Last 7 Days</MenuItem>
              <MenuItem value="Last14Days" className="text-gray-900 dark:text-white">Last 14 Days</MenuItem>
              <MenuItem value="Last30Days" className="text-gray-900 dark:text-white">Last 30 Days</MenuItem>
              <MenuItem value="Last90Days" className="text-gray-900 dark:text-white">Last 90 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        {TotalSales({ total: totalSales, days: dateRange  })}
        {SalesPerPeriod({ salesData, days: dateRange  })}
        {AverageSales({ total: totalSales, days: dateRange })}
        {GrowthRate({ days: dateRange })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full">
          <Top5ProductsSales data={totalSalesAnalytics} seriesData={pieChartData} />
        </div>
        <div className="w-full">
          <SalesGrowthChart data={salesData} seriesData={lineChartData} />
        </div>
        <div className="w-full lg:col-span-2">
          <TopSellingProductsChart data={productsData} seriesData={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
