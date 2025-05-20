

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


















import React, { useEffect, useState } from 'react';
import { Box, Button,Typography, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import SpecialRequestsTable from '../components/specialReq/SpecialRequestsTable';
import SpecialRequestForm from '../components/specialReq/SpecialRequestForm';
import AppointmentDetailsModal from '../components/specialReq/AppointmentDetailsModal';
import axios from '../utils/axiosWithAuth';

const AdminSpecialRequests = () => {
  const [requests, setRequests] = useState([]);
   const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successRequest, setSuccessRequest] = useState(null);
  const [viewAppointmentModalOpen, setViewAppointmentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/specialRequest/admin/all-requests');
      setRequests(res.data.requests);
    } catch (err) {
      console.error('Error fetching special requests:', err);
      setSnackbar({ open: true, message: 'Failed to fetch special requests', severity: 'error' });
    } finally {
      setLoading(false);
    }
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
      fetchRequests();
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
    console.log('Original request:', request);
    console.log('Available fields:', Object.keys(request));
    console.log('Services field:', request.services);
    console.log('Service_name field:', request.service_name);
  
    // Explicitly use appointment_ID from the API response
    const appointmentId = request.appointment_ID;
  
    const processedRequest = {
      ...request,
      appointment_ID: appointmentId
    };
  
    console.log('Processed request with appointment_ID:', processedRequest);
    setSuccessRequest(request);
    setSuccessDialogOpen(true);
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


  const handleViewAppointment = (request) => {
  setSelectedAppointment({
    id: request.appointment_id,
    customer: {
      first_name: request.first_name,
      last_name: request.last_name,
      email: request.email,
      phone_number: request.phone_number
    }
  });
  setViewAppointmentModalOpen(true);
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

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Special Requests</Typography>
      
      {requests.length === 0 ? (
        <Typography>No special requests found</Typography>
      ) : (
        <SpecialRequestsTable 
          requests={requests} 
          onReviewRequest={handleOpenDialog}
          onViewSuccess={handleViewSuccess}
          onViewAppointment={handleViewAppointment}
        />
      )}


      {viewAppointmentModalOpen && (
  <AppointmentDetailsModal
    open={viewAppointmentModalOpen}
    onClose={() => setViewAppointmentModalOpen(false)}
    appointmentId={selectedAppointment?.id}
    customer={selectedAppointment?.customer}
    stylists={stylists} // Make sure you have stylists data available
  />
)}


      {/* Form Dialog */}
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

      {/* Success Dialog */}
      <Dialog 
        open={successDialogOpen} 
        onClose={() => setSuccessDialogOpen(false)}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#4caf50', color: 'white' }}>
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
            
            <Typography variant="h6" gutterBottom>
              Success!
            </Typography>
            
            <Typography variant="body1" align="center" paragraph>
              Appointment #{successRequest?.appointment_ID} was created successfully!
            </Typography>
            
            {successRequest && (
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  width: '100%', 
                  mb: 2,
                  bgcolor: '#f5f5f5',
                  border: '1px solid #e0e0e0'
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Appointment Details:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Appointment ID:</Typography>
                  <Typography variant="body2" fontWeight="bold">#{successRequest.appointment_ID}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Customer:</Typography>
                  <Typography variant="body2">{`${successRequest.first_name} ${successRequest.last_name}`}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Date & Time:</Typography>
                  <Typography variant="body2">
                    {formatDate(successRequest.preferred_date)} at {formatTime(successRequest.preferred_time)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Service(s):</Typography>
                  <Typography variant="body2">
                    {successRequest.services || 
                     successRequest.service_name || 
                     (successRequest.service_ids ? 'Multiple services selected' : 'Not specified')}
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => setSuccessDialogOpen(false)} 
            variant="contained"
            color="primary"
            fullWidth
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminSpecialRequests;