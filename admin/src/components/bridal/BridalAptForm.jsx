import React, { useState, useEffect } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import {
  Box,Button,FormControl,FormHelperText,Grid,InputAdornment,InputLabel,MenuItem, Select,TextField,Typography,Chip,Paper,Snackbar,Alert,
  Autocomplete,Switch,Stack,List,ListItem,ListItemText
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Spa as SpaIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  Notes as NotesIcon
} from '@mui/icons-material';

const BridalAppointmentForm = ({ onSubmit, onCancel, initialData = null, customers = [], services = [], stylists = [] }) => {
  const [appointmentData, setAppointmentData] = useState({
    customer_ID: '',
    appointment_date: null,
    appointment_time: null,
    services: [],
    service_stylist_assignments: [],
    stylists: [],
    custom_price: '',
    notes: '',
    payment_status: 'Pending',
    payment_type: 'Bridal Package'
  });
  
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [useCustomPrice, setUseCustomPrice] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [selectedServiceObjects, setSelectedServiceObjects] = useState([]);
  
  useEffect(() => {
    if (initialData) {
      const initialAppointmentData = {
        customer_ID: initialData.customer_ID || '',
        appointment_date: initialData.appointment_date ? new Date(initialData.appointment_date) : null,
        appointment_time: initialData.appointment_time ? new Date(`2000-01-01T${initialData.appointment_time}`) : null,
        services: initialData.services || [],
        stylists: initialData.stylists || [],
        service_stylist_assignments: initialData.service_stylist_assignments || [],
        custom_price: initialData.custom_price || '',
        notes: initialData.notes || '',
        payment_status: initialData.payment_status || 'Pending',
        payment_type: 'Bridal Package'
      };
      
      setAppointmentData(initialAppointmentData);
      
      if (initialData.custom_price) {
        setUseCustomPrice(true);
      }

      const serviceObjs = services.filter(service => 
        initialAppointmentData.services.includes(service.service_id || service.service_ID || service.id)
      );
      setSelectedServiceObjects(serviceObjs);
    }
  }, [initialData, services]);
  
  useEffect(() => {
    if (appointmentData.services.length > 0) {
      const selectedServices = services.filter(service => 
        appointmentData.services.includes(service.service_id || service.service_ID || service.id)
      );
      
      const total = selectedServices.reduce((sum, service) => {
        const servicePrice = typeof service.price === 'string' 
          ? parseFloat(service.price) 
          : (typeof service.price === 'number' ? service.price : 0);
        return sum + servicePrice;
      }, 0);
      setCalculatedPrice(total);
    } else {
      setCalculatedPrice(0);
    }
  }, [appointmentData.services, services]);

  const handleInputChange = (field) => (event) => {
    setAppointmentData({ ...appointmentData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleDateChange = (date) => {
    setAppointmentData({ ...appointmentData, appointment_date: date });
    if (errors.appointment_date) {
      setErrors({ ...errors, appointment_date: null });
    }
  };

  const handleTimeChange = (time) => {
    setAppointmentData({ ...appointmentData, appointment_time: time });
    if (errors.appointment_time) {
      setErrors({ ...errors, appointment_time: null });
    }
  };

  const handleServicesChange = (event, newValues) => {
    const serviceIds = newValues.map(service => service.service_id || service.service_ID || service.id);
    
    setSelectedServiceObjects(newValues);
    
    const updatedAssignments = appointmentData.service_stylist_assignments.filter(
      assignment => serviceIds.includes(assignment.service_id)
    );
    
    serviceIds.forEach(serviceId => {
      if (!updatedAssignments.some(a => a.service_id === serviceId)) {
        updatedAssignments.push({
          service_id: serviceId,
          stylist_id: ''
        });
      }
    });
    
    setAppointmentData(prev => ({
      ...prev,
      services: serviceIds,
      service_stylist_assignments: updatedAssignments
    }));
    
    if (errors.services) {
      setErrors(prev => ({ ...prev, services: null }));
    }
  };

  const handleStylistAssignment = (serviceId) => (event) => {
    const stylistId = event.target.value;
    
    const updatedAssignments = appointmentData.service_stylist_assignments.map(assignment => {
      if (assignment.service_id === serviceId) {
        return { ...assignment, stylist_id: stylistId };
      }
      return assignment;
    });
    
    const stylistsSet = new Set();
    updatedAssignments.forEach(assignment => {
      if (assignment.stylist_id) {
        stylistsSet.add(assignment.stylist_id);
      }
    });
    
    setAppointmentData(prev => ({
      ...prev,
      service_stylist_assignments: updatedAssignments,
      stylists: Array.from(stylistsSet)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!appointmentData.customer_ID) {
      newErrors.customer_ID = 'Customer is required';
    }
    
    if (!appointmentData.appointment_date) {
      newErrors.appointment_date = 'Appointment date is required';
    }
    
    if (!appointmentData.appointment_time) {
      newErrors.appointment_time = 'Appointment time is required';
    }
    
    if (!appointmentData.services || appointmentData.services.length === 0) {
      newErrors.services = 'At least one service must be selected';
    }
    
    const hasAssignedStylist = appointmentData.service_stylist_assignments.some(
      assignment => assignment.stylist_id && assignment.stylist_id !== ''
    );
    
    if (!hasAssignedStylist) {
      newErrors.service_stylist_assignments = 'At least one stylist must be assigned to a service';
    }
    
    if (useCustomPrice && (!appointmentData.custom_price || isNaN(appointmentData.custom_price))) {
      newErrors.custom_price = 'Please enter a valid price';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      const stylistsSet = new Set();
      appointmentData.service_stylist_assignments.forEach(assignment => {
        if (assignment.stylist_id) {
          stylistsSet.add(assignment.stylist_id);
        }
      });
      
      const formattedData = {
        ...appointmentData,
        appointment_date: appointmentData.appointment_date ? 
          appointmentData.appointment_date.toISOString().split('T')[0] : null,
        appointment_time: appointmentData.appointment_time ? 
          appointmentData.appointment_time.toTimeString().split(' ')[0].substring(0, 5) : null,
        custom_price: useCustomPrice ? parseFloat(appointmentData.custom_price) : null,
        stylists: Array.from(stylistsSet),
        payment_type: 'Bridal Package'
      };
      
      try {
        onSubmit(formattedData);
        setSnackbarMessage('Appointment saved successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarMessage('Error saving appointment: ' + error.message);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } else {
      setSnackbarMessage('Please correct the errors in the form');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const getServiceName = (service) => {
    return service.service_name || service.name || service.serviceName || `Service ID: ${service.service_id || service.service_ID || service.id}`;
  };

  const getStylistName = (stylist) => {
    const firstName = stylist.firstname || stylist.first_name || stylist.firstName || '';
    const lastName = stylist.lastname || stylist.last_name || stylist.lastName || '';
    return `${firstName} ${lastName}`.trim();
  };

  const getServiceId = (service) => {
    return service.service_id || service.service_ID || service.id;
  };

  const getStylistId = (stylist) => {
    return stylist.stylist_ID || stylist.id;
  };

  const getAssignedStylistForService = (serviceId) => {
    const assignment = appointmentData.service_stylist_assignments.find(
      a => a.service_id === serviceId
    );
    return assignment ? assignment.stylist_id : '';
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            {initialData ? 'Edit Bridal Appointment' : 'Create New Bridal Appointment'}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: "text.secondary",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            {initialData 
              ? 'Update the bridal appointment details below' 
              : 'Fill in the details to create a new bridal appointment'}
          </Typography>
        </Box>

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
            
            <FormControl fullWidth margin="normal" required error={!!errors.customer_ID}>
              <InputLabel sx={{ '&.Mui-focused': { color: '#BEAF9B' } }}>
                Customer *
              </InputLabel>
              <Select
                value={appointmentData.customer_ID}
                onChange={handleInputChange('customer_ID')}
                label="Customer *"
                startAdornment={
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#BEAF9B" }} />
                  </InputAdornment>
                }
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
                <MenuItem value="">
                  <em>Select a customer</em>
                </MenuItem>
                {customers.map((customer) => (
                  <MenuItem key={customer.customer_ID || customer.id} value={customer.customer_ID || customer.id}>
                    {customer.firstname || customer.first_name || customer.firstName} {customer.lastname || customer.last_name || customer.lastName}
                  </MenuItem>
                ))}
              </Select>
              {errors.customer_ID && (
                <FormHelperText>{errors.customer_ID}</FormHelperText>
              )}
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

            <FormControl fullWidth margin="normal" required error={!!errors.appointment_date}>
              <DatePicker
                label="Appointment Date *"
                value={appointmentData.appointment_date}
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

            <FormControl fullWidth margin="normal" required error={!!errors.appointment_time}>
              <TimePicker
                label="Appointment Time *"
                value={appointmentData.appointment_time}
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

            <FormControl fullWidth margin="normal" required error={!!errors.services}>
              <Autocomplete
                multiple
                id="services-autocomplete"
                options={services}
                value={selectedServiceObjects}
                onChange={handleServicesChange}
                getOptionLabel={(option) => {
                  const price = typeof option.price === 'string' 
                    ? parseFloat(option.price).toFixed(2) 
                    : (typeof option.price === 'number' ? option.price.toFixed(2) : '0.00');
                  return `${getServiceName(option)} (Rs. ${price})`;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Bridal Services *"
                    placeholder="Select services"
                    error={!!errors.services}
                    helperText={errors.services || "Select services for this bridal appointment"}
                    InputProps={{
                      ...params.InputProps,
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
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const price = typeof option.price === 'string' 
                      ? parseFloat(option.price).toFixed(2) 
                      : (typeof option.price === 'number' ? option.price.toFixed(2) : '0.00');
                    return (
                      <Chip
                        variant="outlined"
                        label={`${getServiceName(option)} (Rs. ${price})`}
                        {...getTagProps({ index })}
                        size="small"
                        sx={{
                          borderColor: '#BEAF9B',
                          color: '#453C33',
                          backgroundColor: 'rgba(190, 175, 155, 0.1)'
                        }}
                      />
                    );
                  })
                }
                isOptionEqualToValue={(option, value) => 
                  getServiceId(option) === getServiceId(value)
                }
              />
            </FormControl>
          </Paper>

          {/* Stylist Assignments Section */}
          {selectedServiceObjects.length > 0 && (
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
                <PeopleIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#453C33",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                  }}
                >
                  Stylist Assignments
                </Typography>
              </Box>
              {errors.service_stylist_assignments && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {errors.service_stylist_assignments}
                </Typography>
              )}
              <List>
                {selectedServiceObjects.map((service) => {
                  const serviceId = getServiceId(service);
                  return (
                    <ListItem key={serviceId} divider sx={{ py: 1 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                          <ListItemText 
                            primary={getServiceName(service)}
                            secondary={`Rs. ${typeof service.price === 'string' ? parseFloat(service.price).toFixed(2) : service.price.toFixed(2)}`}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth size="small">
                            <InputLabel 
                              id={`stylist-select-${serviceId}-label`}
                              sx={{ '&.Mui-focused': { color: '#BEAF9B' } }}
                            >
                              Assign Stylist
                            </InputLabel>
                            <Select
                              labelId={`stylist-select-${serviceId}-label`}
                              id={`stylist-select-${serviceId}`}
                              value={getAssignedStylistForService(serviceId)}
                              onChange={handleStylistAssignment(serviceId)}
                              label="Assign Stylist"
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
                              <MenuItem value="">
                                <em>No specific stylist</em>
                              </MenuItem>
                              {stylists.map((stylist) => (
                                <MenuItem key={getStylistId(stylist)} value={getStylistId(stylist)}>
                                  {getStylistName(stylist)}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          )}

          {/* Pricing and Payment Section */}
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
                Pricing & Payment
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              {/* Calculated Price */}
              <TextField
                label="Calculated Price"
                value={`Rs. ${calculatedPrice.toFixed(2)}`}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentIcon sx={{ color: "#BEAF9B" }} />
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

              {/* Custom Price Toggle */}
              <Stack direction="row" spacing={2} alignItems="center" sx={{ gridColumn: 'span 2' }}>
                <Typography variant="body2">Use custom price for bridal package</Typography>
                <Switch
                  checked={useCustomPrice}
                  onChange={(e) => setUseCustomPrice(e.target.checked)}
                  color="default"
                />
              </Stack>

              {/* Custom Price Input */}
              {useCustomPrice && (
                <TextField
                  label="Custom Price"
                  name="custom_price"
                  value={appointmentData.custom_price}
                  onChange={handleInputChange('custom_price')}
                  error={!!errors.custom_price}
                  helperText={errors.custom_price}
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
              )}

              {/* Payment Type - Fixed as Bridal Package */}
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

              {/* Payment Status */}
              <FormControl fullWidth>
                <InputLabel sx={{ '&.Mui-focused': { color: '#BEAF9B' } }}>
                  Payment Status
                </InputLabel>
                <Select
                  name="payment_status"
                  value={appointmentData.payment_status}
                  onChange={handleInputChange('payment_status')}
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
                value={appointmentData.notes}
                onChange={handleInputChange('notes')}
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
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
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
            {initialData ? 'Save Changes' : 'Create Appointment'}
          </Button>
        </Box>
      </Box>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default BridalAppointmentForm;