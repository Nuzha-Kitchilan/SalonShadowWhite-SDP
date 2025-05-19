
// import React, { useEffect, useState } from 'react';
// import {
//   Box, Typography, Paper, Divider, Grid, Button, CircularProgress,
//   Chip, Snackbar, Alert, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, MenuItem, Container, useMediaQuery, useTheme
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import axios from '../utils/axiosWithAuth';
// import SpaIcon from '@mui/icons-material/Spa';
// import CancelIcon from '@mui/icons-material/Cancel';
// import PaymentIcon from '@mui/icons-material/Payment';
// import { jwtDecode } from 'jwt-decode';

// // Custom styled components to match the aesthetic
// const StyledPaper = styled(Paper)({
//   borderRadius: '8px',
//   overflow: 'hidden',
//   border: '1px solid rgba(190, 175, 155, 0.2)',
//   background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))',
// });

// const StyledTable = styled(Table)({
//   '& .MuiTableCell-root': {
//     fontFamily: "'Poppins', 'Roboto', sans-serif",
//   },
//   '& .MuiTableHead-root': {
//     backgroundColor: 'rgba(190, 175, 155, 0.1)',
//     '& .MuiTableCell-root': {
//       fontWeight: 600,
//       color: '#453C33',
//     }
//   }
// });

// const StyledButton = styled(Button)(({ theme }) => ({
//   textTransform: 'none',
//   fontWeight: 600,
//   fontFamily: "'Poppins', 'Roboto', sans-serif",
//   padding: theme.spacing(1, 2),
//   transition: 'all 0.2s',
//   '&:hover': {
//     backgroundColor: 'rgba(190, 175, 155, 0.1)',
//   }
// }));

// const AdminCancellationRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [refundAmount, setRefundAmount] = useState(0);
//   const [refundReason, setRefundReason] = useState('cancellation');
//   const [processing, setProcessing] = useState(false);
//   const [adminName, setAdminName] = useState('');
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   useEffect(() => {
//     // Get admin info from JWT token
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setAdminName(decodedToken.name || decodedToken.username || 'Admin');
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
    
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       const res = await axios.get('http://localhost:5001/api/appointment/cancellation-requests');
//       setRequests(res.data.data);
//     } catch (err) {
//       console.error('Error fetching cancellation requests:', err);
//       setSnackbar({ open: true, message: 'Failed to fetch cancellation requests', severity: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

// //   const handleProcessRequest = async (action) => {
// //   setProcessing(true);
// //   try {
// //     let refundResult = null;
    
// //     // Process refund only for Paid/Partially Paid statuses
// //     if (action === 'Approved' && 
// //         (selectedRequest.payment?.payment_status === 'Paid' || 
// //          selectedRequest.payment?.payment_status === 'Partially Paid')) {
// //       if (!selectedRequest.payment.stripe_payment_intent_id) {
// //         throw new Error('Missing payment reference for refund');
// //       }
      
// //       refundResult = await axios.post('http://localhost:5001/api/refund/process', {
// //         payment_intent_id: selectedRequest.payment.stripe_payment_intent_id,
// //         amount: refundAmount,
// //         reason: refundReason
// //       });
// //     }

// //     // Process cancellation
// //     const cancelResponse = await axios.post(
// //       `http://localhost:5001/api/appointment/process-cancellation/${selectedRequest.appointment_ID}`,
// //       { action }
// //     );

// //     // Update local state to reflect changes
// //     setRequests(prevRequests => 
// //       prevRequests.map(request => 
// //         request.appointment_ID === selectedRequest.appointment_ID
// //           ? {
// //               ...request,
// //               cancellation_status: action,
// //               appointment_status: action === 'Approved' ? 'Cancelled' : request.appointment_status,
// //               payment: request.payment 
// //                 ? { 
// //                     ...request.payment,
// //                     payment_status: 
// //                       action === 'Approved'
// //                         ? request.payment.payment_status === 'Paid' || 
// //                           request.payment.payment_status === 'Partially Paid'
// //                           ? 'Refunded'
// //                           : 'Cancelled'
// //                         : request.payment.payment_status
// //                   } 
// //                 : null
// //             }
// //           : request
// //       )
// //     );

// //     setSnackbar({ 
// //       open: true, 
// //       message: `Cancellation ${action.toLowerCase()} successfully` + 
// //         (refundResult ? ` and $${refundAmount} refunded` : ''),
// //       severity: 'success'
// //     });
    
// //     setDialogOpen(false);
// //   } catch (err) {
// //     console.error('Processing error:', err);
// //     setSnackbar({
// //       open: true,
// //       message: err.response?.data?.message || err.message || 'Failed to process request',
// //       severity: 'error'
// //     });
// //   } finally {
// //     setProcessing(false);
// //   }
// // };




// const handleProcessRequest = async (action) => {
//   setProcessing(true);
//   try {
//     let refundResult = null;
    
//     // Process refund only for Paid/Partially Paid statuses
//     if (action === 'Approved' && 
//         (selectedRequest.payment?.payment_status === 'Paid' || 
//          selectedRequest.payment?.payment_status === 'Partially Paid')) {
//       if (!selectedRequest.payment.stripe_payment_intent_id) {
//         throw new Error('Missing payment reference for refund');
//       }
      
//       refundResult = await axios.post('http://localhost:5001/api/refund/process', {
//         payment_intent_id: selectedRequest.payment.stripe_payment_intent_id,
//         amount: refundAmount,
//         reason: refundReason
//       });
//     }

//     // Process cancellation
//     const cancelResponse = await axios.post(
//       `http://localhost:5001/api/appointment/process-cancellation/${selectedRequest.appointment_ID}`,
//       { action }
//     );

//     // Update the request in state with new status
//     setRequests(prevRequests => 
//       prevRequests.map(request => 
//         request.appointment_ID === selectedRequest.appointment_ID
//           ? {
//               ...request,
//               cancellation_status: action,
//               appointment_status: action === 'Approved' ? 'Cancelled' : request.appointment_status,
//               payment: request.payment 
//                 ? { 
//                     ...request.payment,
//                     payment_status: 
//                       action === 'Approved'
//                         ? request.payment.payment_status === 'Paid' || 
//                           request.payment.payment_status === 'Partially Paid'
//                           ? 'Refunded'
//                           : request.payment.payment_status === 'Pending'
//                             ? 'Cancelled'
//                             : request.payment.payment_status
//                         : request.payment.payment_status
//                   } 
//                 : null
//             }
//           : request
//       )
//     );

//     setSnackbar({ 
//       open: true, 
//       message: `Cancellation ${action.toLowerCase()} successfully` + 
//         (refundResult ? ` and $${refundAmount} refunded` : ''),
//       severity: 'success'
//     });
    
//     setDialogOpen(false);
//   } catch (err) {
//     console.error('Processing error:', err);
//     setSnackbar({
//       open: true,
//       message: err.response?.data?.message || err.message || 'Failed to process request',
//       severity: 'error'
//     });
//   } finally {
//     setProcessing(false);
//   }
// };

//   useEffect(() => {
//     if (selectedRequest?.payment) {
//       setRefundAmount(selectedRequest.payment.amount_paid);
//     }
//   }, [selectedRequest]);

//   const getCurrentTimeGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good morning';
//     if (hour < 18) return 'Good afternoon';
//     return 'Good evening';
//   };

//   if (loading) return (
//     <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//       <CircularProgress sx={{ color: '#BEAF9B' }} />
//     </Box>
//   );

//   return (
//     <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
//       <StyledPaper elevation={0}>
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
//             Cancellation Requests
//           </Typography>
          
//           <Typography 
//             variant="body1" 
//             sx={{ 
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               color: '#666',
//               mb: 1
//             }}
//           >
//             {getCurrentTimeGreeting()}, {adminName}. Review and process appointment cancellation requests.
//           </Typography>
//         </Box>
        
//         <Box sx={{ p: { xs: 2, md: 3 } }}>
//           {requests.length === 0 ? (
//             <Typography 
//               variant="body1" 
//               sx={{ 
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 color: '#666',
//                 textAlign: 'center',
//                 py: 4
//               }}
//             >
//               No pending cancellation requests
//             </Typography>
//           ) : (
//             <TableContainer>
//               <StyledTable>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Appointment</TableCell>
//                     <TableCell>Customer</TableCell>
//                     {!isMobile && <TableCell>Date & Time</TableCell>}
//                     {!isMobile && <TableCell>Request Time</TableCell>}
//                     <TableCell>Services</TableCell>
//                     <TableCell>Payment</TableCell>
//                     <TableCell align="center">Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {requests.map((request) => (
//                     <TableRow key={request.appointment_ID} hover sx={{ '&:hover': { backgroundColor: 'rgba(190, 175, 155, 0.05)' } }}>
//                       <TableCell>
//                         <Typography fontWeight={600}>#{request.appointment_ID}</Typography>
//                         {isMobile && (
//                           <>
//                             <Typography variant="body2">
//                               {request.appointment_date} at {request.appointment_time?.substring(0, 5)}
//                             </Typography>
//                             <Typography variant="body2" color="textSecondary">
//                               Requested: {new Date(request.cancel_request_time).toLocaleDateString()}
//                             </Typography>
//                           </>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Typography fontWeight={600}>{request.firstname} {request.lastname}</Typography>
//                         <Typography variant="body2">{request.email}</Typography>
//                         <Typography variant="body2">{request.primary_phone}</Typography>
//                       </TableCell>
//                       {!isMobile && (
//                         <TableCell>
//                           {request.appointment_date} at {request.appointment_time?.substring(0, 5)}
//                         </TableCell>
//                       )}
//                       {!isMobile && (
//                         <TableCell>
//                           {new Date(request.cancel_request_time).toLocaleString()}
//                         </TableCell>
//                       )}
//                       <TableCell>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <SpaIcon fontSize="small" color="action" />
//                           <Typography>{request.services}</Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         {request.payment ? (
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <PaymentIcon fontSize="small" color="action" />
//                             <Box>
//                               <Chip 
//                                 label={request.payment.payment_status} 
//                                 size="small"
//                                 sx={{
//                                   backgroundColor: 
//                                     request.payment.payment_status === 'Paid' ? 'rgba(56, 142, 60, 0.1)' :
//                                     request.payment.payment_status === 'Partially Paid' ? 'rgba(255, 160, 0, 0.1)' : 
//                                     'rgba(158, 158, 158, 0.1)',
//                                   color: 
//                                     request.payment.payment_status === 'Paid' ? '#388e3c' :
//                                     request.payment.payment_status === 'Partially Paid' ? '#ffa000' : '#9e9e9e',
//                                 }}
//                               />
//                               <Typography variant="body2">
//                                 ${request.payment.amount_paid} of ${request.payment.payment_amount}
//                               </Typography>
//                             </Box>
//                           </Box>
//                         ) : (
//                           <Chip label="No payment" size="small" sx={{ backgroundColor: 'rgba(158, 158, 158, 0.1)', color: '#9e9e9e' }} />
//                         )}
//                       </TableCell>
//                       <TableCell align="center">
//                         <StyledButton
//                           variant="outlined"
//                           sx={{
//                             color: '#453C33',
//                             borderColor: 'rgba(190, 175, 155, 0.5)',
//                             '&:hover': {
//                               borderColor: '#BEAF9B',
//                             }
//                           }}
//                           startIcon={<CancelIcon fontSize="small" />}
//                           onClick={() => {
//                             setSelectedRequest(request);
//                             setDialogOpen(true);
//                           }}
//                         >
//                           Review
//                         </StyledButton>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </StyledTable>
//             </TableContainer>
//           )}
//         </Box>
//       </StyledPaper>

//       {/* Review Dialog */}
//       <Dialog 
//         open={dialogOpen} 
//         onClose={() => !processing && setDialogOpen(false)} 
//         maxWidth="md" 
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: '8px',
//             background: 'linear-gradient(to right, rgba(190, 175, 155, 0.9), rgba(255, 255, 255, 0.9))',
//           }
//         }}
//       >
//         <DialogTitle sx={{ 
//           fontFamily: "'Poppins', 'Roboto', sans-serif",
//           fontWeight: 600,
//           color: '#453C33',
//           borderBottom: '1px solid rgba(190, 175, 155, 0.2)'
//         }}>
//           Review Cancellation Request
//         </DialogTitle>
//         <DialogContent dividers>
//           {selectedRequest && (
//             <Grid container spacing={3}>
//               <Grid item xs={12} md={6}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                   <SpaIcon color="action" />
//                   <Typography variant="h6" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Appointment Details</Typography>
//                 </Box>
//                 <Divider sx={{ my: 1, borderColor: 'rgba(190, 175, 155, 0.2)' }} />
//                 <Box sx={{ '& > *': { mb: 1 } }}>
//                   <Typography><strong>ID:</strong> {selectedRequest.appointment_ID}</Typography>
//                   <Typography><strong>Customer:</strong> {selectedRequest.firstname} {selectedRequest.lastname}</Typography>
//                   <Typography><strong>Date:</strong> {selectedRequest.appointment_date}</Typography>
//                   <Typography><strong>Time:</strong> {selectedRequest.appointment_time?.substring(0, 5)}</Typography>
//                   <Typography><strong>Requested At:</strong> {new Date(selectedRequest.cancel_request_time).toLocaleString()}</Typography>
//                   <Typography><strong>Services:</strong> {selectedRequest.services}</Typography>
//                   <Typography><strong>Stylists:</strong> {selectedRequest.stylists || 'None assigned'}</Typography>
//                 </Box>
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                   <PaymentIcon color="action" />
//                   <Typography variant="h6" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Payment Details</Typography>
//                 </Box>
//                 <Divider sx={{ my: 1, borderColor: 'rgba(190, 175, 155, 0.2)' }} />
//                 {selectedRequest.payment ? (
//                   <Box sx={{ '& > *': { mb: 1 } }}>
//                     <Typography><strong>Amount:</strong> ${selectedRequest.payment.payment_amount}</Typography>
//                     <Typography><strong>Paid:</strong> ${selectedRequest.payment.amount_paid || 0}</Typography>
//                     <Typography><strong>Status:</strong> <Chip 
//                       label={selectedRequest.payment.payment_status} 
//                       size="small"
//                       sx={{
//                         backgroundColor: 
//                           selectedRequest.payment.payment_status === 'Paid' ? 'rgba(56, 142, 60, 0.1)' :
//                           selectedRequest.payment.payment_status === 'Partially Paid' ? 'rgba(255, 160, 0, 0.1)' : 
//                           'rgba(158, 158, 158, 0.1)',
//                         color: 
//                           selectedRequest.payment.payment_status === 'Paid' ? '#388e3c' :
//                           selectedRequest.payment.payment_status === 'Partially Paid' ? '#ffa000' : '#9e9e9e',
//                       }}
//                     /></Typography>
//                     <Typography><strong>Payment Type:</strong> {selectedRequest.payment.payment_type}</Typography>
//                     <Typography><strong>Payment ID:</strong> {selectedRequest.payment.stripe_payment_intent_id || 'N/A'}</Typography>
//                     <Typography><strong>Date:</strong> {
//                       selectedRequest.payment.payment_date ? 
//                         new Date(selectedRequest.payment.payment_date).toLocaleString() : 'N/A'
//                     }</Typography>

//                     {selectedRequest.payment.payment_status === 'Paid' && (
//                       <>
//                         <Divider sx={{ my: 2, borderColor: 'rgba(190, 175, 155, 0.2)' }} />
//                         <Typography variant="subtitle1" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600 }}>Refund Details</Typography>
//                         <TextField
//                           label="Refund Amount"
//                           type="number"
//                           fullWidth
//                           margin="normal"
//                           variant="outlined"
//                           size="small"
//                           value={refundAmount}
//                           onChange={(e) => setRefundAmount(Math.min(Number(e.target.value), selectedRequest.payment.amount_paid))}
//                           inputProps={{
//                             min: 0,
//                             max: selectedRequest.payment.amount_paid,
//                             step: 0.01
//                           }}
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               '& fieldset': {
//                                 borderColor: 'rgba(190, 175, 155, 0.5)',
//                               },
//                               '&:hover fieldset': {
//                                 borderColor: '#BEAF9B',
//                               },
//                             }
//                           }}
//                         />
//                         <TextField
//                           select
//                           label="Refund Reason"
//                           fullWidth
//                           margin="normal"
//                           variant="outlined"
//                           size="small"
//                           value={refundReason}
//                           onChange={(e) => setRefundReason(e.target.value)}
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               '& fieldset': {
//                                 borderColor: 'rgba(190, 175, 155, 0.5)',
//                               },
//                               '&:hover fieldset': {
//                                 borderColor: '#BEAF9B',
//                               },
//                             }
//                           }}
//                         >
//                           <MenuItem value="cancellation">Cancellation</MenuItem>
//                           <MenuItem value="requested_by_customer">Requested by Customer</MenuItem>
//                           <MenuItem value="duplicate">Duplicate</MenuItem>
//                           <MenuItem value="fraudulent">Fraudulent</MenuItem>
//                         </TextField>
//                       </>
//                     )}
//                   </Box>
//                 ) : (
//                   <Typography>No payment information available</Typography>
//                 )}
//               </Grid>
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(190, 175, 155, 0.2)' }}>
//           <StyledButton
//             onClick={() => setDialogOpen(false)}
//             disabled={processing}
//             sx={{
//               color: '#666',
//               '&:hover': {
//                 color: '#453C33',
//               }
//             }}
//           >
//             Cancel
//           </StyledButton>
//           <StyledButton
//             onClick={() => handleProcessRequest('Rejected')}
//             sx={{
//               color: '#ff6b6b',
//               borderColor: 'rgba(255, 107, 107, 0.5)',
//               '&:hover': {
//                 borderColor: '#ff6b6b',
//                 backgroundColor: 'rgba(255, 107, 107, 0.1)'
//               }
//             }}
//             variant="outlined"
//             disabled={processing}
//             startIcon={processing ? <CircularProgress size={16} color="inherit" /> : null}
//           >
//             Reject
//           </StyledButton>
//           <StyledButton
//             onClick={() => handleProcessRequest('Approved')}
//             sx={{
//               backgroundColor: '#BEAF9B',
//               color: '#fff',
//               '&:hover': {
//                 backgroundColor: '#9e8e7a',
//               },
//               '&:disabled': {
//                 backgroundColor: 'rgba(190, 175, 155, 0.5)',
//               }
//             }}
//             disabled={processing || (selectedRequest?.payment?.payment_status === 'Paid' && refundAmount <= 0)}
//             startIcon={processing ? <CircularProgress size={16} color="inherit" /> : null}
//           >
//             {`Approve${selectedRequest?.payment?.payment_status === 'Paid' ? ' & Refund' : ''}`}
//           </StyledButton>
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

// export default AdminCancellationRequests;










import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Container, CircularProgress, Snackbar, Alert, useMediaQuery, useTheme,
  Tabs, Tab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from '../utils/axiosWithAuth';
import { jwtDecode } from 'jwt-decode';
import CancelReqTable from '../components/cancelReq/CancelReqTable';
import CancelReqForm from '../components/cancelReq/CancelReqForm';
import AppointmentFilters from '../components/appointment/AppointmentFilters'; // Import the filter component

// Custom styled components to match the aesthetic
const StyledPaper = styled(Paper)({
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid rgba(190, 175, 155, 0.2)',
  background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))',
});

const StyledTab = styled(Tab)({
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: 500,
  textTransform: 'none',
  minWidth: 100,
  '&.Mui-selected': {
    fontWeight: 600,
    color: '#453C33',
  },
});

const AdminCancellationRequests = () => {
  const [tabValue, setTabValue] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
  const [filteredApprovedRequests, setFilteredApprovedRequests] = useState([]);
  const [filteredRejectedRequests, setFilteredRejectedRequests] = useState([]);
  const [loading, setLoading] = useState({
    pending: true,
    approved: true,
    rejected: true
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] = useState({
    appointmentId: '',
    date: '',
    customerName: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [adminName, setAdminName] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
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
    
    fetchRequests();
  }, []);

  useEffect(() => {
    // Update filtered requests whenever the original data or search parameters change
    filterRequests();
  }, [pendingRequests, approvedRequests, rejectedRequests, searchParams]);

  const fetchRequests = async () => {
    try {
      // Fetch pending cancellation requests
      const pendingRes = await axios.get('http://localhost:5001/api/appointment/cancellation-requests');
      setPendingRequests(pendingRes.data.data);
      setFilteredPendingRequests(pendingRes.data.data);
      setLoading(prev => ({ ...prev, pending: false }));
      
      // Fetch approved cancellation requests
      const approvedRes = await axios.get('http://localhost:5001/api/appointment/approved-cancellations');
      setApprovedRequests(approvedRes.data.data);
      setFilteredApprovedRequests(approvedRes.data.data);
      setLoading(prev => ({ ...prev, approved: false }));
      
      // Fetch rejected cancellation requests
      const rejectedRes = await axios.get('http://localhost:5001/api/appointment/rejected-cancellations');
      setRejectedRequests(rejectedRes.data.data);
      setFilteredRejectedRequests(rejectedRes.data.data);
      setLoading(prev => ({ ...prev, rejected: false }));
    } catch (err) {
      console.error('Error fetching cancellation requests:', err);
      setSnackbar({ open: true, message: 'Failed to fetch cancellation requests', severity: 'error' });
      setLoading({ pending: false, approved: false, rejected: false });
    }
  };

  const handleProcessRequest = async (action, refundReason, refundAmount) => {
    setProcessing(true);
    try {
      let refundResult = null;
      
      // Process refund only for Paid/Partially Paid statuses
      if (action === 'Approved' && 
          (selectedRequest.payment?.payment_status === 'Paid' || 
           selectedRequest.payment?.payment_status === 'Partially Paid')) {
        if (!selectedRequest.payment.stripe_payment_intent_id) {
          throw new Error('Missing payment reference for refund');
        }
        
        refundResult = await axios.post('http://localhost:5001/api/refund/process', {
          payment_intent_id: selectedRequest.payment.stripe_payment_intent_id,
          amount: refundAmount,
          reason: refundReason
        });
      }

      // Process cancellation
      const cancelResponse = await axios.post(
        `http://localhost:5001/api/appointment/process-cancellation/${selectedRequest.appointment_ID}`,
        { action }
      );

      // Update the pending requests list
      setPendingRequests(prevRequests => 
        prevRequests.filter(request => request.appointment_ID !== selectedRequest.appointment_ID)
      );
      
      // Add the processed request to the appropriate list
      const updatedRequest = {
        ...selectedRequest,
        cancellation_status: action,
        appointment_status: action === 'Approved' ? 'Cancelled' : selectedRequest.appointment_status,
        payment: selectedRequest.payment 
          ? { 
              ...selectedRequest.payment,
              payment_status: 
                action === 'Approved'
                  ? selectedRequest.payment.payment_status === 'Paid' || 
                    selectedRequest.payment.payment_status === 'Partially Paid'
                    ? 'Refunded'
                    : selectedRequest.payment.payment_status === 'Pending'
                      ? 'Cancelled'
                      : selectedRequest.payment.payment_status
                  : selectedRequest.payment.payment_status
            } 
          : null
      };
      
      if (action === 'Approved') {
        setApprovedRequests(prev => [updatedRequest, ...prev]);
        // Automatically switch to approved tab
        setTabValue(1);
      } else if (action === 'Rejected') {
        setRejectedRequests(prev => [updatedRequest, ...prev]);
        // Automatically switch to rejected tab
        setTabValue(2);
      }

      setSnackbar({ 
        open: true, 
        message: `Cancellation ${action.toLowerCase()} successfully` + 
          (refundResult ? ` and $${refundAmount} refunded` : ''),
        severity: 'success'
      });
      
      setDialogOpen(false);
    } catch (err) {
      console.error('Processing error:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || 'Failed to process request',
        severity: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const filterRequests = () => {
    // Filter function to apply search parameters
    const filterData = (data) => {
      return data.filter(request => {
        // Check if appointment_ID includes the search term (case insensitive)
        const idMatch = !searchParams.appointmentId || 
          request.appointment_ID.toString().toLowerCase().includes(searchParams.appointmentId.toLowerCase());
        
        // Check if date matches
        const dateMatch = !searchParams.date || 
          (request.appointment_date && request.appointment_date.includes(searchParams.date));
        
        // Check if customer name includes the search term (case insensitive)
        const nameMatch = !searchParams.customerName || 
          (request.customer && request.customer.name && 
           request.customer.name.toLowerCase().includes(searchParams.customerName.toLowerCase()));
        
        return idMatch && dateMatch && nameMatch;
      });
    };

    // Apply filters to all request types
    setFilteredPendingRequests(filterData(pendingRequests));
    setFilteredApprovedRequests(filterData(approvedRequests));
    setFilteredRejectedRequests(filterData(rejectedRequests));
  };

  const handleSearch = () => {
    setIsSearching(true);
    // Small delay to show loading indicator
    setTimeout(() => {
      filterRequests();
      setIsSearching(false);
    }, 500);
  };

  const clearSearch = () => {
    setSearchParams({
      appointmentId: '',
      date: '',
      customerName: ''
    });
    // Reset filtered data to original data
    setFilteredPendingRequests(pendingRequests);
    setFilteredApprovedRequests(approvedRequests);
    setFilteredRejectedRequests(rejectedRequests);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const renderTabContent = () => {
    // Pending Requests Tab
    if (tabValue === 0) {
      if (loading.pending) {
        return (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress sx={{ color: '#BEAF9B' }} />
          </Box>
        );
      }
      
      return filteredPendingRequests.length === 0 ? (
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#666',
            textAlign: 'center',
            py: 4
          }}
        >
          No pending cancellation requests
        </Typography>
      ) : (
        <CancelReqTable 
          requests={filteredPendingRequests} 
          setSelectedRequest={setSelectedRequest} 
          setDialogOpen={setDialogOpen} 
          showActionButtons={true}
        />
      );
    }
    
    // Approved Requests Tab
    else if (tabValue === 1) {
      if (loading.approved) {
        return (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress sx={{ color: '#BEAF9B' }} />
          </Box>
        );
      }
      
      return filteredApprovedRequests.length === 0 ? (
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#666',
            textAlign: 'center',
            py: 4
          }}
        >
          No approved cancellation requests
        </Typography>
      ) : (
        <CancelReqTable 
          requests={filteredApprovedRequests} 
          setSelectedRequest={setSelectedRequest} 
          setDialogOpen={setDialogOpen} 
          showActionButtons={false}
        />
      );
    }
    
    // Rejected Requests Tab
    else if (tabValue === 2) {
      if (loading.rejected) {
        return (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress sx={{ color: '#BEAF9B' }} />
          </Box>
        );
      }
      
      return filteredRejectedRequests.length === 0 ? (
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#666',
            textAlign: 'center',
            py: 4
          }}
        >
          No rejected cancellation requests
        </Typography>
      ) : (
        <CancelReqTable 
          requests={filteredRejectedRequests} 
          setSelectedRequest={setSelectedRequest} 
          setDialogOpen={setDialogOpen} 
          showActionButtons={false}
        />
      );
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
      <StyledPaper elevation={0}>
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
            Cancellation Requests
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#666',
              mb: 1
            }}
          >
            {getCurrentTimeGreeting()}, {adminName}. Review and process appointment cancellation requests.
          </Typography>
          
          {/* Appointment Filters Component */}
          <AppointmentFilters
            searchParams={searchParams}
            handleSearchInputChange={handleSearchInputChange}
            handleSearch={handleSearch}
            clearSearch={clearSearch}
            isSearching={isSearching}
          />
          
          {/* Tab Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: '#BEAF9B',
                }
              }}
            >
              <StyledTab label={`Pending (${!loading.pending ? filteredPendingRequests.length : '...'})`} />
              <StyledTab label={`Approved (${!loading.approved ? filteredApprovedRequests.length : '...'})`} />
              <StyledTab label={`Rejected (${!loading.rejected ? filteredRejectedRequests.length : '...'})`} />
            </Tabs>
          </Box>
        </Box>
        
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {renderTabContent()}
        </Box>
      </StyledPaper>

      {/* Review Form Dialog - Only shown for pending requests */}
      {tabValue === 0 && (
        <CancelReqForm 
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          selectedRequest={selectedRequest}
          processing={processing}
          handleProcessRequest={handleProcessRequest}
        />
      )}

      {/* Snackbar */}
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

export default AdminCancellationRequests;