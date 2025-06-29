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
        fill: true,
        backgroundColor: 'rgba(190, 175, 155, 0.2)',
        borderColor: "#BEAF9B",
        tension: 0.3,
        pointBackgroundColor: "#8A7B6C",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#BEAF9B",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "'Poppins', 'Roboto', sans-serif",
            size: 12
          },
          color: '#453C33'
        }
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: 'rgba(138, 123, 108, 0.8)',
        titleFont: {
          family: "'Poppins', 'Roboto', sans-serif",
          size: 14
        },
        bodyFont: {
          family: "'Poppins', 'Roboto', sans-serif",
          size: 13
        },
        callbacks: {
          label: function(context) {
            return `Revenue: Rs.${context.parsed.y.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(190, 175, 155, 0.2)',
        },
        ticks: {
          font: {
            family: "'Poppins', 'Roboto', sans-serif",
          },
          color: '#666666',
          callback: function(value) {
            return 'Rs.' + value;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(190, 175, 155, 0.2)',
        },
        ticks: {
          font: {
            family: "'Poppins', 'Roboto', sans-serif",
          },
          color: '#666666'
        }
      }
    },
  };

  return (
    <Box sx={{ 
      p: 4, 
      borderRadius: '8px',
      border: '1px solid rgba(190, 175, 155, 0.3)',
      boxShadow: 'none',
      background: 'linear-gradient(135deg, rgba(190,175,155,0.3), rgba(255,255,255,0.9))'
    }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif", 
            fontWeight: 600,
            color: '#666666'
          }}
        >
          Revenue Trend
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Select 
            value={range} 
            onChange={(e) => setRange(e.target.value)}
            size="small"
            sx={{
              height: 30,
              fontSize: '0.875rem',
              '& .MuiSelect-select': { py: 0.5 },
              '&.MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(190, 175, 155, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#BEAF9B',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#BEAF9B',
                },
              },
              color: '#453C33'
            }}
          >
            <MenuItem value="week" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Weekly</MenuItem>
            <MenuItem value="month" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Monthly</MenuItem>
            <MenuItem value="year" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Yearly</MenuItem>
          </Select>
          {range !== 'year' && (
            <Select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              size="small"
              sx={{
                height: 30,
                fontSize: '0.875rem',
                '& .MuiSelect-select': { py: 0.5 },
                '&.MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(190, 175, 155, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#BEAF9B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#BEAF9B',
                  },
                },
                color: '#453C33'
              }}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <MenuItem 
                  key={i} 
                  value={new Date().getFullYear() - i}
                  sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}
                >
                  {new Date().getFullYear() - i}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
      </Box>

      {/* Chart container with fixed height */}
      <Box 
        sx={{ 
          height: 300, 
          position: "relative",
          p: 1,
          borderRadius: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
        }}
      >
        <Line data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
};

export default RevenueTrend;