

// import React, { useEffect, useState } from 'react';
// import { Box, Button,Typography, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
// import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
// import SpecialRequestsTable from '../components/specialReq/SpecialRequestsTable';
// import SpecialRequestForm from '../components/specialReq/SpecialRequestForm';
// import AppointmentDetailsModal from '../components/specialReq/AppointmentDetailsModal';
// import axios from '../utils/axiosWithAuth';

// const AdminSpecialRequests = () => {
//   const [requests, setRequests] = useState([]);
//    const [stylists, setStylists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [successDialogOpen, setSuccessDialogOpen] = useState(false);
//   const [successRequest, setSuccessRequest] = useState(null);
//   const [viewAppointmentModalOpen, setViewAppointmentModalOpen] = useState(false);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);

//   const fetchRequests = async () => {
//     try {
//       const res = await axios.get('http://localhost:5001/api/specialRequest/admin/all-requests');
//       setRequests(res.data.requests);
//     } catch (err) {
//       console.error('Error fetching special requests:', err);
//       setSnackbar({ open: true, message: 'Failed to fetch special requests', severity: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

  


//   const handleUpdateStatus = async (requestId, newStatus) => {
//     setProcessing(true);
//     try {
//       await axios.put('http://localhost:5001/api/specialRequest/admin/update-status', {
//         requestId,
//         status: newStatus
//       });

//       setSnackbar({ 
//         open: true, 
//         message: `Request status updated to ${newStatus} successfully`,
//         severity: 'success'
//       });
      
//       setDialogOpen(false);
//       fetchRequests();
//     } catch (err) {
//       console.error('Status update error:', err);
//       setSnackbar({
//         open: true,
//         message: err.response?.data?.message || err.message || 'Failed to update request status',
//         severity: 'error'
//       });
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleViewSuccess = (request) => {
//     console.log('Original request:', request);
  
//   // Explicitly use appointment_ID from the API response
//   const appointmentId = request.appointment_ID;
  
//   const processedRequest = {
//     ...request,
//     appointment_ID: appointmentId
//   };
  
//   console.log('Processed request with appointment_ID:', processedRequest);
//     setSuccessRequest(request);
//     setSuccessDialogOpen(true);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };


//   const handleViewAppointment = (request) => {
//   setSelectedAppointment({
//     id: request.appointment_id,
//     customer: {
//       first_name: request.first_name,
//       last_name: request.last_name,
//       email: request.email,
//       phone_number: request.phone_number
//     }
//   });
//   setViewAppointmentModalOpen(true);
// };

//   const formatTime = (timeString) => {
//     if (!timeString) return 'N/A';
//     if (typeof timeString === 'string') {
//       const [hours, minutes] = timeString.split(':');
//       const time = new Date();
//       time.setHours(hours, minutes);
//       return time.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     }
//     return new Date(timeString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const handleOpenDialog = (request) => {
//     setSelectedRequest(request);
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//   };

//   if (loading) return <Box textAlign="center"><CircularProgress /></Box>;

//   return (
//     <Box p={4}>
//       <Typography variant="h4" gutterBottom>Special Requests</Typography>
      
//       {requests.length === 0 ? (
//         <Typography>No special requests found</Typography>
//       ) : (
//         <SpecialRequestsTable 
//           requests={requests} 
//           onReviewRequest={handleOpenDialog}
//           onViewSuccess={handleViewSuccess}
//           onViewAppointment={handleViewAppointment}
//         />
//       )}


//       {viewAppointmentModalOpen && (
//   <AppointmentDetailsModal
//     open={viewAppointmentModalOpen}
//     onClose={() => setViewAppointmentModalOpen(false)}
//     appointmentId={selectedAppointment?.id}
//     customer={selectedAppointment?.customer}
//     stylists={stylists} // Make sure you have stylists data available
//   />
// )}


//       {/* Form Dialog */}
//       {selectedRequest && (
//         <SpecialRequestForm
//           open={dialogOpen}
//           onClose={handleCloseDialog}
//           request={selectedRequest}
//           onUpdateStatus={handleUpdateStatus}
//           processing={processing}
//           onViewSuccess={handleViewSuccess} 
//         />
//       )}

//       {/* Success Dialog */}
//       <Dialog 
//         open={successDialogOpen} 
//         onClose={() => setSuccessDialogOpen(false)}
//         maxWidth="sm" 
//         fullWidth
//       >
//         <DialogTitle sx={{ bgcolor: '#4caf50', color: 'white' }}>
//           Appointment Created Successfully
//         </DialogTitle>
        
//         <DialogContent dividers>
//           <Box sx={{ 
//             display: 'flex', 
//             flexDirection: 'column', 
//             alignItems: 'center',
//             py: 3 
//           }}>
//             <Box 
//               sx={{ 
//                 width: 70, 
//                 height: 70, 
//                 borderRadius: '50%', 
//                 bgcolor: '#e8f5e9', 
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 alignItems: 'center',
//                 mb: 2
//               }}
//             >
//               <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 40 }} />
//             </Box>
            
//             <Typography variant="h6" gutterBottom>
//               Success!
//             </Typography>
            
//             <Typography variant="body1" align="center" paragraph>
//               Appointment #{successRequest?.appointment_ID} was created successfully!
//             </Typography>
            
//             {successRequest && (
//               <Paper 
//                 elevation={1} 
//                 sx={{ 
//                   p: 2, 
//                   width: '100%', 
//                   mb: 2,
//                   bgcolor: '#f5f5f5',
//                   border: '1px solid #e0e0e0'
//                 }}
//               >
//                 <Typography variant="subtitle2" gutterBottom>
//                   Appointment Details:
//                 </Typography>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2">Appointment ID:</Typography>
//                   <Typography variant="body2" fontWeight="bold">#{successRequest.appointment}</Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2">Customer:</Typography>
//                   <Typography variant="body2">{`${successRequest.first_name} ${successRequest.last_name}`}</Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2">Date & Time:</Typography>
//                   <Typography variant="body2">
//                     {formatDate(successRequest.preferred_date)} at {formatTime(successRequest.preferred_time)}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="body2">Service:</Typography>
//                   <Typography variant="body2">{successRequest.service_name || 'Not specified'}</Typography>
//                 </Box>
//               </Paper>
//             )}
//           </Box>
//         </DialogContent>
        
//         <DialogActions>
//           <Button 
//             onClick={() => setSuccessDialogOpen(false)} 
//             variant="contained"
//             color="primary"
//             fullWidth
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert 
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default AdminSpecialRequests;












// PATCHED VERSION OF EditForm.txt

// import React, { useEffect, useState } from 'react';
// import { Box, Button, Typography, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
// import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
// import SpecialRequestsTable from '../components/specialReq/SpecialRequestsTable';
// import SpecialRequestForm from '../components/specialReq/SpecialRequestForm';
// import AppointmentDetailsModal from '../components/specialReq/AppointmentDetailsModal';
// import axios from '../utils/axiosWithAuth';

// const AdminSpecialRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [stylists, setStylists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [successDialogOpen, setSuccessDialogOpen] = useState(false);
//   const [successRequest, setSuccessRequest] = useState(null);
//   const [viewAppointmentModalOpen, setViewAppointmentModalOpen] = useState(false);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);

//   const fetchRequests = async () => {
//     try {
//       const res = await axios.get('http://localhost:5001/api/specialRequest/admin/all-requests');
//       setRequests(res.data.requests);
//     } catch (err) {
//       console.error('Error fetching special requests:', err);
//       setSnackbar({ open: true, message: 'Failed to fetch special requests', severity: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateStatus = async (requestId, newStatus) => {
//     setProcessing(true);
//     try {
//       await axios.put('http://localhost:5001/api/specialRequest/admin/update-status', {
//         requestId,
//         status: newStatus
//       });

//       setSnackbar({ 
//         open: true, 
//         message: `Request status updated to ${newStatus} successfully`,
//         severity: 'success'
//       });

//       setDialogOpen(false);
//       fetchRequests();
//     } catch (err) {
//       console.error('Status update error:', err);
//       setSnackbar({
//         open: true,
//         message: err.response?.data?.message || err.message || 'Failed to update request status',
//         severity: 'error'
//       });
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleViewSuccess = (request) => {
//     const appointmentId =
//       request.appointment_ID ||
//       request.appointment_id ||
//       request.appointmentId ||
//       request.newAppointmentId ||
//       'N/A';

//     const processedRequest = {
//       ...request,
//       appointment_ID: appointmentId,
//       appointment_id: appointmentId,
//       appointmentId: appointmentId,
//       newAppointmentId: appointmentId
//     };

//     setSuccessRequest(processedRequest);
//     setSuccessDialogOpen(true);
//   };

//   const handleViewAppointment = (request) => {
//     setSelectedAppointment({
//       id: request.appointment_id || request.appointment_ID || request.appointmentId,
//       customer: {
//         first_name: request.first_name,
//         last_name: request.last_name,
//         email: request.email,
//         phone_number: request.phone_number
//       }
//     });
//     setViewAppointmentModalOpen(true);
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const handleOpenDialog = (request) => {
//     setSelectedRequest(request);
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return 'N/A';
//     if (typeof timeString === 'string') {
//       const [hours, minutes] = timeString.split(':');
//       const time = new Date();
//       time.setHours(hours, minutes);
//       return time.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     }
//     return new Date(timeString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) return <Box textAlign="center"><CircularProgress /></Box>;

//   return (
//     <Box p={4}>
//       <Typography variant="h4" gutterBottom>Special Requests</Typography>

//       {requests.length === 0 ? (
//         <Typography>No special requests found</Typography>
//       ) : (
//         <SpecialRequestsTable 
//           requests={requests} 
//           onReviewRequest={handleOpenDialog}
//           onViewSuccess={handleViewSuccess}
//           onViewAppointment={handleViewAppointment}
//         />
//       )}

//       {viewAppointmentModalOpen && (
//         <AppointmentDetailsModal
//           open={viewAppointmentModalOpen}
//           onClose={() => setViewAppointmentModalOpen(false)}
//           appointmentId={selectedAppointment?.id}
//           customer={selectedAppointment?.customer}
//           stylists={stylists}
//         />
//       )}

//       {selectedRequest && (
//         <SpecialRequestForm
//           open={dialogOpen}
//           onClose={handleCloseDialog}
//           request={selectedRequest}
//           onUpdateStatus={handleUpdateStatus}
//           processing={processing}
//           onViewSuccess={handleViewSuccess} 
//         />
//       )}

//       <Dialog 
//         open={successDialogOpen} 
//         onClose={() => setSuccessDialogOpen(false)}
//         maxWidth="sm" 
//         fullWidth
//       >
//         <DialogTitle sx={{ bgcolor: '#4caf50', color: 'white' }}>
//           Appointment Created Successfully
//         </DialogTitle>

//         <DialogContent dividers>
//           <Box sx={{ 
//             display: 'flex', 
//             flexDirection: 'column', 
//             alignItems: 'center',
//             py: 3 
//           }}>
//             <Box 
//               sx={{ 
//                 width: 70, 
//                 height: 70, 
//                 borderRadius: '50%', 
//                 bgcolor: '#e8f5e9', 
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 alignItems: 'center',
//                 mb: 2
//               }}
//             >
//               <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 40 }} />
//             </Box>

//             <Typography variant="h6" gutterBottom>
//               Success!
//             </Typography>

//             <Typography variant="body1" align="center" paragraph>
//               Appointment #{
//                  (console.log('🧾 Rendering ID with:', successRequest),
//               successRequest?.appointment_ID || successRequest?.appointment_id || successRequest?.appointmentId || 'N/A')}
//                was created successfully!
//             </Typography>

//             {successRequest && (
//               <Paper 
//                 elevation={1} 
//                 sx={{ 
//                   p: 2, 
//                   width: '100%', 
//                   mb: 2,
//                   bgcolor: '#f5f5f5',
//                   border: '1px solid #e0e0e0'
//                 }}
//               >
//                 <Typography variant="subtitle2" gutterBottom>
//                   Appointment Details:
//                 </Typography>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2">Appointment ID:</Typography>
//                   <Typography variant="body2" fontWeight="bold">
//                     #{successRequest?.appointment_ID || successRequest?.appointment_id || successRequest?.appointmentId || 'N/A'}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2">Customer:</Typography>
//                   <Typography variant="body2">{`${successRequest.first_name} ${successRequest.last_name}`}</Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2">Date & Time:</Typography>
//                   <Typography variant="body2">
//                     {formatDate(successRequest.preferred_date)} at {formatTime(successRequest.preferred_time)}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="body2">Service(s):</Typography>
//                   <Typography variant="body2">
//                     {successRequest.services || 
//                      successRequest.service_name || 
//                      (successRequest.service_ids ? 'Multiple services selected' : 'Not specified')}
//                   </Typography>
//                 </Box>
//               </Paper>
//             )}
//           </Box>
//         </DialogContent>

//         <DialogActions>
//           <Button 
//             onClick={() => setSuccessDialogOpen(false)} 
//             variant="contained"
//             color="primary"
//             fullWidth
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert 
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default AdminSpecialRequests;














// import React, { useEffect, useState } from 'react';
// import { 
//   Box, 
//   Button, 
//   Typography, 
//   CircularProgress, 
//   Snackbar, 
//   Alert, 
//   Dialog, 
//   DialogTitle, 
//   DialogContent, 
//   DialogActions, 
//   Paper,
//   Container,
//   useMediaQuery,
//   useTheme
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
// import SpecialRequestsTable from '../components/specialReq/SpecialRequestsTable';
// import SpecialRequestForm from '../components/specialReq/SpecialRequestForm';
// import axios from '../utils/axiosWithAuth';
// import { jwtDecode } from 'jwt-decode';

// const AdminSpecialRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [stylists, setStylists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [successDialogOpen, setSuccessDialogOpen] = useState(false);
//   const [successRequest, setSuccessRequest] = useState(null);
//   const [adminId, setAdminId] = useState(null);
//   const [adminName, setAdminName] = useState('');
  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const fetchRequests = async () => {
//     try {
//       const res = await axios.get('http://localhost:5001/api/specialRequest/admin/all-requests');
//       setRequests(res.data.requests);
//     } catch (err) {
//       console.error('Error fetching special requests:', err);
//       setSnackbar({ open: true, message: 'Failed to fetch special requests', severity: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateStatus = async (requestId, newStatus) => {
//     setProcessing(true);
//     try {
//       await axios.put('http://localhost:5001/api/specialRequest/admin/update-status', {
//         requestId,
//         status: newStatus
//       });

//       setSnackbar({ 
//         open: true, 
//         message: `Request status updated to ${newStatus} successfully`,
//         severity: 'success'
//       });

//       setDialogOpen(false);
//       fetchRequests();
//     } catch (err) {
//       console.error('Status update error:', err);
//       setSnackbar({
//         open: true,
//         message: err.response?.data?.message || err.message || 'Failed to update request status',
//         severity: 'error'
//       });
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleViewSuccess = (request) => {
//     const appointmentId =
//       request.appointment_ID ||
//       request.appointment_id ||
//       request.appointmentId ||
//       request.newAppointmentId ||
//       'N/A';

//     const processedRequest = {
//       ...request,
//       appointment_ID: appointmentId,
//       appointment_id: appointmentId,
//       appointmentId: appointmentId,
//       newAppointmentId: appointmentId
//     };

//     setSuccessRequest(processedRequest);
//     setSuccessDialogOpen(true);
//   };

//   useEffect(() => {
//     fetchRequests();
    
//     // Get admin info from JWT token
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setAdminId(decodedToken.id);
//         setAdminName(decodedToken.name || decodedToken.username || 'Admin');
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   const handleOpenDialog = (request) => {
//     setSelectedRequest(request);
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return 'N/A';
//     if (typeof timeString === 'string') {
//       const [hours, minutes] = timeString.split(':');
//       const time = new Date();
//       time.setHours(hours, minutes);
//       return time.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     }
//     return new Date(timeString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Get current time to display greeting
//   const getCurrentTimeGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good morning';
//     if (hour < 18) return 'Good afternoon';
//     return 'Good evening';
//   };

//   if (loading) return (
//     <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, textAlign: "center", py: 8 }}>
//       <CircularProgress sx={{ color: '#BEAF9B' }} />
//     </Container>
//   );

//   return (
//     <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
//       <Paper 
//         elevation={0}
//         sx={{ 
//           borderRadius: '8px',
//           overflow: 'hidden',
//           border: '1px solid rgba(190, 175, 155, 0.2)',
//           mb: 4,
//           background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))',
//         }}
//       >
//         <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid rgba(190, 175, 155, 0.2)' }}>
//           <Typography 
//             variant={isMobile ? "h5" : "h4"} 
//             component="h1" 
//             sx={{ 
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               fontWeight: 600,
//               color: '#453C33',
//               mb: 1
//             }}
//           >
//             Special Requests
//           </Typography>
          
//           <Typography 
//             variant="body1" 
//             sx={{ 
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               color: '#666',
//               mb: 1
//             }}
//           >
//             {getCurrentTimeGreeting()}, {adminName}. Review and manage special appointment requests here.
//           </Typography>
//         </Box>

//         <Box sx={{ p: { xs: 2, md: 3 } }}>
//           {requests.length === 0 ? (
//             <Typography 
//               sx={{ 
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 color: '#666',
//                 textAlign: 'center',
//                 py: 4 
//               }}
//             >
//               No special requests found
//             </Typography>
//           ) : (
//             <SpecialRequestsTable 
//               requests={requests} 
//               onReviewRequest={handleOpenDialog}
//               onViewSuccess={handleViewSuccess}
//               onViewAppointment={null}
//               tableSx={{ 
//                 borderRadius: '8px',
//                 overflow: 'hidden',
//               }}
//               buttonSx={{
//                 review: { 
//                   bgcolor: 'rgba(190, 175, 155, 0.1)', 
//                   color: '#453C33',
//                   '&:hover': {
//                     bgcolor: 'rgba(190, 175, 155, 0.2)',
//                   }
//                 },
//                 success: { 
//                   bgcolor: 'rgba(76, 175, 80, 0.1)', 
//                   color: '#4caf50',
//                   '&:hover': {
//                     bgcolor: 'rgba(76, 175, 80, 0.2)',
//                   }
//                 }
//               }}
//             />
//           )}
//         </Box>
//       </Paper>

//       {selectedRequest && (
//         <SpecialRequestForm
//           open={dialogOpen}
//           onClose={handleCloseDialog}
//           request={selectedRequest}
//           onUpdateStatus={handleUpdateStatus}
//           processing={processing}
//           onViewSuccess={handleViewSuccess} 
//         />
//       )}

//       <Dialog 
//         open={successDialogOpen} 
//         onClose={() => setSuccessDialogOpen(false)}
//         maxWidth="sm" 
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: '8px',
//             overflow: 'hidden',
//           }
//         }}
//       >
//         <DialogTitle sx={{ 
//           bgcolor: '#4caf50', 
//           color: 'white',
//           fontFamily: "'Poppins', 'Roboto', sans-serif",
//           fontWeight: 600,
//         }}>
//           Appointment Created Successfully
//         </DialogTitle>

//         <DialogContent dividers>
//           <Box sx={{ 
//             display: 'flex', 
//             flexDirection: 'column', 
//             alignItems: 'center',
//             py: 3 
//           }}>
//             <Box 
//               sx={{ 
//                 width: 70, 
//                 height: 70, 
//                 borderRadius: '50%', 
//                 bgcolor: '#e8f5e9', 
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 alignItems: 'center',
//                 mb: 2
//               }}
//             >
//               <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 40 }} />
//             </Box>

//             <Typography 
//               variant="h6" 
//               gutterBottom
//               sx={{
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 fontWeight: 600,
//                 color: '#453C33',
//               }}
//             >
//               Success!
//             </Typography>

//             <Typography 
//               variant="body1" 
//               align="center" 
//               paragraph
//               sx={{
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 color: '#666',
//               }}
//             >
//               Appointment #{
//                  (console.log('🧾 Rendering ID with:', successRequest),
//               successRequest?.appointment_ID || successRequest?.appointment_id || successRequest?.appointmentId || 'N/A')}
//                was created successfully!
//             </Typography>

//             {successRequest && (
//               <Paper 
//                 elevation={1} 
//                 sx={{ 
//                   p: 2, 
//                   width: '100%', 
//                   mb: 2,
//                   bgcolor: '#f5f5f5',
//                   border: '1px solid rgba(190, 175, 155, 0.3)',
//                   borderRadius: '6px',
//                 }}
//               >
//                 <Typography 
//                   variant="subtitle2" 
//                   gutterBottom
//                   sx={{
//                     fontFamily: "'Poppins', 'Roboto', sans-serif",
//                     fontWeight: 600,
//                     color: '#453C33',
//                   }}
//                 >
//                   Appointment Details:
//                 </Typography>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Appointment ID:</Typography>
//                   <Typography variant="body2" fontWeight="bold" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
//                     #{successRequest?.appointment_ID || successRequest?.appointment_id || successRequest?.appointmentId || 'N/A'}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Customer:</Typography>
//                   <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
//                     {`${successRequest.first_name} ${successRequest.last_name}`}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Date & Time:</Typography>
//                   <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
//                     {formatDate(successRequest.preferred_date)} at {formatTime(successRequest.preferred_time)}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Service(s):</Typography>
//                   <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
//                     {successRequest.services || 
//                      successRequest.service_name || 
//                      (successRequest.service_ids ? 'Multiple services selected' : 'Not specified')}
//                   </Typography>
//                 </Box>
//               </Paper>
//             )}
//           </Box>
//         </DialogContent>

//         <DialogActions sx={{ p: 2 }}>
//           <Button 
//             onClick={() => setSuccessDialogOpen(false)} 
//             variant="contained"
//             fullWidth
//             sx={{
//               bgcolor: '#BEAF9B',
//               color: 'white',
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               fontWeight: 500,
//               '&:hover': {
//                 bgcolor: '#a39888',
//               }
//             }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert 
//           severity={snackbar.severity}
//           sx={{ 
//             width: '100%',
//             fontFamily: "'Poppins', 'Roboto', sans-serif",
//           }}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default AdminSpecialRequests;

























import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  Snackbar, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Paper,
  Container,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import SpecialRequestsTable from '../components/specialReq/SpecialRequestsTable';
import SpecialRequestForm from '../components/specialReq/SpecialRequestForm';
import axios from '../utils/axiosWithAuth';
import { jwtDecode } from 'jwt-decode';

// Custom styled Tab component
const StyledTab = styled(Tab)(({ theme }) => ({
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: 500,
  textTransform: 'none',
  minWidth: 120,
  '&.Mui-selected': {
    color: '#453C33',
    fontWeight: 600,
  },
}));

// Custom styled Tabs component
const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#BEAF9B',
    height: 3,
  },
}));

const AdminSpecialRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successRequest, setSuccessRequest] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [adminName, setAdminName] = useState('');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
    total: 0
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/specialRequest/admin/all-requests');
      const allRequests = res.data.requests;
      
      setRequests(allRequests);
      
      // Calculate stats
      const pending = allRequests.filter(req => req.status && req.status.toLowerCase().trim() === 'pending');
      const approved = allRequests.filter(req => req.status && req.status.toLowerCase().trim() === 'approved');
      const completed = allRequests.filter(req => req.status && req.status.toLowerCase().trim() === 'completed');
      const rejected = allRequests.filter(req => req.status && req.status.toLowerCase().trim() === 'rejected');
      
      setStats({
        pending: pending.length,
        approved: approved.length,
        completed: completed.length,
        rejected: rejected.length,
        total: allRequests.length
      });
      
      // Set initial filtered requests based on first tab
      filterRequestsByTab(tabValue, allRequests);
    } catch (err) {
      console.error('Error fetching special requests:', err);
      setSnackbar({ open: true, message: 'Failed to fetch special requests', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filterRequestsByTab = (tabIndex, requestsData = requests) => {
    let filtered = [];
    
    switch (tabIndex) {
      case 0: // All
        filtered = requestsData;
        break;
      case 1: // Pending
        filtered = requestsData.filter(req => req.status && req.status.toLowerCase().trim() === 'pending');
        break;
      case 2: // Approved
        filtered = requestsData.filter(req => req.status && req.status.toLowerCase().trim() === 'approved');
        break;
      case 3: // Completed
        filtered = requestsData.filter(req => req.status && req.status.toLowerCase().trim() === 'completed');
        break;
      case 4: // Rejected
        filtered = requestsData.filter(req => req.status && req.status.toLowerCase().trim() === 'rejected');
        break;
      default:
        filtered = requestsData;
    }
    
    setFilteredRequests(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    filterRequestsByTab(newValue);
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    setProcessing(true);
    try {
      await axios.put('http://localhost:5001/api/specialRequest/admin/update-status', {
        requestId,
        status: newStatus
      });

      setSnackbar({ 
        open: true, 
        message: `Request status updated to ${newStatus} successfully`,
        severity: 'success'
      });

      setDialogOpen(false);
      await fetchRequests(); // Refresh all data after update
    } catch (err) {
      console.error('Status update error:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || 'Failed to update request status',
        severity: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleViewSuccess = (request) => {
    const appointmentId =
      request.appointment_ID ||
      request.appointment_id ||
      request.appointmentId ||
      request.newAppointmentId ||
      'N/A';

    const processedRequest = {
      ...request,
      appointment_ID: appointmentId,
      appointment_id: appointmentId,
      appointmentId: appointmentId,
      newAppointmentId: appointmentId
    };

    setSuccessRequest(processedRequest);
    setSuccessDialogOpen(true);
  };

  useEffect(() => {
    fetchRequests();
    
    // Get admin info from JWT token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAdminId(decodedToken.id);
        setAdminName(decodedToken.name || decodedToken.username || 'Admin');
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    if (typeof timeString === 'string') {
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(hours, minutes);
      return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get current time to display greeting
  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, textAlign: "center", py: 8 }}>
      <CircularProgress sx={{ color: '#BEAF9B' }} />
    </Container>
  );

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
            Special Requests
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#666',
              mb: 2
            }}
          >
            {getCurrentTimeGreeting()}, {adminName}. Review and manage special appointment requests here.
          </Typography>

          {/* Stats summary */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              mb: 2 
            }}
          >
            <Paper 
              elevation={0}
              sx={{ 
                p: 1.5, 
                minWidth: { xs: '45%', sm: '140px' },
                flex: { xs: '1 0 45%', sm: '0 0 auto' }, 
                borderRadius: '6px',
                border: '1px solid rgba(190, 175, 155, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'rgba(190, 175, 155, 0.05)'
              }}
            >
              <Typography variant="h5" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600, color: '#453C33' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", color: '#666' }}>
                Total
              </Typography>
            </Paper>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: 1.5, 
                minWidth: { xs: '45%', sm: '140px' },
                flex: { xs: '1 0 45%', sm: '0 0 auto' }, 
                borderRadius: '6px',
                border: '1px solid rgba(255, 152, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'rgba(255, 152, 0, 0.05)'
              }}
            >
              <Typography variant="h5" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600, color: '#FF9800' }}>
                {stats.pending}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", color: '#666' }}>
                Pending
              </Typography>
            </Paper>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: 1.5, 
                minWidth: { xs: '45%', sm: '140px' },
                flex: { xs: '1 0 45%', sm: '0 0 auto' }, 
                borderRadius: '6px',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'rgba(33, 150, 243, 0.05)'
              }}
            >
              <Typography variant="h5" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600, color: '#2196F3' }}>
                {stats.approved}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", color: '#666' }}>
                Approved
              </Typography>
            </Paper>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: 1.5, 
                minWidth: { xs: '45%', sm: '140px' },
                flex: { xs: '1 0 45%', sm: '0 0 auto' }, 
                borderRadius: '6px',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'rgba(76, 175, 80, 0.05)'
              }}
            >
              <Typography variant="h5" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600, color: '#4CAF50' }}>
                {stats.completed}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", color: '#666' }}>
                Completed
              </Typography>
            </Paper>

            <Paper 
              elevation={0}
              sx={{ 
                p: 1.5, 
                minWidth: { xs: '45%', sm: '140px' },
                flex: { xs: '1 0 45%', sm: '0 0 auto' }, 
                borderRadius: '6px',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'rgba(244, 67, 54, 0.05)'
              }}
            >
              <Typography variant="h5" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600, color: '#f44336' }}>
                {stats.rejected}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", color: '#666' }}>
                Rejected
              </Typography>
            </Paper>
          </Box>

          {/* Tabs */}
          <StyledTabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              minHeight: '48px',
            }}
          >
            <StyledTab label={`All (${stats.total})`} />
            <StyledTab 
              label={`Pending (${stats.pending})`} 
              sx={{ color: stats.pending > 0 ? '#FF9800' : 'inherit' }} 
            />
            <StyledTab 
              label={`Approved (${stats.approved})`} 
              sx={{ color: stats.approved > 0 ? '#2196F3' : 'inherit' }} 
            />
            <StyledTab 
              label={`Completed (${stats.completed})`} 
              sx={{ color: stats.completed > 0 ? '#4CAF50' : 'inherit' }} 
            />
            <StyledTab 
              label={`Rejected (${stats.rejected})`} 
              sx={{ color: stats.rejected > 0 ? '#f44336' : 'inherit' }} 
            />
          </StyledTabs>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {filteredRequests.length === 0 ? (
            <Typography 
              sx={{ 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: '#666',
                textAlign: 'center',
                py: 4 
              }}
            >
              No {tabValue > 0 ? ['', 'pending', 'approved', 'completed', 'rejected'][tabValue] : ''} special requests found
            </Typography>
          ) : (
            <SpecialRequestsTable 
              requests={filteredRequests} 
              onReviewRequest={handleOpenDialog}
              onViewSuccess={handleViewSuccess}
              onViewAppointment={null}
              tableSx={{ 
                borderRadius: '8px',
                overflow: 'hidden',
              }}
              buttonSx={{
                review: { 
                  bgcolor: 'rgba(190, 175, 155, 0.1)', 
                  color: '#453C33',
                  '&:hover': {
                    bgcolor: 'rgba(190, 175, 155, 0.2)',
                  }
                },
                success: { 
                  bgcolor: 'rgba(76, 175, 80, 0.1)', 
                  color: '#4caf50',
                  '&:hover': {
                    bgcolor: 'rgba(76, 175, 80, 0.2)',
                  }
                }
              }}
            />
          )}
        </Box>
      </Paper>

      {selectedRequest && (
        <SpecialRequestForm
          open={dialogOpen}
          onClose={handleCloseDialog}
          request={selectedRequest}
          onUpdateStatus={handleUpdateStatus}
          processing={processing}
          onViewSuccess={handleViewSuccess} 
        />
      )}

      <Dialog 
        open={successDialogOpen} 
        onClose={() => setSuccessDialogOpen(false)}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#4caf50', 
          color: 'white',
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          fontWeight: 600,
        }}>
          Appointment Created Successfully
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            py: 3 
          }}>
            <Box 
              sx={{ 
                width: 70, 
                height: 70, 
                borderRadius: '50%', 
                bgcolor: '#e8f5e9', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mb: 2
              }}
            >
              <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 40 }} />
            </Box>

            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontWeight: 600,
                color: '#453C33',
              }}
            >
              Success!
            </Typography>

            <Typography 
              variant="body1" 
              align="center" 
              paragraph
              sx={{
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: '#666',
              }}
            >
              Appointment #{successRequest?.appointment_ID || successRequest?.appointment_id || successRequest?.appointmentId || 'N/A'}
               was created successfully!
            </Typography>

            {successRequest && (
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  width: '100%', 
                  mb: 2,
                  bgcolor: '#f5f5f5',
                  border: '1px solid rgba(190, 175, 155, 0.3)',
                  borderRadius: '6px',
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  gutterBottom
                  sx={{
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    fontWeight: 600,
                    color: '#453C33',
                  }}
                >
                  Appointment Details:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Appointment ID:</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                    #{successRequest?.appointment_ID || successRequest?.appointment_id || successRequest?.appointmentId || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Customer:</Typography>
                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                    {`${successRequest.first_name} ${successRequest.last_name}`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Date & Time:</Typography>
                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                    {formatDate(successRequest.preferred_date)} at {formatTime(successRequest.preferred_time)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Service(s):</Typography>
                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                    {successRequest.services || 
                     successRequest.service_name || 
                     (successRequest.service_ids ? 'Multiple services selected' : 'Not specified')}
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setSuccessDialogOpen(false)} 
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#BEAF9B',
              color: 'white',
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#a39888',
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminSpecialRequests;












//last workinh one 


// import React, { useEffect, useState } from 'react';
// import { 
//   Box, 
//   Button, 
//   Typography, 
//   CircularProgress, 
//   Snackbar, 
//   Alert, 
//   Dialog, 
//   DialogTitle, 
//   DialogContent, 
//   DialogActions, 
//   Paper,
//   Container,
//   useMediaQuery,
//   useTheme,
//   Tabs,
//   Tab
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
// import SpecialRequestsTable from '../components/specialReq/SpecialRequestsTable';
// import SpecialRequestForm from '../components/specialReq/SpecialRequestForm';
// import axios from '../utils/axiosWithAuth';
// import { jwtDecode } from 'jwt-decode';

// // Custom styled Tab component
// const StyledTab = styled(Tab)(({ theme }) => ({
//   fontFamily: "'Poppins', 'Roboto', sans-serif",
//   fontWeight: 500,
//   textTransform: 'none',
//   minWidth: 120,
//   '&.Mui-selected': {
//     color: '#453C33',
//     fontWeight: 600,
//   },
// }));

// // Custom styled Tabs component
// const StyledTabs = styled(Tabs)(({ theme }) => ({
//   '& .MuiTabs-indicator': {
//     backgroundColor: '#BEAF9B',
//     height: 3,
//   },
// }));

// const AdminSpecialRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const [tabValue, setTabValue] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [successDialogOpen, setSuccessDialogOpen] = useState(false);
//   const [successRequest, setSuccessRequest] = useState(null);
//   const [adminId, setAdminId] = useState(null);
//   const [adminName, setAdminName] = useState('');
//   const [stats, setStats] = useState({
//     pending: 0,
//     approved: 0,
//     completed: 0,
//     total: 0
//   });
  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const fetchRequests = async () => {
//     try {
//       const res = await axios.get('http://localhost:5001/api/specialRequest/admin/all-requests');
//       const allRequests = res.data.requests;
      
//       // DEBUG: Log all requests and their statuses
//       console.log('=== DEBUG: All requests fetched ===');
//       console.log('Total requests:', allRequests.length);
//       console.log('All requests:', allRequests.map(req => ({ 
//         id: req.id, 
//         status: req.status,
//         statusType: typeof req.status,
//         statusLength: req.status ? req.status.length : 'null/undefined'
//       })));
      
//       setRequests(allRequests);
      
//       // Calculate stats with debugging
//       const pending = allRequests.filter(req => {
//         const isMatch = req.status && req.status.toLowerCase().trim() === 'pending';
//         if (req.status) {
//           console.log(`Request ${req.id}: status="${req.status}" (trimmed="${req.status.trim()}") -> pending match: ${isMatch}`);
//         }
//         return isMatch;
//       });
      
//       const approved = allRequests.filter(req => {
//         const isMatch = req.status && req.status.toLowerCase().trim() === 'approved';
//         if (req.status) {
//           console.log(`Request ${req.id}: status="${req.status}" (trimmed="${req.status.trim()}") -> approved match: ${isMatch}`);
//         }
//         return isMatch;
//       });
      
//       const completed = allRequests.filter(req => {
//         const isMatch = req.status && req.status.toLowerCase().trim() === 'completed';
//         if (req.status) {
//           console.log(`Request ${req.id}: status="${req.status}" (trimmed="${req.status.trim()}") -> completed match: ${isMatch}`);
//         }
//         return isMatch;
//       });
      
//       console.log('=== DEBUG: Stats calculation ===');
//       console.log('Pending count:', pending.length);
//       console.log('Approved count:', approved.length);
//       console.log('Completed count:', completed.length);
//       console.log('Total count:', allRequests.length);
      
//       // Also check for other possible status values
//       const uniqueStatuses = [...new Set(allRequests.map(req => req.status))];
//       console.log('=== DEBUG: Unique status values found ===');
//       console.log('Unique statuses:', uniqueStatuses);
      
//       setStats({
//         pending: pending.length,
//         approved: approved.length,
//         completed: completed.length,
//         total: allRequests.length
//       });
      
//       // Set initial filtered requests based on first tab (All or Pending)
//       filterRequestsByTab(tabValue, allRequests);
//     } catch (err) {
//       console.error('Error fetching special requests:', err);
//       setSnackbar({ open: true, message: 'Failed to fetch special requests', severity: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterRequestsByTab = (tabIndex, requestsData = requests) => {
//     console.log(`=== DEBUG: Filtering by tab ${tabIndex} ===`);
//     console.log('Available requests for filtering:', requestsData.length);
    
//     let filtered = [];
    
//     switch (tabIndex) {
//       case 0: // All
//         filtered = requestsData;
//         console.log('Tab 0 (All): Showing all requests');
//         break;
//       case 1: // Pending
//         filtered = requestsData.filter(req => {
//           const isMatch = req.status && req.status.toLowerCase().trim() === 'pending';
//           console.log(`Request ${req.id}: "${req.status}" -> pending match: ${isMatch}`);
//           return isMatch;
//         });
//         console.log('Tab 1 (Pending): Filtered to', filtered.length, 'requests');
//         break;
//       case 2: // Approved
//         filtered = requestsData.filter(req => {
//           const isMatch = req.status && req.status.toLowerCase().trim() === 'approved';
//           console.log(`Request ${req.id}: "${req.status}" -> approved match: ${isMatch}`);
//           return isMatch;
//         });
//         console.log('Tab 2 (Approved): Filtered to', filtered.length, 'requests');
//         break;
//       case 3: // Completed
//         filtered = requestsData.filter(req => {
//           const isMatch = req.status && req.status.toLowerCase().trim() === 'completed';
//           console.log(`Request ${req.id}: "${req.status}" -> completed match: ${isMatch}`);
//           return isMatch;
//         });
//         console.log('Tab 3 (Completed): Filtered to', filtered.length, 'requests');
//         break;
//       default:
//         filtered = requestsData;
//         console.log('Default: Showing all requests');
//     }
    
//     console.log('=== DEBUG: Final filtered results ===');
//     console.log('Filtered requests:', filtered.map(req => ({ id: req.id, status: req.status })));
    
//     setFilteredRequests(filtered);
//   };

//   const handleTabChange = (event, newValue) => {
//     console.log(`=== DEBUG: Tab changed to ${newValue} ===`);
//     setTabValue(newValue);
//     filterRequestsByTab(newValue);
//   };

//   const handleUpdateStatus = async (requestId, newStatus) => {
//     setProcessing(true);
//     try {
//       await axios.put('http://localhost:5001/api/specialRequest/admin/update-status', {
//         requestId,
//         status: newStatus
//       });

//       setSnackbar({ 
//         open: true, 
//         message: `Request status updated to ${newStatus} successfully`,
//         severity: 'success'
//       });

//       setDialogOpen(false);
//       await fetchRequests(); // Refresh all data after update
//     } catch (err) {
//       console.error('Status update error:', err);
//       setSnackbar({
//         open: true,
//         message: err.response?.data?.message || err.message || 'Failed to update request status',
//         severity: 'error'
//       });
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleViewSuccess = (request) => {
//     const appointmentId =
//       request.appointment_ID ||
//       request.appointment_id ||
//       request.appointmentId ||
//       request.newAppointmentId ||
//       'N/A';

//     const processedRequest = {
//       ...request,
//       appointment_ID: appointmentId,
//       appointment_id: appointmentId,
//       appointmentId: appointmentId,
//       newAppointmentId: appointmentId
//     };

//     setSuccessRequest(processedRequest);
//     setSuccessDialogOpen(true);
//   };

//   useEffect(() => {
//     fetchRequests();
    
//     // Get admin info from JWT token
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setAdminId(decodedToken.id);
//         setAdminName(decodedToken.name || decodedToken.username || 'Admin');
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   const handleOpenDialog = (request) => {
//     setSelectedRequest(request);
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return 'N/A';
//     if (typeof timeString === 'string') {
//       const [hours, minutes] = timeString.split(':');
//       const time = new Date();
//       time.setHours(hours, minutes);
//       return time.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     }
//     return new Date(timeString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Get current time to display greeting
//   const getCurrentTimeGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good morning';
//     if (hour < 18) return 'Good afternoon';
//     return 'Good evening';
//   };

//   if (loading) return (
//     <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, textAlign: "center", py: 8 }}>
//       <CircularProgress sx={{ color: '#BEAF9B' }} />
//     </Container>
//   );

//   return (
//     <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
//       <Paper 
//         elevation={0}
//         sx={{ 
//           borderRadius: '8px',
//           overflow: 'hidden',
//           border: '1px solid rgba(190, 175, 155, 0.2)',
//           mb: 4,
//           background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))',
//         }}
//       >
//         <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid rgba(190, 175, 155, 0.2)' }}>
//           <Typography 
//             variant={isMobile ? "h5" : "h4"} 
//             component="h1" 
//             sx={{ 
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               fontWeight: 600,
//               color: '#453C33',
//               mb: 1
//             }}
//           >
//             Special Requests
//           </Typography>
          
//           <Typography 
//             variant="body1" 
//             sx={{ 
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               color: '#666',
//               mb: 2
//             }}
//           >
//             {getCurrentTimeGreeting()}, {adminName}. Review and manage special appointment requests here.
//           </Typography>

//           {/* DEBUG: Add debug info panel */}
//           {process.env.NODE_ENV === 'development' && (
//             <Paper 
//               elevation={1}
//               sx={{ 
//                 p: 2, 
//                 mb: 2, 
//                 bgcolor: '#f5f5f5',
//                 border: '1px solid #ddd'
//               }}
//             >
//               <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
//                 DEBUG INFO (Development Mode)
//               </Typography>
//               <Typography variant="body2" sx={{ mb: 1 }}>
//                 Total requests loaded: {requests.length}
//               </Typography>
//               <Typography variant="body2" sx={{ mb: 1 }}>
//                 Currently filtered requests: {filteredRequests.length}
//               </Typography>
//               <Typography variant="body2" sx={{ mb: 1 }}>
//                 Active tab: {tabValue} ({['All', 'Pending', 'Approved', 'Completed'][tabValue]})
//               </Typography>
//               <Typography variant="body2" sx={{ mb: 1 }}>
//                 Stats - Pending: {stats.pending}, Approved: {stats.approved}, Completed: {stats.completed}
//               </Typography>
//               {requests.length > 0 && (
//                 <Typography variant="body2">
//                   Sample statuses: {requests.slice(0, 3).map(req => `"${req.status}"`).join(', ')}
//                 </Typography>
//               )}
//             </Paper>
//           )}

//           {/* Stats summary */}
//           <Box 
//             sx={{ 
//               display: 'flex', 
//               flexWrap: 'wrap', 
//               gap: 2, 
//               mb: 2 
//             }}
//           >
//             <Paper 
//               elevation={0}
//               sx={{ 
//                 p: 1.5, 
//                 minWidth: { xs: '45%', sm: '140px' },
//                 flex: { xs: '1 0 45%', sm: '0 0 auto' }, 
//                 borderRadius: '6px',
//                 border: '1px solid rgba(190, 175, 155, 0.3)',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 bgcolor: 'rgba(190, 175, 155, 0.05)'
//               }}
//             >
//               <Typography variant="h5" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600, color: '#453C33' }}>
//                 {stats.total}
//               </Typography>
//               <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", color: '#666' }}>
//                 Total
//               </Typography>
//             </Paper>
            
//             <Paper 
//               elevation={0}
//               sx={{ 
//                 p: 1.5, 
//                 minWidth: { xs: '45%', sm: '140px' },
//                 flex: { xs: '1 0 45%', sm: '0 0 auto' }, 
//                 borderRadius: '6px',
//                 border: '1px solid rgba(255, 152, 0, 0.3)',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 bgcolor: 'rgba(255, 152, 0, 0.05)'
//               }}
//             >
//               <Typography variant="h5" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600, color: '#FF9800' }}>
//                 {stats.pending}
//               </Typography>
//               <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", color: '#666' }}>
//                 Pending
//               </Typography>
//             </Paper>
            
//             <Paper 
//               elevation={0}
//               sx={{ 
//                 p: 1.5, 
//                 minWidth: { xs: '45%', sm: '140px' },
//                 flex: { xs: '1 0 45%', sm: '0 0 auto' }, 
//                 borderRadius: '6px',
//                 border: '1px solid rgba(33, 150, 243, 0.3)',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 bgcolor: 'rgba(33, 150, 243, 0.05)'
//               }}
//             >
//               <Typography variant="h5" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600, color: '#2196F3' }}>
//                 {stats.approved}
//               </Typography>
//               <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", color: '#666' }}>
//                 Approved
//               </Typography>
//             </Paper>
            
//             <Paper 
//               elevation={0}
//               sx={{ 
//                 p: 1.5, 
//                 minWidth: { xs: '45%', sm: '140px' },
//                 flex: { xs: '1 0 45%', sm: '0 0 auto' }, 
//                 borderRadius: '6px',
//                 border: '1px solid rgba(76, 175, 80, 0.3)',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 bgcolor: 'rgba(76, 175, 80, 0.05)'
//               }}
//             >
//               <Typography variant="h5" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600, color: '#4CAF50' }}>
//                 {stats.completed}
//               </Typography>
//               <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", color: '#666' }}>
//                 Completed
//               </Typography>
//             </Paper>
//           </Box>

//           {/* Tabs */}
//           <StyledTabs 
//             value={tabValue} 
//             onChange={handleTabChange}
//             variant={isMobile ? "scrollable" : "standard"}
//             scrollButtons={isMobile ? "auto" : false}
//             sx={{ 
//               borderBottom: 1, 
//               borderColor: 'divider',
//               minHeight: '48px',
//             }}
//           >
//             <StyledTab label={`All (${stats.total})`} />
//             <StyledTab 
//               label={`Pending (${stats.pending})`} 
//               sx={{ color: stats.pending > 0 ? '#FF9800' : 'inherit' }} 
//             />
//             <StyledTab 
//               label={`Approved (${stats.approved})`} 
//               sx={{ color: stats.approved > 0 ? '#2196F3' : 'inherit' }} 
//             />
//             <StyledTab 
//               label={`Completed (${stats.completed})`} 
//               sx={{ color: stats.completed > 0 ? '#4CAF50' : 'inherit' }} 
//             />
//           </StyledTabs>
//         </Box>

//         <Box sx={{ p: { xs: 2, md: 3 } }}>
//           {filteredRequests.length === 0 ? (
//             <Typography 
//               sx={{ 
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 color: '#666',
//                 textAlign: 'center',
//                 py: 4 
//               }}
//             >
//               No {tabValue > 0 ? ['', 'pending', 'approved', 'completed'][tabValue] : ''} special requests found
//             </Typography>
//           ) : (
//             <SpecialRequestsTable 
//               requests={filteredRequests} 
//               onReviewRequest={handleOpenDialog}
//               onViewSuccess={handleViewSuccess}
//               onViewAppointment={null}
//               tableSx={{ 
//                 borderRadius: '8px',
//                 overflow: 'hidden',
//               }}
//               buttonSx={{
//                 review: { 
//                   bgcolor: 'rgba(190, 175, 155, 0.1)', 
//                   color: '#453C33',
//                   '&:hover': {
//                     bgcolor: 'rgba(190, 175, 155, 0.2)',
//                   }
//                 },
//                 success: { 
//                   bgcolor: 'rgba(76, 175, 80, 0.1)', 
//                   color: '#4caf50',
//                   '&:hover': {
//                     bgcolor: 'rgba(76, 175, 80, 0.2)',
//                   }
//                 }
//               }}
//             />
//           )}
//         </Box>
//       </Paper>

//       {selectedRequest && (
//         <SpecialRequestForm
//           open={dialogOpen}
//           onClose={handleCloseDialog}
//           request={selectedRequest}
//           onUpdateStatus={handleUpdateStatus}
//           processing={processing}
//           onViewSuccess={handleViewSuccess} 
//         />
//       )}

//       <Dialog 
//         open={successDialogOpen} 
//         onClose={() => setSuccessDialogOpen(false)}
//         maxWidth="sm" 
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: '8px',
//             overflow: 'hidden',
//           }
//         }}
//       >
//         <DialogTitle sx={{ 
//           bgcolor: '#4caf50', 
//           color: 'white',
//           fontFamily: "'Poppins', 'Roboto', sans-serif",
//           fontWeight: 600,
//         }}>
//           Appointment Created Successfully
//         </DialogTitle>

//         <DialogContent dividers>
//           <Box sx={{ 
//             display: 'flex', 
//             flexDirection: 'column', 
//             alignItems: 'center',
//             py: 3 
//           }}>
//             <Box 
//               sx={{ 
//                 width: 70, 
//                 height: 70, 
//                 borderRadius: '50%', 
//                 bgcolor: '#e8f5e9', 
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 alignItems: 'center',
//                 mb: 2
//               }}
//             >
//               <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 40 }} />
//             </Box>

//             <Typography 
//               variant="h6" 
//               gutterBottom
//               sx={{
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 fontWeight: 600,
//                 color: '#453C33',
//               }}
//             >
//               Success!
//             </Typography>

//             <Typography 
//               variant="body1" 
//               align="center" 
//               paragraph
//               sx={{
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 color: '#666',
//               }}
//             >
//               Appointment #{successRequest?.appointment_ID || successRequest?.appointment_id || successRequest?.appointmentId || 'N/A'}
//                was created successfully!
//             </Typography>

//             {successRequest && (
//               <Paper 
//                 elevation={1} 
//                 sx={{ 
//                   p: 2, 
//                   width: '100%', 
//                   mb: 2,
//                   bgcolor: '#f5f5f5',
//                   border: '1px solid rgba(190, 175, 155, 0.3)',
//                   borderRadius: '6px',
//                 }}
//               >
//                 <Typography 
//                   variant="subtitle2" 
//                   gutterBottom
//                   sx={{
//                     fontFamily: "'Poppins', 'Roboto', sans-serif",
//                     fontWeight: 600,
//                     color: '#453C33',
//                   }}
//                 >
//                   Appointment Details:
//                 </Typography>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Appointment ID:</Typography>
//                   <Typography variant="body2" fontWeight="bold" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
//                     #{successRequest?.appointment_ID || successRequest?.appointment_id || successRequest?.appointmentId || 'N/A'}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Customer:</Typography>
//                   <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
//                     {`${successRequest.first_name} ${successRequest.last_name}`}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Date & Time:</Typography>
//                   <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
//                     {formatDate(successRequest.preferred_date)} at {formatTime(successRequest.preferred_time)}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Service(s):</Typography>
//                   <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
//                     {successRequest.services || 
//                      successRequest.service_name || 
//                      (successRequest.service_ids ? 'Multiple services selected' : 'Not specified')}
//                   </Typography>
//                 </Box>
//               </Paper>
//             )}
//           </Box>
//         </DialogContent>

//         <DialogActions sx={{ p: 2 }}>
//           <Button 
//             onClick={() => setSuccessDialogOpen(false)} 
//             variant="contained"
//             fullWidth
//             sx={{
//               bgcolor: '#BEAF9B',
//               color: 'white',
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               fontWeight: 500,
//               '&:hover': {
//                 bgcolor: '#a39888',
//               }
//             }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert 
//           severity={snackbar.severity}
//           sx={{ 
//             width: '100%',
//             fontFamily: "'Poppins', 'Roboto', sans-serif",
//           }}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default AdminSpecialRequests;