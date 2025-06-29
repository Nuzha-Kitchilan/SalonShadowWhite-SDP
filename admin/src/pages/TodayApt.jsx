import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Paper, Snackbar, Alert, Typography, Container, useMediaQuery, useTheme, styled
} from "@mui/material";
import { Add as AddIcon, PersonAdd as PersonAddIcon } from "@mui/icons-material";
import axios from "axios";
import { format } from 'date-fns';

// Import components
import FilterBar from '../components/todayApt/FilterBar';
import AppointmentsTable from '../components/todayApt/AppointmentsTable';
import AppointmentDetailsModal from '../components/appointment/AppointmentDetails';
import CreateAppointmentModal from '../components/appointment/CreateAppointmentModal';
import EditAppointmentModal from '../components/appointment/EditAppointmentModal';
import CustomerRegistration from '../components/todayApt/CustomerRegistration';

// Import utilities
import {
  statusOptions, paymentStatusOptions, paymentTypeOptions,
  formatDate, formatTime, getStatusColor, getPaymentColor
} from '../components/appointment/utils';

const StyledPaper = styled(Paper)({
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid rgba(190, 175, 155, 0.2)',
  background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))',
});


const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  padding: theme.spacing(1, 2),
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
  },
}));


const PrimaryButton = styled(StyledButton)({
  backgroundColor: '#BEAF9B',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#9E8F7B',
  },
});

const SecondaryButton = styled(StyledButton)({
  backgroundColor: '#BEAF9B',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#9E8F7B',
  },
  border: '1px solid rgba(190, 175, 155, 0.5)',
});

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


const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Form state
  const [editForm, setEditForm] = useState({
    customer_ID: '',
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
  });

  // Define fetchAvailableTimeSlots early using useCallback
  const fetchAvailableTimeSlots = useCallback(async (date, stylistIds, servicesList) => {
    if (!date || !stylistIds?.length || !servicesList?.length) {
      return;
    }
  
    setLoadingTimeSlots(true);
    try {
      const serviceIds = servicesList.map(serviceName => {
        const service = services.find(s => s.service_name === serviceName);
        return service?.service_ID;
      }).filter(Boolean);
  
      const serviceDuration = calculateServiceDuration(servicesList);
  
      const response = await api.post('/booking/available-timeslots', {
        date,
        stylistIds,
        serviceIds,
        serviceDuration
      });
  
      if (response.data?.availableSlots) {
        setAvailableTimeSlots(response.data.availableSlots);
      } else {
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setAvailableTimeSlots([]);
    } finally {
      setLoadingTimeSlots(false);
    }
  }, [services]);

  useEffect(() => {
    console.log('Current appointment data:', {
      selectedAppointment,
      editForm,
      services,
      stylists,
      customers
    });
  }, [selectedAppointment, editForm, services, stylists, customers]);

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
      console.log('API Response:', response.data);
      if (response.data.success) {
        setSelectedAppointmentDetails(response.data.data);
        return response.data.data;
      } else {
        showSnackbar('Failed to fetch appointment details', 'error');
        return null;
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      showSnackbar('Error fetching appointment details', 'error');
      return null;
    } finally {
      setLoadingAppointmentDetails(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

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
            const stylistNames = selectedAppointment.stylists.split(',').map(s => s.trim());
            stylistIds = stylists
              .filter(stylist => stylistNames.includes(`${stylist.firstname} ${stylist.lastname}`))
              .map(stylist => stylist.stylist_ID);
          }
  
          // Ensure have at least one service and one stylist
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
          setAvailableTimeSlots([formatTime(selectedAppointment.appointment_time)]);
        } finally {
          setLoadingTimeSlots(false);
        }
      }
    };
  
    fetchEditTimeSlots();
  }, [showEditModal, selectedAppointment, services, stylists]);

  useEffect(() => {
    const fetchCreateTimeSlots = async () => {
      if (showCreateModal && !showEditModal && editForm.services?.length > 0 && editForm.stylists?.length > 0) {
        try {
          await fetchAvailableTimeSlots(
            editForm.appointment_date,
            editForm.stylists,
            editForm.services
          );
        } catch (error) {
          console.error('Error fetching time slots for create form:', error);
          setAvailableTimeSlots([]);
        }
      }
    };

    fetchCreateTimeSlots();
  }, [showCreateModal, editForm.services, editForm.stylists, editForm.appointment_date, fetchAvailableTimeSlots]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    
    // If services changed, update the payment amount
    if (name === 'services') {
      const totalPrice = services
        .filter(service => value.includes(service.service_name))
        .reduce((total, service) => total + (parseFloat(service.price) || 0), 0)
        .toFixed(2);
      
      setEditForm(prev => ({ ...prev, payment_amount: totalPrice }));
    }
  };


