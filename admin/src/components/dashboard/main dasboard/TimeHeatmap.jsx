import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  useTheme,
  Chip,
  Stack,
  Card
} from '@mui/material';
import { CalendarViewDay, Schedule, Whatshot } from '@mui/icons-material';
import { ResponsiveHeatMap } from '@nivo/heatmap';

const TimeHeatmap = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('week');

  const peakData = useMemo(() => {
    if (!data.length) return null;

    const maxAppointments = Math.max(...data.map(d => d.appointment_count));
    const peakTimes = data.filter(d => d.appointment_count === maxAppointments);

    return {
      maxAppointments,
      peakTimes,
      averageRevenue: peakTimes.reduce((sum, d) => sum + d.total_revenue, 0) / peakTimes.length
    };
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/dashboard/performance/heatmap?period=${viewMode}`);
        const processedData = response.data.data.map(item => ({
          ...item,
          appointment_count: Number(item.appointment_count) || 0,
          total_revenue: Number(item.total_revenue) || 0
        }));
        setData(processedData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching heatmap data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewMode]);

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) setViewMode(newMode);
  };

  const formatHeatmapData = () => {
    if (viewMode === 'day') {
      return [{
        id: 'Appointments',
        data: Array.from({ length: 24 }, (_, hour) => {
          const hourData = data.find(d => d.time_slot === hour);
          const isPeak = peakData?.peakTimes.some(pt => pt.time_slot === hour);
          return {
            x: `${hour}:00`,
            y: hourData?.appointment_count || 0,
            revenue: hourData?.total_revenue || 0,
            isPeak
          };
        })
      }];
    } else {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return [{
        id: 'Appointments',
        data: days.map((day, idx) => {
          const dayData = data.find(d => d.time_slot === idx + 1);
          const isPeak = peakData?.peakTimes.some(pt => pt.time_slot === idx + 1);
          return {
            x: day,
            y: dayData?.appointment_count || 0,
            revenue: dayData?.total_revenue || 0,
            isPeak
          };
        })
      }];
    }
  };

  const heatmapData = formatHeatmapData();

 
  const peakColor = '#BEAF9B';
  const heatMapBaseColor = [255, 250, 245]; 
  const heatMapDeepColor = [190, 175, 155]; 

  return (
    <Card sx={{ 
      p: 2, 
      height: '100%',
      borderRadius: '8px',
      border: '1px solid rgba(190, 175, 155, 0.3)',
      boxShadow: 'none',
      background: 'linear-gradient(135deg, rgba(190,175,155,0.3), rgba(255,255,255,0.9))'
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <CalendarViewDay sx={{ color: '#666666' }} />
          <Typography 
            variant="subtitle1" 
            fontWeight={600}
            sx={{ 
              color: '#666666', 
              fontFamily: "'Poppins', 'Roboto', sans-serif" 
            }}
          >
            Time Performance Heatmap
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              borderColor: 'rgba(190, 175, 155, 0.5)',
              color: '#666666',
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              '&.Mui-selected': {
                backgroundColor: 'rgba(190, 175, 155, 0.2)',
                color: '#453C33',
              },
              '&:hover': {
                backgroundColor: 'rgba(190, 175, 155, 0.1)',
              }
            }
          }}
        >
          <ToggleButton value="day" aria-label="daily view">
            <Schedule fontSize="small" sx={{ mr: 1 }} />
            Daily
          </ToggleButton>
          <ToggleButton value="week" aria-label="weekly view">
            <CalendarViewDay fontSize="small" sx={{ mr: 1 }} />
            Weekly
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Peak Time Indicator */}
      {!loading && !error && peakData && (
        <Box mb={2} sx={{ 
          backgroundColor: 'rgba(190, 175, 155, 0.1)',
          borderRadius: '4px',
          p: 1
        }}>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
            <Whatshot sx={{ color: '#BEAF9B' }} />
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#666666',
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontWeight: 600
              }}
            >
              Peak {viewMode === 'day' ? 'Hours' : 'Days'}:
            </Typography>
            {peakData.peakTimes.map((peak, i) => (
              <Chip
                key={i}
                label={viewMode === 'day'
                  ? `${peak.time_slot}:00 - ${peak.time_slot + 1}:00`
                  : peak.time_label}
                sx={{ 
                  borderColor: '#BEAF9B', 
                  color: '#453C33',
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  backgroundColor: 'rgba(190, 175, 155, 0.2)'
                }}
                variant="outlined"
                size="small"
              />
            ))}
            <Typography 
              variant="body2" 
              sx={{ 
                ml: 2,
                color: '#453C33',
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              }}
            >
              {peakData.maxAppointments} appointments • 
              Avg Revenue: Rs.{peakData.averageRevenue.toFixed(2)}
            </Typography>
          </Stack>
        </Box>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress sx={{ color: '#BEAF9B' }} />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <Typography 
            color="error"
            sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}
          >
            {error}
          </Typography>
        </Box>
      ) : (
        <Paper 
          sx={{ 
            height: 400, 
            overflow: 'hidden',
            boxShadow: 'none',
            border: '1px solid rgba(190, 175, 155, 0.3)',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          }}
        >
          <ResponsiveHeatMap
            data={heatmapData}
            margin={{ top: 60, right: 30, bottom: 60, left: 30 }}
            colors={cell => {
              if (cell.data.isPeak) {
                return peakColor; // Warm neutral tone for peak
              }

              const max = Math.max(...heatmapData[0].data.map(d => d.y));
              const value = cell.value / (max || 1);
              const r = Math.round(heatMapBaseColor[0] + (heatMapDeepColor[0] - heatMapBaseColor[0]) * value);
              const g = Math.round(heatMapBaseColor[1] + (heatMapDeepColor[1] - heatMapBaseColor[1]) * value);
              const b = Math.round(heatMapBaseColor[2] + (heatMapDeepColor[2] - heatMapBaseColor[2]) * value);
              return `rgb(${r}, ${g}, ${b})`;
            }}
            theme={{
              textColor: '#666666',
              fontSize: 12,
              grid: {
                line: {
                  stroke: 'rgba(190, 175, 155, 0.2)',
                }
              },
              axis: {
                legend: {
                  text: {
                    fontSize: 12,
                    fill: '#453C33',
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                  }
                },
                ticks: {
                  text: {
                    fontSize: 11,
                    fill: '#666666',
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                  }
                }
              },
              legends: {
                text: {
                  fontSize: 11,
                  fill: '#666666',
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                }
              }
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: viewMode === 'day' ? -45 : 0,
              legend: viewMode === 'day' ? 'Hour of Day' : 'Day of Week',
              legendPosition: 'middle',
              legendOffset: 40
            }}
            axisLeft={null}
            cellOpacity={1}
            cellBorderWidth={1}
            cellBorderColor="rgba(255, 255, 255, 0.8)"
            labelTextColor={cell =>
              cell.data.isPeak
                ? '#453C33'
                : '#666666'
            }
            animate={true}
            hoverTarget="cell"
            cellHoverOpacity={0.9}
            cellHoverOthersOpacity={0.2}
            tooltip={({ cell }) => (
              <Box sx={{
                bgcolor: 'white',
                p: 1.5,
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid rgba(190, 175, 155, 0.3)'
              }}>
                <Typography 
                  variant="subtitle2"
                  sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", color: '#453C33', fontWeight: 600 }}
                >
                  {viewMode === 'day' ? 'Hour' : 'Day'}: {cell.data.x}
                </Typography>
                <Typography sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", color: '#666666' }}>
                  Appointments: {cell.data.y}
                  {cell.data.isPeak && (
                    <Whatshot sx={{ color: '#BEAF9B', ml: 1, verticalAlign: 'middle' }} fontSize="small" />
                  )}
                </Typography>
                <Typography sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", color: '#666666' }}>
                  Revenue: Rs.{cell.data.revenue.toFixed(2)}
                </Typography>
                {cell.data.isPeak && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#BEAF9B', 
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      fontWeight: 600,
                      display: 'block',
                      mt: 0.5
                    }}
                  >
                    Peak Time
                  </Typography>
                )}
              </Box>
            )}
          />
        </Paper>
      )}
    </Card>
  );
};

export default TimeHeatmap;