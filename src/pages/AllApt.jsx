// import React, { useState, useEffect } from 'react';
// import {
//   Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
//   Paper, IconButton, TextField, Button, Dialog, DialogActions, DialogContent,
//   Box, Chip, MenuItem, Select, FormControl, InputLabel, TablePagination,
//   Typography, CircularProgress, Snackbar, Alert, Grid, RadioGroup, FormControlLabel, Radio,  InputAdornment 
// } from "@mui/material";
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Visibility as VisibilityIcon,
//   Close as CloseIcon,
//   Save as SaveIcon,
//   Add as AddIcon,
//   Search as SearchIcon,
//   Clear as ClearIcon
  
// } from "@mui/icons-material";
// import axios from "axios";
// import { format, parseISO } from 'date-fns';

// const statusOptions = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show'];
// const paymentStatusOptions = ['Pending', 'Paid', 'Refunded', 'Failed'];
// const paymentTypeOptions = ['Online', 'Pay at Salon'];

// // Create axios instance with authentication
// const api = axios.create({
//   baseURL: 'http://localhost:5001/api',
//   withCredentials: true, // Important for sending cookies with requests
// });

// // Add interceptor to handle authentication errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Redirect to login or show auth error
//       console.error("Authentication error. Please login again.");
//       // window.location.href = '/login'; // Uncomment to redirect
//     }
//     return Promise.reject(error);
//   }
// );

// export default function AppointmentsTable() {
//   const [appointments, setAppointments] = useState([]);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [services, setServices] = useState([]);
//   const [stylists, setStylists] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
//   const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
//   const [editForm, setEditForm] = useState({
//     customer_ID: '',
//     appointment_date: '',
//     appointment_time: '',
//     appointment_status: 'Scheduled',
//     services: [],
//     stylists: [],
//     payment_status: 'Pending',
//     payment_amount: '0',
//     payment_type: 'Pay at Salon'
//   });


//   // Search state
//   const [searchParams, setSearchParams] = useState({
//     appointmentId: '',
//     date: '',
//     customerName: ''
//   });
//   const [isSearching, setIsSearching] = useState(false);

//   // Pagination state
//   const [pagination, setPagination] = useState({
//     page: 0,
//     rowsPerPage: 10,
//     totalItems: 0
//   });

  
//   const fetchData = async () => {
//     try {
//       setLoading(true);
  
//       const params = {
//         page: pagination.page + 1,
//         limit: pagination.rowsPerPage
//       };
      
//       // Add search parameters if they exist
//       if (searchParams.appointmentId) params.appointmentId = searchParams.appointmentId;
//       if (searchParams.date) params.date = searchParams.date;
//       if (searchParams.customerName) params.customerName = searchParams.customerName;
  
//       // Use Promise.allSettled instead of Promise.all to handle partial failures
//       const [appointmentsRes, servicesRes, stylistsRes, customersRes] = await Promise.allSettled([
//         api.get('/admin/appointments', { params }), // Use the params object here
//         api.get('/admin/services'),
//         api.get('/admin/stylists'),
//         api.get('/admin/customers')
//       ]);



//       // Handle appointments data
//       if (appointmentsRes.status === 'fulfilled' && appointmentsRes.value.data.success) {
//         setAppointments(appointmentsRes.value.data.data || []);
//         setPagination(prev => ({
//           ...prev,
//           totalItems: appointmentsRes.value.data.pagination?.totalItems || 0
//         }));
//       } else {
//         console.error('Error fetching appointments:', appointmentsRes.reason || 'Unknown error');
//         showSnackbar('Failed to fetch appointments', 'error');
//       }
      
//       // Handle services data
//       if (servicesRes.status === 'fulfilled' && servicesRes.value.data.success) {
//         setServices(servicesRes.value.data.data || []);
//       } else {
//         console.error('Error fetching services:', servicesRes.reason || 'Unknown error');
//       }
      
//       // Handle stylists data
//       if (stylistsRes.status === 'fulfilled' && stylistsRes.value.data.success) {
//         setStylists(stylistsRes.value.data.data || []);
//       } else {
//         console.error('Error fetching stylists:', stylistsRes.reason || 'Unknown error');
//       }
      
//       // Handle customers data
//       if (customersRes.status === 'fulfilled' && customersRes.value.data.success) {
//         setCustomers(customersRes.value.data.data || []);
//       } else {
//         console.error('Error fetching customers:', customersRes.reason || 'Unknown error');
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       showSnackbar('Failed to fetch data', 'error');
//     } finally {
//       setLoading(false);
//       setIsSearching(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [pagination.page, pagination.rowsPerPage, searchParams]);

