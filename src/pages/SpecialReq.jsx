import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Divider, Grid, Button, CircularProgress,
  Chip, Snackbar, Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem
} from '@mui/material';
import axios from '../utils/axiosWithAuth';

const AdminSpecialRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('pending');
  const [processing, setProcessing] = useState(false);

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

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (selectedRequest) {
      setNewStatus(selectedRequest.status);
    }
  }, [selectedRequest]);

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>;

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Special Requests</Typography>
      
      {requests.length === 0 ? (
        <Typography>No special requests found</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Contact Info</TableCell>
                <TableCell>Request Details</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>
                    {request.first_name} {request.last_name}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{request.email}</Typography>
                    <Typography variant="body2">{request.phone_number}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {request.request_details}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {formatDate(request.created_at)}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={request.status} 
                      color={getStatusColor(request.status)} 
                    />
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
        <DialogTitle>Review Special Request</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Customer Details</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography><strong>ID:</strong> {selectedRequest.id}</Typography>
                <Typography><strong>Name:</strong> {selectedRequest.first_name} {selectedRequest.last_name}</Typography>
                <Typography><strong>Email:</strong> {selectedRequest.email}</Typography>
                <Typography><strong>Phone:</strong> {selectedRequest.phone_number}</Typography>
                <Typography><strong>Customer ID:</strong> {selectedRequest.customer_id}</Typography>
                <Typography><strong>Created:</strong> {formatDate(selectedRequest.created_at)}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Request Details</Typography>
                <Divider sx={{ my: 1 }} />
                <Paper elevation={1} sx={{ p: 2, mt: 2, maxHeight: 200, overflow: 'auto' }}>
                  <Typography style={{ whiteSpace: 'pre-wrap' }}>{selectedRequest.request_details}</Typography>
                </Paper>
                
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Update Status</Typography>
                <TextField
                  select
                  label="Request Status"
                  fullWidth
                  margin="normal"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateStatus} 
            color="primary"
            variant="contained"
            disabled={processing || (selectedRequest && selectedRequest.status === newStatus)}
          >
            {processing ? <CircularProgress size={24} color="inherit" /> : 'Update Status'}
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