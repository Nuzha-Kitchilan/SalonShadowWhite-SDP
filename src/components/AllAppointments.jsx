import React from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, List, ListItem, ListItemText
} from '@mui/material';
import { motion } from "framer-motion";

const AllAppointments = ({ appointments, handleCancelRequest, setSelectedAppointment, setReviewDialogType }) => {
  const renderAppointmentCard = (apt) => (
    <motion.div
      key={apt.appointment_ID}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        sx={{ 
          p: 3, 
          my: 2, 
          backgroundColor: "#fff", 
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
            transform: "translateY(-4px)",
            transition: "all 0.3s ease"
          }
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: '500', 
                mb: 1, 
                color: "#72614e", 
                borderBottom: "2px solid #b8a99a",
                pb: 1
              }}
            >
              Appointment #{apt.appointment_ID}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <List sx={{ pl: 0 }}>
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Date</Typography>} 
                  secondary={apt.appointment_date} 
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Time</Typography>} 
                  secondary={apt.appointment_time?.substring(0, 5)} 
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Status</Typography>} 
                  secondary={
                    <Chip 
                      label={apt.appointment_status || 'N/A'} 
                      sx={{ 
                        backgroundColor: 
                          apt.appointment_status === 'Completed' ? "#6da58a" : 
                          apt.appointment_status === 'Cancelled' ? "#d47777" :
                          apt.appointment_status === 'Confirmed' ? "#6a8fd5" : "#b8a99a",
                        color: "white",
                        fontWeight: 500,
                        fontSize: "0.75rem"
                      }} 
                    />
                  } 
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Cancellation</Typography>} 
                  secondary={
                    <Chip 
                      label={apt.cancellation_status || 'N/A'} 
                      sx={{ 
                        backgroundColor: 
                          apt.cancellation_status === 'Approved' ? "#6da58a" : 
                          apt.cancellation_status === 'Rejected' ? "#d47777" :
                          apt.cancellation_status === 'Pending' ? "#d9c17a" : "#b8a99a",
                        color: "white",
                        fontWeight: 500,
                        fontSize: "0.75rem"
                      }} 
                    />
                  } 
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Services</Typography>} 
                  secondary={typeof apt.services === 'string' ? apt.services : (Array.isArray(apt.services) ? apt.services.join(', ') : 'None')} 
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Stylists</Typography>} 
                  secondary={
                    typeof apt.stylists === 'string' ? apt.stylists : 
                    Array.isArray(apt.stylists) ? apt.stylists.map(stylist => 
                      typeof stylist === 'object' ? (stylist.name || '') : stylist
                    ).join(', ') : 
                    apt.stylists && typeof apt.stylists === 'object' ? 
                      (apt.stylists.name || '') : 
                      'None'
                  } 
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ backgroundColor: "#f9f7f4", p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1, color: "#72614e" }}>
                Payment Information
              </Typography>
              {apt.payment ? (
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Amount</Typography>} 
                      secondary={`$${apt.payment.payment_amount}`} 
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Paid</Typography>} 
                      secondary={`$${apt.payment.amount_paid || 0}`} 
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Status</Typography>} 
                      secondary={
                        <Chip 
                          label={apt.payment.payment_status || 'N/A'} 
                          sx={{ 
                            backgroundColor: 
                              apt.payment.payment_status === 'Paid' ? "#6da58a" : 
                              apt.payment.payment_status === 'Unpaid' ? "#d47777" :
                              apt.payment.payment_status === 'Partial' ? "#d9c17a" : "#b8a99a",
                            color: "white",
                            fontWeight: 500,
                            fontSize: "0.75rem"
                          }} 
                        />
                      } 
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Type</Typography>} 
                      secondary={apt.payment.payment_type || 'N/A'} 
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Date</Typography>} 
                      secondary={
                        apt.payment.payment_date ? new Date(apt.payment.payment_date).toLocaleString() : 'N/A'
                      } 
                    />
                  </ListItem>
                </List>
              ) : (
                <Typography sx={{ fontStyle: 'italic', color: '#999' }}>No payment information available.</Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {apt.cancellation_status === 'None' && apt.appointment_status !== 'Cancelled' && (
                <Button 
                  variant="outlined" 
                  sx={{ 
                    color: "#d47777", 
                    borderColor: "#d47777",
                    "&:hover": {
                      backgroundColor: "rgba(212, 119, 119, 0.08)",
                      borderColor: "#c05555"
                    }
                  }} 
                  onClick={() => handleCancelRequest(apt.appointment_ID)}
                >
                  Request Cancellation
                </Button>
              )}

              {apt.appointment_status === 'Completed' && !apt.has_review && (
                <>
                  <Button 
                    variant="outlined"
                    sx={{ 
                      color: "#b8a99a", 
                      borderColor: "#b8a99a",
                      "&:hover": {
                        backgroundColor: "rgba(184, 169, 154, 0.08)",
                        borderColor: "#a89987"
                      }
                    }}
                    onClick={() => {
                      setSelectedAppointment(apt);
                      setReviewDialogType('general');
                    }}
                  >
                    Review Experience
                  </Button>
                  {(apt.stylist_ID || apt.stylist_IDs || (apt.stylists && apt.stylists.length > 0)) && (
                    <Button 
                      variant="contained"
                      sx={{ 
                        backgroundColor: "#b8a99a",
                        "&:hover": {
                          backgroundColor: "#a89987"
                        }
                      }}
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setReviewDialogType('stylist');
                      }}
                    >
                      Review Stylist
                    </Button>
                  )}
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );

  return (
    <Box>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          color: "#72614e", 
          fontWeight: 500,
          borderBottom: "2px solid #b8a99a",
          pb: 1,
          display: "inline-block"
        }}
      >
        All Appointments & Payments
      </Typography>
      {appointments.length === 0 ? (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            backgroundColor: "#fff",
            borderRadius: 2
          }}
        >
          <Typography sx={{ color: "#999", fontStyle: 'italic' }}>
            No appointments found.
          </Typography>
        </Paper>
      ) : (
        appointments.map(apt => renderAppointmentCard(apt))
      )}
    </Box>
  );
};

export default AllAppointments;