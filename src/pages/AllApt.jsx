import { format, parseISO } from 'date-fns';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box, Typography, Button, Snackbar, Alert, CircularProgress
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import axios from "axios";
import AppointmentsTable from '../components/appointment/AppointmentsTable';
import AppointmentFilters from '../components/appointment/AppointmentFilters';
import CreateAppointmentModal from '../components/appointment/CreateAppointmentModal';
import EditAppointmentModal from '../components/appointment/EditAppointmentModal';
import AppointmentDetailsModal from '../components/appointment/AppointmentDetails';
import {
  statusOptions, paymentStatusOptions, paymentTypeOptions,
  formatDate, formatTime, getStatusColor, getPaymentColor, generateMockTimeSlots
} from '../components/appointment/utils';

// Enhanced debounce function with cancel capability
const debounce = (func, wait) => {
  let timeout;
  
  const debounced = function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };

  debounced.cancel = () => {
    clearTimeout(timeout);
  };

  return debounced;
};

// Axios instance with authentication
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Authentication error. Please login again.");
    }
    return Promise.reject(error);
  }
);

export default function AppointmentsManagement() {
  // State declarations
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [editForm, setEditForm] = useState({
    customer_ID: '',
    appointment_date: '',
    appointment_time: '',
    appointment_status: 'Scheduled',
    services: [],
    stylists: [],
    payment_status: 'Pending',
    payment_amount: '0',
    payment_type: 'Pay at Salon'
  });

  const [searchParams, setSearchParams] = useState({
    appointmentId: '',
    date: '',
    customerName: ''
  });

  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    totalItems: 0
  });

  // Create a ref for fetchData to maintain stable reference
  const fetchDataRef = useRef();
  fetchDataRef.current = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: pagination.page + 1,
        limit: pagination.rowsPerPage
      };
      
      if (searchParams.appointmentId) params.appointmentId = searchParams.appointmentId;
      if (searchParams.date) params.date = searchParams.date;
      if (searchParams.customerName) params.customerName = searchParams.customerName;
  
      const [appointmentsRes, servicesRes, stylistsRes, customersRes] = await Promise.allSettled([
        api.get('/admin/appointments', { params }),
        api.get('/admin/services'),
        api.get('/admin/stylists'),
        api.get('/admin/customers')
      ]);

      if (appointmentsRes.status === 'fulfilled' && appointmentsRes.value.data.success) {
        setAppointments(appointmentsRes.value.data.data || []);
        setPagination(prev => ({
          ...prev,
          totalItems: appointmentsRes.value.data.pagination?.totalItems || 0
        }));
      }
      
      if (servicesRes.status === 'fulfilled' && servicesRes.value.data.success) {
        setServices(servicesRes.value.data.data || []);
      }
      
      if (stylistsRes.status === 'fulfilled' && stylistsRes.value.data.success) {
        setStylists(stylistsRes.value.data.data || []);
      }
      
      if (customersRes.status === 'fulfilled' && customersRes.value.data.success) {
        setCustomers(customersRes.value.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Create debounced version of fetchData
  const debouncedFetchData = useMemo(() => 
    debounce(() => {
      setIsSearching(true);
      fetchDataRef.current();
    }, 500),
  []);

  useEffect(() => {
    debouncedFetchData();
    return () => debouncedFetchData.cancel();
  }, [pagination.page, pagination.rowsPerPage, searchParams]);

  const handleSearch = (e) => {
    e?.preventDefault();
    setIsSearching(true);
    setPagination(prev => ({ ...prev, page: 0 }));
    fetchDataRef.current();
  };

  const clearSearch = () => {
    setSearchParams({
      appointmentId: '',
      date: '',
      customerName: ''
    });
    setPagination(prev => ({ ...prev, page: 0 }));
    setIsSearching(false);
    fetchDataRef.current();
  };

  const calculatePaymentAmount = (selectedServices) => {
    if (!services.length || !selectedServices.length) return 0;
    
    let totalAmount = 0;
    selectedServices.forEach(serviceName => {
      const serviceObj = services.find(s => s.service_name === serviceName);
      if (serviceObj && serviceObj.price) {
        totalAmount += parseFloat(serviceObj.price);
      }
    });
    
    return totalAmount;
  };

  const calculateServiceDuration = (selectedServices) => {
    if (!services.length || !selectedServices.length) return 0;
    
    let totalDuration = 0;
    selectedServices.forEach(serviceName => {
      const serviceObj = services.find(s => s.service_name === serviceName);
      if (serviceObj && serviceObj.time_duration) {
        totalDuration += parseInt(serviceObj.time_duration);
      }
    });
    
    return totalDuration;
  };

  useEffect(() => {
    if (editForm.services && editForm.services.length > 0) {
      const calculatedAmount = calculatePaymentAmount(editForm.services);
      setEditForm(prev => ({
        ...prev,
        payment_amount: calculatedAmount.toString()
      }));
    }
  }, [editForm.services, services]);

  useEffect(() => {
    if (editForm.appointment_date && editForm.stylists.length > 0 && editForm.services.length > 0) {
      fetchAvailableTimeSlots();
    } else {
      setAvailableTimeSlots([]);
    }
  }, [editForm.appointment_date, editForm.stylists]);

  const fetchAvailableTimeSlots = async () => {
    if (!editForm.appointment_date || !editForm.stylists.length || !editForm.services.length) {
      return;
    }
    
    setLoadingTimeSlots(true);
    try {
      const serviceDuration = calculateServiceDuration(editForm.services);
      const stylistId = editForm.stylists[0];
      
      const response = await api.post('/booking/available-timeslots', {
        date: editForm.appointment_date,
        stylistId,
        serviceDuration
      });
      
      const originalTimeSlot = selectedAppointment?.appointment_time 
        ? selectedAppointment.appointment_time.substring(0, 5)
        : null;
      
      if (response.data && response.data.availableSlots) {
        const allSlots = [...new Set([
          ...response.data.availableSlots,
          ...(originalTimeSlot ? [originalTimeSlot] : [])
        ])];
        
        setAvailableTimeSlots(allSlots);
        
        if (originalTimeSlot) {
          setEditForm(prev => ({ ...prev, appointment_time: originalTimeSlot }));
        } 
        else if (allSlots.length > 0 && !editForm.appointment_time) {
          setEditForm(prev => ({ ...prev, appointment_time: allSlots[0] }));
        }
      } else {
        setAvailableTimeSlots(originalTimeSlot ? [originalTimeSlot] : []);
        if (originalTimeSlot) {
          setEditForm(prev => ({ ...prev, appointment_time: originalTimeSlot }));
        }
        showSnackbar('No available time slots for selected date and stylist', 'warning');
      }
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      const mockTimeSlots = generateMockTimeSlots();
      const originalTimeSlot = selectedAppointment?.appointment_time 
        ? selectedAppointment.appointment_time.substring(0, 5)
        : null;
      const allSlots = [...new Set([
        ...mockTimeSlots,
        ...(originalTimeSlot ? [originalTimeSlot] : [])
      ])];
      
      setAvailableTimeSlots(allSlots);
      
      if (originalTimeSlot) {
        setEditForm(prev => ({ ...prev, appointment_time: originalTimeSlot }));
      } else if (allSlots.length > 0 && !editForm.appointment_time) {
        setEditForm(prev => ({ ...prev, appointment_time: allSlots[0] }));
      }
      
      showSnackbar('Using sample time slots (API endpoint not available)', 'info');
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/appointments/${id}`);
      if (response.data.success) {
        showSnackbar('Appointment deleted successfully');
        fetchDataRef.current();
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      showSnackbar('Error deleting appointment', 'error');
    }
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

    // Extract service names from string
    const serviceNames = detailedAppointment.services?.split(',').map(s => s.trim()) || [];
    const normalizedServiceNames = serviceNames.map(s => s.toLowerCase());

    // Match services by name (case-insensitive, trimmed)
    const serviceObjects = services.filter(service =>
      normalizedServiceNames.includes(service.service_name.toLowerCase().trim())
    );
    const serviceIds = serviceObjects.map(s => s.service_ID || s.service_id);

    // If no services matched, show error and stop
    if (serviceObjects.length === 0) {
      showSnackbar('One or more services from this appointment were not found. Please reload or check your services list.', 'error');
      return;
    }

    // Extract stylist names
    const stylistNames = detailedAppointment.stylists?.split(',').map(s => s.trim()) || [];
    const stylistNameToIdMap = {};
    stylists.forEach(stylist => {
      const fullName = `${stylist.firstname} ${stylist.lastname}`.trim();
      stylistNameToIdMap[fullName.toLowerCase()] = stylist.stylist_ID;
    });

    // Create assignments matching services to stylists
    const assignments = serviceNames.map((serviceName, index) => {
      const service = services.find(s => s.service_name.toLowerCase().trim() === serviceName.toLowerCase().trim());
      const stylistName = stylistNames[index] || stylistNames[0]; // fallback
      const stylistId = stylistNameToIdMap[stylistName.toLowerCase()] || '';

      return {
        service_id: service?.service_ID || service?.service_id || '',
        service_ID: service?.service_ID || service?.service_id || '',
        service_name: serviceName,
        stylist_id: stylistId
      };
    });

    // Unique stylist IDs
    const stylistIds = [...new Set(assignments.map(a => a.stylist_id))].filter(Boolean);

    // Build initial form state
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
      amount_paid: detailedAppointment.amount_paid || '0.00',
      payment_type: detailedAppointment.payment_type || 'Pay at Salon',
      is_partial: detailedAppointment.is_partial || false,
      notes: detailedAppointment.notes || '',
      payment_notes: detailedAppointment.payment_notes || '',
      cancellation_reason: detailedAppointment.cancellation_reason || ''
    };

    console.log('Initial Form State:', initialForm);
    setEditForm(initialForm);
    setShowEditModal(true);

    // Load time slots
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



  const handleCreateClick = () => {
    setEditForm({
      customer_ID: customers.length > 0 ? customers[0].customer_ID : '',
      appointment_date: format(new Date(), 'yyyy-MM-dd'),
      appointment_time: '',
      appointment_status: 'Scheduled',
      services: [],
      stylists: [],
      payment_status: 'Pending',
      payment_amount: '0',
      payment_type: 'Pay at Salon'
    });
    setAvailableTimeSlots([]);
    setShowCreateModal(true);
  };


const handleSubmit = async (e, isEdit = true) => {
  e.preventDefault();

  // Basic validation
  if (
    !editForm.customer_ID ||
    !editForm.appointment_date ||
    !editForm.appointment_time ||
    !editForm.services.length ||
    !editForm.stylists.length
  ) {
    showSnackbar('Please select timeslot', 'error');
    return;
  }

  const paymentAmount = parseFloat(editForm.payment_amount);
  if (isNaN(paymentAmount)) {
    showSnackbar('Please enter a valid payment amount', 'error');
    return;
  }

  try {
    const serviceStylists = [];

    //  Loop through service IDs
    for (const serviceId of editForm.services) {
      const service = services.find(s =>
        s.service_ID === serviceId || s.service_id === serviceId
      );

      if (!service) {
        showSnackbar(`Service ID ${serviceId} not found. Please refresh the page.`, 'error');
        return;
      }

      const finalServiceId = service.service_ID || service.service_id;

      for (const stylistId of editForm.stylists) {
        serviceStylists.push({
          service_ID: finalServiceId,
          stylist_ID: stylistId
        });
      }
    }

    const formData = {
      customer_ID: editForm.customer_ID,
      appointment_date: editForm.appointment_date,
      appointment_time: editForm.appointment_time + ':00', 
      appointment_status: editForm.appointment_status,
      serviceStylists,
      payment_status: editForm.payment_status,
      payment_amount: paymentAmount,
      payment_type: editForm.payment_type,
      is_partial: editForm.is_partial || false,
      amount_paid: parseFloat(editForm.amount_paid || 0),
      notes: editForm.notes || '',
      payment_notes: editForm.payment_notes || '',
      cancellation_reason: editForm.cancellation_reason || ''
    };

    const url = isEdit
      ? `/admin/appointments/${selectedAppointment.appointment_ID}`
      : '/admin/appointments';

    const method = isEdit ? 'put' : 'post';

    const response = await api[method](url, formData);

    if (response.data.success) {
      showSnackbar(`Appointment ${isEdit ? 'updated' : 'created'} successfully`);
      fetchDataRef.current();

      if (isEdit) {
        setShowEditModal(false);
      } else {
        setShowCreateModal(false);
      }
    }
  } catch (error) {
    console.error(`Error ${isEdit ? 'updating' : 'creating'} appointment:`, error);
    showSnackbar(
      error.response?.data?.message || `Error ${isEdit ? 'updating' : 'creating'} appointment`,
      'error'
    );
  }
};



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: typeof value === 'string' ? value.split(',') : value }));
  };

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePage = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination(prev => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    }));
  };

  const showDetails = async (id) => {
    try {
      const response = await api.get(`/admin/appointments/${id}`);
      if (response.data.success) {
        setSelectedAppointment(response.data.data);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      
      const appointment = appointments.find(apt => apt.appointment_ID === id);
      if (appointment) {
        setSelectedAppointment(appointment);
        setShowDetailsModal(true);
      }
    }
  };

  const handleDeleteClick = (appointment) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      handleDelete(appointment.appointment_ID);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ margin: "20px" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "20px" }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Appointments
        </Typography>
      
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
          sx={{ 
            backgroundColor: "#BEAF9B", 
            color: "white", 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            boxShadow: "0 2px 6px rgba(190, 175, 155, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            '&:hover': { 
              backgroundColor: "#A89583",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 10px rgba(190, 175, 155, 0.4)"
            },
            textTransform: 'none',
            borderRadius: '6px',
            px: 3,
            py: 1
          }}
        >
          New Appointment
        </Button>
      </Box>

      <AppointmentFilters
        searchParams={searchParams}
        handleSearchInputChange={handleSearchInputChange}
        handleSearch={handleSearch}
        clearSearch={clearSearch}
        isSearching={isSearching}
      />

      <AppointmentsTable
        appointments={appointments}
        pagination={pagination}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        showDetails={showDetails}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        formatDate={formatDate}
        formatTime={formatTime}
        getStatusColor={getStatusColor}
        getPaymentColor={getPaymentColor}
      />

      <AppointmentDetailsModal
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        selectedAppointment={selectedAppointment}
        handleEditClick={handleEditClick}
        formatDate={formatDate}
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
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleMultiSelectChange={handleMultiSelectChange}
        loadingTimeSlots={loadingTimeSlots}
        availableTimeSlots={availableTimeSlots}
        selectedAppointment={selectedAppointment}
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
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleMultiSelectChange={handleMultiSelectChange}
        loadingTimeSlots={loadingTimeSlots}
        availableTimeSlots={availableTimeSlots}
        selectedAppointment={selectedAppointment}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}