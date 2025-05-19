// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Container,
//   Paper,
//   Typography,
//   Backdrop,
//   CircularProgress,
//   Alert,
//   Snackbar
// } from '@mui/material';
// import axios from 'axios';
// import BridalAppointmentForm from '../components/bridal/BridalAptForm';

// const AdminBridalAppointments = () => {
//   const [customers, setCustomers] = useState([]);
//   const [services, setServices] = useState([]);
//   const [stylists, setStylists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch all necessary data in parallel
//         const [customersRes, servicesRes, stylistsRes] = await Promise.all([
//           axios.get('/admin/customers'),
//           axios.get('/admin/services'),
//           axios.get('/admin/stylists')
//         ]);
        
//         // Handle different API response structures
//         const customersData = customersRes.data.data || customersRes.data || [];
//         const servicesData = servicesRes.data.data || servicesRes.data || [];
//         const stylistsData = stylistsRes.data.data || stylistsRes.data || [];
        
//         console.log('Customers data:', customersData);
//         console.log('Services data:', servicesData);
//         console.log('Stylists data:', stylistsData);
        
//         // Add validation for required fields
//         const processedCustomers = customersData.map(customer => {
//           // Ensure we have required fields
//           if (!customer.customer_ID && customer.id) customer.customer_ID = customer.id;
//           return customer;
//         });

//         const processedStylists = stylistsData.map(stylist => {
//           // Ensure we have required fields
//           if (!stylist.stylist_ID && stylist.id) stylist.stylist_ID = stylist.id;
//           return stylist;
//         });

//         const processedServices = servicesData.map(service => {
//           // Ensure we have required fields
//           if (!service.service_ID && service.id) service.service_ID = service.id;
//           if (typeof service.price === 'string') service.price = parseFloat(service.price);
//           return service;
//         });
        
//         setCustomers(processedCustomers);
//         setServices(processedServices);
//         setStylists(processedStylists);
        
//         setLoading(false);
//       } catch (err) {
//         console.error('Error loading data:', err);
//         setError('Failed to load necessary data. Please try again later.');
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   const handleSubmit = async (formData) => {
//     try {
//       setLoading(true);
      
//       await axios.post('http://localhost:5001/api/admin/appointments/bridal', formData);
      
//       setNotification({
//         open: true,
//         message: 'Bridal appointment created successfully!',
//         severity: 'success'
//       });
      
//       // You could redirect to appointments list here
//       // history.push('/admin/appointments');
      
//       setLoading(false);
//     } catch (err) {
//       console.error('Error creating appointment:', err);
      
//       setNotification({
//         open: true,
//         message: err.response?.data?.message || 'Failed to create appointment',
//         severity: 'error'
//       });
      
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     // Navigate back to appointments list
//     // history.push('/admin/appointments');
//     console.log('Form canceled');
//   };

//   const handleCloseNotification = () => {
//     setNotification({ ...notification, open: false });
//   };

//   if (loading) {
//     return (
//       <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//         <CircularProgress color="inherit" />
//       </Backdrop>
//     );
//   }

//   if (error) {
//     return (
//       <Container maxWidth="md" sx={{ mt: 4 }}>
//         <Alert severity="error">{error}</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <Paper sx={{ p: 2 }}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Bridal Appointment
//         </Typography>
        
//         <Box sx={{ mt: 3 }}>
//           <BridalAppointmentForm
//             onSubmit={handleSubmit}
//             onCancel={handleCancel}
//             customers={customers}
//             services={services}
//             stylists={stylists}
//           />
//         </Box>
//       </Paper>
      
//       <Snackbar
//         open={notification.open}
//         autoHideDuration={6000}
//         onClose={handleCloseNotification}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert 
//           onClose={handleCloseNotification} 
//           severity={notification.severity}
//           sx={{ width: '100%' }}
//         >
//           {notification.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default AdminBridalAppointments;









import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Backdrop,
  CircularProgress,
  Alert,
  Snackbar,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import BridalAppointmentForm from '../components/bridal/BridalAptForm';
import BridalAptTable from '../components/bridal/BridalAptTable';
import BridalAptEditForm from '../components/bridal/BridalAptEditForm';
import AppointmentDetailsModal from '../components/bridal/BridalAppointmentDetails';
import { jwtDecode } from 'jwt-decode';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

// Custom styled tabs
const StyledTabs = styled(Tabs)({
  borderBottom: '1px solid rgba(190, 175, 155, 0.3)',
  '& .MuiTabs-indicator': {
    backgroundColor: '#BEAF9B',
    height: 3,
  },
});

// Custom styled tab
const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  color: '#666666',
  marginRight: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  transition: 'all 0.2s',
  '&.Mui-selected': {
    color: '#453C33',
    fontWeight: 700,
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
  },
  '&:hover': {
    color: '#453C33',
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
  },
}));

