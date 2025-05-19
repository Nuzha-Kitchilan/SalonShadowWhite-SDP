import React from 'react';
import {
  Dialog, DialogContent, DialogActions, Box,
  Typography, Button, IconButton, Divider, Chip
} from "@mui/material";
import { Close as CloseIcon, Edit, CalendarToday, Notes, PersonAdd } from "@mui/icons-material";

export default function BridalAppointmentDetailsModal({
  showDetailsModal,
  setShowDetailsModal,
  selectedAppointment,
  handleEditClick,
  formatDate
}) {
  if (!selectedAppointment) return null;

  // Enhanced phone number handling - debug the selected appointment object
  console.log("Selected Appointment Data:", selectedAppointment);

  // Helper function to get phone number from multiple possible sources
  const getPhoneNumber = (appointment) => {
    // Check all possible phone number fields, including nested properties
    const possiblePhoneFields = [
      appointment.customer_phones,
      // Add any other potential phone field names
    ];
    
    // Find the first non-empty phone value
    const phone = possiblePhoneFields.find(p => p && String(p).trim() !== '');
    
    return phone ? String(phone).trim() : 'N/A';
  };

  // Helper function to determine status chip color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return { bg: '#4caf50', color: '#fff' };
      case 'completed': return { bg: '#2196f3', color: '#fff' };
      case 'cancelled': return { bg: '#f44336', color: '#fff' };
      case 'pending': return { bg: '#ff9800', color: '#fff' };
      case 'scheduled': return { bg: '#9c27b0', color: '#fff' };
      default: return { bg: '#BEAF9B', color: '#fff' };
    }
  };

  const statusColor = getStatusColor(selectedAppointment.appointment_status);
  const paymentStatusColor = selectedAppointment.payment_status?.toLowerCase() === 'paid' 
    ? { bg: '#4caf50', color: '#fff' }
    : { bg: '#ff9800', color: '#fff' };

  // Determine if this is a first-time customer
  const isFirstTimeCustomer = selectedAppointment.is_first_time || false;

  // Wedding date info
  const weddingDate = selectedAppointment.wedding_date ? formatDate(selectedAppointment.wedding_date) : 'Not specified';
  const daysUntilWedding = selectedAppointment.wedding_date ? calculateDaysUntilWedding(selectedAppointment.wedding_date) : null;

  // Calculate days until wedding
  function calculateDaysUntilWedding(weddingDateStr) {
    if (!weddingDateStr) return null;
    
    const today = new Date();
    const weddingDate = new Date(weddingDateStr);
    const diffTime = weddingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              fontWeight: 500, 
              color: "#453C33",
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            }}
          >
            Bridal Appointment Details
          </Typography>
          {daysUntilWedding !== null && daysUntilWedding > 0 && (
            <Chip 
              label={`${daysUntilWedding} days until wedding`}
              size="small"
              icon={<CalendarToday fontSize="small" />}
              sx={{ 
                ml: 2,
                backgroundColor: "#e91e63", 
                color: "white",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontSize: "0.75rem"
              }}
            />
          )}
        </Box>
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
              {selectedAppointment.customer_name || 'Bride'}
              {selectedAppointment.bride_name && selectedAppointment.bride_name !== selectedAppointment.customer_name && (
                <Typography component="span" sx={{ color: "#9c27b0", ml: 1, fontWeight: 400 }}>
                  ({selectedAppointment.bride_name})
                </Typography>
              )}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {formatDate(selectedAppointment.appointment_date)} • {selectedAppointment.appointment_time?.substring(0, 5)}
            </Typography>
          </Box>
          <Chip 
            label={selectedAppointment.appointment_status || 'Scheduled'} 
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
        <Box sx={{ display: 'grid', gridTemplateColumns: {xs: '1fr', md: '1fr 1fr'}, gap: 3 }}>
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
              Bride Information
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#453C33" }}>
                  {selectedAppointment.customer_email || selectedAppointment.bride_email || 'N/A'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Phone
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#453C33" }}>
                  {getPhoneNumber(selectedAppointment)}
                </Typography>
              </Box>
              
              {isFirstTimeCustomer && (
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    icon={<PersonAdd fontSize="small" />}
                    label="First Time Customer" 
                    size="small"
                    sx={{ 
                      backgroundColor: "#9c27b0", 
                      color: "white",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      fontSize: "0.75rem"
                    }}
                  />
                </Box>
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
              Bridal Services & Stylists
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Bridal Package
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontWeight: 500, 
                  color: "#453C33",
                  padding: "8px 12px",
                  backgroundColor: "rgba(190, 175, 155, 0.05)",
                  borderRadius: "4px",
                  border: "1px solid rgba(190, 175, 155, 0.1)",
                }}>
                  {selectedAppointment.bridal_package || selectedAppointment.package || selectedAppointment.services || 'Standard Bridal Package'}
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
                  {Array.isArray(selectedAppointment.stylists) 
                    ? selectedAppointment.stylists.join(', ')
                    : typeof selectedAppointment.stylists === 'string' 
                      ? selectedAppointment.stylists 
                      : (selectedAppointment.stylist_name || selectedAppointment.stylist || 'N/A')}
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

              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Appointment Type
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#453C33" }}>
                  {selectedAppointment.appointment_type || 'Bridal Consultation'}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Payment Information */}
          <Box sx={{ gridColumn: {xs: '1', md: 'span 2'} }}>
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
            
            <Box sx={{ display: "grid", gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr'}, gap: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                      Total Package Amount
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: "#453C33", fontSize: "1.1rem" }}>
                      Rs.{selectedAppointment.payment_amount || selectedAppointment.total_amount || '0'}
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
                    Rs.{selectedAppointment.amount_paid || '0'}
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
              </Box>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                    Payment Method
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "#453C33" }}>
                    {selectedAppointment.payment_type || selectedAppointment.payment_method || 'Pay at Salon'}
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
                      {selectedAppointment.payment_ID || selectedAppointment.transaction_id}
                    </Typography>
                  </Box>
                )}

              </Box>
            </Box>
          </Box>

          {/* Additional Notes - spans full width if present */}
          {(selectedAppointment.notes || selectedAppointment.special_requests) && (
            <Box sx={{ gridColumn: {xs: '1', md: '1 / span 2'} }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  marginBottom: "16px",
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                  paddingBottom: "8px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Notes sx={{ mr: 1, fontSize: "1rem", color: "#9c27b0" }} />
                Notes & Special Requests
              </Typography>
              
              <Typography variant="body1" sx={{ 
                fontWeight: 400, 
                color: "#453C33",
                padding: "12px 16px",
                backgroundColor: "rgba(190, 175, 155, 0.05)",
                borderRadius: "4px",
                border: "1px solid rgba(190, 175, 155, 0.1)",
                fontStyle: "italic"
              }}>
                {selectedAppointment.notes || selectedAppointment.special_requests}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        padding: "16px 24px", 
        borderTop: "1px dashed rgba(190, 175, 155, 0.3)",
        background: "linear-gradient(to right, rgba(190, 175, 155, 0.05), rgba(190, 175, 155, 0.02))"
      }}>
        <Button 
          onClick={() => {
            handleEditClick(selectedAppointment.id || selectedAppointment.appointment_id);
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