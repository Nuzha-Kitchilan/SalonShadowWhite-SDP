import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, CircularProgress,
  Snackbar, Alert, Tabs, Tab, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Rating, Container
} from '@mui/material';
import { motion } from "framer-motion";
import axios from '../utils/axiosWithAuth';
import profileHeaderImage from '../assets/ProfileHeader.png';
import AllAppointments from '../components/AllAppointments';
import UpcomingAppointments from '../components/UpcomingAppointments';
import SpecialRequests from '../components/SpecialRequests';
import CustomerProfileManagement from '../components/ProfileManagement';

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [specialRequests, setSpecialRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Review dialog states
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewDialogType, setReviewDialogType] = useState(null);
  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/customers/profile');
      const customer = res.data;
      if (!customer || !customer.customer_ID) throw new Error("Invalid profile data");
      setProfile(customer);
      return customer.customer_ID;
    } catch (err) {
      setSnackbar({ open: true, message: 'Unauthorized. Please login again.', severity: 'error' });
    }
  };

  const filterUpcomingAppointments = (allAppointments) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return allAppointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate >= today && apt.appointment_status !== 'Cancelled';
    });
  };

  const fetchAppointmentsWithPayments = async (customerId) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/appointment/customer/${customerId}`);
      const appointmentsList = res.data.data || [];
      const appointmentsWithPayments = await Promise.all(
        appointmentsList.map(async (appointment) => {
          try {
            const paymentRes = await axios.get(`http://localhost:5001/api/payment/appointment-payment/${appointment.appointment_ID}`);
            return {
              ...appointment,
              payment: paymentRes.data.paymentDetails[0] || null
            };
          } catch {
            return { ...appointment, payment: null };
          }
        })
      );
      setAppointments(appointmentsWithPayments);
      setUpcomingAppointments(filterUpcomingAppointments(appointmentsWithPayments));
    } catch {
      setSnackbar({ open: true, message: 'Failed to fetch appointments data.', severity: 'error' });
    }
  };

  const fetchSpecialRequests = async (customerId) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/specialRequest/customer-requests`);
      setSpecialRequests(res.data.requests || []);
    } catch {
      setSnackbar({ open: true, message: 'Failed to fetch special requests.', severity: 'error' });
    }
  };

  const handleCancelRequest = async (appointmentId) => {
  try {
    await axios.post(`http://localhost:5001/api/appointment/cancel-request/${appointmentId}`);
    
    setSnackbar({
      open: true,
      message: 'Cancellation request sent.',
      severity: 'success',
    });

    if (profile) {
      await fetchAppointmentsWithPayments(profile.customer_ID);
    }

  } catch (error) {
    const backendMessage = error?.response?.data?.message;

    setSnackbar({
      open: true,
      message: backendMessage || 'An unexpected error occurred while sending the cancellation request.',
      severity: 'error',
    });
  }
};


  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    const loadData = async () => {
      const customerId = await fetchProfile();
      if (customerId) {
        await Promise.all([
          fetchAppointmentsWithPayments(customerId),
          fetchSpecialRequests(customerId)
        ]);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const getStylistName = (apt) => {
    if (!apt) return '';
    
    if (apt.stylist_name) return apt.stylist_name;
    
    // Check stylists array
    if (Array.isArray(apt.stylists) && apt.stylists.length > 0) {
      const stylist = apt.stylists[0];
      return stylist.name || '';
    }
    
    // Check if stylists is a single object
    if (apt.stylists && typeof apt.stylists === 'object' && apt.stylists.name) {
      return apt.stylists.name;
    }
    
    return 'Stylist';
  };

  const handleSubmitReview = async () => {
    try {
      const response = await axios.post(
        `/review/appointment/${selectedAppointment.appointment_ID}`,
        {
          rating: reviewRating,
          comment: reviewComment,
          stylistId: reviewDialogType === 'stylist' ? 
            (selectedAppointment.stylist_ID || 
             selectedAppointment.stylist_IDs || 
             (selectedAppointment.stylists && selectedAppointment.stylists[0]?.id)) : null
        }
      );

      setSnackbar({
        open: true,
        message: 'Review submitted successfully!',
        severity: 'success'
      });
      setReviewDialogType(null);
      setReviewRating(0);
      setReviewComment('');
      fetchAppointmentsWithPayments(profile.customer_ID);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Failed to submit review',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          bgcolor: "#faf5f0" 
        }}
      >
        <CircularProgress sx={{ color: "#b8a99a" }} />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        width: "100%", 
        maxWidth: "100%", 
        minHeight: "100vh",
        bgcolor: "#faf5f0",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none"
      }}
    >
      {/* Header Section */}
      <Box sx={{ 
        width: "100%", 
        position: "relative", 
        overflow: "hidden",
        height: { xs: '180px', sm: '300px', md: '400px' },
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}>
        <Box
          sx={{
            backgroundImage: `url(${profileHeaderImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            display: "flex",
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: "center",
            position: "relative",
            pt: { xs: 2, sm: 0 },
            '&::before': {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 0
            },
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            
          </motion.div>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5, px: { xs: 2, sm: 3 } }}>
        {/* Personal Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              backgroundColor: "#b8a99a",
              color: "white"
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 500, mb: 3 }}>Personal Information</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography sx={{ fontWeight: 'bold' }}>Name</Typography>
                <Typography variant="h6">{profile?.firstname} {profile?.lastname}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ fontWeight: 'bold' }}>Email</Typography>
                <Typography variant="h6">{profile?.email}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ fontWeight: 'bold' }}>Username</Typography>
                <Typography variant="h6">{profile?.username}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Tabs Section */}
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{ 
              mb: 3, 
              '& .MuiTabs-indicator': { 
                backgroundColor: "#b8a99a",
                height: 3
              },
              '& .MuiTab-root': { 
                color: "#72614e",
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                '&.Mui-selected': {
                  color: "#b8a99a"
                }
              }
            }}
          >
            <Tab label="All Appointments" />
            <Tab label="Upcoming Appointments" />
            <Tab label="Special Requests" />
            <Tab label="Edit Profile" />
          </Tabs>

          {/* Tab Content - Using imported components */}
          {activeTab === 0 && (
            <AllAppointments 
              appointments={appointments} 
              handleCancelRequest={handleCancelRequest}
              setSelectedAppointment={setSelectedAppointment}
              setReviewDialogType={setReviewDialogType}
            />
          )}

          {activeTab === 1 && (
            <UpcomingAppointments 
              upcomingAppointments={upcomingAppointments} 
              handleCancelRequest={handleCancelRequest}
              setSelectedAppointment={setSelectedAppointment}
              setReviewDialogType={setReviewDialogType}
            />
          )}

          {activeTab === 2 && (
            <SpecialRequests 
              specialRequests={specialRequests} 
            />
          )}

          {/* Profile Management Tab */}
          {activeTab === 3 && (
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
                Profile Management
              </Typography>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CustomerProfileManagement />
              </motion.div>
            </Box>
          )}
        </Box>
      </Container>

      {/* Review Dialog */}
      <Dialog 
        open={!!reviewDialogType} 
        onClose={() => setReviewDialogType(null)}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            backgroundColor: "#faf5f0",
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: "#b8a99a", color: "white", fontWeight: 500 }}>
          {reviewDialogType === 'stylist' 
            ? `Review Stylist: ${getStylistName(selectedAppointment)}`
            : 'Review Your Experience'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mr: 2, color: "#72614e", fontWeight: 500 }}>
              Rating:
            </Typography>
            <Rating
              value={reviewRating}
              onChange={(e, newValue) => setReviewRating(newValue)}
              size="large"
              sx={{ 
                color: "#b8a99a",
                '& .MuiRating-iconEmpty': {
                  color: "#e0d9d0"
                }
              }}
            />
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your feedback"
            placeholder={
              reviewDialogType === 'stylist'
                ? `What did you like about ${getStylistName(selectedAppointment)}'s service?`
                : "How was your overall experience at our salon?"
            }
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#d0c7bc',
                },
                '&:hover fieldset': {
                  borderColor: '#b8a99a',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#b8a99a',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#72614e',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box 
              onClick={() => setReviewDialogType(null)}
              sx={{ 
                color: "#72614e", 
                cursor: 'pointer',
                py: 1,
                px: 2
              }}
            >
              Cancel
            </Box>
            <Box 
              onClick={handleSubmitReview} 
              sx={{ 
                backgroundColor: reviewRating === 0 ? "#e0d9d0" : "#b8a99a",
                color: "white",
                cursor: reviewRating === 0 ? 'not-allowed' : 'pointer',
                borderRadius: 1,
                py: 1,
                px: 2,
                "&:hover": {
                  backgroundColor: reviewRating === 0 ? "#e0d9d0" : "#a89987"
                }
              }}
            >
              Submit Review
            </Box>
          </Box>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity} 
          variant="filled" 
          sx={{ 
            bgcolor: snackbar.severity === 'success' ? "#6da58a" : 
                    snackbar.severity === 'error' ? "#d47777" : 
                    snackbar.severity === 'warning' ? "#d9c17a" : "#6a8fd5"
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Global Styles */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html, body {
          overflow-x: hidden;
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
          background-color: #faf5f0;
        }
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          scrollbar-width: none;
        }
        .MuiBox-root {
          max-width: 100%;
        }
      `}</style>
    </Box>
  );
};

export default CustomerProfile;