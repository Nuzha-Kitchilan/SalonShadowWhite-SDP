import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  Paper, IconButton, Button, Box, Chip, Typography, CircularProgress,
  Snackbar, Alert, Grid, Select, MenuItem, FormControl, InputLabel, TextField, Dialog, DialogContent, DialogActions
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  AttachMoney as AttachMoneyIcon
} from "@mui/icons-material";
import axios from "axios";
import { format, parseISO } from 'date-fns';
import AppointmentForm from '../components/todayApt/AppointmentForm';
import CustomerRegistration from '../components/todayApt/CustomerRegistration';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
});

export default function TodayAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [loadingAppointmentDetails, setLoadingAppointmentDetails] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [filters, setFilters] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    stylistId: ''
  });

  // Add this useEffect hook right after your state declarations
  useEffect(() => {
    const fetchEditTimeSlots = async () => {
      if (showEditModal && selectedAppointment) {
        setLoadingTimeSlots(true);
        try {
          // Get service IDs from the appointment
          const serviceNames = selectedAppointment.services.split(',').map(s => s.trim());
          const serviceIds = services
            .filter(service => serviceNames.includes(service.service_name))
            .map(service => service.service_ID);
  
          // Get stylist IDs from the appointment
          let stylistIds = [];
          if (selectedAppointment.stylists_IDs) {
            stylistIds = selectedAppointment.stylists_IDs.split(',').map(id => id.trim());
          } else if (selectedAppointment.stylist_ID) {
            stylistIds = [selectedAppointment.stylist_ID];
          } else if (selectedAppointment.stylists) {
            // Fallback: Extract IDs from stylist names
            const stylistNames = selectedAppointment.stylists.split(',').map(s => s.trim());
            stylistIds = stylists
              .filter(stylist => stylistNames.includes(`${stylist.firstname} ${stylist.lastname}`))
              .map(stylist => stylist.stylist_ID);
          }
  
          // Ensure we have at least one service and one stylist
          if (serviceIds.length === 0 || stylistIds.length === 0) {
            throw new Error('Missing service or stylist data');
          }
  
          // Fetch available time slots
          const response = await api.post('/booking/available-timeslots', {
            date: selectedAppointment.appointment_date,
            stylistIds,
            serviceIds,
            serviceDuration: calculateServiceDuration(serviceNames)
          });
  
          const originalTime = formatTime(selectedAppointment.appointment_time);
          
          if (response.data?.availableSlots) {
            // Combine original time with new slots, removing duplicates
            const allSlots = [...new Set([
              originalTime,
              ...response.data.availableSlots
            ])].sort();
            setAvailableTimeSlots(allSlots);
          } else {
            setAvailableTimeSlots([originalTime]);
          }
        } catch (error) {
          console.error('Error fetching time slots:', error);
          // Fallback to just showing the original time
          setAvailableTimeSlots([formatTime(selectedAppointment.appointment_time)]);
        } finally {
          setLoadingTimeSlots(false);
        }
      }
    };
  
    fetchEditTimeSlots();
  }, [showEditModal, selectedAppointment, services, stylists]);


  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  const calculateServiceDuration = (selectedServices) => {
    if (!services.length || !selectedServices?.length) return 0;
    
    let totalDuration = 0;
    
    selectedServices.forEach(service => {
      const serviceObj = services.find(s => 
        s.service_ID === service || 
        s.service_name === service ||
        (typeof service === 'object' && s.service_ID === service.service_ID)
      );
      
      if (serviceObj?.time_duration) {
        totalDuration += parseInt(serviceObj.time_duration);
      }
    });
    
    return totalDuration;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const params = {
        date: filters.date
      };
      
      if (filters.stylistId) {
        params.stylistId = filters.stylistId;
      }

      const [appointmentsRes, servicesRes, stylistsRes, customersRes] = await Promise.all([
        api.get('/admin/appointments/today', { params }),
        api.get('/admin/services'),
        api.get('/admin/stylists'),
        api.get('/admin/customers')
      ]);

      if (appointmentsRes.data.success) {
        setAppointments(appointmentsRes.data.data || []);
      }
      if (servicesRes.data.success) setServices(servicesRes.data.data || []);
      if (stylistsRes.data.success) setStylists(stylistsRes.data.data || []);
      if (customersRes.data.success) setCustomers(customersRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch only customers
  const fetchCustomers = async () => {
    try {
      const customersRes = await api.get('/admin/customers');
      if (customersRes.data.success) {
        setCustomers(customersRes.data.data || []);
        return customersRes.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      showSnackbar('Failed to fetch customers', 'error');
      return [];
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.date, filters.stylistId]);

  const fetchAppointmentDetails = async (id) => {
    setLoadingAppointmentDetails(true);
    try {
      const response = await api.get(`/admin/appointments/${id}`);
      if (response.data.success) {
        setSelectedAppointmentDetails(response.data.data);
      } else {
        showSnackbar('Failed to fetch appointment details', 'error');
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      showSnackbar('Error fetching appointment details', 'error');
    } finally {
      setLoadingAppointmentDetails(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getServiceIdsFromNames = (serviceNames) => {
    return serviceNames.map(name => {
      const found = services.find(s => s.service_name === name);
      return found?.service_ID;
    }).filter(Boolean);
  };

  const fetchAvailableTimeSlots = useCallback(async (date, stylistId, servicesList) => {
    console.log('Fetching timeslots with:', { date, stylistId, servicesList });
    
    if (!date || !stylistId || !servicesList?.length) {
      console.log('Missing required fields');
      return;
    }
  
    setLoadingTimeSlots(true);
    try {
      const singleStylistId = Array.isArray(stylistId) ? stylistId[0] : stylistId;
      
      // Debug services data
      console.log('All services:', services);
      
      const serviceIds = servicesList.map(serviceName => {
        const service = services.find(s => s.service_name === serviceName);
        if (!service) {
          console.warn(`Service not found: ${serviceName}`);
        }
        return service?.service_ID;
      }).filter(Boolean);
  
      console.log('Mapped service IDs:', serviceIds);
      
      const serviceDuration = calculateServiceDuration(servicesList);
      console.log('Calculated duration:', serviceDuration);
  
      const response = await api.post('/booking/available-timeslots', {
        date,
        stylistId: singleStylistId,
        serviceDuration,
        serviceIds
      });
  
      console.log('API Response:', response.data);
      
      if (response.data?.availableSlots) {
        setAvailableTimeSlots(response.data.availableSlots);
      } else {
        console.warn('No slots returned from API');
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      setAvailableTimeSlots([]);
    } finally {
      setLoadingTimeSlots(false);
    }
  }, [services]);

  
  const handleCreateAppointment = async (formData) => {
    try {
      const response = await api.post('/admin/appointments', formData);
      if (response.data.success) {
        showSnackbar('Appointment created successfully');
        fetchData();
        setShowCreateModal(false);
      }
    } catch (error) {
      showSnackbar('Error creating appointment', 'error');
    }
  };

  const handleEditAppointment = async (formData) => {
    try {
      const response = await api.put(`/admin/appointments/${selectedAppointment.appointment_ID}`, formData);
      if (response.data.success) {
        showSnackbar('Appointment updated successfully');
        fetchData();
        setShowEditModal(false);
      }
    } catch (error) {
      showSnackbar('Error updating appointment', 'error');
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      const response = await api.delete(`/admin/appointments/${id}`);
      if (response.data.success) {
        showSnackbar('Appointment deleted successfully');
        fetchData();
      }
    } catch (error) {
      showSnackbar('Error deleting appointment', 'error');
    }
  };

  const handleRegisterCustomer = async (customerData) => {
    try {
      setLoading(true);
      const response = await api.post('/admin/customers/walkin', customerData);
      showSnackbar('Customer registered successfully');
      
      // Force refresh of customers list and wait for it to complete
      await fetchCustomers();
      
      // Only close modal after refresh is complete
      setShowCustomerModal(false);
      
      // Immediately open appointment form with new customer pre-selected
      const newCustomers = await api.get('/admin/customers');
      const latestCustomer = newCustomers.data.data.find(c => 
        c.email === customerData.email
      );
      
      if (latestCustomer) {
        setShowCreateModal(true);
        setSelectedCustomerId(latestCustomer.customer_ID);
      }
    } catch (error) {
      showSnackbar('Error registering customer', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    fetchAppointmentDetails(appointment.appointment_ID);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAppointmentDetails(null);
  };

  const formatTime = (timeString) => {
    return timeString?.substring(0, 5) || 'N/A';
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      case 'Confirmed': return 'info';
      case 'No-show': return 'error';
      default: return 'warning';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Partial': return 'warning';
      case 'Refunded': return 'info';
      default: return 'error';
    }
  };
  
  const getRemainingAmount = (total, paid) => {
    if (total === null || paid === null) return 0;
    const remaining = parseFloat(total) - parseFloat(paid);
    return remaining > 0 ? remaining : 0;
  };

  const prepareEditTimeSlots = () => {
    if (selectedAppointment?.appointment_time) {
      const formattedTime = formatTime(selectedAppointment.appointment_time);
      return [...new Set([formattedTime, ...availableTimeSlots])].sort();
    }
    return availableTimeSlots;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Today's Appointments</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setShowCustomerModal(true)}
            sx={{ backgroundColor: '#FE8DA1', '&:hover': { backgroundColor: '#fe6a9f' } }}
          >
            Walk-In
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateModal(true)}
          >
            New Appointment
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Stylist</InputLabel>
              <Select
                name="stylistId"
                value={filters.stylistId}
                onChange={handleFilterChange}
                label="Stylist"
              >
                <MenuItem value="">All Stylists</MenuItem>
                {stylists.map(stylist => (
                  <MenuItem key={stylist.stylist_ID} value={stylist.stylist_ID}>
                    {stylist.firstname} {stylist.lastname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Services</TableCell>
                <TableCell>Stylist</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.length > 0 ? (
                appointments.map(appointment => (
                  <TableRow key={appointment.appointment_ID} hover>
                    <TableCell>{formatTime(appointment.appointment_time)}</TableCell>
                    <TableCell>{appointment.customer_name}</TableCell>
                    <TableCell>{appointment.services}</TableCell>
                    <TableCell>{appointment.stylists}</TableCell>
                    <TableCell>
                      <Chip 
                        label={appointment.appointment_status}
                        color={getStatusColor(appointment.appointment_status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatCurrency(appointment.payment_amount)}</TableCell>
                    <TableCell>{formatCurrency(appointment.amount_paid || 0)}</TableCell>
                    <TableCell>
                      {formatCurrency(getRemainingAmount(appointment.payment_amount, appointment.amount_paid))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.payment_status || 'Pending'}
                        color={getPaymentStatusColor(appointment.payment_status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewAppointment(appointment)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowEditModal(true);
                      }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => {
                        if (window.confirm('Delete this appointment?')) {
                          handleDeleteAppointment(appointment.appointment_ID);
                        }
                      }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No appointments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={showDetailsModal} onClose={handleCloseDetailsModal} maxWidth="md" fullWidth>
        {loadingAppointmentDetails ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : selectedAppointmentDetails ? (
          <>
            <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6">Appointment Details</Typography>
            </Box>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Customer</Typography>
                  <Typography>{selectedAppointmentDetails.customer_name}</Typography>
                  
                  {selectedAppointmentDetails.customer_email && (
                    <>
                      <Typography variant="subtitle1" fontWeight="bold" mt={2}>Email</Typography>
                      <Typography>{selectedAppointmentDetails.customer_email}</Typography>
                    </>
                  )}
                  
                  {selectedAppointmentDetails.customer_phone && (
                    <>
                      <Typography variant="subtitle1" fontWeight="bold" mt={2}>Phone</Typography>
                      <Typography>{selectedAppointmentDetails.customer_phone}</Typography>
                    </>
                  )}
                  
                  {selectedAppointmentDetails.is_first_time === 1 && (
                    <Chip 
                      label="First-time Customer"
                      color="primary"
                      sx={{ mt: 2 }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Date & Time</Typography>
                  <Typography>
                    {format(parseISO(selectedAppointmentDetails.appointment_date), 'MMM dd, yyyy')} at {formatTime(selectedAppointmentDetails.appointment_time)}
                  </Typography>
                  
                  <Typography variant="subtitle1" fontWeight="bold" mt={2}>Services</Typography>
                  <Typography>{selectedAppointmentDetails.services}</Typography>
                  
                  <Typography variant="subtitle1" fontWeight="bold" mt={2}>Stylist</Typography>
                  <Typography>{selectedAppointmentDetails.stylists}</Typography>
                  
                  <Typography variant="subtitle1" fontWeight="bold" mt={2}>Duration</Typography>
                  <Typography>{selectedAppointmentDetails.duration || 'N/A'} minutes</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Payment Information</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1" fontWeight="bold">Status</Typography>
                        <Chip 
                          label={selectedAppointmentDetails.payment_status || 'Pending'}
                          color={getPaymentStatusColor(selectedAppointmentDetails.payment_status)}
                          sx={{ mt: 0.5 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1" fontWeight="bold">Total Amount</Typography>
                        <Typography>{formatCurrency(selectedAppointmentDetails.payment_amount)}</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1" fontWeight="bold">Amount Paid</Typography>
                        <Typography>{formatCurrency(selectedAppointmentDetails.amount_paid || 0)}</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1" fontWeight="bold">Remaining Balance</Typography>
                        <Typography>
                          {formatCurrency(getRemainingAmount(selectedAppointmentDetails.payment_amount, selectedAppointmentDetails.amount_paid))}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1" fontWeight="bold">Payment Type</Typography>
                        <Typography>{selectedAppointmentDetails.payment_type || 'Pay at Salon'}</Typography>
                      </Grid>
                      
                      {selectedAppointmentDetails.payment_date && (
                        <Grid item xs={12} md={3}>
                          <Typography variant="subtitle1" fontWeight="bold">Payment Date</Typography>
                          <Typography>{format(parseISO(selectedAppointmentDetails.payment_date), 'MMM dd, yyyy')}</Typography>
                        </Grid>
                      )}
                      
                      {selectedAppointmentDetails.payment_notes && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight="bold">Payment Notes</Typography>
                          <Typography>{selectedAppointmentDetails.payment_notes}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold" mt={2}>Appointment Status</Typography>
                  <Chip 
                    label={selectedAppointmentDetails.appointment_status}
                    color={getStatusColor(selectedAppointmentDetails.appointment_status)}
                  />
                </Grid>
                
                {selectedAppointmentDetails.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" mt={2}>Notes</Typography>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>{selectedAppointmentDetails.notes}</Typography>
                  </Grid>
                )}
                
                {selectedAppointmentDetails.cancellation_reason && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" mt={2}>Cancellation Reason</Typography>
                    <Typography>{selectedAppointmentDetails.cancellation_reason}</Typography>
                  </Grid>
                )}
                
                {selectedAppointmentDetails.created_at && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" mt={2}>Created</Typography>
                    <Typography>{format(parseISO(selectedAppointmentDetails.created_at), 'MMM dd, yyyy HH:mm')}</Typography>
                  </Grid>
                )}
                
                {selectedAppointmentDetails.updated_at && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" mt={2}>Last Updated</Typography>
                    <Typography>{format(parseISO(selectedAppointmentDetails.updated_at), 'MMM dd, yyyy HH:mm')}</Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
              <Button onClick={handleCloseDetailsModal}>Close</Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  setSelectedAppointment(selectedAppointmentDetails);
                  setShowEditModal(true);
                  setShowDetailsModal(false);
                }}
              >
                Edit
              </Button>
            </DialogActions>
          </>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography>No appointment details available</Typography>
            <Button onClick={handleCloseDetailsModal} sx={{ mt: 2 }}>Close</Button>
          </Box>
        )}
      </Dialog>

      <AppointmentForm
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setAvailableTimeSlots([]); // Reset when closing
        }}
        onSubmit={handleEditAppointment}
        title="Edit Appointment"
        customers={customers}
        services={services}
        stylists={stylists}
        initialData={{
          customer_ID: selectedAppointment?.customer_ID || '',
          appointment_date: selectedAppointment?.appointment_date 
            ? format(new Date(selectedAppointment.appointment_date), 'yyyy-MM-dd')
            : '',
          appointment_time: formatTime(selectedAppointment?.appointment_time) || '',
          appointment_status: selectedAppointment?.appointment_status || 'Scheduled',
          services: selectedAppointment?.services 
            ? selectedAppointment.services.split(',').map(s => s.trim()) 
            : [],
          stylists: (() => {
            if (selectedAppointment?.stylists_IDs) {
              return selectedAppointment.stylists_IDs.split(',').map(id => Number(id.trim()));
            } else if (selectedAppointment?.stylist_ID) {
              return [Number(selectedAppointment.stylist_ID)];
            } else if (selectedAppointment?.stylists) {
              const stylistNames = selectedAppointment.stylists.split(',').map(name => name.trim());
              return stylists
                .filter(stylist => stylistNames.includes(`${stylist.firstname} ${stylist.lastname}`))
                .map(stylist => stylist.stylist_ID);
            }
            return [];
          })(),
          payment_status: selectedAppointment?.payment_status || 'Pending',
          payment_amount: (selectedAppointment?.payment_amount || 0).toString(),
          payment_type: selectedAppointment?.payment_type || 'Pay at Salon',
          amount_paid: (selectedAppointment?.amount_paid || 0).toString(),
          is_partial: selectedAppointment?.is_partial === 1,
          notes: selectedAppointment?.notes || '',
          payment_notes: selectedAppointment?.payment_notes || '',
          cancellation_reason: selectedAppointment?.cancellation_reason || ''
        }}
        loadingTimeSlots={false}
        availableTimeSlots={prepareEditTimeSlots()}
        isEdit={true}
        skipTimeSlots={false}
        fetchTimeSlots={fetchAvailableTimeSlots}
      />

      <AppointmentForm
        key={`create-form-${showCreateModal}-${selectedCustomerId}`}
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setAvailableTimeSlots([]);
        }}
        onSubmit={handleCreateAppointment}
        title="New Appointment"
        customers={customers}
        services={services}
        stylists={stylists}
        initialData={{
          customer_ID: selectedCustomerId || '',
          appointment_date: format(new Date(), 'yyyy-MM-dd'),
          appointment_time: '',
          appointment_status: 'Scheduled',
          services: [],
          stylists: [],
          payment_status: 'Pending',
          payment_amount: '0',
          payment_type: 'Pay at Salon',
          amount_paid: '0',
          is_partial: false,
          notes: '',
          payment_notes: '',
          cancellation_reason: ''
        }}
        loadingTimeSlots={loadingTimeSlots}
        availableTimeSlots={availableTimeSlots}
        isEdit={false}
        skipTimeSlots={false}
        fetchTimeSlots={fetchAvailableTimeSlots}
      />

      <CustomerRegistration
        open={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSave={handleRegisterCustomer}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

