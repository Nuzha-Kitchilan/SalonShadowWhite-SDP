// import React, { useEffect, useState } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Box, Typography, TextField, Button, Paper,
//   FormControl, InputLabel, Select, MenuItem,
//   FormHelperText, InputAdornment, Snackbar, Alert
// } from '@mui/material';

// const CreateAppointmentModal = ({ 
//   open, 
//   onClose, 
//   onCreateAppointment, 
//   request, 
//   stylists,
//   selectedStylist, 
//   setSelectedStylist 
// }) => {
//   const [paymentAmount, setPaymentAmount] = useState(0);
//   const [services, setServices] = useState([]);
//   const [validationError, setValidationError] = useState('');

//   useEffect(() => {
//     if (open) {
//       fetchServices();
      
//       // Enhanced validation: Check multiple conditions for existing appointment
//       if (request && (
//         request.has_appointment || 
//         request.appointment_id || 
//         request.status === 'completed'
//       )) {
//         console.log('Request already has an appointment, closing modal');
//         setValidationError('This request already has an appointment associated with it.');
//         // Don't close immediately to allow the error to be seen
//         setTimeout(() => onClose(), 3000);
//       } else {
//         setValidationError('');
//       }
//     }
//   }, [open, request, onClose]);

//   useEffect(() => {
//     if (request && services.length > 0) {
//       // Calculate payment amount when request or services change
//       calculatePaymentAmount();
//     }
//   }, [request, services]);

//   const fetchServices = async () => {
//     try {
//       console.log('Fetching services from API...');
//       const response = await fetch('http://localhost:5001/api/services');
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch services (${response.status})`);
//       }
      
//       const data = await response.json();
//       console.log('Services received:', data);
      
//       if (Array.isArray(data)) {
//         setServices(data);
//       } else if (data.services && Array.isArray(data.services)) {
//         setServices(data.services);
//       } else {
//         throw new Error('Invalid services data format');
//       }
//     } catch (error) {
//       console.error('Error fetching services:', error);
//       setValidationError('Error fetching services. Please try again.');
//     }
//   };
  
//   const calculatePaymentAmount = () => {
//     if (!services.length || !request || !request.service_id) return 0;
    
//     // Find the service that matches the request's service_id
//     const serviceObj = services.find(s => s.service_id === request.service_id);
    
//     if (serviceObj && serviceObj.price) {
//       const amount = parseFloat(serviceObj.price);
//       setPaymentAmount(amount);
//       return amount;
//     }
    
//     setPaymentAmount(0);
//     return 0;
//   };

//   const formatDateForInput = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const offset = date.getTimezoneOffset();
//     const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
//     return adjustedDate.toISOString().split('T')[0];
//   };

//   const validateBeforeCreate = () => {
//     // Clear previous validation errors
//     setValidationError('');
    
//     // Check if appointment already exists for this request
//     if (request && (request.has_appointment || request.appointment_id)) {
//       setValidationError('Cannot create appointment: Request already has an appointment.');
//       return false;
//     }
    
//     // Make sure we have a service_id
//     if (!request.service_id) {
//       setValidationError('Cannot create appointment: No service specified.');
//       return false;
//     }
    
//     // Validate required fields
//     if (!request.preferred_date || !request.preferred_time) {
//       setValidationError('Cannot create appointment: Missing date or time.');
//       return false;
//     }
    
//     // Check for customer data
//     if (!request.customer_id) {
//       setValidationError('Cannot create appointment: Customer information is missing.');
//       return false;
//     }
    
//     return true;
//   };

//   const handleCreateAppointment = () => {
//     // Validate before proceeding
//     if (!validateBeforeCreate()) {
//       return;
//     }
    
//     // Calculate the payment amount one more time before creating appointment
//     const amount = calculatePaymentAmount();
    
//     // Build appointment object from request data
//     const appointment = {
//       customer_ID: request.customer_id,
//       appointment_date: request.preferred_date,
//       appointment_time: request.preferred_time,
//       appointment_status: 'Scheduled',
//       serviceStylists: selectedStylist ? [
//         {
//           service_ID: request.service_id,
//           stylist_ID: selectedStylist,
//         }
//       ] : [],
//       payment_status: 'Pending',
//       payment_amount: amount,
//       payment_type: 'Pay at Salon',
//       notes: `Created from special request #${request.id}: ${request.request_details}`,
//       request_id: request.id, // Add request_id to link this appointment to the request
//     };
    
//     onCreateAppointment(appointment);
//   };

//   const handleClose = () => {
//     setValidationError('');
//     onClose();
//   };

//   if (!request) return null;

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//       <DialogTitle>Create Appointment from Request</DialogTitle>
//       <DialogContent dividers>
//         {validationError && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {validationError}
//           </Alert>
//         )}
        
//         <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
//           {/* Customer Section */}
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="subtitle1" sx={{ mb: 2 }}>Customer Details</Typography>
//             <TextField
//               label="Customer"
//               value={`${request.first_name} ${request.last_name}`}
//               fullWidth
//               margin="normal"
//               InputProps={{ readOnly: true }}
//             />
//           </Paper>
          
//           {/* Appointment Details Section */}
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="subtitle1" sx={{ mb: 2 }}>Appointment Details</Typography>
//             <TextField
//               label="Appointment Date"
//               type="date"
//               value={formatDateForInput(request.preferred_date)}
//               fullWidth
//               margin="normal"
//               InputLabelProps={{ shrink: true }}
//               InputProps={{ readOnly: true }}
//             />
//             <TextField
//               label="Appointment Time"
//               value={request.preferred_time}
//               fullWidth
//               margin="normal"
//               InputProps={{ readOnly: true }}
//             />
//           </Paper>
          
//           {/* Services Section */}
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="subtitle1" sx={{ mb: 2 }}>Services</Typography>
//             <TextField
//               label="Service"
//               value={request.service_name || "Not specified"}
//               fullWidth
//               margin="normal"
//               InputProps={{ readOnly: true }}
//             />
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Stylist</InputLabel>
//               <Select 
//                 value={selectedStylist}
//                 onChange={(e) => setSelectedStylist(e.target.value)}
//               >
//                 <MenuItem value="">
//                   <em>Not assigned</em>
//                 </MenuItem>
//                 {stylists.map((stylist) => (
//                   <MenuItem key={stylist.stylist_ID} value={stylist.stylist_ID}>
//                     {stylist.firstname} {stylist.lastname}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <FormHelperText>Optional: You can assign a stylist now or later</FormHelperText>
//             </FormControl>
//           </Paper>
          
//           {/* Status & Payment Section */}
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="subtitle1" sx={{ mb: 2 }}>Status & Payment</Typography>
//             <TextField
//               label="Appointment Status"
//               value="Scheduled"
//               fullWidth
//               margin="normal"
//               InputProps={{ readOnly: true }}
//             />
            
//             <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
//               <TextField
//                 label="Payment Amount"
//                 type="number"
//                 value={paymentAmount}
//                 fullWidth
//                 InputProps={{
//                   startAdornment: <InputAdornment position="start">$</InputAdornment>,
//                   readOnly: true
//                 }}
//               />
//               <TextField
//                 label="Payment Status"
//                 value="Pending"
//                 fullWidth
//                 InputProps={{ readOnly: true }}
//               />
//             </Box>
            
//             <TextField
//               label="Payment Type"
//               value="Pay at Salon"
//               fullWidth
//               margin="normal"
//               InputProps={{ readOnly: true }}
//             />
//           </Paper>
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button 
//           onClick={handleCreateAppointment} 
//           variant="contained" 
//           color="primary"
//           disabled={!!validationError || request?.has_appointment || request?.appointment_id || request?.status === 'completed'}
//         >
//           Create Appointment
//         </Button>
//         <Button onClick={handleClose}>
//           Cancel
//         </Button>
//       </DialogActions>
      
