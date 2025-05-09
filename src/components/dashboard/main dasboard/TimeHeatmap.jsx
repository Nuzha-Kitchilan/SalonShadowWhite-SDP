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
  Stack
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

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">
          Time Performance Heatmap
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
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
        <Box mb={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Whatshot sx={{ color: '#D88C64' }} />
            <Typography variant="subtitle1" sx={{ color: '#D88C64' }}>
              Peak {viewMode === 'day' ? 'Hours' : 'Days'}:
            </Typography>
            {peakData.peakTimes.map((peak, i) => (
              <Chip
                key={i}
                label={viewMode === 'day'
                  ? `${peak.time_slot}:00 - ${peak.time_slot + 1}:00`
                  : peak.time_label}
                sx={{ borderColor: '#D88C64', color: '#D88C64' }}
                variant="outlined"
                size="small"
              />
            ))}
            <Typography variant="body2" sx={{ ml: 2 }}>
              {peakData.maxAppointments} appointments • 
              Avg Revenue: ${peakData.averageRevenue.toFixed(2)}
            </Typography>
          </Stack>
        </Box>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <Box sx={{ height: 400 }}>
          <ResponsiveHeatMap
            data={heatmapData}
            margin={{ top: 60, right: 30, bottom: 60, left: 30 }}
            colors={cell => {
              if (cell.data.isPeak) {
                return '#D88C64'; // Warm terracotta for peak
              }

              const max = Math.max(...heatmapData[0].data.map(d => d.y));
              const value = cell.value / (max || 1);
              const baseColor = [255, 224, 200]; // light peach
              const deeperColor = [216, 140, 100]; // warm peach/brown
              const r = Math.round(baseColor[0] + (deeperColor[0] - baseColor[0]) * value);
              const g = Math.round(baseColor[1] + (deeperColor[1] - baseColor[1]) * value);
              const b = Math.round(baseColor[2] + (deeperColor[2] - baseColor[2]) * value);
              return `rgb(${r}, ${g}, ${b})`;
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
            cellBorderColor={theme.palette.background.paper}
            labelTextColor={cell =>
              cell.data.isPeak
                ? '#fff'
                : theme.palette.text.primary
            }
            animate={true}
            hoverTarget="cell"
            cellHoverOpacity={0.9}
            cellHoverOthersOpacity={0.2}
            tooltip={({ cell }) => (
              <Box sx={{
                bgcolor: 'background.paper',
                p: 1,
                borderRadius: 1,
                boxShadow: 2
              }}>
                <Typography variant="subtitle2">
                  {viewMode === 'day' ? 'Hour' : 'Day'}: {cell.data.x}
                </Typography>
                <Typography>
                  Appointments: {cell.data.y}
                  {cell.data.isPeak && (
                    <Whatshot sx={{ color: '#D88C64', ml: 1, verticalAlign: 'middle' }} />
                  )}
                </Typography>
                <Typography>
                  Revenue: ${cell.data.revenue.toFixed(2)}
                </Typography>
                {cell.data.isPeak && (
                  <Typography variant="caption" sx={{ color: '#D88C64' }}>
                    Peak Time
                  </Typography>
                )}
              </Box>
            )}
          />
        </Box>
      )}
    </Paper>
  );
};

export default TimeHeatmap;
