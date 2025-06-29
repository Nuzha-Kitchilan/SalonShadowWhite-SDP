
import React from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  Paper, IconButton, Chip, Box, Typography, Tooltip, TablePagination,
  CircularProgress
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from "@mui/icons-material";

export default function AppointmentsTable({
  appointments = [],
  loading = false,
  page = 0,
  rowsPerPage = 5,
  totalItems = 0,
  handleChangePage,
  handleChangeRowsPerPage,
  handleViewAppointment,
  handleEditClick,
  handleDeleteAppointment,
  formatTime,
  getRemainingAmount,
  tableSx,
  buttonSx
}) {
  // Format currency as Rs.
  const formatCurrency = (price) => {
    if (price === undefined || price === null) return "Rs. 0.00";
    return `Rs. ${new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)}`;
  };

  const renderServicesAndStylists = (data) => {
    if (!data) return <Typography variant="body2" color="textSecondary">N/A</Typography>;

    if (Array.isArray(data)) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {data.map((item, index) => (
            <Chip
              key={index}
              label={typeof item === 'object' ? item.service_name || item.name : item}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(190, 175, 155, 0.15)', 
                color: '#453C33',
                fontFamily: "'Poppins', 'Roboto', sans-serif",
              }}
            />
          ))}
        </Box>
      );
    }

    if (typeof data === 'string') {
      const items = data.split(',').map(item => item.trim()).filter(item => item);
      if (items.length === 0) return <Typography variant="body2" color="textSecondary">N/A</Typography>;

      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {items.map((item, index) => (
            <Chip
              key={index}
              label={item}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(190, 175, 155, 0.15)', 
                color: '#453C33',
                fontFamily: "'Poppins', 'Roboto', sans-serif",
              }}
            />
          ))}
        </Box>
      );
    }

    if (typeof data === 'object') {
      return (
        <Chip
          label={data.service_name || data.name || `${data.firstname} ${data.lastname}` || 'N/A'}
          size="small"
          sx={{ 
            backgroundColor: 'rgba(190, 175, 155, 0.15)', 
            color: '#453C33',
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}
        />
      );
    }

    return <Typography variant="body2" color="textSecondary">N/A</Typography>;
  };

  // Apply pagination to the displayed appointments
  const emptyRows = page > 0 
    ? Math.max(0, (1 + page) * rowsPerPage - appointments.length) 
    : 0;

  // Helper functions for consistent styling
  const getStatusChipColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'rgba(102, 187, 106, 0.2)'; 
      case 'completed':
        return 'rgba(33, 150, 243, 0.2)'; 
      case 'cancelled':
        return 'rgba(244, 67, 54, 0.15)'; 
      case 'pending':
        return 'rgba(255, 170, 90, 0.2)'; 
      case 'no-show':
        return 'rgba(158, 158, 158, 0.2)'; 
      default:
        return 'rgba(190, 175, 155, 0.2)'; 
    }
  };

  const getStatusTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return '#2e7d32'; 
      case 'completed':
        return '#0d47a1'; 
      case 'cancelled':
        return '#b71c1c'; 
      case 'pending':
        return '#e65100'; 
      case 'no-show':
        return '#424242'; 
      default:
        return '#453C33'; 
    }
  };

  const getPaymentChipColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'rgba(102, 187, 106, 0.2)'; 
      case 'pending':
        return 'rgba(255, 170, 90, 0.2)'; 
      case 'refunded':
        return 'rgba(33, 150, 243, 0.2)'; 
      case 'failed':
        return 'rgba(244, 67, 54, 0.15)'; 
      default:
        return 'rgba(190, 175, 155, 0.2)'; 
    }
  };

  const getPaymentTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return '#2e7d32'; 
      case 'pending':
        return '#e65100'; 
      case 'refunded':
        return '#0d47a1'; 
      case 'failed':
        return '#b71c1c'; 
      default:
        return '#453C33'; 
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        border: "1px solid rgba(190, 175, 155, 0.2)",
        borderRadius: "8px",
        overflow: "hidden",
        mb: 4,
        ...tableSx
      }}
    >
      <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
        <Table stickyHeader>
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
                Stylist
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
                Total
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                }}
              >
                Paid
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                }}
              >
                Balance
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
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress sx={{ color: "#BEAF9B" }} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : appointments.length > 0 ? (
              appointments.map(appointment => (
                <TableRow 
                  key={appointment.appointment_ID} 
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: "rgba(190, 175, 155, 0.03)" },
                    '&:hover': { backgroundColor: "rgba(190, 175, 155, 0.1)" },
                    transition: "background-color 0.2s"
                  }}
                >
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      color: "#453C33"
                    }}
                  >
                    {formatTime(appointment.appointment_time)}
                  </TableCell>
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif"
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        fontWeight: 500,
                        color: "#453C33"
                      }}
                    >
                      {appointment.customer_name || 'N/A'}
                    </Typography>
                    {appointment.customer_phone && (
                      <Typography 
                        variant="caption" 
                        color="textSecondary" 
                        display="block"
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#666"
                        }}
                      >
                        {appointment.customer_phone}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif"
                    }}
                  >
                    {renderServicesAndStylists(appointment.services)}
                  </TableCell>
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif"
                    }}
                  >
                    {renderServicesAndStylists(appointment.stylists)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.appointment_status || 'N/A'}
                      size="small"
                      sx={{ 
                        backgroundColor: getStatusChipColor(appointment.appointment_status),
                        color: getStatusTextColor(appointment.appointment_status),
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        fontWeight: 500,
                        minWidth: 80
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      color: "#453C33"
                    }}
                  >
                    {formatCurrency(appointment.payment_amount)}
                  </TableCell>
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      color: "#453C33"
                    }}
                  >
                    {formatCurrency(appointment.amount_paid || 0)}
                  </TableCell>
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      color: "#453C33"
                    }}
                  >
                    {formatCurrency(getRemainingAmount(appointment.payment_amount, appointment.amount_paid))}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.payment_status || 'Pending'}
                      size="small"
                      sx={{ 
                        backgroundColor: getPaymentChipColor(appointment.payment_status),
                        color: getPaymentTextColor(appointment.payment_status),
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        fontWeight: 500,
                        minWidth: 80
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          onClick={() => handleViewAppointment(appointment)}
                          sx={buttonSx?.view || { color: "#BEAF9B" }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Appointment">
                        <IconButton 
                          onClick={() => handleEditClick(appointment)}
                          sx={buttonSx?.edit || { color: "#BEAF9B" }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Appointment">
                        <IconButton 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this appointment?')) {
                              handleDeleteAppointment(appointment.appointment_ID);
                            }
                          }}
                          sx={buttonSx?.delete || { color: "#ff6b6b" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
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
                <TableCell colSpan={10} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalItems}
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
  );
}
