"use client"

import React, { useEffect, useState } from "react"
import {
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  BarChart2,
  PieChart,
  LineChart,
} from "lucide-react"
import axios from "axios"
import { useSnackbar } from "notistack"
import dayjs, { type Dayjs } from "dayjs"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import ChartComponent from "../Charts/Charts"
import utils from "../../utils"
import { useApi } from "../../hooks/Apis"
import Loader from "../../hooks/Loader"
import { useDarkMode } from "../../hooks/DarkModeContext"

interface ChartData {
  name: string
  y: number
}

const Dashboard: React.FC = () => {
  const [salesData, setSalesData] = useState<any>([])
  const [productsData, setProductsData] = useState<any>([])
  const [totalSalesAnalytics, setTotalSalesAnalytics] = useState<any>([])
  const [salesGrowth, setSalesGrowth] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { enqueueSnackbar } = useSnackbar()
  const { apiRequest } = useApi()
  const [dateRange, setDateRange] = useState("Last7Days")
  const [filters, setFilters] = useState<{ startDate: string; endDate: string }>({
    startDate: dayjs().subtract(7, "day").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  })
  const [isOpen, setIsOpen] = useState(false)
  const [tempStartDate, setTempStartDate] = useState<Dayjs | null>(null)
  const [tempEndDate, setTempEndDate] = useState<Dayjs | null>(null)
  const [error, setError] = useState<string>("")
  const [salesAnalytics, setSalesAnalytics] = useState<any>({
    currentPeriod: { totalSales: 0, salesCount: 0, totalProfits: 0 },
    previousPeriod: { totalSales: 0, salesCount: 0, totalProfits: 0 },
    percentageChanges: { salesAmount: 0, salesCount: 0, profits: 0 },
  })
  const { darkMode } = useDarkMode()

  const calculateDateRange = (range: string): { startDate: string; endDate: string } => {
    const currentDate = dayjs()
    let startDate: Dayjs = currentDate
    let endDate: Dayjs = currentDate
    const option = utils.dateOptions.find((opt) => opt.value === range)
    if (option && option.days) {
      startDate = currentDate.subtract(option.days, "day")
    } else if (range === "Custom" && tempStartDate && tempEndDate) {
      startDate = tempStartDate
      endDate = tempEndDate
    }
    return {
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
    }
  }

  const handleOptionSelect = (option: string) => {
    setDateRange(option)
    if (option !== "Custom") {
      const { startDate, endDate } = calculateDateRange(option)
      setFilters({ startDate, endDate })
      setIsOpen(false)
    }
  }

  const handleCustomDateChange = (newStartDate: Dayjs | null, newEndDate: Dayjs | null) => {
    setTempStartDate(newStartDate)
    setTempEndDate(newEndDate)
    if (newStartDate && newEndDate && newEndDate.isBefore(newStartDate)) {
      setError("End date cannot be before start date")
    } else {
      setError("")
    }
  }

  const handleApplyCustomDate = () => {
    if (tempStartDate && tempEndDate) {
      if (tempEndDate.isBefore(tempStartDate)) {
        setError("End date cannot be before start date")
        return
      }
      setFilters({
        startDate: tempStartDate.format("YYYY-MM-DD"),
        endDate: tempEndDate.format("YYYY-MM-DD"),
      })
      setDateRange("Custom")
      setError("")
      setIsOpen(false)
    } else {
      setError("Please select both start and end dates")
    }
  }

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev)
    if (!isOpen && dateRange === "Custom") {
      setTempStartDate(dayjs(filters.startDate))
      setTempEndDate(dayjs(filters.endDate))
    }
  }

  // API calls
  const fetchDailySalesData = async () => {
    try {
      const url = `${utils.baseUrl}/api/sales/analytics/total`
      const response = await axios.post(url, {
        filters,
        headers: { "Content-Type": "application/json" },
      })
      setSalesData(response.data.data)
    } catch (error) {
      console.error("Error in fetchDailySalesData:", error)
      enqueueSnackbar("Daily Sales Data Loading Failed. Please try again.", { variant: "error" })
    }
  }

  const fetchSalesAnalytics = async () => {
    try {
      const url = `${utils.baseUrl}/api/sales/analytics`
      const response = await axios.post(url, {
        filters,
        headers: { "Content-Type": "application/json" },
      })
      if (response.data.success && response.data.data) {
        setSalesAnalytics(response.data.data)
      }
    } catch (error) {
      console.error("Error in fetchSalesAnalytics:", error)
      enqueueSnackbar("Sales Analytics Loading Failed. Please try again.", { variant: "error" })
    }
  }

  const fetchHarvestsData = async () => {
    try {
      const url = `${utils.baseUrl}/api/products/analytics`
      const response = await axios.post(url, {
        filters,
        headers: { "Content-Type": "application/json" },
      })
      setProductsData(response.data.data)
    } catch (error) {
      enqueueSnackbar("Products Data Loading Failed. Please try again.", { variant: "error" })
    }
  }

  const fetchSalesProductsAnalytics = async () => {
    try {
      const url = `${utils.baseUrl}/api/products/sales/analytics`
      const response = await axios.post(url, {
        filters,
        headers: { "Content-Type": "application/json" },
      })
      setTotalSalesAnalytics(response?.data)
    } catch (error) {
      enqueueSnackbar("Total Sales Loading Failed. Please try again.", { variant: "error" })
    }
  }

  const fetchSalesGrowth = async () => {
    try {
      const url = `${utils.baseUrl}/api/sales/growth`
      const response = await axios.post(url, {
        filters,
        headers: { "Content-Type": "application/json" },
      })
      setSalesGrowth(response.data.data)
    } catch (error) {
      enqueueSnackbar("Sales Growth Data Loading Failed. Please try again.", { variant: "error" })
    }
  }

  const fetchProductsData = async () => {
    setLoading(true)
    const url = `${utils.baseUrl}/api/products/list`
    const tempPayload = { page: 1, pageSize: 100 }
    const response = await apiRequest({ method: "POST", url: url, data: tempPayload })
    localStorage.setItem("products", JSON.stringify(response?.data))
    setLoading(false)
  }

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      await Promise.all([
        fetchDailySalesData(),
        fetchSalesAnalytics(),
        fetchHarvestsData(),
        fetchSalesProductsAnalytics(),
        fetchProductsData(),
        fetchSalesGrowth(),
      ])
      setLoading(false)
    }
    fetchAllData()
  }, [filters])

  if (loading) {
    return <Loader />
  }

  // Data preparation for charts
  const prepareLineChartData = (data: any[]): ChartData[] => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return []
    }
    return data.map((item) => ({
      name: item.createdon,
      y: Number(item.totalprice),
    }))
  }

  const prepareBarChartData = (data: any[]): { top10: ChartData[]; bottom10: ChartData[] } => {
    if (!Array.isArray(data) || data.length === 0) {
      return { top10: [], bottom10: [] }
    }
    const sortedData = data.map((item) => ({
      ...item,
      totalsales: Number(item.totalsales || 0),
    }))

    const top10 = [...sortedData]
      .sort((a, b) => b.totalsales - a.totalsales)
      .slice(0, 10)
      .map((item) => ({
        name: item.name,
        y: item.totalsales,
      }))

    const bottom10 = [...sortedData]
      .sort((a, b) => a.totalsales - b.totalsales)
      .slice(0, 10)
      .map((item) => ({
        name: item.name,
        y: item.totalsales,
      }))

    return { top10, bottom10 }
  }

  const preparePieChartData = (data: any[]): ChartData[] => {
    if (!Array.isArray(data) || data.length === 0) {
      return []
    }

    return data.map((item) => ({
      name: item.name,
      y: Number(item.totalsales),
    }))
  }

  const lineChartData = prepareLineChartData(salesData)
  const { top10: barChartDataTop10, bottom10: barChartDataBottom10 } = prepareBarChartData(totalSalesAnalytics?.data)
  const pieChartData = preparePieChartData(totalSalesAnalytics?.data)

  const calculateAverageSalesPercentage = () => {
    let daysCount
    if (dateRange === "Custom") {
      daysCount = dayjs(filters.endDate).diff(dayjs(filters.startDate), "day") + 1
    } else {
      daysCount = utils.getDaysCount(dateRange)
    }
    if (!daysCount || daysCount <= 0) {
      return 0
    }
    const currentAverage = salesAnalytics.currentPeriod.totalSales / daysCount
    const previousAverage = salesAnalytics.previousPeriod.totalSales / daysCount
    return previousAverage === 0 ? 0 : ((currentAverage - previousAverage) / previousAverage) * 100
  }

  const getDaysCount = (days: any, start?: Dayjs | null, end?: Dayjs | null) => {
    if (days === "Custom" && start && end) {
      return end.diff(start, "day") + 1
    }
    return utils.getDaysCount(days)
  }

  // Stat card components
  const StatCard = ({
    title,
    value,
    percentChange,
    days,
    icon,
    tempStartDate,
    tempEndDate,
  }: {
    title: string
    value: string | number
    percentChange: number
    days: any
    icon: React.ReactNode
    tempStartDate?: Dayjs | null
    tempEndDate?: Dayjs | null
  }) => {
    const daysNo = getDaysCount(days, tempStartDate, tempEndDate)
    const isPositive = percentChange >= 0

    return (
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>

            <div className="mt-1 flex items-center">
              <span
                className={`flex items-center text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {isPositive ? "+" : ""}
                {percentChange.toFixed(2)}%
              </span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">vs previous {daysNo} days</span>
            </div>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            {icon}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
      </div>
    )
  }

  // Chart components
  const ChartCard = ({
    title,
    children,
    icon,
  }: {
    title: string
    children: React.ReactNode
    icon: React.ReactNode
  }) => {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              {icon}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="relative mt-4 sm:mt-0">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <CalendarIcon size={16} />
              {dateRange === "Custom"
                ? `${dayjs(filters.startDate).format("MMM D, YYYY")} - ${dayjs(filters.endDate).format("MMM D, YYYY")}`
                : dateRange
                  .replace("last", "Last ")
                  .replace(/([A-Z])/g, " $1")
                  .trim()}
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isOpen && (
              <div className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
                <div className="py-1">
                  {utils.dateOptions.map((option) => (
                    <React.Fragment key={option.value}>
                      <button
                        onClick={() => handleOptionSelect(option.value)}
                        className={`block w-full px-4 py-2 text-left text-sm ${dateRange === option.value
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                            : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                          }`}
                      >
                        {option.label}
                      </button>

                      {option.value === "Custom" && dateRange === "Custom" && (
                        <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-700">
                          <div className="mb-3 grid grid-cols-2 gap-2">
                            <DatePicker
                              label="Start Date"
                              value={tempStartDate}
                              onChange={(newValue) => handleCustomDateChange(newValue, tempEndDate)}
                              maxDate={tempEndDate || undefined}
                              slotProps={{
                                textField: {
                                  size: "small",
                                  fullWidth: true,
                                  sx: {
                                    "& .MuiInputBase-root": {
                                      backgroundColor: darkMode ? "#1f2937" : "#fff",
                                      color: darkMode ? "#fff" : "#111827",
                                    },
                                    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                                      color: darkMode ? "#fff" : "#111827",
                                    },
                                  },
                                },
                              }}
                            />
                            <DatePicker
                              label="End Date"
                              value={tempEndDate}
                              onChange={(newValue) => handleCustomDateChange(tempStartDate, newValue)}
                              minDate={tempStartDate || undefined}
                              slotProps={{
                                textField: {
                                  size: "small",
                                  fullWidth: true,
                                  sx: {
                                    "& .MuiInputBase-root": {
                                      backgroundColor: darkMode ? "#1f2937" : "#fff",
                                      color: darkMode ? "#fff" : "#111827",
                                    },
                                    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                                      color: darkMode ? "#fff" : "#111827",
                                    },
                                  },
                                },
                              }}
                            />
                          </div>

                          {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

                          <button
                            onClick={handleApplyCustomDate}
                            disabled={!tempStartDate || !tempEndDate || !!error}
                            className="w-full rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-purple-700 dark:hover:bg-purple-600"
                          >
                            Apply Range
                          </button>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        </LocalizationProvider>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Total Sales Amount"
          value={`KES ${new Intl.NumberFormat("en-KE").format(salesAnalytics.currentPeriod.totalSales)}`}
          percentChange={salesAnalytics.percentageChanges.salesAmount}
          days={dateRange}
          icon={<DollarSign size={24} />}
          tempStartDate={tempStartDate}
          tempEndDate={tempEndDate}
        />

        <StatCard
          title={`Total Sales Count`}
          value={salesAnalytics.currentPeriod.salesCount}
          percentChange={salesAnalytics.percentageChanges.salesCount}
          days={dateRange}
          icon={<ShoppingCart size={24} />}
          tempStartDate={tempStartDate}
          tempEndDate={tempEndDate}
        />

        <StatCard
          title="Total Profits"
          value={`KES ${new Intl.NumberFormat("en-KE").format(salesAnalytics.currentPeriod.totalProfits)}`}
          percentChange={salesAnalytics.percentageChanges.profits}
          days={dateRange}
          icon={<DollarSign size={24} />}
          tempStartDate={tempStartDate}
          tempEndDate={tempEndDate}
        />

        <StatCard
          title="Average Sales"
          value={`KES ${new Intl.NumberFormat("en-KE").format(
            salesAnalytics.currentPeriod.totalSales / (getDaysCount(dateRange, tempStartDate, tempEndDate) || 1),
          )}`}
          percentChange={calculateAverageSalesPercentage()}
          days={dateRange}
          icon={<BarChart2 size={24} />}
          tempStartDate={tempStartDate}
          tempEndDate={tempEndDate}
        />

        <StatCard
          title="Sales Growth Rate"
          value={`${(salesGrowth?.growthPercentage || 0).toFixed(2)}%`}
          percentChange={salesGrowth?.growthPercentage || 0}
          days={dateRange}
          icon={<TrendingUp size={24} />}
          tempStartDate={tempStartDate}
          tempEndDate={tempEndDate}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Top Selling Products" icon={<PieChart size={18} />}>
          {pieChartData.length > 0 ? (
            <ChartComponent
              type="pie"
              data={totalSalesAnalytics}
              title="Top Selling Products"
              yLabel="Amount"
              seriesData={pieChartData}
            />
          ) : (
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">No data available for the selected period</p>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Sales Growth Over Time" icon={<LineChart size={18} />}>
          {lineChartData.length > 0 ? (
            <ChartComponent
              type="line"
              data={salesData}
              title="Sales Growth Over Time"
              yLabel="Amount (KES)"
              seriesData={lineChartData}
            />
          ) : (
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">No data available for the selected period</p>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Top 10 Products Sales" icon={<BarChart2 size={18} />}>
          {barChartDataTop10.length > 0 ? (
            <ChartComponent
              type="bar"
              data={productsData}
              title="Top 10 Products Sales"
              yLabel="Total Sales (KES)"
              seriesData={barChartDataTop10}
            />
          ) : (
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">No data available for the selected period</p>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Bottom 10 Products Sales" icon={<BarChart2 size={18} />}>
          {barChartDataBottom10.length > 0 ? (
            <ChartComponent
              type="bar"
              data={productsData}
              title="Bottom 10 Products Sales"
              yLabel="Total Sales (KES)"
              seriesData={barChartDataBottom10}
            />
          ) : (
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">No data available for the selected period</p>
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  )
}

export default Dashboard
