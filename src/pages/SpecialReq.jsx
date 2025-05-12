// import React, { useEffect, useState } from 'react';
// import {
//   Box, Typography, Paper, Divider, Grid, Button, CircularProgress,
//   Chip, Snackbar, Alert, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, MenuItem
// } from '@mui/material';
// import axios from '../utils/axiosWithAuth';

// const AdminSpecialRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [newStatus, setNewStatus] = useState('pending');
//   const [processing, setProcessing] = useState(false);

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

//   const handleUpdateStatus = async () => {
//     setProcessing(true);
//     try {
//       await axios.put('http://localhost:5001/api/specialRequest/admin/update-status', {
//         requestId: selectedRequest.id,
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

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   useEffect(() => {
//     if (selectedRequest) {
//       setNewStatus(selectedRequest.status);
//     }
//   }, [selectedRequest]);

//   if (loading) return <Box textAlign="center"><CircularProgress /></Box>;

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'pending': return 'warning';
//       case 'approved': return 'success';
//       case 'rejected': return 'error';
//       case 'completed': return 'info';
//       default: return 'default';
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleString();
//   };

//   return (
//     <Box p={4}>
//       <Typography variant="h4" gutterBottom>Special Requests</Typography>
      
//       {requests.length === 0 ? (
//         <Typography>No special requests found</Typography>
//       ) : (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Customer</TableCell>
//                 <TableCell>Contact Info</TableCell>
//                 <TableCell>Request Details</TableCell>
//                 <TableCell>Created At</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {requests.map((request) => (
//                 <TableRow key={request.id}>
//                   <TableCell>{request.id}</TableCell>
//                   <TableCell>
//                     {request.first_name} {request.last_name}
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">{request.email}</Typography>
//                     <Typography variant="body2">{request.phone_number}</Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography noWrap sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                       {request.request_details}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     {formatDate(request.created_at)}
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={request.status} 
//                       color={getStatusColor(request.status)} 
//                     />
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
//         <DialogTitle>Review Special Request</DialogTitle>
//         <DialogContent dividers>
//           {selectedRequest && (
//             <Grid container spacing={3}>
//               <Grid item xs={12} md={6}>
//                 <Typography variant="h6">Customer Details</Typography>
//                 <Divider sx={{ my: 1 }} />
//                 <Typography><strong>ID:</strong> {selectedRequest.id}</Typography>
//                 <Typography><strong>Name:</strong> {selectedRequest.first_name} {selectedRequest.last_name}</Typography>
//                 <Typography><strong>Email:</strong> {selectedRequest.email}</Typography>
//                 <Typography><strong>Phone:</strong> {selectedRequest.phone_number}</Typography>
//                 <Typography><strong>Customer ID:</strong> {selectedRequest.customer_id}</Typography>
//                 <Typography><strong>Created:</strong> {formatDate(selectedRequest.created_at)}</Typography>
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <Typography variant="h6">Request Details</Typography>
//                 <Divider sx={{ my: 1 }} />
//                 <Paper elevation={1} sx={{ p: 2, mt: 2, maxHeight: 200, overflow: 'auto' }}>
//                   <Typography style={{ whiteSpace: 'pre-wrap' }}>{selectedRequest.request_details}</Typography>
//                 </Paper>
                
//                 <Divider sx={{ my: 2 }} />
//                 <Typography variant="h6">Update Status</Typography>
//                 <TextField
//                   select
//                   label="Request Status"
//                   fullWidth
//                   margin="normal"
//                   value={newStatus}
//                   onChange={(e) => setNewStatus(e.target.value)}
//                 >
//                   <MenuItem value="pending">Pending</MenuItem>
//                   <MenuItem value="approved">Approved</MenuItem>
//                   <MenuItem value="rejected">Rejected</MenuItem>
//                   <MenuItem value="completed">Completed</MenuItem>
//                 </TextField>
//               </Grid>
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)} disabled={processing}>
//             Cancel
//           </Button>
//           <Button 
//             onClick={handleUpdateStatus} 
//             color="primary"
//             variant="contained"
//             disabled={processing || (selectedRequest && selectedRequest.status === newStatus)}
//           >
//             {processing ? <CircularProgress size={24} color="inherit" /> : 'Update Status'}
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









// import React, { useEffect, useState } from 'react';
// import {
//   Box, Typography, Paper, Divider, Grid, Button, CircularProgress,
//   Chip, Snackbar, Alert, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, MenuItem, FormControl, InputLabel, Select, InputAdornment
// } from '@mui/material';
// import {
//   Save as SaveIcon,
//   Person as PersonIcon,
//   CalendarToday as CalendarIcon,
//   Spa as SpaIcon,
//   People as PeopleIcon,
//   Description as DescriptionIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon
// } from "@mui/icons-material";
// import axios from '../utils/axiosWithAuth';

// const AdminSpecialRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [newStatus, setNewStatus] = useState('pending');
//   const [processing, setProcessing] = useState(false);

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

//   const handleUpdateStatus = async () => {
//     setProcessing(true);
//     try {
//       await axios.put('http://localhost:5001/api/specialRequest/admin/update-status', {
//         requestId: selectedRequest.id,
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

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   useEffect(() => {
//     if (selectedRequest) {
//       setNewStatus(selectedRequest.status);
//     }
//   }, [selectedRequest]);

//   if (loading) return <Box textAlign="center"><CircularProgress /></Box>;

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'pending': return 'warning';
//       case 'approved': return 'success';
//       case 'rejected': return 'error';
//       case 'completed': return 'info';
//       default: return 'default';
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString();
//   };

//   const formatTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleTimeString();
//   };

//   // Format date for input field (YYYY-MM-DD)
//   const formatDateForInput = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toISOString().split('T')[0];
//   };

//   return (
//     <Box p={4}>
//       <Typography variant="h4" gutterBottom>Special Requests</Typography>
      
//       {requests.length === 0 ? (
//         <Typography>No special requests found</Typography>
//       ) : (
//         <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Customer</TableCell>
//                 <TableCell>Contact Info</TableCell>
//                 <TableCell>Service Type</TableCell>
//                 <TableCell>Date</TableCell>
//                 <TableCell>Time</TableCell>
//                 <TableCell>Request Details</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {requests.map((request) => (
//                 <TableRow key={request.id}>
//                   <TableCell>{request.id}</TableCell>
//                   <TableCell>
//                     {request.first_name} {request.last_name}
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">{request.email}</Typography>
//                     <Typography variant="body2">{request.phone_number}</Typography>
//                   </TableCell>
//                   <TableCell>
//                     {request.service_type || 'Not specified'}
//                   </TableCell>
//                   <TableCell>
//                     {formatDate(request.created_at)}
//                   </TableCell>
//                   <TableCell>
//                     {formatTime(request.created_at)}
//                   </TableCell>
//                   <TableCell>
//                     <Typography noWrap sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                       {request.request_details}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={request.status} 
//                       color={getStatusColor(request.status)} 
//                     />
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

//       {/* Review Dialog with Appointment Form Style */}
//       <Dialog 
//         open={dialogOpen} 
//         onClose={() => setDialogOpen(false)} 
//         maxWidth="md" 
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: "12px",
//             background: "linear-gradient(to right bottom, #F7F4F0, #FFFFFF)"
//           }
//         }}
//       >
//         <DialogTitle sx={{ 
//           color: "#453C33",
//           fontFamily: "'Poppins', 'Roboto', sans-serif",
//           fontWeight: 500,
//           borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
//           pb: 2
//         }}>
//           Special Request Review
//         </DialogTitle>
        
//         <DialogContent dividers sx={{ p: 3 }}>
//           {selectedRequest && (
//             <Box component="form">
//               {/* Form title */}
//               <Box sx={{ mb: 3 }}>
//                 <Typography 
//                   variant="h5" 
//                   component="h2"
//                   sx={{ 
//                     color: "#453C33",
//                     fontFamily: "'Poppins', 'Roboto', sans-serif",
//                     fontWeight: 500,
//                     mb: 1
//                   }}
//                 >
//                   Special Request #{selectedRequest.id}
//                 </Typography>
//                 <Typography 
//                   variant="body2" 
//                   sx={{ 
//                     color: "text.secondary",
//                     fontFamily: "'Poppins', 'Roboto', sans-serif",
//                   }}
//                 >
//                   Review the request details and update the status if needed
//                 </Typography>
//               </Box>

//               <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
//                 {/* Customer Details section */}
//                 <Paper 
//                   elevation={0} 
//                   sx={{ 
//                     p: 2.5, 
//                     borderRadius: "8px",
//                     border: "1px solid rgba(190, 175, 155, 0.3)",
//                     background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
//                   }}
//                 >
//                   <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                     <PersonIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//                     <Typography 
//                       variant="subtitle1" 
//                       sx={{ 
//                         fontWeight: 600, 
//                         color: "#453C33",
//                         fontFamily: "'Poppins', 'Roboto', sans-serif",
//                       }}
//                     >
//                       Customer Details
//                     </Typography>
//                   </Box>
//                   <TextField
//                     label="Full Name"
//                     value={`${selectedRequest.first_name} ${selectedRequest.last_name}`}
//                     fullWidth
//                     margin="normal"
//                     InputProps={{
//                       readOnly: true,
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <PersonIcon sx={{ color: "#BEAF9B" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                         '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                         '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                       },
//                       '& .Mui-focused': { color: '#BEAF9B' },
//                       '& .Mui-disabled, & .Mui-readOnly': {
//                         backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                         WebkitTextFillColor: '#453C33',
//                       }
//                     }}
//                   />
//                   <TextField
//                     label="Email"
//                     value={selectedRequest.email}
//                     fullWidth
//                     margin="normal"
//                     InputProps={{
//                       readOnly: true,
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <EmailIcon sx={{ color: "#BEAF9B" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                         '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                         '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                       },
//                       '& .Mui-focused': { color: '#BEAF9B' },
//                       '& .Mui-disabled, & .Mui-readOnly': {
//                         backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                         WebkitTextFillColor: '#453C33',
//                       }
//                     }}
//                   />
//                   <TextField
//                     label="Phone Number"
//                     value={selectedRequest.phone_number}
//                     fullWidth
//                     margin="normal"
//                     InputProps={{
//                       readOnly: true,
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <PhoneIcon sx={{ color: "#BEAF9B" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                         '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                         '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                       },
//                       '& .Mui-focused': { color: '#BEAF9B' },
//                       '& .Mui-disabled, & .Mui-readOnly': {
//                         backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                         WebkitTextFillColor: '#453C33',
//                       }
//                     }}
//                   />
//                 </Paper>

//                 {/* Request Details section */}
//                 <Paper 
//                   elevation={0} 
//                   sx={{ 
//                     p: 2.5, 
//                     borderRadius: "8px",
//                     border: "1px solid rgba(190, 175, 155, 0.3)",
//                     background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
//                   }}
//                 >
//                   <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                     <SpaIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//                     <Typography 
//                       variant="subtitle1" 
//                       sx={{ 
//                         fontWeight: 600, 
//                         color: "#453C33",
//                         fontFamily: "'Poppins', 'Roboto', sans-serif",
//                       }}
//                     >
//                       Request Information
//                     </Typography>
//                   </Box>
//                   <TextField
//                     label="Service Type"
//                     value={selectedRequest.service_type || 'Not specified'}
//                     fullWidth
//                     margin="normal"
//                     InputProps={{
//                       readOnly: true,
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SpaIcon sx={{ color: "#BEAF9B" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                         '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                         '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                       },
//                       '& .Mui-focused': { color: '#BEAF9B' },
//                       '& .Mui-disabled, & .Mui-readOnly': {
//                         backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                         WebkitTextFillColor: '#453C33',
//                       }
//                     }}
//                   />
//                   <TextField
//                     label="Date Submitted"
//                     value={formatDateForInput(selectedRequest.created_at)}
//                     type="date"
//                     fullWidth
//                     margin="normal"
//                     InputProps={{
//                       readOnly: true,
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <CalendarIcon sx={{ color: "#BEAF9B" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                     InputLabelProps={{ shrink: true }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                         '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                         '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                       },
//                       '& .Mui-focused': { color: '#BEAF9B' },
//                       '& .Mui-disabled, & .Mui-readOnly': {
//                         backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                         WebkitTextFillColor: '#453C33',
//                       }
//                     }}
//                   />
//                   <TextField
//                     label="Time Submitted"
//                     value={formatTime(selectedRequest.created_at)}
//                     fullWidth
//                     margin="normal"
//                     InputProps={{
//                       readOnly: true,
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <CalendarIcon sx={{ color: "#BEAF9B" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                         '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                         '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                       },
//                       '& .Mui-focused': { color: '#BEAF9B' },
//                       '& .Mui-disabled, & .Mui-readOnly': {
//                         backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                         WebkitTextFillColor: '#453C33',
//                       }
//                     }}
//                   />
//                 </Paper>

//                 {/* Request Details section */}
//                 <Paper 
//                   elevation={0} 
//                   sx={{ 
//                     p: 2.5, 
//                     borderRadius: "8px",
//                     border: "1px solid rgba(190, 175, 155, 0.3)",
//                     background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))",
//                     gridColumn: '1 / -1'
//                   }}
//                 >
//                   <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                     <DescriptionIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//                     <Typography 
//                       variant="subtitle1" 
//                       sx={{ 
//                         fontWeight: 600, 
//                         color: "#453C33",
//                         fontFamily: "'Poppins', 'Roboto', sans-serif",
//                       }}
//                     >
//                       Request Details
//                     </Typography>
//                   </Box>
//                   <TextField
//                     label="Request Details"
//                     value={selectedRequest.request_details}
//                     fullWidth
//                     margin="normal"
//                     multiline
//                     rows={4}
//                     InputProps={{
//                       readOnly: true,
//                     }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                         '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                         '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                       },
//                       '& .Mui-focused': { color: '#BEAF9B' },
//                       '& .Mui-disabled, & .Mui-readOnly': {
//                         backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                         WebkitTextFillColor: '#453C33',
//                       }
//                     }}
//                   />
//                 </Paper>

//                 {/* Status Update section */}
//                 <Paper 
//                   elevation={0} 
//                   sx={{ 
//                     p: 2.5, 
//                     borderRadius: "8px",
//                     border: "1px solid rgba(190, 175, 155, 0.3)",
//                     background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))",
//                     gridColumn: '1 / -1'
//                   }}
//                 >
//                   <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                     <PeopleIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//                     <Typography 
//                       variant="subtitle1" 
//                       sx={{ 
//                         fontWeight: 600, 
//                         color: "#453C33",
//                         fontFamily: "'Poppins', 'Roboto', sans-serif",
//                       }}
//                     >
//                       Update Status
//                     </Typography>
//                   </Box>
//                   <FormControl fullWidth margin="normal">
//                     <InputLabel sx={{ '&.Mui-focused': { color: '#BEAF9B' } }}>
//                       Request Status
//                     </InputLabel>
//                     <Select
//                       value={newStatus}
//                       onChange={(e) => setNewStatus(e.target.value)}
//                       sx={{
//                         '& .MuiOutlinedInput-notchedOutline': {
//                           borderColor: 'rgba(190, 175, 155, 0.3)',
//                         },
//                         '&:hover .MuiOutlinedInput-notchedOutline': {
//                           borderColor: 'rgba(190, 175, 155, 0.5)',
//                         },
//                         '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                           borderColor: '#BEAF9B',
//                         },
//                       }}
//                     >
//                       <MenuItem value="pending">
//                         <Chip 
//                           label="Pending" 
//                           size="small" 
//                           sx={{ 
//                             backgroundColor: "#ff9800",
//                             color: 'white',
//                             minWidth: '80px',
//                             justifyContent: 'center'
//                           }} 
//                         />
//                       </MenuItem>
//                       <MenuItem value="approved">
//                         <Chip 
//                           label="Approved" 
//                           size="small" 
//                           sx={{ 
//                             backgroundColor: "#4caf50",
//                             color: 'white',
//                             minWidth: '80px',
//                             justifyContent: 'center'
//                           }} 
//                         />
//                       </MenuItem>
//                       <MenuItem value="rejected">
//                         <Chip 
//                           label="Rejected" 
//                           size="small" 
//                           sx={{ 
//                             backgroundColor: "#f44336",
//                             color: 'white',
//                             minWidth: '80px',
//                             justifyContent: 'center'
//                           }} 
//                         />
//                       </MenuItem>
//                       <MenuItem value="completed">
//                         <Chip 
//                           label="Completed" 
//                           size="small" 
//                           sx={{ 
//                             backgroundColor: "#2196f3",
//                             color: 'white',
//                             minWidth: '80px',
//                             justifyContent: 'center'
//                           }} 
//                         />
//                       </MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Paper>
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
        
//         <DialogActions sx={{ 
//           padding: "20px",
//           borderTop: "1px dashed rgba(190, 175, 155, 0.3)"
//         }}>
//           <Button 
//             onClick={handleUpdateStatus} 
//             variant="contained"
//             startIcon={<SaveIcon />}
//             disabled={processing || (selectedRequest && selectedRequest.status === newStatus)}
//             sx={{ 
//               backgroundColor: "#BEAF9B", 
//               color: "white", 
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               fontWeight: 500,
//               boxShadow: "0 2px 6px rgba(190, 175, 155, 0.3)",
//               transition: "transform 0.3s ease, box-shadow 0.3s ease",
//               px: 3,
//               '&:hover': { 
//                 backgroundColor: "#A89583",
//                 transform: "translateY(-2px)",
//                 boxShadow: "0 4px 10px rgba(190, 175, 155, 0.4)"
//               }
//             }}
//           >
//             {processing ? <CircularProgress size={24} color="inherit" /> : 'Update Status'}
//           </Button>
//           <Button 
//             onClick={() => setDialogOpen(false)} 
//             disabled={processing}
//             sx={{ 
//               color: "#453C33", 
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               fontWeight: 500,
//               '&:hover': { 
//                 backgroundColor: "rgba(190, 175, 155, 0.1)" 
//               } 
//             }}
//           >
//             Cancel
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








































// import React, { useEffect, useState } from 'react';
// import { Box, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
// import SpecialRequestsTable from '../components/specialReq/SpecialRequestsTable';
// import SpecialRequestForm from '../components/specialReq/SpecialRequestForm';
// import axios from '../utils/axiosWithAuth';

// const AdminSpecialRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [processing, setProcessing] = useState(false);

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
//         />
//       )}

//       {/* Form Dialog */}
//       {selectedRequest && (
//         <SpecialRequestForm
//           open={dialogOpen}
//           onClose={handleCloseDialog}
//           request={selectedRequest}
//           onUpdateStatus={handleUpdateStatus}
//           processing={processing}
//         />
//       )}

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
                  <Typography variant="body2" fontWeight="bold">#{successRequest.appointment}</Typography>
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
                  <Typography variant="body2">Service:</Typography>
                  <Typography variant="body2">{successRequest.service_name || 'Not specified'}</Typography>
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