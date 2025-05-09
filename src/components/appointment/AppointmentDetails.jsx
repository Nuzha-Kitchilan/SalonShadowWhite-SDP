import React from 'react';
import {
  Dialog, DialogContent, DialogActions, Box,
  Typography, Button, IconButton, Divider, Chip
} from "@mui/material";
import { Close as CloseIcon, Edit } from "@mui/icons-material";

export default function AppointmentDetailsModal({
  showDetailsModal,
  setShowDetailsModal,
  selectedAppointment,
  handleEditClick,
  formatDate
}) {
  if (!selectedAppointment) return null;

  // Helper function to determine status chip color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return { bg: '#4caf50', color: '#fff' };
      case 'completed': return { bg: '#2196f3', color: '#fff' };
      case 'cancelled': return { bg: '#f44336', color: '#fff' };
      case 'pending': return { bg: '#ff9800', color: '#fff' };
      default: return { bg: '#BEAF9B', color: '#fff' };
    }
  };

  const statusColor = getStatusColor(selectedAppointment.appointment_status);
  const paymentStatusColor = selectedAppointment.payment_status?.toLowerCase() === 'paid' 
    ? { bg: '#4caf50', color: '#fff' }
    : { bg: '#ff9800', color: '#fff' };

  return (
    <Dialog 
      open={showDetailsModal} 
      onClose={() => setShowDetailsModal(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(190, 175, 155, 0.25)",
          background: "linear-gradient(to right, #f9f5f0, #ffffff)",
          border: "1px solid rgba(190, 175, 155, 0.3)",
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: "16px 24px", 
        borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
        background: "linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(190, 175, 155, 0.05))"
      }}>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 500, 
            color: "#453C33",
            fontFamily: "'Poppins', 'Roboto', sans-serif"
          }}
        >
          Appointment Details
        </Typography>
        <IconButton 
          onClick={() => setShowDetailsModal(false)}
          sx={{
            color: "#BEAF9B",
            "&:hover": {
              backgroundColor: "rgba(190, 175, 155, 0.1)",
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <DialogContent sx={{ p: 3 }}>
        {/* Appointment Header with Status */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 500, 
              color: "#453C33",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}>
              {selectedAppointment.customer_name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {formatDate(selectedAppointment.appointment_date)} • {selectedAppointment.appointment_time?.substring(0, 5)}
            </Typography>
          </Box>
          <Chip 
            label={selectedAppointment.appointment_status} 
            sx={{ 
              backgroundColor: statusColor.bg, 
              color: statusColor.color,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 500,
              fontSize: "0.875rem",
              height: "28px"
            }} 
          />
        </Box>

        <Divider sx={{ my: 2, borderColor: "rgba(190, 175, 155, 0.2)" }} />
        
        {/* Main Content Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          {/* Customer Information */}
          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                marginBottom: "16px",
                color: "#453C33",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                paddingBottom: "8px"
              }}
            >
              Customer Information
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#453C33" }}>
                  {selectedAppointment.customer_email || 'N/A'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Phone
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#453C33" }}>
                  {selectedAppointment.customer_phone || 'N/A'}
                </Typography>
              </Box>
              
              {selectedAppointment.is_first_time && (
                <Chip 
                  label="First Time Customer" 
                  size="small"
                  sx={{ 
                    mt: 1, 
                    alignSelf: "flex-start",
                    backgroundColor: "#BEAF9B", 
                    color: "white",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    fontSize: "0.75rem"
                  }}
                />
              )}
            </Box>
          </Box>
          
          {/* Services & Stylists */}
          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                marginBottom: "16px",
                color: "#453C33",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                paddingBottom: "8px"
              }}
            >
              Services & Stylists
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Services
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontWeight: 500, 
                  color: "#453C33",
                  padding: "8px 12px",
                  backgroundColor: "rgba(190, 175, 155, 0.05)",
                  borderRadius: "4px",
                  border: "1px solid rgba(190, 175, 155, 0.1)",
                }}>
                  {selectedAppointment.services}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Stylists
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontWeight: 500, 
                  color: "#453C33" 
                }}>
                  {selectedAppointment.stylists}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Appointment Details */}
          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                marginBottom: "16px",
                color: "#453C33",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                paddingBottom: "8px"
              }}
            >
              Appointment Details
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Date & Time
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#453C33" }}>
                  {formatDate(selectedAppointment.appointment_date)} at {selectedAppointment.appointment_time?.substring(0, 5)}
                </Typography>
              </Box>
              
              {selectedAppointment.cancellation_status && (
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                    Cancellation
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontWeight: 500, 
                    color: "#d32f2f",
                    padding: "4px 8px",
                    backgroundColor: "rgba(211, 47, 47, 0.05)",
                    borderRadius: "4px",
                    border: "1px solid rgba(211, 47, 47, 0.1)",
                    display: "inline-block"
                  }}>
                    {selectedAppointment.cancellation_status}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          {/* Payment Information */}
          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                marginBottom: "16px",
                color: "#453C33",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                paddingBottom: "8px"
              }}
            >
              Payment Information
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                    Total Amount
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: "#453C33", fontSize: "1.1rem" }}>
                    ${selectedAppointment.payment_amount || '0'}
                  </Typography>
                </Box>
                <Chip 
                  label={selectedAppointment.payment_status || 'Pending'} 
                  sx={{ 
                    backgroundColor: paymentStatusColor.bg, 
                    color: paymentStatusColor.color,
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    fontWeight: 500
                  }}
                />
              </Box>
              
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Amount Paid
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#453C33" }}>
                  ${selectedAppointment.amount_paid || '0'}
                  {selectedAppointment.is_partial && (
                    <Chip 
                      label="Partial" 
                      size="small"
                      sx={{ 
                        ml: 1, 
                        backgroundColor: "rgba(255, 152, 0, 0.1)", 
                        color: "#ff9800",
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        fontSize: "0.7rem",
                        height: "20px"
                      }}
                    />
                  )}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Payment Details
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#453C33" }}>
                  {selectedAppointment.payment_type || 'Pay at Salon'}
                  {selectedAppointment.payment_date && ` • ${formatDate(selectedAppointment.payment_date)}`}
                </Typography>
              </Box>
              
              {selectedAppointment.payment_ID && (
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                    Payment ID
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontWeight: 500, 
                    color: "#453C33",
                    fontSize: "0.85rem",
                    fontFamily: "monospace"
                  }}>
                    {selectedAppointment.payment_ID}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        padding: "16px 24px", 
        borderTop: "1px dashed rgba(190, 175, 155, 0.3)",
        background: "linear-gradient(to right, rgba(190, 175, 155, 0.05), rgba(190, 175, 155, 0.02))"
      }}>
        <Button 
          onClick={() => {
            handleEditClick(selectedAppointment);
            setShowDetailsModal(false);
          }}
          variant="contained"
          startIcon={<Edit />}
          sx={{ 
            backgroundColor: "#BEAF9B", 
            color: "white", 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            '&:hover': { 
              backgroundColor: "#A89583",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(190, 175, 155, 0.4)"
            } 
          }}
        >
          Edit Appointment
        </Button>
        <Button 
          onClick={() => setShowDetailsModal(false)}
          sx={{ 
            color: "#453C33", 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            '&:hover': { 
              backgroundColor: "rgba(190, 175, 155, 0.1)" 
            } 
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}