//       {/* Error Snackbar */}
//       <Snackbar
//         open={!!validationError}
//         autoHideDuration={6000}
//         onClose={() => setValidationError('')}
//       >
//         <Alert onClose={() => setValidationError('')} severity="error">
//           {validationError}
//         </Alert>
//       </Snackbar>
//     </Dialog>
//   );
// };

// export default CreateAppointmentModal;











import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, TextField, Button, Paper,
  FormControl, InputLabel, Select, MenuItem,
  FormHelperText, InputAdornment, Snackbar, Alert,
  styled
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Spa as SpaIcon,
  Description as DescriptionIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  ContentCut as StylistIcon,
  Save as SaveIcon
} from "@mui/icons-material";

// Styled components to match the table aesthetic
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: 'rgba(190, 175, 155, 0.1)',
  color: '#453C33',
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: 600,
  padding: '16px 24px',
  borderBottom: '1px solid rgba(190, 175, 155, 0.3)',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: '24px',
  fontFamily: "'Poppins', 'Roboto', sans-serif",
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: '16px 24px',
  borderTop: '1px solid rgba(190, 175, 155, 0.1)',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '8px',
  border: '1px solid rgba(190, 175, 155, 0.2)',
  boxShadow: 'none',
  overflow: 'hidden',
  height: '100%',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontFamily: "'Poppins', 'Roboto', sans-serif",
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
  '& .MuiInputLabel-root': {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    color: '#666666',
  },
  '& .MuiInputBase-input': {
    color: '#453C33',
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontFamily: "'Poppins', 'Roboto', sans-serif",
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
  '& .MuiInputLabel-root': {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    color: '#666666',
  },
  '& .MuiSelect-select': {
    color: '#453C33',
  },
}));

const StyledButton = styled(Button)(({ theme, color }) => ({
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: 600,
  fontSize: '0.75rem',
  borderRadius: '20px',
  padding: '6px 16px',
  textTransform: 'none',
  boxShadow: 'none',
  ...(color === 'primary' && {
    borderColor: '#BEAF9B',
    color: '#453C33',
    '&:hover': {
      backgroundColor: 'rgba(190, 175, 155, 0.1)',
      borderColor: '#BEAF9B',
    },
  }),
  ...(color === 'secondary' && {
    backgroundColor: '#BEAF9B',
    color: '#FFFFFF',
    border: 'none',
    '&:hover': {
      backgroundColor: '#a39383',
    },
  }),
}));

const SectionTitle = styled(Box)(({ theme }) => ({
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    marginRight: '8px',
    color: '#BEAF9B',
  },
  '& .MuiTypography-root': {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    fontWeight: 600,
    color: '#453C33',
  },
}));

