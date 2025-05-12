import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, TextField, Button, Paper,
  FormControl, InputLabel, Select, MenuItem,
  FormHelperText, InputAdornment, Snackbar, Alert
} from '@mui/material';

const CreateAppointmentModal = ({ 
  open, 
  onClose, 
  onCreateAppointment, 
  request, 
  stylists,
  selectedStylist, 
  setSelectedStylist 
}) => {
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [services, setServices] = useState([]);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (open) {
      fetchServices();
      
      // Enhanced validation: Check multiple conditions for existing appointment
      if (request && (
        request.has_appointment || 
        request.appointment_id || 
        request.status === 'completed'
      )) {
        console.log('Request already has an appointment, closing modal');
        setValidationError('This request already has an appointment associated with it.');
        // Don't close immediately to allow the error to be seen
        setTimeout(() => onClose(), 3000);
      } else {
        setValidationError('');
      }
    }
  }, [open, request, onClose]);

  useEffect(() => {
    if (request && services.length > 0) {
      // Calculate payment amount when request or services change
      calculatePaymentAmount();
    }
  }, [request, services]);

  const fetchServices = async () => {
    try {
      console.log('Fetching services from API...');
      const response = await fetch('http://localhost:5001/api/services');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Services received:', data);
      
      if (Array.isArray(data)) {
        setServices(data);
      } else if (data.services && Array.isArray(data.services)) {
        setServices(data.services);
      } else {
        throw new Error('Invalid services data format');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setValidationError('Error fetching services. Please try again.');
    }
  };
  
  const calculatePaymentAmount = () => {
    if (!services.length || !request || !request.service_id) return 0;
    
    // Find the service that matches the request's service_id
    const serviceObj = services.find(s => s.service_id === request.service_id);
    
    if (serviceObj && serviceObj.price) {
      const amount = parseFloat(serviceObj.price);
      setPaymentAmount(amount);
      return amount;
    }
    
    setPaymentAmount(0);
    return 0;
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().split('T')[0];
  };

  const validateBeforeCreate = () => {
    // Clear previous validation errors
    setValidationError('');
    
    // Check if appointment already exists for this request
    if (request && (request.has_appointment || request.appointment_id)) {
      setValidationError('Cannot create appointment: Request already has an appointment.');
      return false;
    }
    
    // Make sure we have a service_id
    if (!request.service_id) {
      setValidationError('Cannot create appointment: No service specified.');
      return false;
    }
    
    // Validate required fields
    if (!request.preferred_date || !request.preferred_time) {
      setValidationError('Cannot create appointment: Missing date or time.');
      return false;
    }
    
    // Check for customer data
    if (!request.customer_id) {
      setValidationError('Cannot create appointment: Customer information is missing.');
      return false;
    }
    
    return true;
  };

  const handleCreateAppointment = () => {
    // Validate before proceeding
    if (!validateBeforeCreate()) {
      return;
    }
    
    // Calculate the payment amount one more time before creating appointment
    const amount = calculatePaymentAmount();
    
    // Build appointment object from request data
    const appointment = {
      customer_ID: request.customer_id,
      appointment_date: request.preferred_date,
      appointment_time: request.preferred_time,
      appointment_status: 'Scheduled',
      serviceStylists: selectedStylist ? [
        {
          service_ID: request.service_id,
          stylist_ID: selectedStylist,
        }
      ] : [],
      payment_status: 'Pending',
      payment_amount: amount,
      payment_type: 'Pay at Salon',
      notes: `Created from special request #${request.id}: ${request.request_details}`,
      request_id: request.id, // Add request_id to link this appointment to the request
    };
    
    onCreateAppointment(appointment);
  };

  const handleClose = () => {
    setValidationError('');
    onClose();
  };

  if (!request) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Appointment from Request</DialogTitle>
      <DialogContent dividers>
        {validationError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationError}
          </Alert>
        )}
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {/* Customer Section */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Customer Details</Typography>
            <TextField
              label="Customer"
              value={`${request.first_name} ${request.last_name}`}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
          </Paper>
          
          {/* Appointment Details Section */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Appointment Details</Typography>
            <TextField
              label="Appointment Date"
              type="date"
              value={formatDateForInput(request.preferred_date)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Appointment Time"
              value={request.preferred_time}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
          </Paper>
          
          {/* Services Section */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Services</Typography>
            <TextField
              label="Service"
              value={request.service_name || "Not specified"}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Stylist</InputLabel>
              <Select 
                value={selectedStylist}
                onChange={(e) => setSelectedStylist(e.target.value)}
              >
                <MenuItem value="">
                  <em>Not assigned</em>
                </MenuItem>
                {stylists.map((stylist) => (
                  <MenuItem key={stylist.stylist_ID} value={stylist.stylist_ID}>
                    {stylist.firstname} {stylist.lastname}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Optional: You can assign a stylist now or later</FormHelperText>
            </FormControl>
          </Paper>
          
          {/* Status & Payment Section */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Status & Payment</Typography>
            <TextField
              label="Appointment Status"
              value="Scheduled"
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                label="Payment Amount"
                type="number"
                value={paymentAmount}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  readOnly: true
                }}
              />
              <TextField
                label="Payment Status"
                value="Pending"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Box>
            
            <TextField
              label="Payment Type"
              value="Pay at Salon"
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleCreateAppointment} 
          variant="contained" 
          color="primary"
          disabled={!!validationError || request?.has_appointment || request?.appointment_id || request?.status === 'completed'}
        >
          Create Appointment
        </Button>
        <Button onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
      
      {/* Error Snackbar */}
      <Snackbar
        open={!!validationError}
        autoHideDuration={6000}
        onClose={() => setValidationError('')}
      >
        <Alert onClose={() => setValidationError('')} severity="error">
          {validationError}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default CreateAppointmentModal;