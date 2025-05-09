// import React, { useEffect, useState } from 'react';
// import {
//   Box, Typography, Paper, Divider, Grid, Button, CircularProgress,
//   Chip, Snackbar, Alert, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, MenuItem
// } from '@mui/material';
// import axios from '../utils/axiosWithAuth';

// const AdminCancellationRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [refundAmount, setRefundAmount] = useState(0);
//   const [refundReason, setRefundReason] = useState('cancellation');
//   const [processing, setProcessing] = useState(false);

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

//   const handleProcessRequest = async (action) => {
//     setProcessing(true);
//     try {
//       let refundResult = null;
      
//       // Only process refund if approved and payment exists
//       if (action === 'Approved' && selectedRequest.payment?.payment_status === 'Paid') {
//         if (!selectedRequest.payment.stripe_payment_intent_id) {
//           throw new Error('Missing payment reference for refund');
//         }
        
//         refundResult = await axios.post('http://localhost:5001/api/refund/process', {
//           payment_intent_id: selectedRequest.payment.stripe_payment_intent_id,
//           amount: refundAmount,
//           reason: refundReason
//         });
//       }

//       // Process cancellation
//       const cancelResponse = await axios.post(
//         `http://localhost:5001/api/appointment/process-cancellation/${selectedRequest.appointment_ID}`,
//         { action }
//       );

//       setSnackbar({ 
//         open: true, 
//         message: `Cancellation ${action.toLowerCase()} successfully` + 
//           (refundResult ? ` and $${refundAmount} refunded` : ''),
//         severity: 'success'
//       });
      
//       setDialogOpen(false);
//       fetchRequests();
//     } catch (err) {
//       console.error('Processing error:', err);
//       setSnackbar({
//         open: true,
//         message: err.response?.data?.message || err.message || 'Failed to process request',
//         severity: 'error'
//       });
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const processRefund = async () => {
//     try {
//       const response = await axios.post('http://localhost:5001/api/refund/process', {
//         payment_intent_id: selectedRequest.payment.stripe_payment_intent_id,
//         amount: refundAmount,
//         reason: refundReason
//       });

//       setSnackbar({
//         open: true,
//         message: `Refund processed successfully (ID: ${response.data.refundId})`,
//         severity: 'success'
//       });

//       return response.data;
//     } catch (err) {
//       console.error('Refund processing error:', err);
//       throw err;
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   useEffect(() => {
//     if (selectedRequest?.payment) {
//       // Set default refund amount to amount paid
//       setRefundAmount(selectedRequest.payment.amount_paid);
//     }
//   }, [selectedRequest]);

//   if (loading) return <Box textAlign="center"><CircularProgress /></Box>;

//   return (
//     <Box p={4}>
//       <Typography variant="h4" gutterBottom>Pending Cancellation Requests</Typography>
      
//       {requests.length === 0 ? (
//         <Typography>No pending cancellation requests</Typography>
//       ) : (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Appointment ID</TableCell>
//                 <TableCell>Customer</TableCell>
//                 <TableCell>Date & Time</TableCell>
//                 <TableCell>Request Time</TableCell>
//                 <TableCell>Services</TableCell>
//                 <TableCell>Payment Status</TableCell>
//                 <TableCell>Refund Eligible</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {requests.map((request) => (
//                 <TableRow key={request.appointment_ID}>
//                   <TableCell>{request.appointment_ID}</TableCell>
//                   <TableCell>
//                     {request.firstname} {request.lastname}
//                     <Typography variant="body2">{request.email}</Typography>
//                     <Typography variant="body2">{request.primary_phone}</Typography>
//                   </TableCell>
//                   <TableCell>
//                     {request.appointment_date} at {request.appointment_time?.substring(0, 5)}
//                   </TableCell>
//                   <TableCell>
//                     {new Date(request.cancel_request_time).toLocaleString()}
//                   </TableCell>
//                   <TableCell>{request.services}</TableCell>
//                   <TableCell>
//                     {request.payment ? (
//                       <>
//                         <Chip 
//                           label={request.payment.payment_status} 
//                           color={
//                             request.payment.payment_status === 'Paid' ? 'success' :
//                             request.payment.payment_status === 'Partially Paid' ? 'warning' : 'default'
//                           } 
//                         />
//                         <Typography variant="body2">
//                           ${request.payment.amount_paid} of ${request.payment.payment_amount}
//                         </Typography>
//                         {request.payment.stripe_payment_intent_id && (
//                           <Typography variant="caption" display="block">
//                             Stripe: {request.payment.stripe_payment_intent_id.substring(0, 8)}...
//                           </Typography>
//                         )}
//                       </>
//                     ) : (
//                       <Chip label="No payment" color="default" />
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     {request.payment?.payment_status === 'Paid' ? (
//                       <Chip label="Yes" color="success" />
//                     ) : request.payment?.payment_status === 'Partially Paid' ? (
//                       <Chip label="Partial" color="warning" />
//                     ) : (
//                       <Chip label="No" color="default" />
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Button 
//                       variant="outlined" 
//                       color="primary"
//                       onClick={() => {
//                         setSelectedRequest(request);
//                         setDialogOpen(true);
//                       }}
//                     >
//                       Review
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* Review Dialog */}
//       <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
//         <DialogTitle>Review Cancellation Request</DialogTitle>
//         <DialogContent dividers>
//           {selectedRequest && (
//             <Grid container spacing={3}>
//               <Grid item xs={12} md={6}>
//                 <Typography variant="h6">Appointment Details</Typography>
//                 <Divider sx={{ my: 1 }} />
//                 <Typography><strong>ID:</strong> {selectedRequest.appointment_ID}</Typography>
//                 <Typography><strong>Customer:</strong> {selectedRequest.firstname} {selectedRequest.lastname}</Typography>
//                 <Typography><strong>Date:</strong> {selectedRequest.appointment_date}</Typography>
//                 <Typography><strong>Time:</strong> {selectedRequest.appointment_time?.substring(0, 5)}</Typography>
//                 <Typography><strong>Requested At:</strong> {new Date(selectedRequest.cancel_request_time).toLocaleString()}</Typography>
//                 <Typography><strong>Services:</strong> {selectedRequest.services}</Typography>
//                 <Typography><strong>Stylists:</strong> {selectedRequest.stylists || 'None assigned'}</Typography>
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <Typography variant="h6">Payment Details</Typography>
//                 <Divider sx={{ my: 1 }} />
//                 {selectedRequest.payment ? (
//                   <>
//                     <Typography><strong>Amount:</strong> ${selectedRequest.payment.payment_amount}</Typography>
//                     <Typography><strong>Paid:</strong> ${selectedRequest.payment.amount_paid || 0}</Typography>
//                     <Typography><strong>Status:</strong> <Chip 
//                       label={selectedRequest.payment.payment_status} 
//                       color={
//                         selectedRequest.payment.payment_status === 'Paid' ? 'success' :
//                         selectedRequest.payment.payment_status === 'Partially Paid' ? 'warning' : 'default'
//                       } 
//                     /></Typography>
//                     <Typography><strong>Payment Type:</strong> {selectedRequest.payment.payment_type}</Typography>
//                     <Typography><strong>Payment ID:</strong> {selectedRequest.payment.stripe_payment_intent_id || 'N/A'}</Typography>
//                     <Typography><strong>Date:</strong> {
//                       selectedRequest.payment.payment_date ? 
//                         new Date(selectedRequest.payment.payment_date).toLocaleString() : 'N/A'
//                     }</Typography>

//                     {selectedRequest.payment.payment_status === 'Paid' && (
//                       <>
//                         <Divider sx={{ my: 2 }} />
//                         <Typography variant="h6">Refund Details</Typography>
//                         <TextField
//                           label="Refund Amount"
//                           type="number"
//                           fullWidth
//                           margin="normal"
//                           value={refundAmount}
//                           onChange={(e) => setRefundAmount(Math.min(Number(e.target.value), selectedRequest.payment.amount_paid))}
//                           inputProps={{
//                             min: 0,
//                             max: selectedRequest.payment.amount_paid,
//                             step: 0.01
//                           }}
//                         />
//                         <TextField
//                           select
//                           label="Refund Reason"
//                           fullWidth
//                           margin="normal"
//                           value={refundReason}
//                           onChange={(e) => setRefundReason(e.target.value)}
//                         >
//                           <MenuItem value="cancellation">Cancellation</MenuItem>
//                           <MenuItem value="requested_by_customer">Requested by Customer</MenuItem>
//                           <MenuItem value="duplicate">Duplicate</MenuItem>
//                           <MenuItem value="fraudulent">Fraudulent</MenuItem>
//                         </TextField>
//                       </>
//                     )}
//                   </>
//                 ) : (
//                   <Typography>No payment information available</Typography>
//                 )}
//               </Grid>
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)} disabled={processing}>
//             Cancel
//           </Button>
//           <Button 
//             onClick={() => handleProcessRequest('Rejected')} 
//             color="error"
//             variant="outlined"
//             disabled={processing}
//           >
//             {processing ? <CircularProgress size={24} /> : 'Reject'}
//           </Button>
//           <Button 
//             onClick={() => handleProcessRequest('Approved')} 
//             color="success"
//             variant="contained"
//             disabled={processing || (selectedRequest?.payment?.payment_status === 'Paid' && refundAmount <= 0)}
//           >
//             {processing ? (
//               <CircularProgress size={24} color="inherit" />
//             ) : (
//               `Approve${selectedRequest?.payment?.payment_status === 'Paid' ? ' & Refund' : ''}`
//             )}
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

// export default AdminCancellationRequests;


















import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Divider, Grid, Button, CircularProgress,
  Chip, Snackbar, Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Container, useMediaQuery, useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from '../utils/axiosWithAuth';
import SpaIcon from '@mui/icons-material/Spa';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentIcon from '@mui/icons-material/Payment';
import { jwtDecode } from 'jwt-decode';

// Custom styled components to match the aesthetic
const StyledPaper = styled(Paper)({
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid rgba(190, 175, 155, 0.2)',
  background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))',
});

const StyledTable = styled(Table)({
  '& .MuiTableCell-root': {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
  },
  '& .MuiTableHead-root': {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
    '& .MuiTableCell-root': {
      fontWeight: 600,
      color: '#453C33',
    }
  }
});

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  padding: theme.spacing(1, 2),
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
  }
}));

const AdminCancellationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState('cancellation');
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

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/appointment/cancellation-requests');
      setRequests(res.data.data);
    } catch (err) {
      console.error('Error fetching cancellation requests:', err);
      setSnackbar({ open: true, message: 'Failed to fetch cancellation requests', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRequest = async (action) => {
    setProcessing(true);
    try {
      let refundResult = null;
      
      if (action === 'Approved' && selectedRequest.payment?.payment_status === 'Paid') {
        if (!selectedRequest.payment.stripe_payment_intent_id) {
          throw new Error('Missing payment reference for refund');
        }
        
        refundResult = await axios.post('http://localhost:5001/api/refund/process', {
          payment_intent_id: selectedRequest.payment.stripe_payment_intent_id,
          amount: refundAmount,
          reason: refundReason
        });
      }

      const cancelResponse = await axios.post(
        `http://localhost:5001/api/appointment/process-cancellation/${selectedRequest.appointment_ID}`,
        { action }
      );

      setSnackbar({ 
        open: true, 
        message: `Cancellation ${action.toLowerCase()} successfully` + 
          (refundResult ? ` and $${refundAmount} refunded` : ''),
        severity: 'success'
      });
      
      setDialogOpen(false);
      fetchRequests();
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

  useEffect(() => {
    if (selectedRequest?.payment) {
      setRefundAmount(selectedRequest.payment.amount_paid);
    }
  }, [selectedRequest]);

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress sx={{ color: '#BEAF9B' }} />
    </Box>
  );

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
        </Box>
        
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {requests.length === 0 ? (
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
            <TableContainer>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Appointment</TableCell>
                    <TableCell>Customer</TableCell>
                    {!isMobile && <TableCell>Date & Time</TableCell>}
                    {!isMobile && <TableCell>Request Time</TableCell>}
                    <TableCell>Services</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.appointment_ID} hover sx={{ '&:hover': { backgroundColor: 'rgba(190, 175, 155, 0.05)' } }}>
                      <TableCell>
                        <Typography fontWeight={600}>#{request.appointment_ID}</Typography>
                        {isMobile && (
                          <>
                            <Typography variant="body2">
                              {request.appointment_date} at {request.appointment_time?.substring(0, 5)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Requested: {new Date(request.cancel_request_time).toLocaleDateString()}
                            </Typography>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>{request.firstname} {request.lastname}</Typography>
                        <Typography variant="body2">{request.email}</Typography>
                        <Typography variant="body2">{request.primary_phone}</Typography>
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          {request.appointment_date} at {request.appointment_time?.substring(0, 5)}
                        </TableCell>
                      )}
                      {!isMobile && (
                        <TableCell>
                          {new Date(request.cancel_request_time).toLocaleString()}
                        </TableCell>
                      )}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SpaIcon fontSize="small" color="action" />
                          <Typography>{request.services}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {request.payment ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PaymentIcon fontSize="small" color="action" />
                            <Box>
                              <Chip 
                                label={request.payment.payment_status} 
                                size="small"
                                sx={{
                                  backgroundColor: 
                                    request.payment.payment_status === 'Paid' ? 'rgba(56, 142, 60, 0.1)' :
                                    request.payment.payment_status === 'Partially Paid' ? 'rgba(255, 160, 0, 0.1)' : 
                                    'rgba(158, 158, 158, 0.1)',
                                  color: 
                                    request.payment.payment_status === 'Paid' ? '#388e3c' :
                                    request.payment.payment_status === 'Partially Paid' ? '#ffa000' : '#9e9e9e',
                                }}
                              />
                              <Typography variant="body2">
                                ${request.payment.amount_paid} of ${request.payment.payment_amount}
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Chip label="No payment" size="small" sx={{ backgroundColor: 'rgba(158, 158, 158, 0.1)', color: '#9e9e9e' }} />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <StyledButton
                          variant="outlined"
                          sx={{
                            color: '#453C33',
                            borderColor: 'rgba(190, 175, 155, 0.5)',
                            '&:hover': {
                              borderColor: '#BEAF9B',
                            }
                          }}
                          startIcon={<CancelIcon fontSize="small" />}
                          onClick={() => {
                            setSelectedRequest(request);
                            setDialogOpen(true);
                          }}
                        >
                          Review
                        </StyledButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </StyledTable>
            </TableContainer>
          )}
        </Box>
      </StyledPaper>

      {/* Review Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => !processing && setDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.9))',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          fontWeight: 600,
          color: '#453C33',
          borderBottom: '1px solid rgba(190, 175, 155, 0.2)'
        }}>
          Review Cancellation Request
        </DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <SpaIcon color="action" />
                  <Typography variant="h6" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Appointment Details</Typography>
                </Box>
                <Divider sx={{ my: 1, borderColor: 'rgba(190, 175, 155, 0.2)' }} />
                <Box sx={{ '& > *': { mb: 1 } }}>
                  <Typography><strong>ID:</strong> {selectedRequest.appointment_ID}</Typography>
                  <Typography><strong>Customer:</strong> {selectedRequest.firstname} {selectedRequest.lastname}</Typography>
                  <Typography><strong>Date:</strong> {selectedRequest.appointment_date}</Typography>
                  <Typography><strong>Time:</strong> {selectedRequest.appointment_time?.substring(0, 5)}</Typography>
                  <Typography><strong>Requested At:</strong> {new Date(selectedRequest.cancel_request_time).toLocaleString()}</Typography>
                  <Typography><strong>Services:</strong> {selectedRequest.services}</Typography>
                  <Typography><strong>Stylists:</strong> {selectedRequest.stylists || 'None assigned'}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PaymentIcon color="action" />
                  <Typography variant="h6" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Payment Details</Typography>
                </Box>
                <Divider sx={{ my: 1, borderColor: 'rgba(190, 175, 155, 0.2)' }} />
                {selectedRequest.payment ? (
                  <Box sx={{ '& > *': { mb: 1 } }}>
                    <Typography><strong>Amount:</strong> ${selectedRequest.payment.payment_amount}</Typography>
                    <Typography><strong>Paid:</strong> ${selectedRequest.payment.amount_paid || 0}</Typography>
                    <Typography><strong>Status:</strong> <Chip 
                      label={selectedRequest.payment.payment_status} 
                      size="small"
                      sx={{
                        backgroundColor: 
                          selectedRequest.payment.payment_status === 'Paid' ? 'rgba(56, 142, 60, 0.1)' :
                          selectedRequest.payment.payment_status === 'Partially Paid' ? 'rgba(255, 160, 0, 0.1)' : 
                          'rgba(158, 158, 158, 0.1)',
                        color: 
                          selectedRequest.payment.payment_status === 'Paid' ? '#388e3c' :
                          selectedRequest.payment.payment_status === 'Partially Paid' ? '#ffa000' : '#9e9e9e',
                      }}
                    /></Typography>
                    <Typography><strong>Payment Type:</strong> {selectedRequest.payment.payment_type}</Typography>
                    <Typography><strong>Payment ID:</strong> {selectedRequest.payment.stripe_payment_intent_id || 'N/A'}</Typography>
                    <Typography><strong>Date:</strong> {
                      selectedRequest.payment.payment_date ? 
                        new Date(selectedRequest.payment.payment_date).toLocaleString() : 'N/A'
                    }</Typography>

                    {selectedRequest.payment.payment_status === 'Paid' && (
                      <>
                        <Divider sx={{ my: 2, borderColor: 'rgba(190, 175, 155, 0.2)' }} />
                        <Typography variant="subtitle1" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600 }}>Refund Details</Typography>
                        <TextField
                          label="Refund Amount"
                          type="number"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          size="small"
                          value={refundAmount}
                          onChange={(e) => setRefundAmount(Math.min(Number(e.target.value), selectedRequest.payment.amount_paid))}
                          inputProps={{
                            min: 0,
                            max: selectedRequest.payment.amount_paid,
                            step: 0.01
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'rgba(190, 175, 155, 0.5)',
                              },
                              '&:hover fieldset': {
                                borderColor: '#BEAF9B',
                              },
                            }
                          }}
                        />
                        <TextField
                          select
                          label="Refund Reason"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          size="small"
                          value={refundReason}
                          onChange={(e) => setRefundReason(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'rgba(190, 175, 155, 0.5)',
                              },
                              '&:hover fieldset': {
                                borderColor: '#BEAF9B',
                              },
                            }
                          }}
                        >
                          <MenuItem value="cancellation">Cancellation</MenuItem>
                          <MenuItem value="requested_by_customer">Requested by Customer</MenuItem>
                          <MenuItem value="duplicate">Duplicate</MenuItem>
                          <MenuItem value="fraudulent">Fraudulent</MenuItem>
                        </TextField>
                      </>
                    )}
                  </Box>
                ) : (
                  <Typography>No payment information available</Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(190, 175, 155, 0.2)' }}>
          <StyledButton
            onClick={() => setDialogOpen(false)}
            disabled={processing}
            sx={{
              color: '#666',
              '&:hover': {
                color: '#453C33',
              }
            }}
          >
            Cancel
          </StyledButton>
          <StyledButton
            onClick={() => handleProcessRequest('Rejected')}
            sx={{
              color: '#ff6b6b',
              borderColor: 'rgba(255, 107, 107, 0.5)',
              '&:hover': {
                borderColor: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)'
              }
            }}
            variant="outlined"
            disabled={processing}
            startIcon={processing ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Reject
          </StyledButton>
          <StyledButton
            onClick={() => handleProcessRequest('Approved')}
            sx={{
              backgroundColor: '#BEAF9B',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#9e8e7a',
              },
              '&:disabled': {
                backgroundColor: 'rgba(190, 175, 155, 0.5)',
              }
            }}
            disabled={processing || (selectedRequest?.payment?.payment_status === 'Paid' && refundAmount <= 0)}
            startIcon={processing ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {`Approve${selectedRequest?.payment?.payment_status === 'Paid' ? ' & Refund' : ''}`}
          </StyledButton>
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