import React, { useEffect, useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, useTheme } from "@mui/material";
import ChartComponent from "../Charts/Charts";
import axios from "axios";
import { useSnackbar } from "notistack";
import utils from "../../utils";

const TotalSales = ({ total }: { total: number }) => {
  return (
    <div className="w-full sm:w-1/4 p-4 text-center bg-white dark:bg-gray-800 shadow-md dark:shadow-inner rounded-lg">
      <p className="text-sm text-gray-400 dark:text-gray-500">Total Revenue</p>
      <h2 className="text-4xl font-bold text-black dark:text-white">{`KES ${new Intl.NumberFormat('en-KE').format(total)}`}</h2>
      <p className="text-sm text-green-500">+20%</p>
      <p className="text-xs text-gray-400 dark:text-gray-500">vs previous 7 days</p>
    </div>
  );
};

const SalesPerPeriod = (salesData: any) => {
  return (
    <div className="w-full sm:w-1/4 p-4 text-center bg-white dark:bg-gray-800 shadow-md dark:shadow-inner rounded-lg">
      <p className="text-sm text-gray-400 dark:text-gray-500">Total Sales per Week</p>
      <h2 className="text-4xl font-bold text-black dark:text-white">{salesData.length || 0}</h2>
      <p className="text-sm text-green-500">+15</p>
      <p className="text-xs text-gray-400 dark:text-gray-500">vs previous 7 days</p>
    </div>
  );
};

const AverageContract = () => {
  return (
    <div className="w-full sm:w-1/4 p-4 text-center bg-white dark:bg-gray-800 shadow-md dark:shadow-inner rounded-lg">
      <p className="text-sm text-gray-400 dark:text-gray-500">Average Sales</p>
      <h2 className="text-4xl font-bold text-black dark:text-white">KES 1,553</h2>
      <p className="text-sm text-green-500">+7.3%</p>
      <p className="text-xs text-gray-400 dark:text-gray-500">vs previous 7 days</p>
    </div>
  );
};

const GrowthRate = () => {
  return (
    <div className="w-full sm:w-1/4 p-4 text-center bg-white dark:bg-gray-800 shadow-md dark:shadow-inner rounded-lg">
      <p className="text-sm text-gray-400 dark:text-gray-500">Sales Growth Rate</p>
      <h2 className="text-4xl font-bold text-black dark:text-white">8.29%</h2>
      <p className="text-sm text-green-500">+1.3%</p>
      <p className="text-xs text-gray-400 dark:text-gray-500">vs previous 7 days</p>
    </div>
  );
};

const SalesGrowthChart = ({ data }: { data: any }) => {
  return (
    <div className="w-full mt-6">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Sales Growth</h3>
      <ChartComponent
        type="line"
        data={data}
        title="Sales Over Time"
        yLabel="Amount (KES)"
        xLabel="Date"
      />
    </div>
  );
};

const SalesPerRepChart = ({ data }: { data: any }) => {
  return (
    <div className="w-full mt-6">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Sales per Rep</h3>
      <ChartComponent
        type="line"
        data={data}
        title="Products Over Time"
        yLabel="Amount (KES)"
        xLabel="Date"
      />
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [salesData, setSalesData] = useState<any>([]);
  const [productsData, setProductsData] = useState<any>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
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

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([fetchData(), fetchHarvestsData(), fetchTotalSales()]);
      setLoading(false);
    };
    fetchAllData();
  }, [filters]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
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
        {TotalSales({ total: totalSales })}
        {SalesPerPeriod(salesData)}
        {AverageContract()}
        {GrowthRate()}
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-4 mt-6">
        <div className="w-full sm:w-1/2 mb-6 sm:mb-0">
          <SalesGrowthChart data={salesData} />
        </div>
        <div className="w-full sm:w-1/2">
          <SalesPerRepChart data={productsData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
