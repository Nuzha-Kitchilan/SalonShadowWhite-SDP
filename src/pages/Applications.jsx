import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/candidates');
        
        if (response.data && typeof response.data === 'object') {
          setApplications(Object.values(response.data));
        } else {
          setApplications([]);
        }
      } catch (err) {
        setError(`Failed to load applications: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setUpdatedStatus(application.status || 'pending'); // Default to 'pending'
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleStatusChange = (event) => {
    setUpdatedStatus(event.target.value);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication) return;

    try {
      await axios.put(`http://localhost:5001/api/candidates/${selectedApplication.candidate_id}/status`, {
        status: updatedStatus
      });

      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.candidate_id === selectedApplication.candidate_id
            ? { ...app, status: updatedStatus }
            : app
        )
      );

      handleCloseDialog();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Job Applications
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : applications.length === 0 ? (
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1">No applications found.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="applications table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Date Applied</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow 
                  key={app.candidate_id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleViewDetails(app)}
                >
                  <TableCell>{`${app.first_name} ${app.last_name}`}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{formatDate(app.submit_date)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={app.status} 
                      color={
                        app.status === 'pending' ? 'default' :
                        app.status === 'interviewed' ? 'primary' :
                        app.status === 'accepted' ? 'success' :
                        'error'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(app);
                      }}
                      sx={{ mr: 1,  
                      backgroundColor: '#a36a4f', '&:hover': { backgroundColor: '#8e5c3b' } }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedApplication && (
          <>
            <DialogTitle>Application Details</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">Personal Information</Typography>
                      <Typography><strong>Name:</strong> {selectedApplication.first_name} {selectedApplication.last_name}</Typography>
                      <Typography><strong>Email:</strong> {selectedApplication.email}</Typography>
                      <Typography><strong>Date Applied:</strong> {formatDate(selectedApplication.submit_date)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">Application Details</Typography>
                      {selectedApplication.resume_url && (
                        <Typography>
                          <strong>Resume:</strong>{' '}
                          <Button href={selectedApplication.resume_url} target="_blank" rel="noopener noreferrer" size="small">
                            View Resume
                          </Button>
                        </Typography>
                      )}
                      <Box mt={2}>
                        <FormControl fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select value={updatedStatus} onChange={handleStatusChange}>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="interviewed">Interviewed</MenuItem>
                            <MenuItem value="accepted">Accepted</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">Reason for Joining</Typography>
                      <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, minHeight: '100px' }}>
                        <Typography>{selectedApplication.reason || 'No reason provided.'}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleUpdateStatus} variant="contained"
              sx={{ backgroundColor: '#a36a4f', '&:hover': { backgroundColor: '#8e5c3b' } }}>
                Update Status
              </Button>
              <Button onClick={handleCloseDialog} variant="outlined"
              sx={{
                color: 'red', 
                borderColor: 'red', 
                '&:hover': { borderColor: 'darkred', backgroundColor: 'white' }
              }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Applications;
