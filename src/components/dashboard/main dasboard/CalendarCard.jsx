import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import axios from 'axios';

const CalendarView = () => {
  const [calendarData, setCalendarData] = useState({ 
    days: [], 
    startDay: 1, 
    endDay: 10,
    hasNext: false,
    hasPrev: false,
    totalDays: 0
  });
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear] = useState(new Date().getFullYear());
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchCalendarData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching calendar with offset: ${offset}`);
        const res = await axios.get(
          `http://localhost:5001/api/dashboard/appointments/calendar/${currentYear}/${currentMonth}`,
          { params: { offset } }
        );
        console.log("Calendar data received:", res.data);
        setCalendarData(res.data);
        setSelectedDay(null);
      } catch (err) {
        console.error('Failed to fetch calendar data:', err);
        setError('Failed to load calendar data. Please try again.');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendarData();
  }, [currentYear, currentMonth, offset]);

  const getColor = (count) => {
    if (count === 0) return '#f5f5f5';
    if (count <= 2) return 'rgba(63, 81, 181, 0.2)';
    if (count <= 5) return 'rgba(63, 81, 181, 0.4)';
    if (count <= 8) return 'rgba(63, 81, 181, 0.6)';
    return 'rgba(63, 81, 181, 0.8)';
  };

  const getMonthName = (month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
  };

  const daysHeader = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleNext = () => {
    if (calendarData.hasNext) {
      console.log("Moving to next page");
      setOffset(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (calendarData.hasPrev) {
      console.log("Moving to previous page");
      setOffset(prev => prev - 1);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Get appointments for the selected day
  const getSelectedDayAppointments = () => {
    if (!selectedDay) return [];
    const selectedDayData = calendarData.days.find(d => d.day === selectedDay);
    return selectedDayData?.appointments || [];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Store appointments in a variable before rendering
  const selectedDayAppointments = getSelectedDayAppointments();

  return (
    <>
      <Card sx={{ minWidth: 320, m: 2, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Appointments Calendar
            </Typography>
            <Box>
              <IconButton 
                onClick={handlePrev} 
                disabled={!calendarData.hasPrev}
                sx={{ color: calendarData.hasPrev ? 'primary.main' : 'grey.400' }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton 
                onClick={handleNext} 
                disabled={!calendarData.hasNext}
                sx={{ color: calendarData.hasNext ? 'primary.main' : 'grey.400' }}
              >
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>
          
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {getMonthName(currentMonth)} {currentYear} (Days {calendarData.startDay}-{calendarData.endDay} of {calendarData.totalDays})
          </Typography>

          {/* Calendar Header */}
          <Grid container spacing={1} sx={{ mb: 1 }}>
            {daysHeader.map((day, i) => (
              <Grid item xs={1.7} key={i}>
                <Typography variant="caption" align="center" display="block">
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Calendar Days */}
          <Grid container spacing={1}>
            {calendarData.days.map((dayData, i) => {
              const day = dayData.day;
              const count = dayData.count || 0;
              const isSelected = selectedDay === day;

              return (
                <Grid item xs={1.7} key={i}>
                  <Box
                    onClick={() => setSelectedDay(day)}
                    sx={{
                      height: 30,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      bgcolor: getColor(count),
                      color: count > 5 ? '#fff' : 'text.primary',
                      border: isSelected ? '2px solid #1976d2' : 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                  >
                    <Typography variant="body2">{day}</Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          {/* Appointments List */}
          <Box sx={{ mt: 2 }}>
            {selectedDay ? (
              <>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Appointments for {selectedDay} {getMonthName(currentMonth)}
                </Typography>
                {selectedDayAppointments.length > 0 ? (
                  selectedDayAppointments.map((appt, i) => (
                    <Box key={i} sx={{ mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {appt.name}
                      </Typography>
                      <Box sx={{ ml: 2, mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Time: {appt.startTime} - {appt.endTime}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Services: {appt.services || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Stylists: {appt.stylists || "N/A"}
                        </Typography>
                      </Box>
                      {i < selectedDayAppointments.length - 1 && (
                        <Divider sx={{ my: 1 }} />
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    No appointments scheduled for this day
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Select a day to view appointments
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CalendarView;