import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  CircularProgress,
  InputAdornment,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {
  Save as SaveIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Spa as SpaIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Notes as NotesIcon
} from "@mui/icons-material";
import axios from 'axios';
import moment from 'moment';

const BridalAptEditForm = ({ appointmentId, customers, services, stylists, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    appointment_date: moment(),
    appointment_time: '10:00',
    services: '',
    stylists: '',
    appointment_status: 'Scheduled',
    payment_status: 'Pending',
    payment_amount: 0,
    payment_type: 'Bridal Package',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (appointmentId && appointmentId !== 'new') {
      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/admin/appointments/bridal/${appointmentId}`);
      const appointmentData = response.data.data || response.data;
      
      console.log('Fetched appointment data:', appointmentData);
      
      // Format data for form
      setAppointment({
        ...appointmentData,
        appointment_date: moment(appointmentData.appointment_date),
        appointment_time: appointmentData.appointment_time ? 
          appointmentData.appointment_time.substring(0, 5) : // Format "03:00:00" to "03:00"
          '10:00',
        stylists: appointmentData.stylists || '',
        payment_amount: parseFloat(appointmentData.payment_amount) || 0,
        payment_type: 'Bridal Package' // Always set to Bridal Package
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch appointment details', error);
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!appointment.customer_name) {
      newErrors.customer_name = 'Customer name is required';
    }
    
    if (!appointment.appointment_date) {
      newErrors.appointment_date = 'Date is required';
    }
    
    if (!appointment.appointment_time) {
      newErrors.appointment_time = 'Time is required';
    }
    
    if (!appointment.services) {
      newErrors.services = 'Services are required';
    }
    
    if (!appointment.stylists) {
      newErrors.stylists = 'At least one stylist is required';
    }
    
    if (isNaN(appointment.payment_amount) || appointment.payment_amount < 0) {
      newErrors.payment_amount = 'Payment amount must be a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setAppointment(prev => ({
      ...prev,
      appointment_date: date
    }));
  };

  const handleTimeChange = (time) => {
    setAppointment(prev => ({
      ...prev,
      appointment_time: time ? time.format('HH:mm') : ''
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Format data for submission
      const formattedData = {
        ...appointment,
        appointment_date: appointment.appointment_date.format('YYYY-MM-DD'),
        payment_type: 'Bridal Package' // Ensure it's always sent as Bridal Package
      };
      
      // Call the parent component's submit handler
      await onSubmit(formattedData, appointmentId);
      
      setLoading(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setLoading(false);
    }
  };

  // Helper function to get status chip color
  const getStatusChipColor = (status) => {
    switch(status.toLowerCase()) {
      case 'scheduled': return '#ff9800';
      case 'completed': return '#4caf50';
      case 'cancelled': return '#f44336';
      case 'no-show': return '#9c27b0';
      default: return '#BEAF9B';
    }
  };

  // Helper function to get payment status chip color
  const getPaymentStatusChipColor = (status) => {
    switch(status.toLowerCase()) {
      case 'paid': return '#4caf50';
      case 'partially paid': return '#2196f3';
      case 'unpaid': return '#f44336';
      case 'pending': return '#ff9800';
      default: return '#BEAF9B';
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Form title */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            color: "#453C33",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            mb: 1
          }}
        >
          {appointmentId === 'new' ? 'Create New Bridal Appointment' : 'Edit Bridal Appointment'}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: "text.secondary",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}
        >
          {appointmentId === 'new' 
            ? 'Fill in the details to create a new bridal appointment' 
            : 'Update the bridal appointment details below'}
        </Typography>
      </Box>

      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          {/* Customer Information Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2.5, 
              borderRadius: "8px",
              border: "1px solid rgba(190, 175, 155, 0.3)",
              background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
            }}
          >
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                }}
              >
                Customer Details
              </Typography>
            </Box>
            
            <FormControl fullWidth margin="normal" required>
              <TextField
                label="Customer Name"
                name="customer_name"
                value={appointment.customer_name}
                onChange={handleChange}
                error={!!errors.customer_name}
                helperText={errors.customer_name}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#BEAF9B" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#BEAF9B',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BEAF9B',
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                label="Customer Phone"
                name="customer_phone"
                value={appointment.customer_phone || ''}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: "#BEAF9B" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#BEAF9B',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BEAF9B',
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                label="Customer Email"
                name="customer_email"
                value={appointment.customer_email || ''}
                onChange={handleChange}
                type="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#BEAF9B" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#BEAF9B',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BEAF9B',
                  },
                }}
              />
            </FormControl>
          </Paper>

          {/* Appointment Date & Time */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2.5, 
              borderRadius: "8px",
              border: "1px solid rgba(190, 175, 155, 0.3)",
              background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
            }}
          >
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CalendarIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                }}
              >
                Appointment Schedule
              </Typography>
            </Box>

            <FormControl fullWidth margin="normal" required>
              <DatePicker
                label="Appointment Date"
                value={appointment.appointment_date}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.appointment_date}
                    helperText={errors.appointment_date}
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon sx={{ color: "#BEAF9B" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(190, 175, 155, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(190, 175, 155, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#BEAF9B',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#BEAF9B',
                      },
                    }}
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <TimePicker
                label="Appointment Time"
                value={moment(appointment.appointment_time, 'HH:mm')}
                onChange={handleTimeChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.appointment_time}
                    helperText={errors.appointment_time}
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon sx={{ color: "#BEAF9B" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(190, 175, 155, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(190, 175, 155, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#BEAF9B',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#BEAF9B',
                      },
                    }}
                  />
                )}
              />
            </FormControl>
          </Paper>

          {/* Services Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2.5, 
              borderRadius: "8px",
              border: "1px solid rgba(190, 175, 155, 0.3)",
              background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))",
              gridColumn: '1 / -1'
            }}
          >
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <SpaIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                }}
              >
                Services
              </Typography>
            </Box>

            <FormControl fullWidth margin="normal" required>
              <TextField
                label="Bridal Services"
                name="services"
                value={appointment.services}
                onChange={handleChange}
                multiline
                rows={2}
                error={!!errors.services}
                helperText={errors.services || "Enter services separated by commas"}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SpaIcon sx={{ color: "#BEAF9B" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#BEAF9B',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BEAF9B',
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <TextField
                label="Assigned Stylist(s)"
                name="stylists"
                value={appointment.stylists}
                onChange={handleChange}
                error={!!errors.stylists}
                helperText={errors.stylists || "Enter full stylist name(s) - First + Last Name"}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleIcon sx={{ color: "#BEAF9B" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#BEAF9B',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BEAF9B',
                  },
                }}
              />
            </FormControl>
          </Paper>

          {/* Status and Payment section */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2.5, 
              borderRadius: "8px",
              border: "1px solid rgba(190, 175, 155, 0.3)",
              background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))",
              gridColumn: '1 / -1'
            }}
          >
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <PaymentIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                }}
              >
                Status & Payment
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel sx={{ '&.Mui-focused': { color: '#BEAF9B' } }}>
                  Appointment Status
                </InputLabel>
                <Select
                  name="appointment_status"
                  value={appointment.appointment_status}
                  onChange={handleChange}
                  label="Appointment Status"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(190, 175, 155, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(190, 175, 155, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#BEAF9B',
                    },
                  }}
                >
                  {['Scheduled', 'Completed', 'Cancelled', 'No-Show'].map(status => (
                    <MenuItem key={status} value={status}>
                      <Chip 
                        label={status} 
                        size="small" 
                        sx={{ 
                          backgroundColor: getStatusChipColor(status),
                          color: 'white',
                          minWidth: '80px',
                          justifyContent: 'center'
                        }} 
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <TextField
                  label="Payment Amount"
                  name="payment_amount"
                  type="number"
                  value={appointment.payment_amount}
                  onChange={handleChange}
                  error={!!errors.payment_amount}
                  helperText={errors.payment_amount}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(190, 175, 155, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(190, 175, 155, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#BEAF9B',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#BEAF9B',
                    },
                  }}
                />
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ '&.Mui-focused': { color: '#BEAF9B' } }}>
                  Payment Status
                </InputLabel>
                <Select
                  name="payment_status"
                  value={appointment.payment_status}
                  onChange={handleChange}
                  label="Payment Status"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(190, 175, 155, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(190, 175, 155, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#BEAF9B',
                    },
                  }}
                >
                  {['Pending', 'Partially Paid', 'Paid', 'Unpaid'].map(status => (
                    <MenuItem key={status} value={status}>
                      <Chip 
                        label={status} 
                        size="small" 
                        sx={{ 
                          backgroundColor: getPaymentStatusChipColor(status),
                          color: 'white',
                          minWidth: '80px',
                          justifyContent: 'center'
                        }} 
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Payment Type - Fixed as Bridal Package */}
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Payment Type"
                  value="Bridal Package"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SpaIcon sx={{ color: "#BEAF9B" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(190, 175, 155, 0.3)',
                      },
                      backgroundColor: 'rgba(190, 175, 155, 0.05)',
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#453C33',
                    }
                  }}
                />
              </FormControl>
            </Box>
          </Paper>

          {/* Notes Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2.5, 
              borderRadius: "8px",
              border: "1px solid rgba(190, 175, 155, 0.3)",
              background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))",
              gridColumn: '1 / -1'
            }}
          >
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <NotesIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                }}
              >
                Additional Notes
              </Typography>
            </Box>
            
            <FormControl fullWidth margin="normal">
              <TextField
                label="Notes"
                name="notes"
                value={appointment.notes || ''}
                onChange={handleChange}
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                      <NotesIcon sx={{ color: "#BEAF9B" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#BEAF9B',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BEAF9B',
                  },
                }}
              />
            </FormControl>
          </Paper>
        </Box>
      </LocalizationProvider>
      
      {/* Action Buttons */}
      <Box sx={{ 
        padding: "20px 0", 
        borderTop: "1px dashed rgba(190, 175, 155, 0.3)",
        mt: 4,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2
      }}>
        <Button 
          onClick={onCancel}
          sx={{ 
            color: "#453C33", 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            '&:hover': { 
              backgroundColor: "rgba(190, 175, 155, 0.1)" 
            } 
          }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          disabled={loading}
          sx={{ 
            backgroundColor: "#BEAF9B", 
            color: "white", 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            boxShadow: "0 2px 6px rgba(190, 175, 155, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            px: 3,
            '&:hover': { 
              backgroundColor: "#A89583",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 10px rgba(190, 175, 155, 0.4)"
            }
          }}
        >
          {appointmentId === 'new' ? 'Create Appointment' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
};

export default BridalAptEditForm;