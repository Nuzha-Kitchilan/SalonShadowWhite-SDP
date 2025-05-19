// import React, { useState, useEffect } from 'react';
// import { 
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
//   Button, Chip, Card, Grid, Box, TextField, MenuItem,
//   Typography, Tooltip, Paper, IconButton
// } from '@mui/material';
// import {
//   CalendarToday as CalendarOutlined,
//   Person as UserOutlined,
//   AttachMoney as DollarOutlined,
//   FilterList as FilterOutlined,
//   Refresh as ReloadOutlined,
//   Visibility as EyeOutlined,
//   Edit as EditOutlined,
//   Delete as DeleteOutlined
// } from '@mui/icons-material';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import moment from 'moment';
// import axios from 'axios';

// const BridalAppointmentsList = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [stylists, setStylists] = useState([]);
//   const [filters, setFilters] = useState({
//     startDate: null,
//     endDate: null,
//     status: null,
//     stylistId: null,
//     paymentStatus: null
//   });
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchStylists();
//     fetchAppointments();
//   }, []);

//   // Fetch all stylists for filter dropdown
//   const fetchStylists = async () => {
//     try {
//       const response = await axios.get('/admin/stylists');
//       if (response.data.success) {
//         setStylists(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching stylists:', error);
//       alert('Failed to load stylists');
//     }
//   };

//   // Fetch appointments with filters
//   const fetchAppointments = async () => {
//     setLoading(true);
//     try {
//       // Build query parameters based on filters
//       let params = {};
      
//       if (filters.startDate) params.startDate = moment(filters.startDate).format('YYYY-MM-DD');
//       if (filters.endDate) params.endDate = moment(filters.endDate).format('YYYY-MM-DD');
//       if (filters.status) params.status = filters.status;
//       if (filters.stylistId) params.stylistId = filters.stylistId;
//       if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
      
//       const response = await axios.get('admin/appointments/bridal');
      
//       if (response.data.success) {
//         setAppointments(response.data.data);
//       } else {
//         alert(response.data.message || 'Failed to fetch appointments');
//       }
//     } catch (error) {
//       console.error('Error fetching bridal appointments:', error);
//       alert('Failed to load bridal appointments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle edit appointment
//   const handleEdit = (appointmentId) => {
//     window.location.href = `/admin/appointments/bridal/${appointmentId}`;
//   };

//   // Handle delete appointment
//   const handleDelete = async (appointmentId) => {
//     try {
//       const response = await axios.delete(`/api/admin/bridal-appointments/${appointmentId}`);
//       if (response.data.success) {
//         alert('Bridal appointment deleted successfully');
//         fetchAppointments();
//       } else {
//         alert(response.data.message || 'Failed to delete appointment');
//       }
//     } catch (error) {
//       console.error('Error deleting appointment:', error);
//       alert('Failed to delete appointment');
//     }
//   };

//   // Handle filter changes
//   const handleFilterChange = (key, value) => {
//     setFilters({
//       ...filters,
//       [key]: value
//     });
//   };

