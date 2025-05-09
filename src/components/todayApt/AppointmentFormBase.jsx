import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Dialog, DialogActions, DialogContent,
  Typography, CircularProgress, Chip, MenuItem, Select, 
  FormControl, InputLabel, RadioGroup, FormControlLabel, Radio, Paper,
  InputAdornment, Grid, Autocomplete, FormHelperText
} from "@mui/material";
import {
  Save as SaveIcon,
  Close as CloseIcon
} from "@mui/icons-material";

// Status options
const STATUS_OPTIONS = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show'];
const PAYMENT_STATUS_OPTIONS = ['Pending', 'Paid', 'Refunded', 'Failed'];
const PAYMENT_TYPE_OPTIONS = ['Online', 'Pay at Salon'];

/**
 * Base component for appointment forms
 */
const AppointmentFormBase = ({
  open,
  onClose,
  onSubmit,
  title,
  customers = [],
  services = [],
  stylists = [],
  initialData = {},
  loadingTimeSlots = false,
  availableTimeSlots = [],
  isEdit = false,
  skipTimeSlots = false,
  fetchTimeSlots
}) => {
  // Form state
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    customer_ID: '',
    appointment_date: '',
    appointment_time: '',
    appointment_status: 'Scheduled',
    services: [],
    serviceIds: [],
    stylists: [],
    payment_status: 'Pending',
    payment_amount: '0',
    payment_type: 'Pay at Salon',
    amount_paid: '0',
    is_partial: false,
    notes: '',
    payment_notes: '',
    cancellation_reason: ''
  });

  // Selection state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStylists, setSelectedStylists] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // Initialize form with data
  useEffect(() => {
    if (open && !initialized) {
      // Customer initialization
      let customerObj = null;
      if (initialData.customer_ID && customers.length > 0) {
        customerObj = customers.find(c => c.customer_ID === initialData.customer_ID) || null;
      }

      // Services initialization
      let serviceObjs = [];
      if (Array.isArray(initialData.services) && initialData.services.length > 0) {
        serviceObjs = initialData.services
          .map(serviceName => {
            const serviceObj = services.find(s => 
              s.service_name?.toLowerCase() === serviceName?.toLowerCase()
            );
            return serviceObj;
          })
          .filter(Boolean);
      } else if (Array.isArray(initialData.serviceIds) && initialData.serviceIds.length > 0) {
        serviceObjs = initialData.serviceIds
          .map(serviceId => {
            const serviceObj = services.find(s => String(s.service_ID) === String(serviceId));
            return serviceObj;
          })
          .filter(Boolean);
      }

      // Stylists initialization
      let stylistObjs = [];
      if (Array.isArray(initialData.stylists) && initialData.stylists.length > 0) {
        stylistObjs = initialData.stylists
          .map(stylistId => {
            const stylistObj = stylists.find(s => String(s.stylist_ID) === String(stylistId));
            return stylistObj || null;
          })
          .filter(Boolean);
      }

      // Set all states
      setSelectedCustomer(customerObj);
      setSelectedServices(serviceObjs);
      setSelectedStylists(stylistObjs);

      setForm({
        customer_ID: customerObj?.customer_ID || initialData.customer_ID || '',
        appointment_date: initialData.appointment_date || '',
        appointment_time: initialData.appointment_time || '',
        services: serviceObjs.map(s => s?.service_name || ''),
        serviceIds: serviceObjs.map(s => s?.service_ID || ''),
        stylists: stylistObjs.map(s => s?.stylist_ID || ''),
        payment_status: initialData.payment_status || 'Pending',
        payment_amount: calculatePaymentAmount(serviceObjs).toString(),
        payment_type: initialData.payment_type || 'Pay at Salon',
        amount_paid: initialData.amount_paid || '0',
        is_partial: initialData.is_partial || false,
        notes: initialData.notes || '',
        payment_notes: initialData.payment_notes || '',
        cancellation_reason: initialData.cancellation_reason || ''
      });

      setInitialized(true);
      setErrors({});
    } else if (!open) {
      setInitialized(false);
    }
  }, [open, initialData, customers, services, stylists, initialized]);

  // Fetch time slots when criteria change
  useEffect(() => {
    if (!open || isEdit || skipTimeSlots || !fetchTimeSlots) return;

    let debugMessages = [];
    
    // Basic validation
    if (!form.appointment_date) {
      debugMessages.push("❌ Date not selected");
      setDebugInfo(debugMessages.join('\n'));
      return;
    }

    if (selectedStylists.length === 0) {
      debugMessages.push("❌ No stylists selected");
      setDebugInfo(debugMessages.join('\n'));
      return;
    }

    // Get service IDs (handle null/undefined cases)
    const serviceIds = selectedServices.length > 0
      ? selectedServices.map(s => s.service_ID || s.service_id || '').filter(Boolean)
      : [];

    debugMessages.push(
      "✅ Fetching timeslots with:",
      `📅 Date: ${form.appointment_date}`,
      `✂️ Stylists: ${selectedStylists.map(s => s.stylist_ID).join(', ')}`,
      `💇 Services: ${serviceIds.join(', ') || 'None (fetching all slots)'}`
    );

    setDebugInfo(debugMessages.join('\n'));
    fetchTimeSlots(form.appointment_date, selectedStylists.map(s => s.stylist_ID), selectedServices.map(s => s.service_name));
  }, [form.appointment_date, selectedServices, selectedStylists, fetchTimeSlots, isEdit, open, skipTimeSlots]);

  // Calculate total payment amount based on selected services
  const calculatePaymentAmount = (selectedServiceObjects) => {
    if (!selectedServiceObjects || !selectedServiceObjects.length) return 0;
    
    return selectedServiceObjects.reduce((total, service) => {
      return total + (service?.price ? parseFloat(service.price) : 0);
    }, 0);
  };

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Customer selection handler
  const handleCustomerChange = (event, newValue) => {
    setSelectedCustomer(newValue);
    setForm(prev => ({ 
      ...prev, 
      customer_ID: newValue ? newValue.customer_ID : '' 
    }));
    
    if (errors.customer_ID) {
      setErrors(prev => ({ ...prev, customer_ID: null }));
    }
  };

  // Service selection handler
  const handleServiceChange = (event, newValue) => {
    // Normalize service objects - handle both service_ID and service_id cases
    const normalizedServices = newValue.map(service => {
      const normalized = {
        ...service,
        service_ID: service.service_ID || service.service_id,
        service_name: service.service_name
      };

      if (!normalized.service_ID || !normalized.service_name) {
        console.error('Invalid service object structure:', service);
        return null;
      }

      // Find the full service object from options
      const fullService = services.find(s => 
        (s.service_ID || s.service_id) === normalized.service_ID
      );
      
      return fullService || normalized;
    }).filter(Boolean);
    
    setSelectedServices(normalizedServices);
    
    setForm(prev => ({
      ...prev,
      services: normalizedServices.map(s => s.service_name),
      serviceIds: normalizedServices.map(s => s.service_ID || s.service_id),
      payment_amount: calculatePaymentAmount(normalizedServices).toString()
    }));
    
    if (errors.services) {
      setErrors(prev => ({ ...prev, services: null }));
    }
  };

  // Stylist selection handler
  const handleStylistChange = (event, newValue) => {
    const uniqueStylists = Array.from(
      new Map(newValue.map(item => [item.stylist_ID, item])).values()
    );
    
    setSelectedStylists(uniqueStylists);
    setForm(prev => ({ 
      ...prev, 
      stylists: uniqueStylists.map(stylist => stylist.stylist_ID)
    }));
    
    if (errors.stylists) {
      setErrors(prev => ({ ...prev, stylists: null }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.customer_ID) newErrors.customer_ID = "Customer is required";
    if (!form.appointment_date) newErrors.appointment_date = "Appointment date is required";
    if (!form.appointment_time && !skipTimeSlots) newErrors.appointment_time = "Appointment time is required";
    if (!form.appointment_status) newErrors.appointment_status = "Status is required";
    
    if (!selectedServices || selectedServices.length === 0) {
      newErrors.services = "At least one service is required";
    }
    
    if (!selectedStylists || selectedStylists.length === 0) {
      newErrors.stylists = "At least one stylist is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const serviceStylists = selectedServices.map(service => ({
      service_ID: service.service_ID || service.service_id,
      stylist_ID: selectedStylists[0]?.stylist_ID
    })).filter(pair => pair.service_ID && pair.stylist_ID);
  
    if (serviceStylists.length !== selectedServices.length) {
      console.error("Missing service or stylist assignments");
      return;
    }
  
    const payload = {
      ...form,
      serviceStylists
    };
  
    onSubmit(payload);
  };

  // Render available time slots
  const renderTimeSlots = () => {
    return (
      <Box sx={{ mt: 3 }}>
        {/* Debug info box - always visible in development */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{
            mb: 2,
            p: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: 1,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}>
            <Typography variant="subtitle2">Debug Info:</Typography>
            <Typography variant="body2">
              {debugInfo || 'No debug information yet'}
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Timeslots received: {availableTimeSlots?.length || 0}
            </Typography>
          </Box>
        )}
  
        {/* Loading state */}
        {loadingTimeSlots && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2 }}>Loading time slots...</Typography>
          </Box>
        )}
  
        {/* Timeslot grid */}
        {!loadingTimeSlots && availableTimeSlots?.length > 0 && (
          <FormControl fullWidth component="fieldset">
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Available Time Slots
            </Typography>
            <RadioGroup
              name="appointment_time"
              value={form.appointment_time || ''}
              onChange={handleInputChange}
              sx={{ mt: 1 }}
            >
              <Grid container spacing={1}>
                {availableTimeSlots.map((time) => (
                  <Grid item xs={4} sm={3} md={2} key={time}>
                    <Paper elevation={1} sx={{ p: 1 }}>
                      <FormControlLabel
                        value={time}
                        control={<Radio size="small" />}
                        label={time}
                        sx={{
                          m: 0,
                          '& .MuiFormControlLabel-label': {
                            width: '100%',
                            textAlign: 'center'
                          }
                        }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
          </FormControl>
        )}
  
        {/* Empty state */}
        {!loadingTimeSlots && availableTimeSlots?.length === 0 && (
          <Typography color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
            No available time slots for the selected criteria
          </Typography>
        )}
      </Box>
    );
  };

  // Render form
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      disableRestoreFocus
      PaperProps={{
        sx: { 
          overflowY: 'auto',
          maxHeight: '90vh'
        }
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
        <Typography variant="h6">{title}</Typography>
      </Box>
      
      <DialogContent sx={{ overflowY: 'visible', p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {/* Customer Field */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" required error={!!errors.customer_ID}>
                <Autocomplete
                  id="customer-autocomplete"
                  options={customers}
                  getOptionLabel={(option) => 
                    `${option.firstname || ''} ${option.lastname || ''}`.trim()
                  }
                  value={selectedCustomer}
                  onChange={handleCustomerChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer"
                      required
                      error={!!errors.customer_ID}
                      helperText={errors.customer_ID}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => 
                    option?.customer_ID === value?.customer_ID
                  }
                />
              </FormControl>
            </Grid>

            {/* Date Field */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" required error={!!errors.appointment_date}>
                <TextField
                  label="Appointment Date"
                  type="date"
                  name="appointment_date"
                  value={form.appointment_date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.appointment_date}
                  helperText={errors.appointment_date}
                />
              </FormControl>
            </Grid>

            {/* Services Field */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" required error={!!errors.services}>
                <Autocomplete
                  id="services-autocomplete"
                  multiple
                  options={services}
                  getOptionLabel={(option) => 
                    option?.service_name 
                      ? `${option.service_name} - $${option.price || '0'} (${option.time_duration || '0'} min)`
                      : 'Unknown Service'
                  }
                  value={selectedServices}
                  onChange={handleServiceChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Services"
                      required
                      error={!!errors.services}
                      helperText={errors.services || "Select one or more services"}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => 
                    (option.service_ID || option.service_id) === (value.service_ID || value.service_id)
                  }
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={`${option.service_ID || option.service_id}-${index}`}
                        label={`${option.service_name} - $${option.price || '0'}`}
                        {...getTagProps({ index })}
                        size="small"
                      />
                    ))
                  }
                  filterSelectedOptions
                />
              </FormControl>
            </Grid>

            {/* Stylists Field */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" required error={!!errors.stylists}>
                <Autocomplete
                  id="stylists-autocomplete"
                  multiple
                  options={stylists}
                  getOptionLabel={(option) => 
                    `${option.firstname || ''} ${option.lastname || ''}`.trim()
                  }
                  value={selectedStylists}
                  onChange={handleStylistChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Stylists"
                      required
                      error={!!errors.stylists}
                      helperText={errors.stylists}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => 
                    option?.stylist_ID === value?.stylist_ID
                  }
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={`${option.stylist_ID}-${index}`}
                        label={`${option.firstname} ${option.lastname}`}
                        {...getTagProps({ index })}
                        size="small"
                      />
                    ))
                  }
                />
              </FormControl>
            </Grid>

            {/* Status Field */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" required error={!!errors.appointment_status}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="appointment_status"
                  value={form.appointment_status}
                  onChange={handleInputChange}
                  label="Status"
                  error={!!errors.appointment_status}
                >
                  {STATUS_OPTIONS.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
                {errors.appointment_status && (
                  <FormHelperText error>{errors.appointment_status}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Payment Amount Field */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Payment Amount"
                  type="number"
                  name="payment_amount"
                  value={form.payment_amount}
                  onChange={handleInputChange}
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    readOnly: selectedServices.length > 0
                  }}
                  helperText={selectedServices.length > 0 ? "Auto-calculated from services" : ""}
                />
              </FormControl>
            </Grid>

            {/* Payment Status Field */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Payment Status</InputLabel>
                <Select
                  name="payment_status"
                  value={form.payment_status}
                  onChange={handleInputChange}
                  label="Payment Status"
                >
                  {PAYMENT_STATUS_OPTIONS.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Payment Type Field */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Payment Type</InputLabel>
                <Select
                  name="payment_type"
                  value={form.payment_type}
                  onChange={handleInputChange}
                  label="Payment Type"
                >
                  {PAYMENT_TYPE_OPTIONS.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {/* Timeslot Selection */}
          {!skipTimeSlots && (
            <Box sx={{ mt: 3 }}>
              {renderTimeSlots()}
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0', position: 'sticky', bottom: 0, bgcolor: 'background.paper', zIndex: 1 }}>
        <Button 
          onClick={onClose}
          startIcon={<CloseIcon />}
          sx={{ mr: 1, color: "#666" }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{ backgroundColor: "green", '&:hover': { backgroundColor: "darkgreen" } }}
        >
          {isEdit ? 'Save Changes' : 'Create Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentFormBase;