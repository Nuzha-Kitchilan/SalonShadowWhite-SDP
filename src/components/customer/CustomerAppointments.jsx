import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  Box,
  Typography,
  Paper,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  CircularProgress, 
  Alert, 
  AlertTitle,
  Pagination
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpaIcon from '@mui/icons-material/Spa';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const CustomerAppointments = ({ customerId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(
          `/customers/admin-customer/${customerId}/appointments?page=${currentPage}&limit=10`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setAppointments(response.data.appointments);
        setTotalPages(response.data.pagination.totalPages);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch appointments');
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [customerId, currentPage]);
  
  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (err) {
      return 'Invalid date';
    }
  };
  
  // Format time slot
  const formatTimeSlot = (timeSlot) => {
    // Check if timeSlot is in a format like "HH:MM:SS" or just a number
    if (typeof timeSlot === 'string' && timeSlot.includes(':')) {
      // Handle time in "HH:MM:SS" format
      const [hours, minutes] = timeSlot.split(':').map(Number);
      
      if (isNaN(hours) || isNaN(minutes)) return 'Invalid time';
      
      const hour12 = hours % 12 || 12;
      const amPm = hours < 12 ? 'AM' : 'PM';
      
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${amPm}`;
    } 
    else if (typeof timeSlot === 'number') {
      // Handle time as minutes from midnight
      const hours = Math.floor(timeSlot / 60);
      const minutes = timeSlot % 60;
      
      const hour12 = hours % 12 || 12;
      const amPm = hours < 12 ? 'AM' : 'PM';
      
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${amPm}`;
    }
    
    return 'Invalid time';
  };
  
  // Get status chip color and style
  const getStatusChipProps = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    const baseStyles = {
      fontFamily: "'Poppins', 'Roboto', sans-serif",
      fontWeight: 500,
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      borderRadius: "12px",
    };
    
    switch (statusLower) {
      case 'completed':
        return {
          color: "success",
          icon: <CheckCircleOutlineIcon fontSize="small" />,
          sx: { 
            ...baseStyles,
            bgcolor: 'rgba(46, 125, 50, 0.9)',
          }
        };
      case 'cancelled':
        return {
          color: "error",
          icon: null,
          sx: { 
            ...baseStyles,
            bgcolor: 'rgba(211, 47, 47, 0.9)',
          }
        };
      case 'no-show':
        return {
          color: "warning",
          icon: null,
          sx: { 
            ...baseStyles,
            bgcolor: 'rgba(237, 108, 2, 0.9)',
          }
        };
      case 'confirmed':
        return {
          color: "primary",
          icon: null,
          sx: { 
            ...baseStyles,
            bgcolor: 'rgba(25, 118, 210, 0.9)',
          }
        };
      case 'pending':
        return {
          color: "info",
          icon: null,
          sx: { 
            ...baseStyles,
            bgcolor: 'rgba(2, 136, 209, 0.9)',
          }
        };
      default:
        return {
          color: "default",
          icon: null,
          sx: baseStyles
        };
    }
  };
  
  // Format price to ensure it's displayed correctly
  const formatPrice = (price) => {
    // Convert to number if it's a string or ensure it's a valid number
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Check if conversion resulted in a valid number
    if (numericPrice && !isNaN(numericPrice)) {
      return numericPrice.toFixed(2);
    }
    
    return '0.00';
  };
  
  // Handle pagination
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <Box 
        sx={{ 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5 
        }}
      >
        <CalendarTodayIcon sx={{ color: "#BEAF9B" }} />
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            color: "#453C33", 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 600,
          }}
        >
          Customer Appointments
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          py: 6,
          backgroundColor: "rgba(190, 175, 155, 0.05)",
          borderRadius: "10px",
        }}>
          <CircularProgress sx={{ color: "#BEAF9B" }} />
        </Box>
      ) : error ? (
        <Alert 
          severity="error"
          sx={{
            borderRadius: "10px",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}
        >
          <AlertTitle sx={{ fontWeight: 600 }}>Error</AlertTitle>
          {error}
        </Alert>
      ) : appointments.length === 0 ? (
        <Alert 
          severity="info"
          sx={{
            borderRadius: "10px",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            backgroundColor: "rgba(190, 175, 155, 0.1)",
            color: "#5D4037",
            border: "1px solid rgba(190, 175, 155, 0.3)",
          }}
        >
          <AlertTitle sx={{ fontWeight: 600 }}>Info</AlertTitle>
          No appointments found for this customer.
        </Alert>
      ) : (
        <>
          <TableContainer 
            component={Paper} 
            elevation={1} 
            sx={{ 
              mb: 3, 
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              overflow: 'hidden',
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="appointments table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(190, 175, 155, 0.05)" }}>
                  <TableCell sx={{ 
                    fontFamily: "'Poppins', 'Roboto', sans-serif", 
                    fontWeight: 600,
                    color: "#5D4037",
                    borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                    py: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                      Date
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    fontFamily: "'Poppins', 'Roboto', sans-serif", 
                    fontWeight: 600,
                    color: "#5D4037",
                    borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                    py: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                      Time
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    fontFamily: "'Poppins', 'Roboto', sans-serif", 
                    fontWeight: 600,
                    color: "#5D4037",
                    borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                    py: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SpaIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                      Service
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    fontFamily: "'Poppins', 'Roboto', sans-serif", 
                    fontWeight: 600,
                    color: "#5D4037",
                    borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                    py: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                      Staff
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    fontFamily: "'Poppins', 'Roboto', sans-serif", 
                    fontWeight: 600,
                    color: "#5D4037",
                    borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                    py: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoneyIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                      Price
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    fontFamily: "'Poppins', 'Roboto', sans-serif", 
                    fontWeight: 600,
                    color: "#5D4037",
                    borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                    py: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HourglassEmptyIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                      Duration
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    fontFamily: "'Poppins', 'Roboto', sans-serif", 
                    fontWeight: 600,
                    color: "#5D4037",
                    borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                    py: 2
                  }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map(appointment => {
                  const statusProps = getStatusChipProps(appointment.status);
                  
                  return (
                    <TableRow 
                      key={appointment.appointment_ID} 
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: "rgba(190, 175, 155, 0.03)",
                        },
                        '&:last-child td': {
                          borderBottom: 0
                        }
                      }}
                    >
                      <TableCell sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        borderBottom: "1px solid rgba(190, 175, 155, 0.1)",
                        py: 2
                      }}>
                        {formatDate(appointment.date)}
                      </TableCell>
                      <TableCell sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        borderBottom: "1px solid rgba(190, 175, 155, 0.1)",
                        py: 2
                      }}>
                        {formatTimeSlot(appointment.time_slot)}
                      </TableCell>
                      <TableCell sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        borderBottom: "1px solid rgba(190, 175, 155, 0.1)",
                        py: 2,
                        fontWeight: 500
                      }}>
                        {appointment.service_name || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        borderBottom: "1px solid rgba(190, 175, 155, 0.1)",
                        py: 2
                      }}>
                        {appointment.stylist_firstname && appointment.stylist_lastname
                          ? `${appointment.stylist_firstname} ${appointment.stylist_lastname}`
                          : 'Unassigned'}
                      </TableCell>
                      <TableCell sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        borderBottom: "1px solid rgba(190, 175, 155, 0.1)",
                        py: 2
                      }}>
                        Rs.{formatPrice(appointment.price)}
                      </TableCell>
                      <TableCell sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        borderBottom: "1px solid rgba(190, 175, 155, 0.1)",
                        py: 2
                      }}>
                        {appointment.time_duration ? `${appointment.time_duration} min` : 'N/A'}
                      </TableCell>
                      <TableCell sx={{ 
                        borderBottom: "1px solid rgba(190, 175, 155, 0.1)",
                        py: 2
                      }}>
                        <Chip 
                          label={appointment.status || 'Unknown'} 
                          color={statusProps.color}
                          size="small"
                          icon={statusProps.icon}
                          sx={statusProps.sx}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange}
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    color: "#5D4037",
                  },
                  '& .MuiPaginationItem-root.Mui-selected': {
                    backgroundColor: "rgba(190, 175, 155, 0.9)",
                    color: "#5D4037",
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: "rgba(190, 175, 155, 0.9)",
                    }
                  },
                  '& .MuiPaginationItem-root:hover': {
                    backgroundColor: "rgba(190, 175, 155, 0.1)",
                  }
                }}
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default CustomerAppointments;