//   // Apply filters
//   const applyFilters = () => {
//     fetchAppointments();
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setFilters({
//       startDate: null,
//       endDate: null,
//       status: null,
//       stylistId: null,
//       paymentStatus: null
//     });
//     fetchAppointments();
//   };

//   // Status color mapping
//   const getStatusColor = (status) => {
//     const statusMap = {
//       'Scheduled': 'info',
//       'Completed': 'success',
//       'Cancelled': 'error',
//       'No-Show': 'warning'
//     };
//     return statusMap[status] || 'default';
//   };

//   // Payment status color mapping
//   const getPaymentStatusColor = (status) => {
//     const statusMap = {
//       'Paid': 'success',
//       'Pending': 'warning',
//       'Refunded': 'error',
//       'Partial': 'secondary'
//     };
//     return statusMap[status] || 'default';
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <div className="bridal-appointments-list">
//       <Card sx={{ p: 3 }}>
//         <Grid container spacing={3}>
//           <Grid item xs={12}>
//             <Typography variant="h4">Bridal Appointments</Typography>
//           </Grid>
          
//           {/* Filters Section */}
//           <Grid item xs={12}>
//             <Card variant="outlined" sx={{ p: 2 }}>
//               <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                 <FilterOutlined sx={{ mr: 1 }} /> Filters
//               </Typography>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6} md={3}>
//                   <Typography variant="subtitle2" gutterBottom>Start Date</Typography>
//                   <LocalizationProvider dateAdapter={AdapterDateFns}>
//                     <DatePicker
//                       value={filters.startDate}
//                       onChange={(date) => handleFilterChange('startDate', date)}
//                       renderInput={(params) => (
//                         <TextField {...params} size="small" fullWidth />
//                       )}
//                     />
//                   </LocalizationProvider>
//                 </Grid>
//                 <Grid item xs={12} sm={6} md={3}>
//                   <Typography variant="subtitle2" gutterBottom>End Date</Typography>
//                   <LocalizationProvider dateAdapter={AdapterDateFns}>
//                     <DatePicker
//                       value={filters.endDate}
//                       onChange={(date) => handleFilterChange('endDate', date)}
//                       renderInput={(params) => (
//                         <TextField {...params} size="small" fullWidth />
//                       )}
//                     />
//                   </LocalizationProvider>
//                 </Grid>
//                 <Grid item xs={12} sm={6} md={2}>
//                   <Typography variant="subtitle2" gutterBottom>Status</Typography>
//                   <TextField
//                     select
//                     value={filters.status || ''}
//                     onChange={(e) => handleFilterChange('status', e.target.value)}
//                     fullWidth
//                     size="small"
//                   >
//                     <MenuItem value="">All statuses</MenuItem>
//                     <MenuItem value="Scheduled">Scheduled</MenuItem>
//                     <MenuItem value="Completed">Completed</MenuItem>
//                     <MenuItem value="Cancelled">Cancelled</MenuItem>
//                     <MenuItem value="No-Show">No-Show</MenuItem>
//                   </TextField>
//                 </Grid>
//                 <Grid item xs={12} sm={6} md={2}>
//                   <Typography variant="subtitle2" gutterBottom>Stylist</Typography>
//                   <TextField
//                     select
//                     value={filters.stylistId || ''}
//                     onChange={(e) => handleFilterChange('stylistId', e.target.value)}
//                     fullWidth
//                     size="small"
//                   >
//                     <MenuItem value="">All stylists</MenuItem>
//                     {stylists.map(stylist => (
//                       <MenuItem key={stylist.stylist_ID} value={stylist.stylist_ID}>
//                         {stylist.first_name} {stylist.last_name}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>
//                 <Grid item xs={12} sm={6} md={2}>
//                   <Typography variant="subtitle2" gutterBottom>Payment Status</Typography>
//                   <TextField
//                     select
//                     value={filters.paymentStatus || ''}
//                     onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
//                     fullWidth
//                     size="small"
//                   >
//                     <MenuItem value="">All payment statuses</MenuItem>
//                     <MenuItem value="Paid">Paid</MenuItem>
//                     <MenuItem value="Pending">Pending</MenuItem>
//                     <MenuItem value="Refunded">Refunded</MenuItem>
//                     <MenuItem value="Partial">Partial</MenuItem>
//                   </TextField>
//                 </Grid>
//                 <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//                   <Button 
//                     variant="outlined"
//                     startIcon={<ReloadOutlined />}
//                     onClick={resetFilters}
//                     sx={{ mr: 1 }}
//                   >
//                     Reset
//                   </Button>
//                   <Button 
//                     variant="contained"
//                     color="primary"
//                     startIcon={<FilterOutlined />}
//                     onClick={applyFilters}
//                   >
//                     Apply Filters
//                   </Button>
//                 </Grid>
//               </Grid>
//             </Card>
//           </Grid>
          
//           {/* Appointments Table */}
//           <Grid item xs={12}>
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Date & Time</TableCell>
//                     <TableCell>Customer</TableCell>
//                     <TableCell>Services</TableCell>
//                     <TableCell>Stylists</TableCell>
//                     <TableCell>Status</TableCell>
//                     <TableCell>Payment</TableCell>
//                     <TableCell>Notes</TableCell>
//                     <TableCell>Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {loading ? (
//                     <TableRow>
//                       <TableCell colSpan={8} align="center">Loading...</TableCell>
//                     </TableRow>
//                   ) : appointments.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={8} align="center">No appointments found</TableCell>
//                     </TableRow>
//                   ) : (
//                     appointments
//                       .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                       .map((appointment) => (
//                         <TableRow key={appointment.appointment_ID}>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                               <CalendarOutlined fontSize="small" sx={{ mr: 1 }} />
//                               <Box>
//                                 {moment(appointment.appointment_date).format('MMM DD, YYYY')}
//                                 <Typography variant="caption" display="block">
//                                   {appointment.appointment_time}
//                                 </Typography>
//                               </Box>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                               <UserOutlined fontSize="small" sx={{ mr: 1 }} />
//                               <Box>
//                                 {appointment.customer_name}
//                                 <Typography variant="caption" display="block">
//                                   {appointment.customer_email}
//                                 </Typography>
//                                 <Typography variant="caption" display="block">
//                                   {appointment.customer_phone}
//                                 </Typography>
//                               </Box>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             {appointment.services.map(service => (
//                               <Chip
//                                 key={service.service_ID}
//                                 label={service.service_name}
//                                 size="small"
//                                 sx={{ mr: 0.5, mb: 0.5 }}
//                               />
//                             ))}
//                           </TableCell>
//                           <TableCell>
//                             {appointment.stylists.map(stylist => (
//                               <Chip
//                                 key={stylist.stylist_ID}
//                                 label={stylist.stylist_name}
//                                 color="primary"
//                                 size="small"
//                                 variant="outlined"
//                                 sx={{ mr: 0.5, mb: 0.5 }}
//                               />
//                             ))}
//                           </TableCell>
//                           <TableCell>
//                             <Chip
//                               label={appointment.appointment_status}
//                               color={getStatusColor(appointment.appointment_status)}
//                               size="small"
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                               <DollarOutlined fontSize="small" sx={{ mr: 1 }} />
//                               ${appointment.payment_amount}
//                               <Chip
//                                 label={appointment.payment_status}
//                                 color={getPaymentStatusColor(appointment.payment_status)}
//                                 size="small"
//                                 sx={{ ml: 1 }}
//                               />
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             {appointment.notes ? (
//                               <Tooltip title={appointment.notes}>
//                                 <Typography
//                                   sx={{
//                                     maxWidth: 150,
//                                     overflow: 'hidden',
//                                     textOverflow: 'ellipsis',
//                                     whiteSpace: 'nowrap'
//                                   }}
//                                 >
//                                   {appointment.notes}
//                                 </Typography>
//                               </Tooltip>
//                             ) : '-'}
//                           </TableCell>
//                           <TableCell>
//                             <Box sx={{ display: 'flex' }}>
//                               <Tooltip title="View Details">
//                                 <IconButton
//                                   size="small"
//                                   onClick={() => handleEdit(appointment.appointment_ID)}
//                                 >
//                                   <EyeOutlined fontSize="small" />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="Edit">
//                                 <IconButton
//                                   size="small"
//                                   color="primary"
//                                   onClick={() => handleEdit(appointment.appointment_ID)}
//                                 >
//                                   <EditOutlined fontSize="small" />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="Delete">
//                                 <IconButton
//                                   size="small"
//                                   color="error"
//                                   onClick={() => {
//                                     if (window.confirm('Are you sure you want to delete this appointment?')) {
//                                       handleDelete(appointment.appointment_ID);
//                                     }
//                                   }}
//                                 >
//                                   <DeleteOutlined fontSize="small" />
//                                 </IconButton>
//                               </Tooltip>
//                             </Box>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                   )}
//                 </TableBody>
//               </Table>
//               <TablePagination
//                 rowsPerPageOptions={[10, 25, 50]}
//                 component="div"
//                 count={appointments.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//               />
//             </TableContainer>
//           </Grid>
          
//           {/* Add New Button */}
//           <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//             <Button 
//               variant="contained"
//               color="primary"
//               onClick={() => window.location.href = '/admin/appointments/bridal'}
//             >
//               Create New Bridal Appointment
//             </Button>
//           </Grid>
//         </Grid>
//       </Card>
//     </div>
//   );
// };

// export default BridalAppointmentsList;













import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, TableHead, TableBody, TableCell, TableContainer,
  TableRow, Paper, IconButton, Chip, Typography, Button,
  CircularProgress, Stack, Box, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, TablePagination,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import moment from 'moment';

// Track the currently edited appointment ID globally
let currentlyEditingId = null;

const BridalAptTable = ({ stylists, onEdit, onDelete, onAddNew, onViewDetails }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Enhanced fetchBridalAppointments function - memoized with useCallback
  const fetchBridalAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/bridal-appointments');
      // Handle different API response structures
      const appointmentsData = response.data.data || response.data || [];
      
      // Only update state if we have data to avoid setting an empty array
      if (appointmentsData && appointmentsData.length > 0) {
        setAppointments(appointmentsData);
      } else if (appointments.length === 0) {
        // Only set empty array if we didn't have data before
        setAppointments(appointmentsData);
      }
      
      console.log('Fetched appointments:', appointmentsData);
    } catch (error) {
      console.error('Failed to fetch bridal appointments', error);
      // Don't clear appointments on error
    } finally {
      setLoading(false);
    }
  }, [appointments.length]);

  // Fetch appointments on mount and when refreshKey changes
  useEffect(() => {
    fetchBridalAppointments();
  }, [fetchBridalAppointments, refreshKey]);

  // Custom edit handler
  const handleEditClick = (id) => {
    if (onEdit) {
      // Store the ID being edited
      currentlyEditingId = id;
      setEditingAppointmentId(id);
      
      // Call the parent's onEdit with our custom callback
      onEdit(id, () => {
        console.log('Edit completed, refreshing data...');
        setRefreshKey(prev => prev + 1);
        setEditingAppointmentId(null);
        currentlyEditingId = null;
      });
    }
  };

  // Add a function to refresh appointments
  const refreshAppointments = () => {
    console.log('Manual refresh triggered');
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleDeleteClick = (id) => {
    setAppointmentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Handle view details click - pass the entire appointment object to parent
  const handleViewDetailsClick = (appointment) => {
    if (onViewDetails) {
      onViewDetails(appointment);
    }
  };

  const handleConfirmDelete = async () => {
    if (appointmentToDelete) {
      try {
        setLoading(true);
        
        // Call the parent component's delete handler
        if (onDelete) {
          await onDelete(appointmentToDelete);
        }
        
        // Refresh the appointments list
        refreshAppointments();
      } catch (error) {
        console.error('Failed to delete appointment', error);
      } finally {
        setLoading(false);
        setDeleteConfirmOpen(false);
        setAppointmentToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setAppointmentToDelete(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return { bg: 'rgba(25, 118, 210, 0.1)', color: '#1976d2' };
      case 'Completed': return { bg: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' };
      case 'Confirmed': return { bg: 'rgba(3, 169, 244, 0.1)', color: '#03a9f4' };
      case 'Cancelled': return { bg: 'rgba(244, 67, 54, 0.1)', color: '#f44336' };
      case 'Pending': return { bg: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' };
      default: return { bg: 'rgba(158, 158, 158, 0.1)', color: '#9e9e9e' };
    }
  };

  const getPaymentColor = (status) => {
    return status === 'Paid' 
      ? { bg: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }
      : { bg: 'rgba(244, 67, 54, 0.1)', color: '#f44336' };
  };

  // Find stylist name by ID
  const getStylistName = (stylistId) => {
    const stylist = stylists.find(s => s.stylist_ID === stylistId || s.id === stylistId);
    return stylist ? stylist.name || stylist.full_name : 'Unknown';
  };

  // Handle adding new appointment
  const handleAddNewClick = () => {
    if (onAddNew) {
      onAddNew();
    } else if (onEdit) {
      // Fallback to the old behavior if onAddNew is not provided
      onEdit('new', refreshAppointments);
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Apply pagination
  const visibleAppointments = appointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const emptyRows = page > 0 
    ? Math.max(0, (1 + page) * rowsPerPage - appointments.length) 
    : 0;

  // Format currency similar to ServicesTable
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "Rs. 0.00";
    return `Rs. ${new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)}`;
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: "#453C33",
            fontWeight: 600
          }}
        >
          Bridal Appointments
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={refreshAppointments}
            sx={{ 
              borderColor: "rgba(190, 175, 155, 0.5)",
              color: "#BEAF9B",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#BEAF9B",
                backgroundColor: "rgba(190, 175, 155, 0.05)"
              }
            }}
          >
            Refresh List
          </Button>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddNewClick}
            sx={{ 
              backgroundColor: "#BEAF9B", 
              color: "white",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#A89683",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
              }
            }}
          >
            Add New Bridal Appointment
          </Button>
        </Stack>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress sx={{ color: "#BEAF9B" }} />
        </Box>
      ) : (
        <Paper 
          elevation={0}
          sx={{ 
            border: "1px solid rgba(190, 175, 155, 0.2)",
            borderRadius: "8px",
            overflow: "hidden",
            mb: 4
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    Customer
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    Time
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    Services
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    Stylists
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    Payment
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                    align="center"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleAppointments.length > 0 ? visibleAppointments.map((appt) => {
                  const statusStyle = getStatusColor(appt.appointment_status || 'Scheduled');
                  const paymentStyle = getPaymentColor(appt.payment_status || 'Unpaid');
                  
                  return (
                    <TableRow 
                      key={appt.id} 
                      sx={{
                        ...(editingAppointmentId === appt.id 
                          ? { backgroundColor: 'rgba(190, 175, 155, 0.1)' } 
                          : {}
                        ),
                        '&:nth-of-type(odd)': { backgroundColor: "rgba(190, 175, 155, 0.03)" },
                        '&:hover': { backgroundColor: "rgba(190, 175, 155, 0.1)" },
                        transition: "background-color 0.2s"
                      }}
                    >
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#666"
                        }}
                      >
                        {appt.id}
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif"
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon 
                            fontSize="small" 
                            sx={{ color: "#BEAF9B" }} 
                          />
                          <Typography
                            sx={{ 
                              fontWeight: 500,
                              color: "#453C33",
                              fontFamily: "'Poppins', 'Roboto', sans-serif"
                            }}
                          >
                            {appt.customer_name || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#666"
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EventIcon 
                            fontSize="small" 
                            sx={{ color: "#BEAF9B" }} 
                          />
                          <Typography
                            sx={{ 
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {moment(appt.appointment_date).format('MMM D, YYYY')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#666"
                        }}
                      >
                        {appt.appointment_time}
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#453C33"
                        }}
                      >
                        <Chip 
                          label={appt.services || 'No services'} 
                          size="small"
                          sx={{ 
                            backgroundColor: "rgba(190, 175, 155, 0.2)",
                            color: "#453C33",
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#453C33"
                        }}
                      >
                        {Array.isArray(appt.stylists) 
                          ? appt.stylists.map(s => getStylistName(s)).join(', ')
                          : typeof appt.stylists === 'string' 
                            ? appt.stylists 
                            : getStylistName(appt.stylist_id || appt.stylist)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={appt.appointment_status || 'Scheduled'} 
                          size="small"
                          sx={{ 
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="column" spacing={0.5}>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              fontWeight: 500,
                              color: "#453C33"
                            }}
                          >
                            {formatCurrency(appt.payment_amount)}
                          </Typography>
                          <Chip 
                            label={appt.payment_status || 'Unpaid'} 
                            size="small" 
                            sx={{ 
                              backgroundColor: paymentStyle.bg,
                              color: paymentStyle.color,
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              fontWeight: 500
                            }}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton 
                              onClick={() => handleViewDetailsClick(appt)}
                              disabled={editingAppointmentId !== null}
                              size="small"
                              sx={{ 
                                color: "#BEAF9B",
                                '&:hover': {
                                  backgroundColor: 'rgba(190, 175, 155, 0.1)'
                                }
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Appointment">
                            <IconButton 
                              onClick={() => handleEditClick(appt.id)}
                              disabled={editingAppointmentId !== null}
                              size="small"
                              sx={{ 
                                color: "#BEAF9B",
                                '&:hover': {
                                  backgroundColor: 'rgba(190, 175, 155, 0.1)'
                                }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Appointment">
                            <IconButton 
                              onClick={() => handleDeleteClick(appt.id)}
                              disabled={editingAppointmentId !== null}
                              size="small"
                              sx={{ 
                                color: "#ff6b6b",
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 107, 107, 0.1)'
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography 
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#666"
                        }}
                      >
                        No appointments found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={9} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={appointments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: "1px solid rgba(190, 175, 155, 0.2)",
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: "#666"
              },
              '.MuiTablePagination-select': {
                fontFamily: "'Poppins', 'Roboto', sans-serif",
              },
              '.MuiTablePagination-actions': {
                '& .MuiIconButton-root': {
                  color: "#BEAF9B"
                }
              }
            }}
          />
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: "8px",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }
        }}
      >
        <DialogTitle 
          id="alert-dialog-title"
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 600,
            color: "#453C33"
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText 
            id="alert-dialog-description"
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: "#666"
            }}
          >
            Are you sure you want to delete this bridal appointment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button 
            onClick={handleCancelDelete} 
            sx={{ 
              color: "#666",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained"
            sx={{ 
              backgroundColor: "#ff6b6b",
              color: "white",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#ff5252",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BridalAptTable;