import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CartModal from "./CartModal";
import axios from "axios";

const TimeSelectionModal = forwardRef(
  ({ services, customerId, selectedStylist, onBack, onClose }, ref) => {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [showCart, setShowCart] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [availableDates, setAvailableDates] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);
    const [monthLoading, setMonthLoading] = useState(false);
    const [error, setError] = useState(null);

   
    const normalizedServices = useCallback(() => {
      if (!services) return [];
      if (Array.isArray(services)) return services;
      return [services];
    }, [services]);

    // Calculate the total service duration from all services
    const getTotalServiceDuration = useCallback(() => {
      const servicesList = normalizedServices();
      if (servicesList.length === 0) return 60;
      
      // Extract time duration
      return servicesList.reduce((total, service) => {
        const duration = service.time_duration || 
                         service.duration || 
                         (typeof service.duration === 'string' ? parseInt(service.duration, 10) : 0);
        
        return total + (isNaN(duration) ? 60 : duration); 
      }, 0);
    }, [normalizedServices]);

    // Get today's date string
    const getTodayDateString = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formatTimeToHHMM = (timeString) => {
      if (/^\d{2}:\d{2}$/.test(timeString)) {
        return timeString;
      }
      
      const time = new Date(`2000-01-01 ${timeString}`);
      if (isNaN(time.getTime())) {
        return "00:00";
      }
      return time.toTimeString().substring(0, 5);
    };

    const formatTimeForDisplay = (timeString) => {
      try {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      } catch (err) {
        return timeString;
      }
    };

    // Reset the component state
    useImperativeHandle(ref, () => ({
      reset: () => {
        setSelectedDate("");
        setSelectedTime("");
        setShowCart(false);
        setTimeSlots([]);
        setAvailableDates([]);
        setCurrentMonth(new Date());
        setError(null);
      },
    }));

    // Fetch available dates for the current month
    const fetchAvailableDatesForMonth = useCallback(async (month) => {
      setMonthLoading(true);
      try {
        const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
        const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        
        const response = await axios.post(
          "http://localhost:5001/api/booking/available-dates",
          {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            stylistId: selectedStylist?.stylist_ID || null,
            serviceDuration: getTotalServiceDuration(),
          }
        );
        
        return response.data.availableDates || [];
      } catch (err) {
        return [];
      } finally {
        setMonthLoading(false);
      }
    }, [getTotalServiceDuration, selectedStylist]);

    // Fetch time slots for a specific date
    const fetchTimeSlots = useCallback(async (date) => {
      if (!date) return [];
      
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:5001/api/booking/available-timeslots",
          {
            date: date,
            stylistId: selectedStylist?.stylist_ID || null,
            serviceDuration: getTotalServiceDuration(),
          }
        );

        const formattedSlots = response.data.availableSlots?.map(slot => 
          formatTimeToHHMM(slot)
        );
        return formattedSlots || [];
      } catch (err) {
        return [];
      } finally {
        setLoading(false);
      }
    }, [getTotalServiceDuration, selectedStylist]);

    // Build calendar days
    const buildCalendarDays = useCallback(async (month, availableDays) => {
      const year = month.getFullYear();
      const monthIndex = month.getMonth();
      
      const firstDay = new Date(year, monthIndex, 1).getDay();
      
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      
      const days = [];
      
      // Fill with empty spaces for days before the start of month
      for (let i = 0; i < firstDay; i++) {
        days.push({ day: null, date: null });
      }
      
      // Add each day of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isAvailable = availableDays.includes(dateString);
        const isToday = dateString === getTodayDateString();
        const isPast = new Date(dateString) < new Date(getTodayDateString());
        
        days.push({
          day,
          date: dateString,
          isAvailable,
          isToday,
          isPast
        });
      }
      
      return days;
    }, []);

    // Handle month navigation
    const navigateMonth = async (direction) => {
      const newMonth = new Date(currentMonth);
      newMonth.setMonth(newMonth.getMonth() + direction);
      setCurrentMonth(newMonth);
    };

    // Select a date and fetch available time slots
    const handleDateSelect = async (dateString) => {
      if (!dateString) return;
      
      setSelectedDate(dateString);
      setSelectedTime(""); 
      
      const slots = await fetchTimeSlots(dateString);
      setTimeSlots(slots);
      
      // Auto-select first time slot if available
      if (slots.length > 0) {
        setSelectedTime(slots[0]);
      }
    };

    // Initialize calendar and fetch data
    useEffect(() => {
      const initializeCalendar = async () => {
        const today = getTodayDateString();
        const availableDays = await fetchAvailableDatesForMonth(currentMonth);
        setAvailableDates(availableDays);
        
        const days = await buildCalendarDays(currentMonth, availableDays);
        setCalendarDays(days);
        
        if (availableDays.length > 0) {
          const sortedDates = [...availableDays].sort();
          
          const today = getTodayDateString();
          const firstAvailableDate = sortedDates.find(date => date >= today);
          
          if (firstAvailableDate) {
            handleDateSelect(firstAvailableDate);
          } else {
            handleDateSelect(sortedDates[0]);
          }
        } else {
          setSelectedDate("");
          setTimeSlots([]);
        }
      };
      
      initializeCalendar();
    }, [currentMonth, fetchAvailableDatesForMonth, buildCalendarDays]);

    useEffect(() => {
      const servicesList = normalizedServices();
      if (servicesList.length === 0) {
        setError("No services available for booking");
      } else {
        setError(null);
      }
    }, [normalizedServices]);

    // Handle confirming the appointment
    const handleContinue = async () => {
      if (!selectedTime || !selectedDate) {
        setError("Please select both date and time.");
        return;
      }

      const formattedTime = selectedTime.split(':').slice(0, 2).join(':');
      const formattedDate = selectedDate;
      
      // Add all services to cart
      try {
        const servicesToAdd = normalizedServices();
        
        if (servicesToAdd.length === 0) {
          setError("No services available to add to cart");
          return;
        }
        
        for (const service of servicesToAdd) {
          const cartData = {
            customer_id: customerId,
            service_id: service.service_id,
            stylist_id: selectedStylist?.stylist_ID || service.selectedStylist?.stylist_ID || null,
            selected_date: formattedDate,
            selected_time: formattedTime,
            price: service.price,
          };
          
          // Validate required fields
          if (!cartData.customer_id || !cartData.service_id || !cartData.selected_date || !cartData.selected_time) {
            setError(`Missing required fields for ${service.service_name || 'this service'}`);
            throw new Error('Missing required fields for cart item');
          }

          const response = await axios.post(
            "http://localhost:5001/api/cart/add",
            cartData
          );
        }
        
        setShowCart(true);
      } catch (error) {
        if (error.response) {
          setError(`Server error: ${error.response.data.message || 'Failed to add to cart'}`);
        } else {
          setError("Failed to add to cart. Please try again.");
        }
      }
    };

    const getMonthYear = () => {
      return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    if (showCart) {
      const servicesToPass = normalizedServices();
      
      return (
        <CartModal
          services={servicesToPass}
          customerId={customerId}
          selectedStylist={selectedStylist}
          selectedTime={selectedTime}
          selectedDate={selectedDate}
          onBack={() => setShowCart(false)}
          onClose={onClose}
        />
      );
    }

    return (
      <Box sx={{ 
        width: "100%", 
        height: "100vh",
        display: "flex", 
        flexDirection: "column",
        bgcolor: "#f9f5f0",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Header */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          p: 2,
          borderBottom: "1px solid #e0e0e0",
          background: "linear-gradient(to right, #f9f5f0, #ffffff)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          flexShrink: 0,
        }}>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center",
            gap: 1
          }}>
            <IconButton
              sx={{
                color: "#BEAF9B",
                "&:hover": {
                  backgroundColor: "rgba(190, 175, 155, 0.1)",
                  transform: "scale(1.05)",
                  transition: "all 0.2s",
                },
              }}
              onClick={onBack}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 500,
                color: "#453C33",
                letterSpacing: "0.3px",
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              }}
            >
              SELECT DATE & TIME
            </Typography>
          </Box>
        </Box>

        {/* Error Message */}
        {error && (
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: "rgba(211, 47, 47, 0.1)",
              borderBottom: "1px dashed rgba(211, 47, 47, 0.3)",
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: "#d32f2f", 
                fontWeight: 500,
                textAlign: "center",
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              }}
            >
              {error}
            </Typography>
          </Box>
        )}

        {/* Message */}
        <Box 
          sx={{ 
            p: 2, 
            backgroundColor: "rgba(190, 175, 155, 0.1)",
            borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
            flexShrink: 0,
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#666", 
              fontStyle: "italic",
              textAlign: "center",
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            }}
          >
            Please select your preferred date and time for this appointment
          </Typography>
        </Box>

        {/* Debug Info (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <Box 
            sx={{
              p: 1,
              bgcolor: "rgba(0, 0, 0, 0.03)",
              borderBottom: "1px dashed rgba(0, 0, 0, 0.1)",
              fontSize: "10px",
              color: "#666"
            }}
          >
            <Typography variant="caption" component="div">Services count: {normalizedServices().length}</Typography>
            <Typography variant="caption" component="div">First service: {normalizedServices()[0]?.service_name || 'None'}</Typography>
            <Typography variant="caption" component="div">Total duration: {getTotalServiceDuration()} minutes</Typography>
          </Box>
        )}

        {/* Main Content - Split Layout */}
        <Box sx={{ 
          display: "flex", 
          flexGrow: 1, 
          overflow: "hidden",
        }}>
          {/* Left Side - Calendar */}
          <Box sx={{ 
            width: "50%", 
            p: 3, 
            borderRight: "1px solid rgba(0, 0, 0, 0.08)",
            overflowY: "auto",
          }}>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              mb: 2,
              justifyContent: "space-between"
            }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarMonthIcon sx={{ color: "#BEAF9B", mr: 1 }} />
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: "#453C33",
                    fontWeight: 500,
                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                  }}
                >
                  SELECT DATE
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={() => navigateMonth(-1)}>
                  <ArrowBackIosIcon sx={{ fontSize: 16, color: "#BEAF9B" }} />
                </IconButton>
                <Typography sx={{ mx: 1, fontWeight: 500, minWidth: "120px", textAlign: "center" }}>
                  {getMonthYear()}
                </Typography>
                <IconButton onClick={() => navigateMonth(1)}>
                  <ArrowForwardIosIcon sx={{ fontSize: 16, color: "#BEAF9B" }} />
                </IconButton>
              </Box>
            </Box>

            {/* Calendar Grid */}
            <Box sx={{ mb: 3 }}>
              {/* Days of week */}
              <Grid container spacing={1} sx={{ mb: 1 }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <Grid item xs={12/7} key={index}>
                    <Typography 
                      align="center" 
                      sx={{ 
                        fontWeight: 500, 
                        fontSize: "0.85rem",
                        color: "#666"
                      }}
                    >
                      {day}
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              {/* Calendar days */}
              {monthLoading ? (
                <Box display="flex" justifyContent="center" my={3}>
                  <CircularProgress sx={{ color: "#BEAF9B" }} />
                </Box>
              ) : (
                <Grid container spacing={1}>
                  {calendarDays.map((dayObj, index) => (
                    <Grid item xs={12/7} key={index}>
                      {dayObj.day ? (
                        <Paper
                          elevation={0}
                          onClick={() => dayObj.isAvailable && !dayObj.isPast ? handleDateSelect(dayObj.date) : null}
                          sx={{
                            p: 1,
                            textAlign: "center",
                            cursor: dayObj.isAvailable && !dayObj.isPast ? "pointer" : "default",
                            borderRadius: "8px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: selectedDate === dayObj.date ? 
                              "2px solid #BEAF9B" : 
                              "1px solid rgba(190, 175, 155, 0.3)",
                            bgcolor: (() => {
                              if (selectedDate === dayObj.date) return "rgba(190, 175, 155, 0.1)";
                              if (dayObj.isToday) return "rgba(25, 118, 210, 0.1)";
                              if (dayObj.isPast) return "rgba(0, 0, 0, 0.05)";
                              if (!dayObj.isAvailable) return "#fff";
                              return "rgba(190, 175, 155, 0.05)";
                            })(),
                            opacity: dayObj.isPast || !dayObj.isAvailable ? 0.5 : 1,
                            position: "relative",
                            transition: "all 0.2s ease",
                            "&:hover": dayObj.isAvailable && !dayObj.isPast ? {
                              bgcolor: "rgba(190, 175, 155, 0.1)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                            } : {},
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: selectedDate === dayObj.date ? 600 : 400,
                              color: dayObj.isToday ? "#1976d2" : "#453C33",
                            }}
                          >
                            {dayObj.day}
                          </Typography>
                          {dayObj.isAvailable && !dayObj.isPast && (
                            <Box 
                              sx={{ 
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                bgcolor: "#BEAF9B",
                                position: "absolute",
                                bottom: "4px",
                              }}
                            />
                          )}
                        </Paper>
                      ) : (
                        <Box sx={{ height: "40px" }} />
                      )}
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Box>

          {/* Right Side - Time Slots  */}
          <Box sx={{ 
            width: "50%", 
            display: "flex", 
            flexDirection: "column",
            overflow: "hidden",
          }}>
            {/* Time slot header */}
            <Box sx={{ 
              p: 3, 
              pb: 0,
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            }}>
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                mb: 2,
              }}>
                <AccessTimeIcon sx={{ color: "#BEAF9B", mr: 1 }} />
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: "#453C33",
                    fontWeight: 500,
                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                  }}
                >
                  SELECT TIME
                </Typography>
              </Box>
            </Box>

            {/* Time slot list */}
            <Box sx={{ 
              flexGrow: 1,
              overflowY: "auto",
              p: 3,
            }}>
              {loading ? (
                <Box display="flex" justifyContent="center" mt={3}>
                  <CircularProgress sx={{ color: "#BEAF9B" }} />
                </Box>
              ) : timeSlots.length === 0 ? (
                <Box 
                  sx={{ 
                    mt: 3, 
                    textAlign: "center",
                    p: 3,
                    bgcolor: "rgba(190, 175, 155, 0.05)",
                    borderRadius: "8px",
                    border: "1px dashed rgba(190, 175, 155, 0.3)"
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: "#666",
                      fontFamily: "'Poppins', 'Roboto', sans-serif" 
                    }}
                  >
                    No available time slots for this date.
                    {!selectedDate && " Please select a date first."}
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {timeSlots.map((time, index) => (
                    <Grid item xs={4} key={index}>
                      <Paper
                        elevation={0}
                        onClick={() => setSelectedTime(time)}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          cursor: "pointer",
                          borderRadius: "8px",
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: selectedTime === time ? 
                            "2px solid #BEAF9B" : 
                            "1px solid rgba(190, 175, 155, 0.3)",
                          bgcolor: selectedTime === time ? 
                            "rgba(190, 175, 155, 0.1)" : 
                            "#fff",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "rgba(190, 175, 155, 0.1)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                          },
                        }}
                      >
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: selectedTime === time ? 600 : 400,
                            color: "#453C33",
                            fontFamily: "'Poppins', 'Roboto', sans-serif"
                          }}
                        >
                          {formatTimeForDisplay(time)}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Box>
        </Box>

        {/* Sticky Selected options summary */}
        {(selectedDate || selectedTime) && (
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: "rgba(190, 175, 155, 0.05)",
              borderTop: "1px dashed rgba(190, 175, 155, 0.3)",
              borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              position: "sticky",
              bottom: 64, // Position above the button
              left: 0,
              right: 0,
              zIndex: 2,
              backdropFilter: "blur(5px)",
            }}
          >
            {selectedDate && (
              <Chip 
                label={`Date: ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`} 
                sx={{ 
                  bgcolor: "#BEAF9B", 
                  color: "white",
                  fontFamily: "'Poppins', 'Roboto', sans-serif" 
                }} 
              />
            )}
            {selectedTime && (
              <Chip 
                label={`Time: ${formatTimeForDisplay(selectedTime)}`} 
                sx={{ 
                  bgcolor: "#BEAF9B", 
                  color: "white",
                  fontFamily: "'Poppins', 'Roboto', sans-serif" 
                }} 
              />
            )}
          </Box>
        )}

        {/* Sticky Footer Button */}
        <Box
          sx={{
            p: 2, 
            bgcolor: "#fff",
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            boxShadow: "0 -2px 8px rgba(0,0,0,0.08)"
          }}
        >
          <Button
            variant="contained"
            disabled={!selectedTime || !selectedDate || normalizedServices().length === 0}
            sx={{
              background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
              color: '#fff',
              py: 1.5,
              px: 4,
              borderRadius: "8px",
              width: "100%",
              maxWidth: "500px",
              fontWeight: 500,
              letterSpacing: "0.5px",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              textTransform: "none",
              fontSize: "1rem",
              boxShadow: "0 4px 8px rgba(190, 175, 155, 0.3)",
              transition: "all 0.3s ease",
              '&:hover': { 
                background: "linear-gradient(to right, #b0a08d, #cec2b3)",
                boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
                transform: "translateY(-2px)"
              },
              '&.Mui-disabled': {
                background: "#e0e0e0",
                color: "#a0a0a0"
              }
            }}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </Box>
      </Box>
    );
  }
);

export default TimeSelectionModal;




























