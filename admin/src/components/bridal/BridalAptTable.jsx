import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, TableHead, TableBody, TableCell, TableContainer,
  TableRow, Paper, IconButton, Chip, Typography, Button,
  CircularProgress, Stack, Box, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, TablePagination,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import moment from 'moment';

// Track the currently edited appointment ID globally
let currentlyEditingId = null;

const BridalAptTable = ({ stylists, onEdit, onDelete, onAddNew, onViewDetails }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Enhanced fetchBridalAppointments function - memoized with useCallback
  const fetchBridalAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/bridal-appointments');
      // Handle different API response structures
      const appointmentsData = response.data.data || response.data || [];
      
      // Only update state if we have data to avoid setting an empty array
      if (appointmentsData && appointmentsData.length > 0) {
        setAppointments(appointmentsData);
      } else if (appointments.length === 0) {
        // Only set empty array if we didn't have data before
        setAppointments(appointmentsData);
      }
      
      console.log('Fetched appointments:', appointmentsData);
    } catch (error) {
      console.error('Failed to fetch bridal appointments', error);
      // Don't clear appointments on error
    } finally {
      setLoading(false);
    }
  }, [appointments.length]);

  // Fetch appointments on mount and when refreshKey changes
  useEffect(() => {
    fetchBridalAppointments();
  }, [fetchBridalAppointments, refreshKey]);

  // Custom edit handler
  const handleEditClick = (id) => {
    if (onEdit) {
      // Store the ID being edited
      currentlyEditingId = id;
      setEditingAppointmentId(id);
      
      // Call the parent's onEdit with our custom callback
      onEdit(id, () => {
        console.log('Edit completed, refreshing data...');
        setRefreshKey(prev => prev + 1);
        setEditingAppointmentId(null);
        currentlyEditingId = null;
      });
    }
  };

  // Add a function to refresh appointments
  const refreshAppointments = () => {
    console.log('Manual refresh triggered');
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleDeleteClick = (id) => {
    setAppointmentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Handle view details click
  const handleViewDetailsClick = (appointment) => {
    if (onViewDetails) {
      onViewDetails(appointment);
    }
  };

  const handleConfirmDelete = async () => {
    if (appointmentToDelete) {
      try {
        setLoading(true);
        
        if (onDelete) {
          await onDelete(appointmentToDelete);
        }
        
        // Refresh the appointments list
        refreshAppointments();
      } catch (error) {
        console.error('Failed to delete appointment', error);
      } finally {
        setLoading(false);
        setDeleteConfirmOpen(false);
        setAppointmentToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setAppointmentToDelete(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return { bg: 'rgba(25, 118, 210, 0.1)', color: '#1976d2' };
      case 'Completed': return { bg: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' };
      case 'Cancelled': return { bg: 'rgba(244, 67, 54, 0.1)', color: '#f44336' };
      case 'Pending': return { bg: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' };
      default: return { bg: 'rgba(158, 158, 158, 0.1)', color: '#9e9e9e' };
    }
  };

  const getPaymentColor = (status) => {
    return status === 'Paid' 
      ? { bg: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }
      : { bg: 'rgba(244, 67, 54, 0.1)', color: '#f44336' };
  };

  // Find stylist name by ID
  const getStylistName = (stylistId) => {
    const stylist = stylists.find(s => s.stylist_ID === stylistId || s.id === stylistId);
    return stylist ? stylist.name || stylist.full_name : 'Unknown';
  };

  // Handle adding new appointment
  const handleAddNewClick = () => {
    if (onAddNew) {
      onAddNew();
    } else if (onEdit) {
      onEdit('new', refreshAppointments);
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Apply pagination
  const visibleAppointments = appointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const emptyRows = page > 0 
    ? Math.max(0, (1 + page) * rowsPerPage - appointments.length) 
    : 0;

  // Format currency similar to ServicesTable
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "Rs. 0.00";
    return `Rs. ${new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)}`;
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: "#453C33",
            fontWeight: 600
          }}
        >
          Bridal Appointments
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={refreshAppointments}
            sx={{ 
              borderColor: "rgba(190, 175, 155, 0.5)",
              color: "#BEAF9B",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#BEAF9B",
                backgroundColor: "rgba(190, 175, 155, 0.05)"
              }
            }}
          >
            Refresh List
          </Button>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddNewClick}
            sx={{ 
              backgroundColor: "#BEAF9B", 
              color: "white",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#A89683",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
              }
            }}
          >
            Add New Bridal Appointment
          </Button>
        </Stack>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress sx={{ color: "#BEAF9B" }} />
        </Box>
      ) : (
        <Paper 
          elevation={0}
          sx={{ 
            border: "1px solid rgba(190, 175, 155, 0.2)",
            borderRadius: "8px",
            overflow: "hidden",
            mb: 4
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    Customer
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    Time
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    Services
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    Stylists
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                  >
                    Payment
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                    }}
                    align="center"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleAppointments.length > 0 ? visibleAppointments.map((appt) => {
                  const statusStyle = getStatusColor(appt.appointment_status || 'Scheduled');
                  const paymentStyle = getPaymentColor(appt.payment_status || 'Unpaid');
                  
                  return (
                    <TableRow 
                      key={appt.id} 
                      sx={{
                        ...(editingAppointmentId === appt.id 
                          ? { backgroundColor: 'rgba(190, 175, 155, 0.1)' } 
                          : {}
                        ),
                        '&:nth-of-type(odd)': { backgroundColor: "rgba(190, 175, 155, 0.03)" },
                        '&:hover': { backgroundColor: "rgba(190, 175, 155, 0.1)" },
                        transition: "background-color 0.2s"
                      }}
                    >
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#666"
                        }}
                      >
                        {appt.id}
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif"
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon 
                            fontSize="small" 
                            sx={{ color: "#BEAF9B" }} 
                          />
                          <Typography
                            sx={{ 
                              fontWeight: 500,
                              color: "#453C33",
                              fontFamily: "'Poppins', 'Roboto', sans-serif"
                            }}
                          >
                            {appt.customer_name || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#666"
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EventIcon 
                            fontSize="small" 
                            sx={{ color: "#BEAF9B" }} 
                          />
                          <Typography
                            sx={{ 
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {moment(appt.appointment_date).format('MMM D, YYYY')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#666"
                        }}
                      >
                        {appt.appointment_time}
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#453C33"
                        }}
                      >
                        <Chip 
                          label={appt.services || 'No services'} 
                          size="small"
                          sx={{ 
                            backgroundColor: "rgba(190, 175, 155, 0.2)",
                            color: "#453C33",
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#453C33"
                        }}
                      >
                        {Array.isArray(appt.stylists) 
                          ? appt.stylists.map(s => getStylistName(s)).join(', ')
                          : typeof appt.stylists === 'string' 
                            ? appt.stylists 
                            : getStylistName(appt.stylist_id || appt.stylist)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={appt.appointment_status || 'Scheduled'} 
                          size="small"
                          sx={{ 
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="column" spacing={0.5}>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              fontWeight: 500,
                              color: "#453C33"
                            }}
                          >
                            {formatCurrency(appt.payment_amount)}
                          </Typography>
                          <Chip 
                            label={appt.payment_status || 'Unpaid'} 
                            size="small" 
                            sx={{ 
                              backgroundColor: paymentStyle.bg,
                              color: paymentStyle.color,
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              fontWeight: 500
                            }}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton 
                              onClick={() => handleViewDetailsClick(appt)}
                              disabled={editingAppointmentId !== null}
                              size="small"
                              sx={{ 
                                color: "#BEAF9B",
                                '&:hover': {
                                  backgroundColor: 'rgba(190, 175, 155, 0.1)'
                                }
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Appointment">
                            <IconButton 
                              onClick={() => handleEditClick(appt.id)}
                              disabled={editingAppointmentId !== null}
                              size="small"
                              sx={{ 
                                color: "#BEAF9B",
                                '&:hover': {
                                  backgroundColor: 'rgba(190, 175, 155, 0.1)'
                                }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Appointment">
                            <IconButton 
                              onClick={() => handleDeleteClick(appt.id)}
                              disabled={editingAppointmentId !== null}
                              size="small"
                              sx={{ 
                                color: "#ff6b6b",
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 107, 107, 0.1)'
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography 
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#666"
                        }}
                      >
                        No appointments found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={9} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={appointments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: "1px solid rgba(190, 175, 155, 0.2)",
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: "#666"
              },
              '.MuiTablePagination-select': {
                fontFamily: "'Poppins', 'Roboto', sans-serif",
              },
              '.MuiTablePagination-actions': {
                '& .MuiIconButton-root': {
                  color: "#BEAF9B"
                }
              }
            }}
          />
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: "8px",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }
        }}
      >
        <DialogTitle 
          id="alert-dialog-title"
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 600,
            color: "#453C33"
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText 
            id="alert-dialog-description"
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: "#666"
            }}
          >
            Are you sure you want to delete this bridal appointment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button 
            onClick={handleCancelDelete} 
            sx={{ 
              color: "#666",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained"
            sx={{ 
              backgroundColor: "#ff6b6b",
              color: "white",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#ff5252",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BridalAptTable;