// TabPanel component for the tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bridal-tabpanel-${index}`}
      aria-labelledby={`bridal-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3, px: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminBridalAppointments = () => {
  const [tabValue, setTabValue] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [adminName, setAdminName] = useState('');
  
  // New states for AppointmentDetailsModal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get admin info from JWT token
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            setAdminName(decodedToken.name || decodedToken.username || 'Admin');
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
        
        // Fetch all necessary data in parallel
        const [customersRes, servicesRes, stylistsRes] = await Promise.all([
          axios.get('/admin/customers'),
          axios.get('/admin/services'),
          axios.get('/admin/stylists')
        ]);
        
        // Handle different API response structures
        const customersData = customersRes.data.data || customersRes.data || [];
        const servicesData = servicesRes.data.data || servicesRes.data || [];
        const stylistsData = stylistsRes.data.data || stylistsRes.data || [];
        
        // Add validation for required fields
        const processedCustomers = customersData.map(customer => {
          if (!customer.customer_ID && customer.id) customer.customer_ID = customer.id;
          return customer;
        });

        const processedStylists = stylistsData.map(stylist => {
          if (!stylist.stylist_ID && stylist.id) stylist.stylist_ID = stylist.id;
          return stylist;
        });

        const processedServices = servicesData.map(service => {
          if (!service.service_ID && service.id) service.service_ID = service.id;
          if (typeof service.price === 'string') service.price = parseFloat(service.price);
          return service;
        });
        
        setCustomers(processedCustomers);
        setServices(processedServices);
        setStylists(processedStylists);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load necessary data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Get current time to display greeting
  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Helper function to format dates consistently for the modal
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleTabChange = (event, newValue) => {
    // Only allow tab changes if not in edit mode
    if (!isEditMode) {
      setTabValue(newValue);
    } else {
      // Show a notification that they need to complete or cancel editing first
      setNotification({
        open: true,
        message: 'Please complete or cancel the current edit operation first',
        severity: 'warning'
      });
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
      await axios.post('/admin/appointments/bridal', formData);
      
      setNotification({
        open: true,
        message: 'Bridal appointment created successfully!',
        severity: 'success'
      });
      
      // Switch to the appointments list tab after successful creation
      setTabValue(0);
      
      setLoading(false);
    } catch (err) {
      console.error('Error creating appointment:', err);
      
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Failed to create appointment',
        severity: 'error'
      });
      
      setLoading(false);
    }
  };

  const handleEditSubmit = async (formData, appointmentId) => {
    try {
      setLoading(true);
      
      await axios.put(`/admin/bridal-appointments/${appointmentId}`, formData);
      
      setNotification({
        open: true,
        message: 'Appointment updated successfully!',
        severity: 'success'
      });
      
      // Reset edit mode and return to list view
      setIsEditMode(false);
      setCurrentAppointmentId(null);
      setTabValue(0);
      
      setLoading(false);
    } catch (err) {
      console.error('Error updating appointment:', err);
      
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Failed to update appointment',
        severity: 'error'
      });
      
      setLoading(false);
    }
  };

  const handleEditAppointment = (appointmentId, callback) => {
    // Set edit mode and store the appointment ID
    setCurrentAppointmentId(appointmentId);
    setIsEditMode(true);
    
    // Add a third tab (index 2) specifically for editing
    if (tabValue !== 2) {
      setTabValue(2);
    }
  };

  // New function to view appointment details
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  // New function for handling "Add New" button click
  const handleAddNewAppointment = () => {
    // Clear any appointment ID
    setCurrentAppointmentId(null);
    setIsEditMode(false);
    
    // Navigate to the create appointment tab
    setTabValue(1);
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      
      await axios.delete(`/admin/appointments/bridal/${appointmentId}`);
      
      setNotification({
        open: true,
        message: 'Appointment deleted successfully',
        severity: 'success'
      });
      
      // Refresh appointments list
      // You might want to implement a refresh method here
      
      setLoading(false);
    } catch (err) {
      console.error('Error deleting appointment:', err);
      
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Failed to delete appointment',
        severity: 'error'
      });
      
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset edit mode if applicable
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentAppointmentId(null);
    }
    
    // Switch back to the appointments list tab
    setTabValue(0);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" sx={{ color: '#BEAF9B' }} />
      </Backdrop>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ 
          borderRadius: '8px',
          border: '1px solid rgba(244, 67, 54, 0.2)'
        }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(190, 175, 155, 0.2)',
          mb: 4,
          background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))',
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid rgba(190, 175, 155, 0.2)' }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 600,
              color: '#453C33',
              mb: 1
            }}
          >
            Bridal Appointments Management
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#666',
              mb: 1
            }}
          >
            {getCurrentTimeGreeting()}, {adminName}. Manage your salon's bridal appointments here.
          </Typography>
        </Box>
        
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'rgba(190, 175, 155, 0.2)', px: { xs: 2, md: 3 } }}>
            <StyledTabs 
              value={tabValue} 
              onChange={handleTabChange}
              aria-label="bridal appointments tabs"
              variant={isMobile ? "fullWidth" : "standard"}
            >
              <StyledTab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventNoteIcon fontSize="small" />
                    <span>Appointments List</span>
                  </Box>
                }
                id="bridal-tab-0" 
                aria-controls="bridal-tabpanel-0" 
              />
              <StyledTab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AddCircleOutlineIcon fontSize="small" />
                    <span>Create Appointment</span>
                  </Box>
                }
                id="bridal-tab-1" 
                aria-controls="bridal-tabpanel-1" 
              />
              {isEditMode && (
                <StyledTab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EditCalendarIcon fontSize="small" />
                      <span>Edit Appointment</span>
                    </Box>
                  }
                  id="bridal-tab-2" 
                  aria-controls="bridal-tabpanel-2" 
                />
              )}
            </StyledTabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <BridalAptTable 
              stylists={stylists}
              onEdit={handleEditAppointment}
              onDelete={handleDeleteAppointment}
              onAddNew={handleAddNewAppointment}
              onViewDetails={handleViewDetails}
              tableSx={{ 
                borderRadius: '8px',
                overflow: 'hidden',
              }}
              buttonSx={{
                edit: { color: '#BEAF9B' },
                delete: { color: '#ff6b6b' },
                view: { color: '#4dabf5' }
              }}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <BridalAppointmentForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              customers={customers}
              services={services}
              stylists={stylists}
              formSx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'rgba(190, 175, 155, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#BEAF9B',
                  },
                },
                '& .MuiFormLabel-root.Mui-focused': {
                  color: '#BEAF9B',
                },
              }}
              buttonSx={{
                submit: { 
                  bgcolor: '#BEAF9B', 
                  '&:hover': { 
                    bgcolor: '#a39685'
                  } 
                },
                cancel: { 
                  color: '#666', 
                  borderColor: '#ccc',
                  '&:hover': { 
                    borderColor: '#999'
                  } 
                }
              }}
            />
          </TabPanel>
          
          {isEditMode && (
            <TabPanel value={tabValue} index={2}>
              <BridalAptEditForm
                appointmentId={currentAppointmentId}
                onSubmit={handleEditSubmit}
                onCancel={handleCancel}
                customers={customers}
                services={services}
                stylists={stylists}
                formSx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#BEAF9B',
                    },
                  },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: '#BEAF9B',
                  },
                }}
                buttonSx={{
                  submit: { 
                    bgcolor: '#BEAF9B', 
                    '&:hover': { 
                      bgcolor: '#a39685'
                    } 
                  },
                  cancel: { 
                    color: '#666', 
                    borderColor: '#ccc',
                    '&:hover': { 
                      borderColor: '#999'
                    } 
                  }
                }}
              />
            </TabPanel>
          )}
        </Box>
      </Paper>
      
      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        selectedAppointment={selectedAppointment}
        handleEditClick={handleEditAppointment}
        formatDate={formatDate}
        modalSx={{
          '& .MuiPaper-root': {
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          },
          '& .MuiDialogTitle-root': {
            backgroundColor: 'rgba(190, 175, 155, 0.1)',
            borderBottom: '1px solid rgba(190, 175, 155, 0.2)',
          },
          '& .MuiDialogActions-root': {
            borderTop: '1px solid rgba(190, 175, 155, 0.2)',
          }
        }}
        buttonSx={{
          edit: { 
            bgcolor: '#BEAF9B', 
            '&:hover': { 
              bgcolor: '#a39685'
            } 
          },
          close: { 
            color: '#666', 
            borderColor: '#ccc',
            '&:hover': { 
              borderColor: '#999'
            } 
          }
        }}
      />
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ 
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            ...(notification.severity === 'success' && {
              bgcolor: 'rgba(76, 175, 80, 0.9)'
            }),
            ...(notification.severity === 'error' && {
              bgcolor: 'rgba(244, 67, 54, 0.9)'
            }),
            ...(notification.severity === 'warning' && {
              bgcolor: 'rgba(255, 152, 0, 0.9)'
            }),
            '& .MuiAlert-icon': {
              alignItems: 'center'
            }
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminBridalAppointments;