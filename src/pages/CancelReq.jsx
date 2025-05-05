// import React, { useEffect, useState } from 'react';
// import {
//   Box, Typography, Paper, Divider, Grid, Button, CircularProgress,
//   Chip, Snackbar, Alert, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions
// } from '@mui/material';
// import axios from '../utils/axiosWithAuth';

// const AdminCancellationRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);

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
//     try {
//       await axios.post(
//         `http://localhost:5001/api/appointment/process-cancellation/${selectedRequest.appointment_ID}`,
//         { action }
//       );
//       setSnackbar({ 
//         open: true, 
//         message: `Cancellation request ${action.toLowerCase()} successfully`,
//         severity: 'success'
//       });
//       setDialogOpen(false);
//       fetchRequests(); // Refresh the list
//     } catch (err) {
//       console.error('Error processing request:', err);
//       setSnackbar({ open: true, message: 'Failed to process request', severity: 'error' });
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

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
//                     <Typography variant="body2">{request.phone}</Typography>
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
//                       <Chip 
//                         label={request.payment.payment_status} 
//                         color={
//                           request.payment.payment_status === 'Paid' ? 'success' :
//                           request.payment.payment_status === 'Partially Paid' ? 'warning' : 'default'
//                         } 
//                       />
//                     ) : 'No payment info'}
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
//                 <Typography><strong>Stylists:</strong> {selectedRequest.stylists}</Typography>
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
//                     <Typography><strong>Date:</strong> {
//                       selectedRequest.payment.payment_date ? 
//                         new Date(selectedRequest.payment.payment_date).toLocaleString() : 'N/A'
//                     }</Typography>
//                   </>
//                 ) : (
//                   <Typography>No payment information available</Typography>
//                 )}
//               </Grid>
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
//           <Button 
//             onClick={() => handleProcessRequest('Rejected')} 
//             color="error"
//             variant="outlined"
//           >
//             Reject
//           </Button>
//           <Button 
//             onClick={() => handleProcessRequest('Approved')} 
//             color="success"
//             variant="contained"
//           >
//             Approve
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
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
  TextField, MenuItem
} from '@mui/material';
import axios from '../utils/axiosWithAuth';

const AdminCancellationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState('cancellation');
  const [processing, setProcessing] = useState(false);

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
      
      // Only process refund if approved and payment exists
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

      // Process cancellation
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

  const processRefund = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/refund/process', {
        payment_intent_id: selectedRequest.payment.stripe_payment_intent_id,
        amount: refundAmount,
        reason: refundReason
      });

      setSnackbar({
        open: true,
        message: `Refund processed successfully (ID: ${response.data.refundId})`,
        severity: 'success'
      });

      return response.data;
    } catch (err) {
      console.error('Refund processing error:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (selectedRequest?.payment) {
      // Set default refund amount to amount paid
      setRefundAmount(selectedRequest.payment.amount_paid);
    }
  }, [selectedRequest]);

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Pending Cancellation Requests</Typography>
      
      {requests.length === 0 ? (
        <Typography>No pending cancellation requests</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Appointment ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Request Time</TableCell>
                <TableCell>Services</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Refund Eligible</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.appointment_ID}>
                  <TableCell>{request.appointment_ID}</TableCell>
                  <TableCell>
                    {request.firstname} {request.lastname}
                    <Typography variant="body2">{request.email}</Typography>
                    <Typography variant="body2">{request.primary_phone}</Typography>
                  </TableCell>
                  <TableCell>
                    {request.appointment_date} at {request.appointment_time?.substring(0, 5)}
                  </TableCell>
                  <TableCell>
                    {new Date(request.cancel_request_time).toLocaleString()}
                  </TableCell>
                  <TableCell>{request.services}</TableCell>
                  <TableCell>
                    {request.payment ? (
                      <>
                        <Chip 
                          label={request.payment.payment_status} 
                          color={
                            request.payment.payment_status === 'Paid' ? 'success' :
                            request.payment.payment_status === 'Partially Paid' ? 'warning' : 'default'
                          } 
                        />
                        <Typography variant="body2">
                          ${request.payment.amount_paid} of ${request.payment.payment_amount}
                        </Typography>
                        {request.payment.stripe_payment_intent_id && (
                          <Typography variant="caption" display="block">
                            Stripe: {request.payment.stripe_payment_intent_id.substring(0, 8)}...
                          </Typography>
                        )}
                      </>
                    ) : (
                      <Chip label="No payment" color="default" />
                    )}
                  </TableCell>
                  <TableCell>
                    {request.payment?.payment_status === 'Paid' ? (
                      <Chip label="Yes" color="success" />
                    ) : request.payment?.payment_status === 'Partially Paid' ? (
                      <Chip label="Partial" color="warning" />
                    ) : (
                      <Chip label="No" color="default" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => {
                        setSelectedRequest(request);
                        setDialogOpen(true);
                      }}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Review Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Review Cancellation Request</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Appointment Details</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography><strong>ID:</strong> {selectedRequest.appointment_ID}</Typography>
                <Typography><strong>Customer:</strong> {selectedRequest.firstname} {selectedRequest.lastname}</Typography>
                <Typography><strong>Date:</strong> {selectedRequest.appointment_date}</Typography>
                <Typography><strong>Time:</strong> {selectedRequest.appointment_time?.substring(0, 5)}</Typography>
                <Typography><strong>Requested At:</strong> {new Date(selectedRequest.cancel_request_time).toLocaleString()}</Typography>
                <Typography><strong>Services:</strong> {selectedRequest.services}</Typography>
                <Typography><strong>Stylists:</strong> {selectedRequest.stylists || 'None assigned'}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Payment Details</Typography>
                <Divider sx={{ my: 1 }} />
                {selectedRequest.payment ? (
                  <>
                    <Typography><strong>Amount:</strong> ${selectedRequest.payment.payment_amount}</Typography>
                    <Typography><strong>Paid:</strong> ${selectedRequest.payment.amount_paid || 0}</Typography>
                    <Typography><strong>Status:</strong> <Chip 
                      label={selectedRequest.payment.payment_status} 
                      color={
                        selectedRequest.payment.payment_status === 'Paid' ? 'success' :
                        selectedRequest.payment.payment_status === 'Partially Paid' ? 'warning' : 'default'
                      } 
                    /></Typography>
                    <Typography><strong>Payment Type:</strong> {selectedRequest.payment.payment_type}</Typography>
                    <Typography><strong>Payment ID:</strong> {selectedRequest.payment.stripe_payment_intent_id || 'N/A'}</Typography>
                    <Typography><strong>Date:</strong> {
                      selectedRequest.payment.payment_date ? 
                        new Date(selectedRequest.payment.payment_date).toLocaleString() : 'N/A'
                    }</Typography>

                    {selectedRequest.payment.payment_status === 'Paid' && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6">Refund Details</Typography>
                        <TextField
                          label="Refund Amount"
                          type="number"
                          fullWidth
                          margin="normal"
                          value={refundAmount}
                          onChange={(e) => setRefundAmount(Math.min(Number(e.target.value), selectedRequest.payment.amount_paid))}
                          inputProps={{
                            min: 0,
                            max: selectedRequest.payment.amount_paid,
                            step: 0.01
                          }}
                        />
                        <TextField
                          select
                          label="Refund Reason"
                          fullWidth
                          margin="normal"
                          value={refundReason}
                          onChange={(e) => setRefundReason(e.target.value)}
                        >
                          <MenuItem value="cancellation">Cancellation</MenuItem>
                          <MenuItem value="requested_by_customer">Requested by Customer</MenuItem>
                          <MenuItem value="duplicate">Duplicate</MenuItem>
                          <MenuItem value="fraudulent">Fraudulent</MenuItem>
                        </TextField>
                      </>
                    )}
                  </>
                ) : (
                  <Typography>No payment information available</Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleProcessRequest('Rejected')} 
            color="error"
            variant="outlined"
            disabled={processing}
          >
            {processing ? <CircularProgress size={24} /> : 'Reject'}
          </Button>
          <Button 
            onClick={() => handleProcessRequest('Approved')} 
            color="success"
            variant="contained"
            disabled={processing || (selectedRequest?.payment?.payment_status === 'Paid' && refundAmount <= 0)}
          >
            {processing ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Approve${selectedRequest?.payment?.payment_status === 'Paid' ? ' & Refund' : ''}`
            )}
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

export default AdminCancellationRequests;