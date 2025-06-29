import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Typography,Button,CircularProgress,
  Box,Alert,Dialog,DialogTitle,DialogContent,DialogActions,Grid,Card,CardContent,Chip,Select,MenuItem,
  FormControl,InputLabel,Container,useTheme,useMediaQuery
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { jwtDecode } from 'jwt-decode';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [adminId, setAdminId] = useState(null);
  const [adminName, setAdminName] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get admin info from JWT token
  useEffect(() => {
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

  // Get current time to display greeting
  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

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
    setUpdatedStatus(application.status || 'pending'); 
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFC107'; 
      case 'interviewed':
        return '#2196F3'; 
      case 'accepted':
        return '#4CAF50'; 
      case 'rejected':
        return '#F44336'; 
      default:
        return '#9E9E9E'; 
    }
  };

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
            Job Applications
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#666',
              mb: 1
            }}
          >
            {getCurrentTimeGreeting()}, {adminName}. Review and manage candidate applications here.
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: '8px',
                '& .MuiAlert-icon': {
                  color: '#d32f2f'
                }
              }}
            >
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
              <CircularProgress sx={{ color: '#BEAF9B' }} />
            </Box>
          ) : applications.length === 0 ? (
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: '8px',
                border: '1px dashed rgba(190, 175, 155, 0.4)',
                backgroundColor: 'rgba(190, 175, 155, 0.05)',
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  color: '#666',
                  textAlign: 'center'
                }}
              >
                No applications found.
              </Typography>
            </Paper>
          ) : (
            <TableContainer 
              component={Paper} 
              sx={{ 
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(190, 175, 155, 0.15)',
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="applications table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(190, 175, 155, 0.1)' }}>
                    <TableCell 
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        fontWeight: 600,
                        color: '#453C33'
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        fontWeight: 600,
                        color: '#453C33'
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        fontWeight: 600,
                        color: '#453C33'
                      }}
                    >
                      Date Applied
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        fontWeight: 600,
                        color: '#453C33'
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        fontWeight: 600,
                        color: '#453C33'
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow 
                      key={app.candidate_id}
                      hover
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(190, 175, 155, 0.05)'
                        }
                      }}
                      onClick={() => handleViewDetails(app)}
                    >
                      <TableCell 
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                        }}
                      >
                        {`${app.first_name} ${app.last_name}`}
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                        }}
                      >
                        {app.email}
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                        }}
                      >
                        {formatDate(app.submit_date)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={app.status || 'pending'} 
                          sx={{
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                            backgroundColor: app.status ? `${getStatusColor(app.status)}20` : '#FFC10720',
                            color: app.status ? getStatusColor(app.status) : '#FFC107',
                            fontWeight: 500,
                            borderRadius: '16px',
                          }}
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
                          sx={{ 
                            mr: 1,  
                            backgroundColor: '#BEAF9B', 
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                            textTransform: 'none',
                            fontWeight: 500,
                            boxShadow: '0 2px 5px rgba(190, 175, 155, 0.3)',
                            '&:hover': { 
                              backgroundColor: '#a49683',
                              boxShadow: '0 4px 8px rgba(190, 175, 155, 0.4)',
                            }
                          }}
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
        </Box>
      </Paper>

      {/* Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            overflowY: 'visible'
          }
        }}
      >
        {selectedApplication && (
          <>
            <DialogTitle 
              sx={{
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                backgroundColor: 'rgba(190, 175, 155, 0.1)',
                color: '#453C33',
                fontWeight: 600,
                borderBottom: '1px solid rgba(190, 175, 155, 0.2)',
              }}
            >
              Application Details
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card 
                    variant="outlined"
                    sx={{
                      borderRadius: '8px',
                      border: '1px solid rgba(190, 175, 155, 0.3)'
                    }}
                  >
                    <CardContent>
                      <Typography 
                        variant="h6"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: '#453C33',
                          mb: 2
                        }}
                      >
                        Personal Information
                      </Typography>
                      <Typography 
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          mb: 1
                        }}
                      >
                        <strong>Name:</strong> {selectedApplication.first_name} {selectedApplication.last_name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          mb: 1
                        }}
                      >
                        <strong>Email:</strong> {selectedApplication.email}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                        }}
                      >
                        <strong>Date Applied:</strong> {formatDate(selectedApplication.submit_date)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card 
                    variant="outlined"
                    sx={{
                      borderRadius: '8px',
                      border: '1px solid rgba(190, 175, 155, 0.3)'
                    }}
                  >
                    <CardContent>
                      <Typography 
                        variant="h6"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: '#453C33',
                          mb: 2
                        }}
                      >
                        Application Details
                      </Typography>
                      {selectedApplication.resume_url && (
                        <Typography
                          sx={{
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <strong>Resume:</strong>&nbsp;
                          <Button 
                            href={selectedApplication.resume_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            size="small"
                            startIcon={<DescriptionIcon />}
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              textTransform: 'none',
                              color: '#BEAF9B',
                              ml: 1
                            }}
                          >
                            View Resume
                          </Button>
                        </Typography>
                      )}
                      <Box mt={2}>
                        <FormControl fullWidth>
                          <InputLabel 
                            sx={{ 
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                            }}
                          >
                            Status
                          </InputLabel>
                          <Select 
                            value={updatedStatus} 
                            onChange={handleStatusChange}
                            sx={{ 
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                            }}
                          >
                            <MenuItem value="pending"
                              sx={{ 
                                fontFamily: "'Poppins', 'Roboto', sans-serif",
                              }}
                            >
                              Pending
                            </MenuItem>
                            <MenuItem value="interviewed"
                              sx={{ 
                                fontFamily: "'Poppins', 'Roboto', sans-serif",
                              }}
                            >
                              Interviewed
                            </MenuItem>
                            <MenuItem value="accepted"
                              sx={{ 
                                fontFamily: "'Poppins', 'Roboto', sans-serif",
                              }}
                            >
                              Accepted
                            </MenuItem>
                            <MenuItem value="rejected"
                              sx={{ 
                                fontFamily: "'Poppins', 'Roboto', sans-serif",
                              }}
                            >
                              Rejected
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card 
                    variant="outlined"
                    sx={{
                      borderRadius: '8px',
                      border: '1px solid rgba(190, 175, 155, 0.3)'
                    }}
                  >
                    <CardContent>
                      <Typography 
                        variant="h6"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: '#453C33',
                          mb: 2
                        }}
                      >
                        Reason for Joining
                      </Typography>
                      <Box 
                        sx={{ 
                          backgroundColor: 'rgba(190, 175, 155, 0.05)', 
                          p: 2, 
                          borderRadius: '8px', 
                          minHeight: '100px',
                          border: '1px solid rgba(190, 175, 155, 0.1)'
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                            whiteSpace: 'pre-line'
                          }}
                        >
                          {selectedApplication.reason || 'No reason provided.'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions 
              sx={{ 
                p: 2,
                backgroundColor: 'rgba(190, 175, 155, 0.05)',
                borderTop: '1px solid rgba(190, 175, 155, 0.2)'
              }}
            >
              <Button 
                onClick={handleUpdateStatus} 
                variant="contained"
                sx={{ 
                  backgroundColor: '#BEAF9B', 
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: '0 2px 5px rgba(190, 175, 155, 0.3)',
                  '&:hover': { 
                    backgroundColor: '#a49683',
                    boxShadow: '0 4px 8px rgba(190, 175, 155, 0.4)',
                  }
                }}
              >
                Update Status
              </Button>
              <Button 
                onClick={handleCloseDialog} 
                variant="outlined"
                sx={{
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  textTransform: 'none',
                  fontWeight: 500,
                  color: '#666',
                  borderColor: 'rgba(190, 175, 155, 0.3)',
                  '&:hover': { 
                    borderColor: '#BEAF9B', 
                    backgroundColor: 'rgba(190, 175, 155, 0.05)'
                  }
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Applications;