// Add the formatDateForInput function
const formatDateForInput = (dateString) => {
  // Handle different date formats
  if (!dateString) return '';
  
  try {
    // Try to parse the date
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) return dateString;
    
    // Format as YYYY-MM-DD (format required by date input)
    return date.toISOString().split('T')[0];
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString; // Return the original string if parsing fails
  }
};

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
  const [serviceStylists, setServiceStylists] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

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
    // Only attempt to calculate payment amount when both services and request are loaded
    if (request && services.length > 0) {
      console.log('Both request and services are loaded, calculating payment');
      // Set a flag that data is loaded
      setDataLoaded(true);
      
      // Initialize service-stylist pairings
      initializeServiceStylists();
      
      // Calculate payment amount with a small delay to ensure all data is processed
      setTimeout(() => calculatePaymentAmount(), 100);
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
  
  // Improved function to get service information as an array from different possible sources
  const getServiceInfo = (request) => {
    // First, log the available service data for debugging
    console.log('Processing service data:', {
      services: request.services,
      service_name: request.service_name,
      service_ids: request.service_ids,
      service_id: request.service_id
    });

    // Return an array of service objects with id and name
    const servicesList = [];

    // Check different possible service data sources
    if (request.services) {
      // If services is an array of objects
      if (Array.isArray(request.services)) {
        request.services.forEach((service, index) => {
          if (typeof service === 'object') {
            servicesList.push({
              id: service.id || service.service_id || `service-${index}`,
              name: service.name || service.service_name || `Service ${index + 1}`
            });
          } else if (typeof service === 'string') {
            servicesList.push({
              id: `service-${index}`,
              name: service
            });
          }
        });
      } else if (typeof request.services === 'string') {
        // If services is a comma-separated string, split it into multiple services
        const serviceNames = request.services.split(',').map(s => s.trim());
        
        // Check if we also have service_ids to match with these services
        let serviceIds = [];
        if (request.service_ids && typeof request.service_ids === 'string') {
          serviceIds = request.service_ids.split(',').map(id => id.trim());
        }
        
        // Create service objects for each service name
        serviceNames.forEach((serviceName, index) => {
          servicesList.push({
            id: serviceIds[index] || `service-string-${index}`,
            name: serviceName
          });
        });
      }
    } 
    
    // Check for service_name
    if (request.service_name && servicesList.length === 0) {
      let serviceId = request.service_id || 'service-name';
      
      // Find matching service by name if possible
      if (!request.service_id && services.length > 0) {
        const matchingService = services.find(
          s => s.name === request.service_name || 
               s.service_name === request.service_name
        );
        if (matchingService) {
          serviceId = matchingService.id || matchingService.service_id;
        }
      }
      
      servicesList.push({
        id: serviceId,
        name: request.service_name
      });
    }
    
    // Check for service_ids with services array
    if (request.service_ids && servicesList.length === 0) {
      // If service_ids is an array
      if (Array.isArray(request.service_ids)) {
        request.service_ids.forEach((id, index) => {
          const serviceObj = services.find(s => s.service_id === id || s.id === id);
          servicesList.push({
            id: id,
            name: serviceObj ? (serviceObj.name || serviceObj.service_name) : `Service ${index + 1}`
          });
        });
      } else if (typeof request.service_ids === 'string') {
        // If it's a string, split by comma
        const ids = request.service_ids.split(',').map(id => id.trim());
        
        ids.forEach((id, index) => {
          const serviceObj = services.find(s => s.service_id === id || s.id === id);
          servicesList.push({
            id: id,
            name: serviceObj ? (serviceObj.name || serviceObj.service_name) : `Service ID: ${id}`
          });
        });
      }
    }
    
    // If we have service_id but no services processed yet
    if (request.service_id && servicesList.length === 0) {
      const serviceObj = services.find(s => s.service_id === request.service_id || s.id === request.service_id);
      if (serviceObj) {
        servicesList.push({
          id: request.service_id,
          name: serviceObj.name || serviceObj.service_name || 'Service'
        });
      } else {
        servicesList.push({
          id: request.service_id,
          name: `Service ID: ${request.service_id}`
        });
      }
    }
    
    // If no services found, add a default one
    if (servicesList.length === 0) {
      servicesList.push({
        id: 'default-service',
        name: 'Not specified'
      });
    }
    
    console.log('Processed services:', servicesList);
    return servicesList;
  };
  
  // Updated payment calculation for multiple services
  const calculatePaymentAmount = () => {
    if (!services.length || !request) return 0;
    
    let totalAmount = 0;
    
    // Get the services from the request
    const requestServices = getServiceInfo(request);
    
    // For debugging, log all services and the request services
    console.log('All available services:', services);
    console.log('Request services to find prices for:', requestServices);
    
    // Calculate total price based on service IDs
    requestServices.forEach(requestService => {
      // Find matching service in our services list - more comprehensive matching
      const serviceObj = services.find(s => {
        // Try multiple ways to match the service
        return (
          // Direct ID match
          s.service_id === requestService.id || 
          s.id === requestService.id ||
          // Name match if IDs don't work
          s.name === requestService.name ||
          s.service_name === requestService.name
        );
      });
      
      if (serviceObj) {
        console.log('Found matching service:', serviceObj);
        
        // Get price from multiple possible fields
        const price = serviceObj.price || serviceObj.base_price || 0;
        console.log(`Price for ${requestService.name}:`, price);
        
        if (price) {
          const amount = parseFloat(price);
          if (!isNaN(amount)) {
            totalAmount += amount;
            console.log(`Added ${amount} to total. New total:`, totalAmount);
          } else {
            console.log('Could not parse price as number:', price);
          }
        } else {
          console.log('No price found for service:', requestService.name);
        }
      } else {
        console.log('No matching service found for:', requestService);
      }
    });
    
    console.log('Final calculated payment amount:', totalAmount);
    setPaymentAmount(totalAmount);
    return totalAmount;
  };

  // Initialize service-stylist pairings
  const initializeServiceStylists = () => {
    if (!request) return;
    
    // Get services list using the updated getServiceInfo function
    const servicesList = getServiceInfo(request);
    
    // Map the services to our serviceStylists format
    const mappedServiceStylists = servicesList.map(service => ({
      id: service.id,
      name: service.name,
      stylistId: selectedStylist || ''
    }));
    
    setServiceStylists(mappedServiceStylists);
  };

  // Update service stylist
  const updateServiceStylist = (index, stylistId) => {
    const updatedServiceStylists = [...serviceStylists];
    updatedServiceStylists[index] = {
      ...updatedServiceStylists[index],
      stylistId
    };
    setServiceStylists(updatedServiceStylists);
  };

  const validateBeforeCreate = () => {
    // Clear previous validation errors
    setValidationError('');
    
    // Check if appointment already exists for this request
    if (request && (request.has_appointment || request.appointment_id)) {
      setValidationError('Cannot create appointment: Request already has an appointment.');
      return false;
    }
    
    // Make sure we have services
    const requestServices = getServiceInfo(request);
    if (requestServices.length === 0) {
      setValidationError('Cannot create appointment: No services specified.');
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
    
    // Check if at least one stylist is assigned
    const hasAnyStylist = serviceStylists.some(service => service.stylistId);
    if (!hasAnyStylist) {
      setValidationError('Please assign at least one stylist.');
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
    
    // Build service-stylist pairings from our state
    const serviceStylistsData = serviceStylists
      .filter(item => item.stylistId) // Only include assigned stylists
      .map(item => ({
        service_ID: item.id,
        stylist_ID: item.stylistId,
      }));
    
    // Build appointment object from request data
    const appointment = {
      customer_ID: request.customer_id,
      appointment_date: request.preferred_date,
      appointment_time: request.preferred_time,
      appointment_status: 'Scheduled',
      serviceStylists: serviceStylistsData,
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
    <StyledDialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        Create Appointment from Request
      </StyledDialogTitle>
      
      <StyledDialogContent dividers>
        {validationError && (
          <Alert severity="error" sx={{ mb: 2, fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
            {validationError}
          </Alert>
        )}
        
        {!dataLoaded && (
          <Alert severity="info" sx={{ mb: 2, fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
            Loading service data...
          </Alert>
        )}
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#453C33',
            fontWeight: 600,
            fontSize: '1.25rem',
            mb: 1
          }}>
            New Appointment for Request #{request.id}
          </Typography>
          <Typography variant="body2" sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#666666'
          }}>
            Review the details and assign stylists to create an appointment
          </Typography>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
          {/* Customer Section */}
          <StyledPaper>
            <Box sx={{ p: 2 }}>
              <SectionTitle>
                <PersonIcon />
                <Typography variant="subtitle1">
                  Customer Details
                </Typography>
              </SectionTitle>
              <StyledTextField
                label="Customer"
                value={`${request.first_name || ''} ${request.last_name || ''}`}
                fullWidth
                margin="normal"
                InputProps={{ 
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#BEAF9B' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </StyledPaper>
          
          {/* Appointment Details Section */}
          <StyledPaper>
            <Box sx={{ p: 2 }}>
              <SectionTitle>
                <CalendarIcon />
                <Typography variant="subtitle1">
                  Appointment Details
                </Typography>
              </SectionTitle>
              <StyledTextField
                label="Appointment Date"
                type="date"
                value={formatDateForInput(request.preferred_date)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                InputProps={{ 
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon sx={{ color: '#BEAF9B' }} />
                    </InputAdornment>
                  )
                }}
              />
              <StyledTextField
                label="Appointment Time"
                value={request.preferred_time}
                fullWidth
                margin="normal"
                InputProps={{ 
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimeIcon sx={{ color: '#BEAF9B' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </StyledPaper>
          
          {/* Services Section */}
          <StyledPaper>
            <Box sx={{ p: 2 }}>
              <SectionTitle>
                <SpaIcon />
                <Typography variant="subtitle1">
                  Services & Stylists
                </Typography>
              </SectionTitle>
              
              {/* Service-stylist pairing fields */}
              {serviceStylists.map((service, index) => (
                <Box key={service.id || index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <StyledTextField
                    label={`Service ${index + 1}`}
                    value={service.name}
                    sx={{ flexGrow: 1 }}
                    InputProps={{ 
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SpaIcon sx={{ color: '#BEAF9B' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                  <StyledFormControl sx={{ minWidth: '50%' }}>
                    <InputLabel>{`Assign Stylist`}</InputLabel>
                    <Select 
                      value={service.stylistId}
                      onChange={(e) => updateServiceStylist(index, e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <StylistIcon sx={{ color: '#BEAF9B' }} />
                        </InputAdornment>
                      }
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
                  </StyledFormControl>
                </Box>
              ))}
              
              <FormHelperText sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                Assign a stylist to each service or leave unassigned for later
              </FormHelperText>
            </Box>
          </StyledPaper>
          
          {/* Status & Payment Section */}
          <StyledPaper>
            <Box sx={{ p: 2 }}>
              <SectionTitle>
                <MoneyIcon />
                <Typography variant="subtitle1">
                  Status & Payment
                </Typography>
              </SectionTitle>
              <StyledTextField
                label="Appointment Status"
                value="Scheduled"
                fullWidth
                margin="normal"
                InputProps={{ 
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon sx={{ color: '#BEAF9B' }} />
                    </InputAdornment>
                  )
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <StyledTextField
                  label="Payment Amount"
                  type="number"
                  value={paymentAmount}
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    readOnly: true
                  }}
                />
                <StyledTextField
                  label="Payment Status"
                  value="Pending"
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Box>
              
              <StyledTextField
                label="Payment Type"
                value="Pay at Salon"
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
            </Box>
          </StyledPaper>
        </Box>
      </StyledDialogContent>
      
      <StyledDialogActions>
        <StyledButton 
          onClick={handleCreateAppointment} 
          variant="contained" 
          color="secondary"
          startIcon={<SaveIcon />}
          disabled={!!validationError || request?.has_appointment || request?.appointment_id || request?.status === 'completed'}
        >
          Create Appointment
        </StyledButton>
        <StyledButton 
          onClick={handleClose}
          variant="outlined"
          color="primary"
        >
          Cancel
        </StyledButton>
      </StyledDialogActions>
      
      {/* Error Snackbar */}
      <Snackbar
        open={!!validationError}
        autoHideDuration={6000}
        onClose={() => setValidationError('')}
      >
        <Alert 
          onClose={() => setValidationError('')} 
          severity="error"
          sx={{
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            color: '#d32f2f',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}
        >
          {validationError}
        </Alert>
      </Snackbar>
    </StyledDialog>
  );
};

export default CreateAppointmentModal;