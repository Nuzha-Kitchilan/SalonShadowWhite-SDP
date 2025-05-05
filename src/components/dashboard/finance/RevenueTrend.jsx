import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const RevenueTrend = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [range, setRange] = useState("week");
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get(`/revenue/trend?type=${range}&year=${year}`);
        setRevenueData(response.data.data);
      } catch (error) {
        console.error("Error fetching revenue trend data:", error);
      }
    };

    fetchRevenueData();
  }, [range, year]);

  const chartData = {
    labels: revenueData.map((item) => item.period),
    datasets: [
      {
        label: "Revenue",
        data: revenueData.map((item) => item.revenue),
        fill: false,
        borderColor: "#1976d2",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // allows us to control height manually
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Revenue Trend</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl size="small">
            <InputLabel>Range</InputLabel>
            <Select 
              value={range} 
              label="Range" 
              onChange={(e) => setRange(e.target.value)}
            >
              <MenuItem value="week">Weekly</MenuItem>
              <MenuItem value="month">Monthly</MenuItem>
              <MenuItem value="year">Yearly</MenuItem>
            </Select>
          </FormControl>
          {range !== 'year' && (
            <FormControl size="small">
              <InputLabel>Year</InputLabel>
              <Select
                value={year}
                label="Year"
                onChange={(e) => setYear(e.target.value)}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <MenuItem key={i} value={new Date().getFullYear() - i}>
                    {new Date().getFullYear() - i}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </Box>

      {/* Chart container with fixed height */}
      <Box sx={{ height: 300, position: "relative" }}>
        <Line data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
};

export default RevenueTrend;
