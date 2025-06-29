import React from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  Paper, IconButton, Box, Chip, Typography, TablePagination, Tooltip
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from "@mui/icons-material";

export default function AppointmentsTable({
  appointments = [],
  page = 0,
  rowsPerPage = 5,
  totalItems = 0,
  handleChangePage,
  handleChangeRowsPerPage,
  showDetails,
  handleEditClick,
  handleDeleteClick,
  formatDate,
  formatTime,
  tableSx,
  buttonSx
}) {
  // Apply pagination to the displayed appointments
  const emptyRows = page > 0 
    ? Math.max(0, (1 + page) * rowsPerPage - appointments.length) 
    : 0;

  return (
    <>
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
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
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
                        color: "#666"
                      }}
                    >
                      {appointment.appointment_ID}
                    </TableCell>
                    <TableCell
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        fontWeight: 500,
                        color: "#453C33"
                      }}
                    >
                      {appointment.customer_name}
                    </TableCell>
                    <TableCell
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#453C33"
                      }}
                    >
                      {formatDate(appointment.appointment_date)}
                    </TableCell>
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
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#453C33",
                          fontSize: '0.875rem'
                        }}
                      >
                        {appointment.services}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#453C33"
                      }}
                    >
                      {appointment.stylists}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={appointment.appointment_status}
                        size="small"
                        sx={{ 
                          backgroundColor: getStatusChipColor(appointment.appointment_status),
                          color: getStatusTextColor(appointment.appointment_status),
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={appointment.payment_status}
                        size="small"
                        sx={{ 
                          backgroundColor: getPaymentChipColor(appointment.payment_status),
                          color: getPaymentTextColor(appointment.payment_status),
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            onClick={() => showDetails(appointment.appointment_ID)}
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
                            onClick={() => handleDeleteClick(appointment)}
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
    </>
  );
}

// Helper functions for consistent styling
function getStatusChipColor(status) {
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
}

function getStatusTextColor(status) {
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
}

function getPaymentChipColor(status) {
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
}

function getPaymentTextColor(status) {
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
}