//   // Handle search
//   const handleSearch = () => {
//     setIsSearching(true);
//     setPagination(prev => ({ ...prev, page: 0 })); // Reset to first page when searching
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchParams({
//       appointmentId: '',
//       date: '',
//       customerName: ''
//     });
//     // Reset pagination and fetch data
//     setPagination(prev => ({ ...prev, page: 0 }));
//     setIsSearching(false);
//     fetchData();
//   };

//   // Calculate payment amount based on selected services
//   const calculatePaymentAmount = (selectedServices) => {
//     if (!services.length || !selectedServices.length) return 0;
    
//     let totalAmount = 0;
//     selectedServices.forEach(serviceName => {
//       const serviceObj = services.find(s => s.service_name === serviceName);
//       if (serviceObj && serviceObj.price) {
//         totalAmount += parseFloat(serviceObj.price);
//       }
//     });
    
//     return totalAmount;
//   };

//   // Calculate total service duration
//   const calculateServiceDuration = (selectedServices) => {
//     if (!services.length || !selectedServices.length) return 0;
    
//     let totalDuration = 0;
//     selectedServices.forEach(serviceName => {
//       const serviceObj = services.find(s => s.service_name === serviceName);
//       if (serviceObj && serviceObj.time_duration) {
//         totalDuration += parseInt(serviceObj.time_duration);
//       }
//     });
    
//     return totalDuration;
//   };

//   // Update payment amount when services are selected
//   useEffect(() => {
//     if (editForm.services && editForm.services.length > 0) {
//       const calculatedAmount = calculatePaymentAmount(editForm.services);
//       setEditForm(prev => ({
//         ...prev,
//         payment_amount: calculatedAmount.toString()
//       }));
//     }
//   }, [editForm.services, services]);

//   // Fetch available time slots when date or stylist changes
//   useEffect(() => {
//     if (editForm.appointment_date && editForm.stylists.length > 0 && editForm.services.length > 0) {
//       fetchAvailableTimeSlots();
//     } else {
//       setAvailableTimeSlots([]);
//     }
//   }, [editForm.appointment_date, editForm.stylists]);

//   const fetchAvailableTimeSlots = async () => {
//     if (!editForm.appointment_date || !editForm.stylists.length || !editForm.services.length) {
//       return;
//     }
    
//     setLoadingTimeSlots(true);
//     try {
//       const serviceDuration = calculateServiceDuration(editForm.services);
//       const stylistId = editForm.stylists[0];
      
//       const response = await api.post('/booking/available-timeslots', {
//         date: editForm.appointment_date,
//         stylistId,
//         serviceDuration
//       });
      
//       // Get original time slot if editing
//       const originalTimeSlot = selectedAppointment?.appointment_time 
//         ? selectedAppointment.appointment_time.substring(0, 5)
//         : null;
      
//       if (response.data && response.data.availableSlots) {
//         // Combine available slots with original time slot (if editing)
//         const allSlots = [...new Set([
//           ...response.data.availableSlots,
//           ...(originalTimeSlot ? [originalTimeSlot] : [])
//         ])];
        
//         setAvailableTimeSlots(allSlots);
        
//         // If editing and we have the original time, keep it selected
//         if (originalTimeSlot) {
//           setEditForm(prev => ({ ...prev, appointment_time: originalTimeSlot }));
//         } 
//         // Otherwise select first available slot if none selected
//         else if (allSlots.length > 0 && !editForm.appointment_time) {
//           setEditForm(prev => ({ ...prev, appointment_time: allSlots[0] }));
//         }
//       } else {
//         // Fallback to just the original time slot if available
//         setAvailableTimeSlots(originalTimeSlot ? [originalTimeSlot] : []);
//         if (originalTimeSlot) {
//           setEditForm(prev => ({ ...prev, appointment_time: originalTimeSlot }));
//         }
//         showSnackbar('No available time slots for selected date and stylist', 'warning');
//       }
//     } catch (error) {
//       console.error('Error fetching available time slots:', error);
//       // In error case, use mock slots plus original time
//       const mockTimeSlots = generateMockTimeSlots();
//       const originalTimeSlot = selectedAppointment?.appointment_time 
//         ? selectedAppointment.appointment_time.substring(0, 5)
//         : null;
//       const allSlots = [...new Set([
//         ...mockTimeSlots,
//         ...(originalTimeSlot ? [originalTimeSlot] : [])
//       ])];
      
//       setAvailableTimeSlots(allSlots);
      
//       if (originalTimeSlot) {
//         setEditForm(prev => ({ ...prev, appointment_time: originalTimeSlot }));
//       } else if (allSlots.length > 0 && !editForm.appointment_time) {
//         setEditForm(prev => ({ ...prev, appointment_time: allSlots[0] }));
//       }
      
//       showSnackbar('Using sample time slots (API endpoint not available)', 'info');
//     } finally {
//       setLoadingTimeSlots(false);
//     }
//   };

//   // Helper function to generate mock time slots for testing
//   const generateMockTimeSlots = () => {
//     const slots = [];
//     const start = 8; 
//     const end = 18; 
    
//     for (let hour = start; hour <= end; hour++) {
//       for (let minutes of ['00', '15']) {
//         if (hour === end && minutes === '15') continue; // Skip 5:30 PM
//         slots.push(`${hour.toString().padStart(2, '0')}:${minutes}`);
//       }
//     }
    
//     return slots;
//   };

//   const showSnackbar = (message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await api.delete(`/admin/appointments/${id}`);
//       if (response.data.success) {
//         showSnackbar('Appointment deleted successfully');
//         fetchData();
//       } else {
//         showSnackbar('Failed to delete appointment', 'error');
//       }
//     } catch (error) {
//       console.error('Error deleting appointment:', error);
//       showSnackbar('Error deleting appointment', 'error');
//     }
//   };

//   const handleEditClick = async (appointment) => {
//     try {
//       const response = await api.get(`/admin/appointments/${appointment.appointment_ID}`);
//       if (response.data.success) {
//         const detailedAppointment = response.data.data;
//         setSelectedAppointment(detailedAppointment);
        
//         const paymentType = detailedAppointment.payment_type && 
//                            paymentTypeOptions.includes(detailedAppointment.payment_type) 
//                            ? detailedAppointment.payment_type 
//                            : 'Pay at Salon';
        
//         // Extract appointment time in HH:MM format
//         const appointmentTime = detailedAppointment.appointment_time ? 
//                                detailedAppointment.appointment_time.substring(0, 5) : '';
        
//         const initialForm = {
//           customer_ID: detailedAppointment.customer_ID,
//           appointment_date: detailedAppointment.appointment_date ? detailedAppointment.appointment_date.split('T')[0] : '',
//           appointment_time: appointmentTime,
//           appointment_status: detailedAppointment.appointment_status || 'Scheduled',
//           services: detailedAppointment.services ? detailedAppointment.services.split(',').map(s => s.trim()) : [],
//           stylists: detailedAppointment.stylists ? stylists
//             .filter(stylist => detailedAppointment.stylists.includes(`${stylist.firstname} ${stylist.lastname}`))
//             .map(stylist => stylist.stylist_ID) : [],
//           payment_status: detailedAppointment.payment_status || 'Pending',
//           payment_amount: detailedAppointment.payment_amount ? detailedAppointment.payment_amount.toString() : '0',
//           payment_type: paymentType
//         };
        
//         setEditForm(initialForm);
//         setShowEditModal(true);
        
//         // Immediately fetch available time slots
//         if (initialForm.appointment_date && initialForm.stylists.length > 0 && initialForm.services.length > 0) {
//           fetchAvailableTimeSlots();
//         }
//       } else {
//         showSnackbar('Failed to fetch appointment details', 'error');
//       }
//     } catch (error) {
//       console.error('Error fetching appointment details:', error);
//       showSnackbar('Error fetching appointment details', 'error');
      
//       // Fallback to basic data if API fails
//       if (appointment) {
//         setSelectedAppointment(appointment);
        
//         const appointmentTime = appointment.appointment_time ? 
//                                appointment.appointment_time.substring(0, 5) : '';
        
//         const initialForm = {
//           customer_ID: appointment.customer_ID || '',
//           appointment_date: appointment.appointment_date ? appointment.appointment_date.split('T')[0] : format(new Date(), 'yyyy-MM-dd'),
//           appointment_time: appointmentTime,
//           appointment_status: appointment.appointment_status || 'Scheduled',
//           services: appointment.services ? appointment.services.split(',').map(s => s.trim()) : [],
//           stylists: [],
//           payment_status: appointment.payment_status || 'Pending',
//           payment_amount: appointment.payment_amount ? appointment.payment_amount.toString() : '0',
//           payment_type: appointment.payment_type || 'Pay at Salon'
//         };
        
//         setEditForm(initialForm);
//         setShowEditModal(true);
//         fetchAvailableTimeSlots();
//       }
//     }
//   };

//   // Add a handler for the time slot selection
// const handleTimeSlotChange = (time) => {
//   setEditForm({
//     ...editForm,
//     appointment_time: time,
//     selectedTimeSlot: time
//   });
// };

//   const handleCreateClick = () => {
//     setEditForm({
//       customer_ID: customers.length > 0 ? customers[0].customer_ID : '',
//       appointment_date: format(new Date(), 'yyyy-MM-dd'),
//       appointment_time: '',
//       appointment_status: 'Scheduled',
//       services: [],
//       stylists: [],
//       payment_status: 'Pending',
//       payment_amount: '0',
//       payment_type: 'Pay at Salon'
//     });
//     setAvailableTimeSlots([]);
//     setShowCreateModal(true);
//   };

//   const handleSubmit = async (e, isEdit = true) => {
//     e.preventDefault();
    
//     // Validate required fields
//     if (!editForm.customer_ID || !editForm.appointment_date || !editForm.appointment_time || 
//         !editForm.services.length || !editForm.stylists.length) {
//       showSnackbar('Please select timeslot', 'error');
//       return;
//     }
  
//     // Validate that payment_amount is a valid number
//     const paymentAmount = parseFloat(editForm.payment_amount);
//     if (isNaN(paymentAmount)) {
//       showSnackbar('Please enter a valid payment amount', 'error');
//       return;
//     }
  
//     try {
//       // Debug: Log all services for verification
//       console.log('All services:', services);
  
//       // Convert services and stylists to serviceStylists format
//       const serviceStylists = [];
      
//       for (const serviceName of editForm.services) {
//         const service = services.find(s => s.service_name === serviceName);
        
//         if (!service) {
//           showSnackbar(`Service "${serviceName}" not found. Please refresh the page.`, 'error');
//           return;
//         }
        
//         // Use the correct property name here (service_id or service_ID)
//         const serviceId = service.service_id || service.service_ID;
        
//         if (!serviceId) {
//           showSnackbar(`Service ID not found for "${serviceName}"`, 'error');
//           return;
//         }
  
//         for (const stylistId of editForm.stylists) {
//           serviceStylists.push({
//             service_ID: serviceId, // This must match exactly what your backend expects
//             stylist_ID: stylistId
//           });
//         }
//       }
  
//       // Debug: Verify the final serviceStylists structure
//       console.log('Final serviceStylists:', serviceStylists);
  
//       const formData = {
//         customer_ID: editForm.customer_ID,
//         appointment_date: editForm.appointment_date,
//         appointment_time: editForm.appointment_time + ':00',
//         appointment_status: editForm.appointment_status,
//         serviceStylists,
//         payment_status: editForm.payment_status,
//         payment_amount: paymentAmount,
//         payment_type: editForm.payment_type
//       };
  
//       console.log('Final payload to backend:', JSON.stringify(formData, null, 2));
  
//       const url = isEdit 
//         ? `/admin/appointments/${selectedAppointment.appointment_ID}`
//         : '/admin/appointments';
//       const method = isEdit ? 'put' : 'post';
  
//       const response = await api[method](url, formData);
//       if (response.data.success) {
//         showSnackbar(`Appointment ${isEdit ? 'updated' : 'created'} successfully`);
//         fetchData();
//         isEdit ? setShowEditModal(false) : setShowCreateModal(false);
//       } else {
//         showSnackbar(response.data.message || `Failed to ${isEdit ? 'update' : 'create'} appointment`, 'error');
//       }
//     } catch (error) {
//       console.error(`Error ${isEdit ? 'updating' : 'creating'} appointment:`, error);
//       showSnackbar(error.response?.data?.message || `Error ${isEdit ? 'updating' : 'creating'} appointment`, 'error');
//     }
//   };
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleMultiSelectChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm(prev => ({ ...prev, [name]: typeof value === 'string' ? value.split(',') : value }));
//   };

//   const handleSearchInputChange = (e) => {
//     const { name, value } = e.target;
//     setSearchParams(prev => ({ ...prev, [name]: value }));
//   };

//   const handleChangePage = (event, newPage) => {
//     setPagination(prev => ({ ...prev, page: newPage }));
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setPagination(prev => ({
//       ...prev,
//       rowsPerPage: parseInt(event.target.value, 10),
//       page: 0
//     }));
//   };

//   const showDetails = async (id) => {
//     try {
//       const response = await api.get(`/admin/appointments/${id}`);
//       if (response.data.success) {
//         setSelectedAppointment(response.data.data);
//         setShowDetailsModal(true);
//       } else {
//         showSnackbar('Failed to fetch appointment details', 'error');
//       }
//     } catch (error) {
//       console.error('Error fetching appointment details:', error);
      
//       // Find the appointment in the current list as a fallback
//       const appointment = appointments.find(apt => apt.appointment_ID === id);
//       if (appointment) {
//         setSelectedAppointment(appointment);
//         setShowDetailsModal(true);
//       } else {
//         showSnackbar('Error fetching appointment details', 'error');
//       }
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       return format(parseISO(dateString), 'MMM dd, yyyy');
//     } catch (error) {
//       console.error('Error formatting date:', dateString, error);
//       return dateString;
//     }
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return "N/A";
//     return timeString.substring(0, 5);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Completed': return 'success';
//       case 'Cancelled': return 'error';
//       case 'Confirmed': return 'info';
//       case 'No-show': return 'error';
//       default: return 'warning';
//     }
//   };

//   const getPaymentColor = (status) => {
//     switch (status) {
//       case 'Paid': return 'success';
//       case 'Refunded': return 'info';
//       case 'Failed': return 'error';
//       default: return 'warning';
//     }
//   };

//   const handleDeleteClick = (appointment) => {
//     if (window.confirm('Are you sure you want to delete this appointment?')) {
//       handleDelete(appointment.appointment_ID);
//     }
//   };

//   const renderTimeSlots = () => {
//     if (loadingTimeSlots) {
//       return (
//         <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
//           <CircularProgress size={24} />
//         </Box>
//       );
//     }
  
//     if (!editForm.appointment_date || !editForm.stylists.length || !editForm.services.length) {
//       return (
//         <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
//           Please select date, stylist, and services to view available time slots
//         </Typography>
//       );
//     }
    
//     // Get the originally booked time slot from the selected appointment
//     const originalTimeSlot = selectedAppointment?.appointment_time 
//       ? selectedAppointment.appointment_time.substring(0, 5)
//       : null;
  
//     return (
//       <FormControl component="fieldset" fullWidth margin="normal" required>
//         <Typography variant="subtitle2" sx={{ mb: 1 }}>Time Slot Selection</Typography>
        
//         {/* Show originally booked time slot */}
//         {originalTimeSlot && (
//           <Box sx={{ mb: 2, p: 1, backgroundColor: '#fff8e1', borderRadius: 1 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Currently Booked Time:
//             </Typography>
//             <Chip 
//               label={originalTimeSlot} 
//               color="primary"
//               sx={{ mt: 1 }}
//             />
//           </Box>
//         )}
        
//         {/* Show available time slots */}
//         <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
//           Available Time Slots:
//         </Typography>
        
//         {availableTimeSlots.length === 0 ? (
//           <Typography variant="body2" color="error" sx={{ my: 2 }}>
//             No available time slots for the selected date and stylist
//           </Typography>
//         ) : (
//           <RadioGroup
//             name="appointment_time"
//             value={editForm.appointment_time || ''}
//             onChange={(e) => {
//               setEditForm(prev => ({ 
//                 ...prev, 
//                 appointment_time: e.target.value 
//               }));
//             }}
//             sx={{ 
//               display: 'grid', 
//               gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
//               gap: 1 
//             }}
//           >
//             {availableTimeSlots.map((time) => (
//               <FormControlLabel
//                 key={time}
//                 value={time}
//                 control={<Radio size="small" />}
//                 label={time}
//                 sx={{ 
//                   border: '1px solid #e0e0e0',
//                   borderRadius: 1,
//                   m: 0,
//                   p: 1,
//                   '&:hover': { backgroundColor: '#f5f5f5' },
//                   ...(editForm.appointment_time === time ? {
//                     backgroundColor: '#f0f7ff',
//                     borderColor: '#90caf9'
//                   } : {})
//                 }}
//               />
//             ))}
//           </RadioGroup>
//         )}
//       </FormControl>
//     );
//   };

//   const renderForm = () => (
//     <Box component="form" onSubmit={(e) => handleSubmit(e, showEditModal)}>
//       <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, marginTop: 2 }}>
//         <FormControl fullWidth margin="normal" required>
//           <InputLabel>Customer</InputLabel>
//           <Select
//             name="customer_ID"
//             value={editForm.customer_ID}
//             onChange={handleInputChange}
//           >
//             {customers.length > 0 ? (
//               customers.map(customer => (
//                 <MenuItem key={customer.customer_ID} value={customer.customer_ID}>
//                   {customer.firstname} {customer.lastname}
//                 </MenuItem>
//               ))
//             ) : (
//               <MenuItem value="" disabled>Loading customers...</MenuItem>
//             )}
//           </Select>
//         </FormControl>

//         <FormControl fullWidth margin="normal" required>
//           <TextField
//             label="Appointment Date"
//             type="date"
//             name="appointment_date"
//             value={editForm.appointment_date}
//             onChange={handleInputChange}
//             InputLabelProps={{ shrink: true }}
//             required
//           />
//         </FormControl>

//         <FormControl fullWidth margin="normal" required>
//           <InputLabel>Services</InputLabel>
//           <Select
//             name="services"
//             multiple
//             value={editForm.services}
//             onChange={handleMultiSelectChange}
//             renderValue={(selected) => selected.join(', ')}
//             required
//           >
//             {services.length > 0 ? (
//               services.map(service => (
//                 <MenuItem key={service.service_ID} value={service.service_name}>
//                   {service.service_name} - ${service.price || '0'} ({service.time_duration || '0'} min)
//                 </MenuItem>
//               ))
//             ) : (
//               <MenuItem value="" disabled>Loading services...</MenuItem>
//             )}
//           </Select>
//         </FormControl>

//         <FormControl fullWidth margin="normal" required>
//           <InputLabel>Stylists</InputLabel>
//           <Select
//             name="stylists"
//             multiple
//             value={editForm.stylists}
//             onChange={handleMultiSelectChange}
//             renderValue={(selected) => {
//               const selectedStylists = stylists.filter(stylist => 
//                 selected.includes(stylist.stylist_ID)
//               );
//               return selectedStylists.map(s => `${s.firstname} ${s.lastname}`).join(', ');
//             }}
//             required
//           >
//             {stylists.length > 0 ? (
//               stylists.map(stylist => (
//                 <MenuItem key={stylist.stylist_ID} value={stylist.stylist_ID}>
//                   {stylist.firstname} {stylist.lastname}
//                 </MenuItem>
//               ))
//             ) : (
//               <MenuItem value="" disabled>Loading stylists...</MenuItem>
//             )}
//           </Select>
//         </FormControl>

//         <FormControl fullWidth margin="normal" required>
//           <InputLabel>Status</InputLabel>
//           <Select
//             name="appointment_status"
//             value={editForm.appointment_status}
//             onChange={handleInputChange}
//             required
//           >
//             {statusOptions.map(status => (
//               <MenuItem key={status} value={status}>{status}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <FormControl fullWidth margin="normal">
//           <TextField
//             label="Payment Amount"
//             type="number"
//             name="payment_amount"
//             value={editForm.payment_amount}
//             onChange={handleInputChange}
//             InputProps={{ 
//               startAdornment: '$',
//               readOnly: editForm.services.length > 0 // Make it read-only if services are selected
//             }}
//             helperText={editForm.services.length > 0 ? "Auto-calculated from services" : ""}
//           />
//         </FormControl>

//         <FormControl fullWidth margin="normal">
//           <InputLabel>Payment Status</InputLabel>
//           <Select
//             name="payment_status"
//             value={editForm.payment_status}
//             onChange={handleInputChange}
//           >
//             {paymentStatusOptions.map(status => (
//               <MenuItem key={status} value={status}>{status}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <FormControl fullWidth margin="normal">
//           <InputLabel>Payment Type</InputLabel>
//           <Select
//             name="payment_type"
//             value={editForm.payment_type}
//             onChange={handleInputChange}
//           >
//             {paymentTypeOptions.map(type => (
//               <MenuItem key={type} value={type}>{type}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>
      
//       {/* Time slots section - spans full width */}
//       <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
//         {renderTimeSlots()}
//       </Box>
      
//       <DialogActions sx={{ padding: "16px 24px", borderTop: "1px solid #e0e0e0", mt: 2 }}>
//         <Button 
//           type="submit"
//           variant="contained"
//           startIcon={<SaveIcon />}
//           sx={{ backgroundColor: "green", color: "white", '&:hover': { backgroundColor: "darkgreen" } }}
//         >
//           {showEditModal ? 'Save Changes' : 'Create Appointment'}
//         </Button>
//         <Button 
//           onClick={() => showEditModal ? setShowEditModal(false) : setShowCreateModal(false)}
//           sx={{ backgroundColor: "#e0e0e0", color: "#000", '&:hover': { backgroundColor: "#c0c0c0" } }}
//         >
//           Cancel
//         </Button>
//       </DialogActions>
//     </Box>
//   );



//    // Search component
//    const renderSearchBar = () => (
//     <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
//       <Typography variant="h6" sx={{ mb: 2 }}>Search Appointments</Typography>
//       <Grid container spacing={2} alignItems="center">
//         <Grid item xs={12} sm={3}>
//           <TextField
//             fullWidth
//             label="Appointment ID"
//             name="appointmentId"
//             value={searchParams.appointmentId}
//             onChange={handleSearchInputChange}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon fontSize="small" />
//                 </InputAdornment>
//               ),
//             }}
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={12} sm={3}>
//           <TextField
//             fullWidth
//             label="Date"
//             name="date"
//             type="date"
//             value={searchParams.date}
//             onChange={handleSearchInputChange}
//             InputLabelProps={{ shrink: true }}
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={12} sm={3}>
//           <TextField
//             fullWidth
//             label="Customer Name"
//             name="customerName"
//             value={searchParams.customerName}
//             onChange={handleSearchInputChange}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon fontSize="small" />
//                 </InputAdornment>
//               ),
//             }}
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={12} sm={3}>
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSearch}
//               disabled={isSearching}
//               startIcon={isSearching ? <CircularProgress size={20} /> : <SearchIcon />}
//               sx={{ flexGrow: 1 }}
//             >
//               {isSearching ? 'Searching...' : 'Search'}
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={clearSearch}
//               startIcon={<ClearIcon />}
//             >
//               Clear
//             </Button>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );



//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <div style={{ margin: "20px" }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "20px" }}>
//         <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
//           Appointments
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={handleCreateClick}
//           sx={{ backgroundColor: "#FE8DA1", color: "#fff", '&:hover': { backgroundColor: "#fe6a9f" } }}
//         >
//           New Appointment
//         </Button>
//       </Box>

//       {renderSearchBar()}

//       <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 250px)' }}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Customer</TableCell>
//               <TableCell>Date</TableCell>
//               <TableCell>Time</TableCell>
//               <TableCell>Services</TableCell>
//               <TableCell>Stylist</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Payment</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {appointments.length > 0 ? (
//               appointments.map((appointment) => (
//                 <TableRow key={appointment.appointment_ID} hover>
//                   <TableCell>{appointment.appointment_ID}</TableCell>
//                   <TableCell>{appointment.customer_name}</TableCell>
//                   <TableCell>{formatDate(appointment.appointment_date)}</TableCell>
//                   <TableCell>{formatTime(appointment.appointment_time)}</TableCell>
//                   <TableCell>{appointment.services}</TableCell>
//                   <TableCell>{appointment.stylists}</TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={appointment.appointment_status}
//                       color={getStatusColor(appointment.appointment_status)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={appointment.payment_status}
//                       color={getPaymentColor(appointment.payment_status)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => showDetails(appointment.appointment_ID)} color="primary">
//                       <VisibilityIcon />
//                     </IconButton>
//                     <IconButton onClick={() => handleEditClick(appointment)} color="secondary">
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton onClick={() => handleDeleteClick(appointment)} color="error">
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={9} align="center">
//                   No appointments found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
      
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={pagination.totalItems}
//         rowsPerPage={pagination.rowsPerPage}
//         page={pagination.page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         sx={{ mt: 2 }}
//       />

//       {/* Details Modal */}
//       <Dialog 
//         open={showDetailsModal} 
//         onClose={() => setShowDetailsModal(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         {selectedAppointment && (
//           <>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: "16px 24px", borderBottom: "1px solid #e0e0e0" }}>
//               <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
//                 Appointment Details
//               </Typography>
//               <IconButton onClick={() => setShowDetailsModal(false)}>
//                 <CloseIcon />
//               </IconButton>
//             </Box>
            
//             <DialogContent>
//               <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
//                 <div>
//                   <Typography variant="subtitle1" sx={{ fontWeight: "600", marginBottom: "16px" }}>
//                     Customer Information
//                   </Typography>
//                   <Typography><strong>Name:</strong> {selectedAppointment.customer_name}</Typography>
//                   <Typography><strong>Email:</strong> {selectedAppointment.customer_email || 'N/A'}</Typography>
//                   <Typography><strong>Phone:</strong> {selectedAppointment.customer_phone || 'N/A'}</Typography>
//                 </div>
                
//                 <div>
//                   <Typography variant="subtitle1" sx={{ fontWeight: "600", marginBottom: "16px" }}>
//                     Appointment Details
//                   </Typography>
//                   <Typography><strong>Date:</strong> {formatDate(selectedAppointment.appointment_date)}</Typography>
//                   <Typography><strong>Time:</strong> {formatTime(selectedAppointment.appointment_time)}</Typography>
//                   <Typography><strong>Status:</strong> {selectedAppointment.appointment_status}</Typography>
//                   {selectedAppointment.cancellation_status && (
//                     <Typography><strong>Cancellation:</strong> {selectedAppointment.cancellation_status}</Typography>
//                   )}
//                 </div>
                
//                 <div>
//                   <Typography variant="subtitle1" sx={{ fontWeight: "600", marginBottom: "16px" }}>
//                     Services & Stylists
//                   </Typography>
//                   <Typography><strong>Services:</strong> {selectedAppointment.services}</Typography>
//                   <Typography><strong>Stylists:</strong> {selectedAppointment.stylists}</Typography>
//                 </div>
                
//                 <div>
//                   <Typography variant="subtitle1" sx={{ fontWeight: "600", marginBottom: "16px" }}>
//                     Payment Information
//                   </Typography>
//                   <Typography><strong>Payment ID:</strong> {selectedAppointment.payment_ID || 'N/A'}</Typography>
//                   <Typography><strong>Total Amount:</strong> ${selectedAppointment.payment_amount || '0'}</Typography>
//                   <Typography><strong>Amount Paid:</strong> ${selectedAppointment.amount_paid || '0'}</Typography>
//                   <Typography><strong>Payment Date:</strong> {selectedAppointment.payment_date ? formatDate(selectedAppointment.payment_date) : 'N/A'}</Typography>
//                   <Typography><strong>Payment Status:</strong> {selectedAppointment.payment_status || 'N/A'}</Typography>
//                   <Typography><strong>Payment Type:</strong> {selectedAppointment.payment_type || 'Pay at Salon'}</Typography>
//                   {selectedAppointment.is_partial && <Typography><strong>Partial Payment:</strong> Yes</Typography>}
//                   {selectedAppointment.is_first_time && <Typography><strong>First Time:</strong> Yes</Typography>}
//                 </div>
//               </Box>
//             </DialogContent>
            
//             <DialogActions sx={{ padding: "16px 24px", borderTop: "1px solid #e0e0e0" }}>
//               <Button 
//                 onClick={() => {
//                   handleEditClick(selectedAppointment);
//                   setShowDetailsModal(false);
//                 }}
//                 variant="contained"
//                 sx={{ backgroundColor: "green", color: "white", '&:hover': { backgroundColor: "darkgreen" } }}
//               >
//                 Edit
//               </Button>
//               <Button 
//                 onClick={() => setShowDetailsModal(false)}
//                 sx={{ backgroundColor: "#e0e0e0", color: "#000", '&:hover': { backgroundColor: "#c0c0c0" } }}
//               >
//                 Close
//               </Button>
//             </DialogActions>
//           </>
//         )}
//       </Dialog>

//       {/* Edit Modal */}
//       <Dialog 
//         open={showEditModal} 
//         onClose={() => setShowEditModal(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <Box sx={{ padding: "16px 24px", borderBottom: "1px solid #e0e0e0" }}>
//           <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
//             Edit Appointment
//           </Typography>
//         </Box>
//         {renderForm()}
//       </Dialog>

//       {/* Create Modal */}
//       <Dialog 
//         open={showCreateModal} 
//         onClose={() => setShowCreateModal(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <Box sx={{ padding: "16px 24px", borderBottom: "1px solid #e0e0e0" }}>
//           <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
//             New Appointment
//           </Typography>
//         </Box>
//         {renderForm()}
//       </Dialog>

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// }








import { format, parseISO } from 'date-fns';
import React, { useState, useEffect } from 'react';
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

// Create axios instance with authentication
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
  const [isSearching, setIsSearching] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    totalItems: 0
  });

  const fetchData = async () => {
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
      } else {
        console.error('Error fetching appointments:', appointmentsRes.reason || 'Unknown error');
        showSnackbar('Failed to fetch appointments', 'error');
      }
      
      if (servicesRes.status === 'fulfilled' && servicesRes.value.data.success) {
        setServices(servicesRes.value.data.data || []);
      } else {
        console.error('Error fetching services:', servicesRes.reason || 'Unknown error');
      }
      
      if (stylistsRes.status === 'fulfilled' && stylistsRes.value.data.success) {
        setStylists(stylistsRes.value.data.data || []);
      } else {
        console.error('Error fetching stylists:', stylistsRes.reason || 'Unknown error');
      }
      
      if (customersRes.status === 'fulfilled' && customersRes.value.data.success) {
        setCustomers(customersRes.value.data.data || []);
      } else {
        console.error('Error fetching customers:', customersRes.reason || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.rowsPerPage, searchParams]);

  const handleSearch = () => {
    setIsSearching(true);
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const clearSearch = () => {
    setSearchParams({
      appointmentId: '',
      date: '',
      customerName: ''
    });
    setPagination(prev => ({ ...prev, page: 0 }));
    setIsSearching(false);
    fetchData();
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
        fetchData();
      } else {
        showSnackbar('Failed to delete appointment', 'error');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      showSnackbar('Error deleting appointment', 'error');
    }
  };

  const handleEditClick = async (appointment) => {
    try {
      const response = await api.get(`/admin/appointments/${appointment.appointment_ID}`);
      if (response.data.success) {
        const detailedAppointment = response.data.data;
        setSelectedAppointment(detailedAppointment);
        
        const paymentType = detailedAppointment.payment_type && 
                           paymentTypeOptions.includes(detailedAppointment.payment_type) 
                           ? detailedAppointment.payment_type 
                           : 'Pay at Salon';
        
        const appointmentTime = detailedAppointment.appointment_time ? 
                               detailedAppointment.appointment_time.substring(0, 5) : '';
        
        const initialForm = {
          customer_ID: detailedAppointment.customer_ID,
          appointment_date: detailedAppointment.appointment_date ? detailedAppointment.appointment_date.split('T')[0] : '',
          appointment_time: appointmentTime,
          appointment_status: detailedAppointment.appointment_status || 'Scheduled',
          services: detailedAppointment.services ? detailedAppointment.services.split(',').map(s => s.trim()) : [],
          stylists: detailedAppointment.stylists ? stylists
            .filter(stylist => detailedAppointment.stylists.includes(`${stylist.firstname} ${stylist.lastname}`))
            .map(stylist => stylist.stylist_ID) : [],
          payment_status: detailedAppointment.payment_status || 'Pending',
          payment_amount: detailedAppointment.payment_amount ? detailedAppointment.payment_amount.toString() : '0',
          payment_type: paymentType
        };
        
        setEditForm(initialForm);
        setShowEditModal(true);
        
        if (initialForm.appointment_date && initialForm.stylists.length > 0 && initialForm.services.length > 0) {
          fetchAvailableTimeSlots();
        }
      } else {
        showSnackbar('Failed to fetch appointment details', 'error');
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      showSnackbar('Error fetching appointment details', 'error');
      
      if (appointment) {
        setSelectedAppointment(appointment);
        
        const appointmentTime = appointment.appointment_time ? 
                               appointment.appointment_time.substring(0, 5) : '';
        
        const initialForm = {
          customer_ID: appointment.customer_ID || '',
          appointment_date: appointment.appointment_date ? appointment.appointment_date.split('T')[0] : format(new Date(), 'yyyy-MM-dd'),
          appointment_time: appointmentTime,
          appointment_status: appointment.appointment_status || 'Scheduled',
          services: appointment.services ? appointment.services.split(',').map(s => s.trim()) : [],
          stylists: [],
          payment_status: appointment.payment_status || 'Pending',
          payment_amount: appointment.payment_amount ? appointment.payment_amount.toString() : '0',
          payment_type: appointment.payment_type || 'Pay at Salon'
        };
        
        setEditForm(initialForm);
        setShowEditModal(true);
        fetchAvailableTimeSlots();
      }
    }
  };

  const handleCreateClick = () => {
    setEditForm({
      customer_ID: customers.length > 0 ? customers[0].customer_ID : '',
      appointment_date: format(new Date(), 'yyyy-MM-dd'),  // This is where the error occurs
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
    
    if (!editForm.customer_ID || !editForm.appointment_date || !editForm.appointment_time || 
        !editForm.services.length || !editForm.stylists.length) {
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
      
      for (const serviceName of editForm.services) {
        const service = services.find(s => s.service_name === serviceName);
        
        if (!service) {
          showSnackbar(`Service "${serviceName}" not found. Please refresh the page.`, 'error');
          return;
        }
        
        const serviceId = service.service_id || service.service_ID;
        
        if (!serviceId) {
          showSnackbar(`Service ID not found for "${serviceName}"`, 'error');
          return;
        }
  
        for (const stylistId of editForm.stylists) {
          serviceStylists.push({
            service_ID: serviceId,
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
        payment_type: editForm.payment_type
      };
  
      const url = isEdit 
        ? `/admin/appointments/${selectedAppointment.appointment_ID}`
        : '/admin/appointments';
      const method = isEdit ? 'put' : 'post';
  
      const response = await api[method](url, formData);
      if (response.data.success) {
        showSnackbar(`Appointment ${isEdit ? 'updated' : 'created'} successfully`);
        fetchData();
        isEdit ? setShowEditModal(false) : setShowCreateModal(false);
      } else {
        showSnackbar(response.data.message || `Failed to ${isEdit ? 'update' : 'create'} appointment`, 'error');
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} appointment:`, error);
      showSnackbar(error.response?.data?.message || `Error ${isEdit ? 'updating' : 'creating'} appointment`, 'error');
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
      } else {
        showSnackbar('Failed to fetch appointment details', 'error');
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      
      const appointment = appointments.find(apt => apt.appointment_ID === id);
      if (appointment) {
        setSelectedAppointment(appointment);
        setShowDetailsModal(true);
      } else {
        showSnackbar('Error fetching appointment details', 'error');
      }
    }
  };

  const handleDeleteClick = (appointment) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      handleDelete(appointment.appointment_ID);
    }
  };

  const renderTimeSlots = () => {
    return (
      <TimeSlotSelector
        loadingTimeSlots={loadingTimeSlots}
        editForm={editForm}
        setEditForm={setEditForm}
        availableTimeSlots={availableTimeSlots}
        selectedAppointment={selectedAppointment}
      />
    );
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