// handleCreateAppointment function
const handleCreateAppointment = async (e) => {
  e.preventDefault();
  try {
    // Create serviceStylists array from service_stylist_assignments
    const serviceStylists = [];
    
    // Use the service_stylist_assignments from editForm if available
    if (editForm.service_stylist_assignments && editForm.service_stylist_assignments.length > 0) {
      editForm.service_stylist_assignments.forEach(assignment => {
        // Make sure we have both service ID and stylist ID
        const serviceId = assignment.service_id || assignment.service_ID;
        const stylistId = assignment.stylist_id;
        
        if (serviceId && stylistId) {
          serviceStylists.push({
            service_ID: serviceId,
            stylist_ID: stylistId
          });
        }
      });
    }

    else if (editForm.services && editForm.services.length && editForm.stylists && editForm.stylists.length) {
      for (const serviceId of editForm.services) {
        const service = services.find(s => {
          const sId = s.service_id || s.service_ID;
          return sId == serviceId; 
        });
        
        // If service not found, log and continue to next
        if (!service) {
          console.error(`Service ID ${serviceId} not found in services array`);
          continue;
        }
        
        const serviceIdToUse = service.service_id || service.service_ID;
        
        for (const stylistId of editForm.stylists) {
          serviceStylists.push({
            service_ID: serviceIdToUse,
            stylist_ID: stylistId
          });
        }
      }
    }

    // Make sure we have at least one service-stylist pair
    if (serviceStylists.length === 0) {
      throw new Error('No service-stylist assignments found. Please assign at least one stylist to a service.');
    }

    // Create appointment data with serviceStylists
    const formData = {
      customer_ID: editForm.customer_ID,
      appointment_date: editForm.appointment_date,
      appointment_time: editForm.appointment_time + ':00',
      appointment_status: editForm.appointment_status,
      serviceStylists: serviceStylists,
      payment_status: editForm.payment_status,
      payment_amount: parseFloat(editForm.payment_amount || 0),
      payment_type: editForm.payment_type,
      amount_paid: parseFloat(editForm.amount_paid || 0),
      is_partial: editForm.is_partial,
      notes: editForm.notes || '',
      payment_notes: editForm.payment_notes || '',
      cancellation_reason: editForm.cancellation_reason || ''
    };

    console.log('Sending appointment data:', formData);
    const response = await api.post('/admin/appointments', formData);
    
    if (response.data.success) {
      showSnackbar('Appointment created successfully');
      fetchData();
      setShowCreateModal(false);
    } else {
      throw new Error(response.data.message || 'Failed to create appointment');
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    showSnackbar(error.message || 'Error creating appointment', 'error');
  }
};


// handleEditAppointment function
const handleEditAppointment = async (e) => {
  e.preventDefault();
  try {
    // Create serviceStylists array from service_stylist_assignments
    const serviceStylists = [];
    
    // Use the service_stylist_assignments from editForm if available
    if (editForm.service_stylist_assignments && editForm.service_stylist_assignments.length > 0) {
      editForm.service_stylist_assignments.forEach(assignment => {
        // Make sure we have both service ID and stylist ID
        const serviceId = assignment.service_id || assignment.service_ID;
        const stylistId = assignment.stylist_id;
        
        if (serviceId && stylistId) {
          serviceStylists.push({
            service_ID: serviceId,
            stylist_ID: stylistId
          });
        }
      });
    }
    // Fallback to old method if no assignments
    else if (editForm.services && editForm.services.length && editForm.stylists && editForm.stylists.length) {
      for (const serviceId of editForm.services) {
        // Find the actual service object to get the correct ID format
        const service = services.find(s => {
          // Check both service_id and service_ID and handle string/number comparison
          const sId = s.service_id || s.service_ID;
          return sId == serviceId; // Use == to handle type coercion
        });
        
        // If service not found, log and continue to next
        if (!service) {
          console.error(`Service ID ${serviceId} not found in services array`);
          continue;
        }
        
        const serviceIdToUse = service.service_id || service.service_ID;
        
        for (const stylistId of editForm.stylists) {
          serviceStylists.push({
            service_ID: serviceIdToUse,
            stylist_ID: stylistId
          });
        }
      }
    }

    // Make sure we have at least one service-stylist pair
    if (serviceStylists.length === 0) {
      throw new Error('No service-stylist assignments found. Please assign at least one stylist to a service.');
    }

    // Create appointment data with serviceStylists
    const formData = {
      customer_ID: editForm.customer_ID,
      appointment_date: editForm.appointment_date,
      appointment_time: editForm.appointment_time + ':00',
      appointment_status: editForm.appointment_status,
      serviceStylists: serviceStylists,
      payment_status: editForm.payment_status,
      payment_amount: parseFloat(editForm.payment_amount || 0),
      payment_type: editForm.payment_type,
      amount_paid: parseFloat(editForm.amount_paid || 0),
      is_partial: editForm.is_partial,
      notes: editForm.notes || '',
      payment_notes: editForm.payment_notes || '',
      cancellation_reason: editForm.cancellation_reason || ''
    };

    console.log('Sending updated appointment data:', formData);
    const response = await api.put(
      `/admin/appointments/${selectedAppointment.appointment_ID}`,
      formData
    );
    
    if (response.data.success) {
      showSnackbar('Appointment updated successfully');
      fetchData();
      setShowEditModal(false);
    } else {
      throw new Error(response.data.message || 'Failed to update appointment');
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
    showSnackbar(error.message || 'Error updating appointment', 'error');
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
      
      await fetchCustomers();
      setShowCustomerModal(false);
      
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


const handleEditClick = async (appointment) => {
  try {
    setLoading(true);
    
    // Fetch detailed appointment data
    const response = await api.get(`/admin/appointments/${appointment.appointment_ID}`);
    if (!response.data.success) {
      throw new Error('Failed to fetch appointment details');
    }

    const detailedAppointment = response.data.data;
    console.log('API Response:', detailedAppointment);
    setSelectedAppointment(detailedAppointment);

    // Extract services
    const serviceNames = detailedAppointment.services?.split(',').map(s => s.trim()) || [];
    const serviceObjects = services.filter(service => 
      serviceNames.includes(service.service_name)
    );
    const serviceIds = serviceObjects.map(s => s.service_ID || s.service_id);

    // Extract stylist names and IDs
    const stylistNames = detailedAppointment.stylists?.split(',').map(s => s.trim()) || [];
    const stylistNameToIdMap = {};
    stylists.forEach(stylist => {
      const fullName = `${stylist.firstname} ${stylist.lastname}`;
      stylistNameToIdMap[fullName] = stylist.stylist_ID;
    });

    // Create assignments - match services to stylists by position
    const assignments = serviceNames.map((serviceName, index) => {
      const service = services.find(s => s.service_name === serviceName);
      const stylistName = stylistNames[index] || stylistNames[0]; 
      const stylistId = stylistNameToIdMap[stylistName];

      return {
        service_id: service?.service_ID || service?.service_id || '',
        service_ID: service?.service_ID || service?.service_id || '',
        service_name: serviceName,
        stylist_id: stylistId || ''
      };
    });

    // Get unique stylist IDs
    const stylistIds = [...new Set(assignments.map(a => a.stylist_id))].filter(Boolean);

    // Prepare initial form state
    const initialForm = {
      customer_ID: detailedAppointment.customer_ID?.toString() || '',
      appointment_date: detailedAppointment.appointment_date || format(new Date(), 'yyyy-MM-dd'),
      appointment_time: detailedAppointment.appointment_time?.substring(0, 5) || '',
      appointment_status: detailedAppointment.appointment_status || 'Scheduled',
      services: serviceIds,
      service_objects: serviceObjects,
      service_stylist_assignments: assignments,
      stylists: stylistIds,
      payment_status: detailedAppointment.payment_status || 'Pending',
      payment_amount: detailedAppointment.payment_amount || '0.00',
      payment_type: detailedAppointment.payment_type || 'Pay at Salon',
      amount_paid: detailedAppointment.amount_paid || '0.00',
      is_partial: detailedAppointment.is_partial || false,
      notes: detailedAppointment.notes || '',
      payment_notes: detailedAppointment.payment_notes || '',
      cancellation_reason: detailedAppointment.cancellation_reason || ''
    };

    console.log('Initial Form State:', initialForm);
    setEditForm(initialForm);
    setShowEditModal(true);

    // Fetch available time slots
    if (initialForm.appointment_date && stylistIds.length > 0 && serviceIds.length > 0) {
      await fetchAvailableTimeSlots(
        initialForm.appointment_date,
        stylistIds,
        serviceIds
      );
    }

  } catch (error) {
    console.error('Error preparing appointment for edit:', error);
    showSnackbar(error.message || 'Error loading appointment data', 'error');
  } finally {
    setLoading(false);
  }
};


const getRemainingAmount = (total, paid) => {
    if (total === null || paid === null) return 0;
    const remaining = parseFloat(total) - parseFloat(paid);
    return remaining > 0 ? remaining : 0;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
      <StyledPaper elevation={0}>
        {/* Header Section */}
        <Box sx={{ 
          p: { xs: 2, md: 3 }, 
          borderBottom: '1px solid rgba(190, 175, 155, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              component="h1" 
              sx={{ 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontWeight: 600,
                color: '#453C33',
                my: 1
              }}
            >
              Today's Appointments
            </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
              <SecondaryButton
                startIcon={<PersonAddIcon />}
                onClick={() => setShowCustomerModal(true)}
              >
                Walk-In
              </SecondaryButton>
                            <PrimaryButton
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditForm({
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
                  });
                  setShowCreateModal(true);
                }}
              >
                New Appointment
              </PrimaryButton>
            </Box>
          </Box>
        </Box>

         <Box sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
          <FilterBar 
            filters={filters} 
            handleFilterChange={handleFilterChange} 
            stylists={stylists} 
          />
        </Box>

        <Box sx={{ p:0 }}>
          <AppointmentsTable
            appointments={appointments}
            loading={loading}
            handleViewAppointment={handleViewAppointment}
            setSelectedAppointment={setSelectedAppointment}
            setShowEditModal={setShowEditModal}
            handleEditClick={handleEditClick}
            handleDeleteAppointment={handleDeleteAppointment}
            formatTime={formatTime}
            formatCurrency={(amount) => `$${parseFloat(amount || 0).toFixed(2)}`}
            getStatusColor={getStatusColor}
            getPaymentStatusColor={getPaymentColor}
            getRemainingAmount={getRemainingAmount}
            sx={{
              '& .MuiTableCell-root': {
                fontFamily: "'Poppins', 'Roboto', sans-serif",
              }
            }}
          />
        </Box>
      </StyledPaper>

      {/* Modals remain unchanged */}
      <AppointmentDetailsModal
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        selectedAppointment={selectedAppointmentDetails}
        handleEditClick={handleEditClick}
        formatDate={formatDate}
      />

      <CreateAppointmentModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        editForm={editForm}
        setEditForm={setEditForm}
        services={services}
        stylists={stylists}
        customers={customers}
        statusOptions={statusOptions}
        paymentStatusOptions={paymentStatusOptions}
        paymentTypeOptions={paymentTypeOptions}
        handleSubmit={handleCreateAppointment}
        handleInputChange={handleInputChange}
        handleMultiSelectChange={handleMultiSelectChange}
        loadingTimeSlots={loadingTimeSlots}
        availableTimeSlots={availableTimeSlots}
        selectedAppointment={selectedAppointment}
        fetchTimeSlots={fetchAvailableTimeSlots}
      />

      <EditAppointmentModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editForm={editForm}
        setEditForm={setEditForm}
        services={services}
        stylists={stylists}
        customers={customers}
        statusOptions={statusOptions}
        paymentStatusOptions={paymentStatusOptions}
        paymentTypeOptions={paymentTypeOptions}
        handleSubmit={handleEditAppointment}
        handleInputChange={handleInputChange}
        handleMultiSelectChange={handleMultiSelectChange}
        loadingTimeSlots={loadingTimeSlots}
        availableTimeSlots={availableTimeSlots}
        selectedAppointment={selectedAppointment}
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
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}