import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Button, CircularProgress,
  Paper, Grid, Divider, Chip, Avatar
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Spa as SpaIcon,
  ContentCut as StylistIcon,
  Payments as PaymentIcon,
  Notes as NotesIcon,
  Event as EventIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from "@mui/icons-material";

const AppointmentDetailsModal = ({ 
  open, 
  onClose, 
  appointmentId, 
  appointmentDetails: initialDetails,
  customer,
  stylists 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState(initialDetails || null);

  useEffect(() => {
    // Set the details if they're passed in as props
    if (initialDetails) {
      setAppointmentDetails(initialDetails);
    }
  }, [initialDetails]);
  
  useEffect(() => {
    // If no details and we have an ID, fetch them
    if (open && appointmentId && !appointmentDetails) {
      fetchAppointmentDetails();
    }
  }, [open, appointmentId, appointmentDetails]);

  const fetchAppointmentDetails = async () => {
    if (!appointmentId) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      console.log('Fetching appointment details for ID:', appointmentId);
      const response = await fetch(`http://localhost:5001/api/admin/appointments/${appointmentId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch appointment details (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Appointment details received:', data);
      
      const details = data.data || data;
      setAppointmentDetails(details);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      setError(`Failed to load appointment details: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    if (typeof timeString === 'string' && timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(parseInt(hours), parseInt(minutes));
      return time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
    return new Date(timeString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getStatusColor = (status) => {
    if (!status) return 'default';
    
    switch(status.toLowerCase()) {
      case 'scheduled':
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStylistName = (stylistId) => {
    if (!stylistId || !stylists || !stylists.length) return 'Not assigned';
    
    const stylist = stylists.find(s => s.stylist_ID === stylistId);
    return stylist ? `${stylist.firstname} ${stylist.lastname}` : 'Unknown';
  };

  const getCustomerInfo = () => {
    if (appointmentDetails?.customer) {
      return {
        firstName: appointmentDetails.customer.first_name || appointmentDetails.customer.firstName,
        lastName: appointmentDetails.customer.last_name || appointmentDetails.customer.lastName,
        email: appointmentDetails.customer.email,
        phone: appointmentDetails.customer.phone_number || appointmentDetails.customer.phone
      };
    }
    
    // Fallback to the customer prop
    return customer || { firstName: 'N/A', lastName: '', email: 'N/A', phone: 'N/A' };
  };

  const customerInfo = getCustomerInfo();

  // Show loading state
  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Appointment Details</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading appointment details...</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Show error state
  if (error) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error" variant="h6">
              {error}
            </Typography>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={fetchAppointmentDetails}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EventIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Appointment Details
          </Typography>
        </Box>
        {appointmentDetails?.id && (
          <Chip 
            label={`#${appointmentDetails.id}`} 
            color="default" 
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
        )}
      </DialogTitle>
      
      <DialogContent dividers>
        {!appointmentDetails ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              No appointment details available. Appointment ID: {appointmentId || 'N/A'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ py: 2 }}>
            {/* Status Banner */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                mb: 3, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: appointmentDetails.status ? 
                  getStatusColor(appointmentDetails.status) === 'success' ? '#e8f5e9' :
                  getStatusColor(appointmentDetails.status) === 'warning' ? '#fff3e0' :
                  getStatusColor(appointmentDetails.status) === 'error' ? '#ffebee' :
                  getStatusColor(appointmentDetails.status) === 'info' ? '#e3f2fd' : '#f5f5f5'
                  : '#f5f5f5'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon 
                  sx={{ 
                    mr: 1,
                    color: appointmentDetails.status ? 
                      getStatusColor(appointmentDetails.status) === 'success' ? '#4caf50' :
                      getStatusColor(appointmentDetails.status) === 'warning' ? '#ff9800' :
                      getStatusColor(appointmentDetails.status) === 'error' ? '#f44336' :
                      getStatusColor(appointmentDetails.status) === 'info' ? '#2196f3' : '#757575'
                      : '#757575'
                  }}
                />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Appointment Status
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {appointmentDetails.status ? (
                      <Chip 
                        label={appointmentDetails.status} 
                        color={getStatusColor(appointmentDetails.status)}
                        size="small"
                      />
                    ) : 'N/A'}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="textSecondary">
                  Date & Time
                </Typography>
                <Typography variant="subtitle1" fontWeight="medium">
                  {formatDate(appointmentDetails.appointment_date || appointmentDetails.date)}
                  {' at '}
                  {formatTime(appointmentDetails.appointment_time || appointmentDetails.time)}
                </Typography>
              </Box>
            </Paper>
            
            <Grid container spacing={3}>
              {/* Customer Information */}
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1, color: '#1976d2' }} />
                    <Typography variant="subtitle1" color="primary">
                      Customer Information
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#bbdefb', color: '#1976d2', mr: 2 }}>
                      {customerInfo.firstName.charAt(0)}{customerInfo.lastName.charAt(0)}
                    </Avatar>
                    <Typography variant="body1" fontWeight="medium">
                      {customerInfo.firstName} {customerInfo.lastName}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ mr: 1, fontSize: 18, color: '#757575' }} />
                    <Typography variant="body2">
                      {customerInfo.email}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ mr: 1, fontSize: 18, color: '#757575' }} />
                    <Typography variant="body2">
                      {customerInfo.phone}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              {/* Appointment Details */}
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <SpaIcon sx={{ mr: 1, color: '#1976d2' }} />
                    <Typography variant="subtitle1" color="primary">
                      Service Information
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Service Type
                    </Typography>
                    <Typography variant="body1">
                      {appointmentDetails.service_name || appointmentDetails.service || 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Duration
                    </Typography>
                    <Typography variant="body1">
                      {appointmentDetails.duration ? `${appointmentDetails.duration} minutes` : 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Stylist
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <StylistIcon sx={{ mr: 1, fontSize: 18, color: '#757575' }} />
                      <Typography variant="body1">
                        {getStylistName(appointmentDetails.stylist_id)}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              
              {/* Additional Details */}
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <NotesIcon sx={{ mr: 1, color: '#1976d2' }} />
                    <Typography variant="subtitle1" color="primary">
                      Additional Details
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                          Created At
                        </Typography>
                        <Typography variant="body1">
                          {appointmentDetails.created_at ? formatDate(appointmentDetails.created_at) + ' ' + formatTime(appointmentDetails.created_at) : 'N/A'}
                        </Typography>
                      </Box>
                      
                      {appointmentDetails.updated_at && (
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Last Updated
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(appointmentDetails.updated_at) + ' ' + formatTime(appointmentDetails.updated_at)}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      {appointmentDetails.price !== undefined && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="textSecondary">
                            Price
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PaymentIcon sx={{ mr: 1, fontSize: 18, color: '#757575' }} />
                            <Typography variant="body1" fontWeight="medium">
                              ${typeof appointmentDetails.price === 'number' ? 
                                appointmentDetails.price.toFixed(2) : appointmentDetails.price}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      
                      {appointmentDetails.special_request_id && (
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Special Request ID
                          </Typography>
                          <Typography variant="body1">
                            #{appointmentDetails.special_request_id}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    
                    {appointmentDetails.notes && (
                      <Grid item xs={12}>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            Notes
                          </Typography>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 2, 
                              mt: 1, 
                              bgcolor: '#f5f5f5', 
                              borderRadius: 1,
                              minHeight: '80px'
                            }}
                          >
                            <Typography variant="body2">
                              {appointmentDetails.notes}
                            </Typography>
                          </Paper>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentDetailsModal;