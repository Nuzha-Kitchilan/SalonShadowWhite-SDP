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













import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Grid, 
  Button, 
  CircularProgress,
  Chip, 
  Snackbar, 
  Alert, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer,
  TableHead, 
  TableRow, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField, 
  MenuItem, 
  Container,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from '../utils/axiosWithAuth';
import { jwtDecode } from 'jwt-decode';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import DoneAllIcon from '@mui/icons-material/DoneAll';

// Styled components to match ServiceManagement aesthetic
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid rgba(190, 175, 155, 0.2)',
  boxShadow: 'none',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: 'rgba(190, 175, 155, 0.1)',
  '& .MuiTableCell-head': {
    color: '#453C33',
    fontWeight: 600,
    fontSize: '0.9rem',
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    padding: theme.spacing(2),
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(190, 175, 155, 0.03)',
  },
  '&:hover': {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
  },
  transition: 'background-color 0.2s',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  borderBottom: '1px solid rgba(190, 175, 155, 0.2)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: 600,
  borderRadius: '6px',
  boxShadow: 'none',
  padding: '8px 16px',
  '&:hover': {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  }
}));

const StyledChip = styled(Chip)(({ theme, color }) => ({
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: 500,
  borderRadius: '6px',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid rgba(190, 175, 155, 0.2)',
  boxShadow: 'none',
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: 'rgba(190, 175, 155, 0.1)',
  color: '#453C33',
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: 600,
  padding: theme.spacing(2, 3),
}));

const AdminSpecialRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('pending');
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
    if (selectedRequest) {
      setNewStatus(selectedRequest.status);
    }
  }, [selectedRequest]);

  const fetchRequests = async () => {
    setRefreshing(true);
    try {
      const res = await axios.get('http://localhost:5001/api/specialRequest/admin/all-requests');
      setRequests(res.data.requests);
    } catch (err) {
      console.error('Error fetching special requests:', err);
      setSnackbar({ open: true, message: 'Failed to fetch special requests', severity: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateStatus = async () => {
    setProcessing(true);
    try {
      await axios.put('http://localhost:5001/api/specialRequest/admin/update-status', {
        requestId: selectedRequest.id,
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <PendingIcon fontSize="small" />;
      case 'approved': return <CheckCircleIcon fontSize="small" />;
      case 'rejected': return <CancelIcon fontSize="small" />;
      case 'completed': return <DoneAllIcon fontSize="small" />;
      default: return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Get current time to display greeting
  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#BEAF9B' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
      <StyledPaper
        sx={{ 
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
              mb: 1
            }}
          >
            {getCurrentTimeGreeting()}, {adminName}. Manage customer special requests here.
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <StyledButton
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchRequests}
              disabled={refreshing}
              sx={{ 
                color: '#BEAF9B', 
                borderColor: '#BEAF9B',
                '&:hover': {
                  borderColor: '#453C33',
                  backgroundColor: 'rgba(190, 175, 155, 0.1)',
                }
              }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </StyledButton>
          </Box>
          
          {requests.length === 0 ? (
            <Box 
              sx={{ 
                p: 4, 
                textAlign: 'center', 
                backgroundColor: 'rgba(190, 175, 155, 0.05)', 
                borderRadius: '8px' 
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  color: '#666'
                }}
              >
                No special requests found
              </Typography>
            </Box>
          ) : (
            <StyledTableContainer>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell>Customer</StyledTableCell>
                    <StyledTableCell>Contact Info</StyledTableCell>
                    <StyledTableCell>Request Details</StyledTableCell>
                    <StyledTableCell>Created At</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {requests.map((request) => (
                    <StyledTableRow key={request.id}>
                      <StyledTableCell>{request.id}</StyledTableCell>
                      <StyledTableCell>
                        {request.first_name} {request.last_name}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                          {request.email}
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                          {request.phone_number}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography 
                          noWrap 
                          sx={{ 
                            maxWidth: 200, 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            fontFamily: "'Poppins', 'Roboto', sans-serif" 
                          }}
                        >
                          {request.request_details}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                        {formatDate(request.created_at)}
                      </StyledTableCell>
                      <StyledTableCell>
                        <StyledChip 
                          label={request.status}
                          color={getStatusColor(request.status)}
                          icon={getStatusIcon(request.status)}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Tooltip title="Review Request">
                          <IconButton
                            onClick={() => {
                              setSelectedRequest(request);
                              setDialogOpen(true);
                            }}
                            sx={{ 
                              color: '#BEAF9B',
                              '&:hover': {
                                color: '#453C33',
                                backgroundColor: 'rgba(190, 175, 155, 0.1)',
                              }
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          )}
        </Box>
      </StyledPaper>

      {/* Review Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            overflow: 'hidden',
          }
        }}
      >
        <StyledDialogTitle>Review Special Request</StyledDialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedRequest && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    fontWeight: 600,
                    color: '#453C33',
                  }}
                >
                  Customer Details
                </Typography>
                <Divider sx={{ my: 1, borderColor: 'rgba(190, 175, 155, 0.3)' }} />
                
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography sx={{ fontWeight: 600, color: '#666' }}>ID:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{selectedRequest.id}</Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography sx={{ fontWeight: 600, color: '#666' }}>Name:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{selectedRequest.first_name} {selectedRequest.last_name}</Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography sx={{ fontWeight: 600, color: '#666' }}>Email:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{selectedRequest.email}</Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography sx={{ fontWeight: 600, color: '#666' }}>Phone:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{selectedRequest.phone_number}</Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography sx={{ fontWeight: 600, color: '#666' }}>Customer ID:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{selectedRequest.customer_id}</Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography sx={{ fontWeight: 600, color: '#666' }}>Created:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{formatDate(selectedRequest.created_at)}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    fontWeight: 600,
                    color: '#453C33',
                  }}
                >
                  Request Details
                </Typography>
                <Divider sx={{ my: 1, borderColor: 'rgba(190, 175, 155, 0.3)' }} />
                
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    mt: 2, 
                    maxHeight: 200, 
                    overflow: 'auto',
                    border: '1px solid rgba(190, 175, 155, 0.2)',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(190, 175, 155, 0.03)'
                  }}
                >
                  <Typography 
                    style={{ whiteSpace: 'pre-wrap' }}
                    sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}
                  >
                    {selectedRequest.request_details}
                  </Typography>
                </Paper>
                
                <Divider sx={{ my: 3, borderColor: 'rgba(190, 175, 155, 0.3)' }} />
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    fontWeight: 600,
                    color: '#453C33',
                  }}
                >
                  Update Status
                </Typography>
                
                <TextField
                  select
                  label="Request Status"
                  fullWidth
                  margin="normal"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  variant="outlined"
                  sx={{
                    mt: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(190, 175, 155, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#BEAF9B',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#BEAF9B',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#453C33',
                    },
                  }}
                >
                  <MenuItem value="pending">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PendingIcon fontSize="small" color="warning" />
                      <span>Pending</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value="approved">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                      <span>Approved</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value="rejected">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CancelIcon fontSize="small" color="error" />
                      <span>Rejected</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value="completed">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DoneAllIcon fontSize="small" color="info" />
                      <span>Completed</span>
                    </Box>
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: 'rgba(190, 175, 155, 0.03)' }}>
          <StyledButton 
            onClick={() => setDialogOpen(false)} 
            disabled={processing}
            sx={{ 
              color: '#666',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            Cancel
          </StyledButton>
          <StyledButton 
            onClick={handleUpdateStatus} 
            variant="contained"
            disabled={processing || (selectedRequest && selectedRequest.status === newStatus)}
            sx={{ 
              backgroundColor: '#BEAF9B',
              color: 'white',
              '&:hover': {
                backgroundColor: '#453C33',
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(190, 175, 155, 0.3)',
                color: 'rgba(255, 255, 255, 0.7)',
              }
            }}
          >
            {processing ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Update Status'
            )}
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
            boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '6px',
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