// import React, { useEffect, useState } from 'react';
// import {
//   Box, Typography, Paper, Divider, Grid, Button, CircularProgress,
//   Chip, Snackbar, Alert
// } from '@mui/material';
// import axios from '../utils/axiosWithAuth'; // Use the custom Axios instance

// const CustomerProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//   const fetchProfile = async () => {
//     try {
//       const res = await axios.get('http://localhost:5001/api/customers/profile');
//       console.log("👀 Profile response:", res.data);
//       const customer = res.data;
//       if (!customer || !customer.customer_ID) throw new Error("Invalid profile data");
//       setProfile(customer);
//       return customer.customer_ID;
//     } catch (err) {
//       console.error('Error fetching profile:', err);
//       setSnackbar({ open: true, message: 'Unauthorized. Please login again.', severity: 'error' });
//     }
//   };

//   const fetchAppointmentsWithPayments = async (customerId) => {
//     try {
//       // First fetch all appointments
//       const appointmentsRes = await axios.get(`http://localhost:5001/api/appointment/customer/${customerId}`);
//       const appointmentsList = appointmentsRes.data.data || [];
      
//       // Now fetch payment details for each appointment and combine them
//       const appointmentsWithPayments = await Promise.all(
//         appointmentsList.map(async (appointment) => {
//           try {
//             const paymentRes = await axios.get(`http://localhost:5001/api/payment/appointment-payment/${appointment.appointment_ID}`);
//             return {
//               ...appointment,
//               payment: paymentRes.data.paymentDetails[0] || null
//             };
//           } catch (error) {
//             console.error(`Error fetching payment for appointment ${appointment.appointment_ID}:`, error);
//             return {
//               ...appointment,
//               payment: null
//             };
//           }
//         })
//       );
      
//       setAppointments(appointmentsWithPayments);
//     } catch (err) {
//       console.error('Error fetching appointments with payments:', err);
//       setSnackbar({ open: true, message: 'Failed to fetch appointments data.', severity: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelRequest = async (appointmentId) => {
//     try {
//       await axios.post(`http://localhost:5001/api/appointment/cancel-request/${appointmentId}`);
//       setSnackbar({ open: true, message: 'Cancellation request sent.', severity: 'success' });
//       if (profile) fetchAppointmentsWithPayments(profile.customer_ID);
//     } catch (err) {
//       console.error('Cancel request error:', err);
//       setSnackbar({ open: true, message: 'Failed to send cancel request.', severity: 'error' });
//     }
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       const customerId = await fetchProfile();
//       if (customerId) {
//         await fetchAppointmentsWithPayments(customerId);
//       }
//     };
//     loadData();
//   }, []);

//   if (loading) return <Box textAlign="center"><CircularProgress /></Box>;

//   return (
//     <Box p={4}>
//       <Typography variant="h4" gutterBottom>My Profile</Typography>

//       {/* Personal Information */}
//       <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
//         <Typography variant="h6">Personal Information</Typography>
//         <Divider sx={{ my: 1 }} />
//         <Typography><strong>Name:</strong> {profile?.firstname} {profile?.lastname}</Typography>
//         <Typography><strong>Email:</strong> {profile?.email}</Typography>
//         <Typography><strong>Username:</strong> {profile?.username}</Typography>
//       </Paper>

//       {/* Appointments with Payment Information */}
//       <Paper elevation={3} sx={{ p: 3 }}>
//         <Typography variant="h6">Appointments & Payments</Typography>
//         <Divider sx={{ my: 1 }} />
//         {appointments.length === 0 ? (
//           <Typography>No appointments found.</Typography>
//         ) : (
//           appointments.map((apt) => (
//             <Paper key={apt.appointment_ID} sx={{ p: 2, my: 2, backgroundColor: "#f9f9f9" }}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
//                     Appointment #{apt.appointment_ID}
//                   </Typography>
//                 </Grid>
                
//                 {/* Appointment Details */}
//                 <Grid item xs={12} sm={6}>
//                   <Typography><strong>Date:</strong> {apt.appointment_date}</Typography>
//                   <Typography><strong>Time:</strong> {apt.appointment_time?.substring(0, 5)}</Typography>
//                   <Typography><strong>Status:</strong> <Chip label={apt.appointment_status} /></Typography>
//                   <Typography><strong>Cancellation:</strong> <Chip label={apt.cancellation_status} color={
//                     apt.cancellation_status === 'Approved' ? 'success' :
//                       apt.cancellation_status === 'Requested' ? 'warning' :
//                         apt.cancellation_status === 'Rejected' ? 'error' : 'default'
//                   } /></Typography>
//                   <Typography><strong>Services:</strong> {apt.services}</Typography>
//                   <Typography><strong>Stylists:</strong> {apt.stylists}</Typography>
//                 </Grid>
                
//                 {/* Payment Details */}
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2">Payment Information</Typography>
//                   {apt.payment ? (
//                     <>
//                       <Typography><strong>Amount:</strong> ${apt.payment.payment_amount}</Typography>
//                       <Typography><strong>Paid:</strong> ${apt.payment.amount_paid || 0}</Typography>
//                       <Typography><strong>Status:</strong> <Chip 
//                         label={apt.payment.payment_status} 
//                         color={
//                           apt.payment.payment_status === 'Paid' ? 'success' :
//                           apt.payment.payment_status === 'Partially Paid' ? 'warning' : 'default'
//                         } 
//                       /></Typography>
//                       <Typography><strong>Payment Type:</strong> {apt.payment.payment_type}</Typography>
//                       <Typography><strong>Date:</strong> {
//                         apt.payment.payment_date ? 
//                           new Date(apt.payment.payment_date).toLocaleString() : 'N/A'
//                       }</Typography>
//                     </>
//                   ) : (
//                     <Typography>No payment information available.</Typography>
//                   )}
//                 </Grid>
                
//                 {/* Action Buttons */}
//                 <Grid item xs={12}>
//                   {apt.cancellation_status === 'None' && apt.appointment_status !== 'Cancelled' && (
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       sx={{ mt: 2 }}
//                       onClick={() => handleCancelRequest(apt.appointment_ID)}
//                     >
//                       Request Cancellation
//                     </Button>
//                   )}
//                 </Grid>
//               </Grid>
//             </Paper>
//           ))
//         )}
//       </Paper>

//       {/* Snackbar Notification */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default CustomerProfile;















import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Divider, Grid, Button, CircularProgress,
  Chip, Snackbar, Alert, Tabs, Tab
} from '@mui/material';
import axios from '../utils/axiosWithAuth';

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [specialRequests, setSpecialRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/customers/profile');
      console.log("👀 Profile response:", res.data);
      const customer = res.data;
      if (!customer || !customer.customer_ID) throw new Error("Invalid profile data");
      setProfile(customer);
      return customer.customer_ID;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setSnackbar({ open: true, message: 'Unauthorized. Please login again.', severity: 'error' });
    }
  };

  const filterUpcomingAppointments = (allAppointments) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
    
    return allAppointments.filter(apt => {
      // Parse the date string properly - assuming format is "YYYY-MM-DD"
      const aptDate = new Date(apt.appointment_date);
      aptDate.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
      
      // Only include future appointments that aren't cancelled
      return aptDate >= today && apt.appointment_status !== 'Cancelled';
    });
  };

  const fetchAppointmentsWithPayments = async (customerId) => {
    try {
      const appointmentsRes = await axios.get(`http://localhost:5001/api/appointment/customer/${customerId}`);
      const appointmentsList = appointmentsRes.data.data || [];
      
      const appointmentsWithPayments = await Promise.all(
        appointmentsList.map(async (appointment) => {
          try {
            const paymentRes = await axios.get(`http://localhost:5001/api/payment/appointment-payment/${appointment.appointment_ID}`);
            return {
              ...appointment,
              payment: paymentRes.data.paymentDetails[0] || null
            };
          } catch (error) {
            console.error(`Error fetching payment for appointment ${appointment.appointment_ID}:`, error);
            return {
              ...appointment,
              payment: null
            };
          }
        })
      );
      
      setAppointments(appointmentsWithPayments);
      setUpcomingAppointments(filterUpcomingAppointments(appointmentsWithPayments));
    } catch (err) {
      console.error('Error fetching appointments with payments:', err);
      setSnackbar({ open: true, message: 'Failed to fetch appointments data.', severity: 'error' });
    }
  };

  const fetchSpecialRequests = async (customerId) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/specialRequest/customer-requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSpecialRequests(res.data.requests || []);
    } catch (err) {
      console.error('Error fetching special requests:', err);
      setSnackbar({ open: true, message: 'Failed to fetch special requests.', severity: 'error' });
    }
  };

  const handleCancelRequest = async (appointmentId) => {
    try {
      await axios.post(`http://localhost:5001/api/appointment/cancel-request/${appointmentId}`);
      setSnackbar({ open: true, message: 'Cancellation request sent.', severity: 'success' });
      if (profile) {
        await fetchAppointmentsWithPayments(profile.customer_ID);
      }
    } catch (err) {
      console.error('Cancel request error:', err);
      setSnackbar({ open: true, message: 'Failed to send cancel request.', severity: 'error' });
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

  const renderAppointmentCard = (apt) => (
    <Paper key={apt.appointment_ID} sx={{ p: 2, my: 2, backgroundColor: "#f9f9f9" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Appointment #{apt.appointment_ID}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Typography><strong>Date:</strong> {apt.appointment_date}</Typography>
          <Typography><strong>Time:</strong> {apt.appointment_time?.substring(0, 5)}</Typography>
          <Typography><strong>Status:</strong> <Chip label={apt.appointment_status} /></Typography>
          <Typography><strong>Cancellation:</strong> <Chip label={apt.cancellation_status} color={
            apt.cancellation_status === 'Approved' ? 'success' :
              apt.cancellation_status === 'Requested' ? 'warning' :
                apt.cancellation_status === 'Rejected' ? 'error' : 'default'
          } /></Typography>
          <Typography><strong>Services:</strong> {apt.services}</Typography>
          <Typography><strong>Stylists:</strong> {apt.stylists}</Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Payment Information</Typography>
          {apt.payment ? (
            <>
              <Typography><strong>Amount:</strong> ${apt.payment.payment_amount}</Typography>
              <Typography><strong>Paid:</strong> ${apt.payment.amount_paid || 0}</Typography>
              <Typography><strong>Status:</strong> <Chip 
                label={apt.payment.payment_status} 
                color={
                  apt.payment.payment_status === 'Paid' ? 'success' :
                  apt.payment.payment_status === 'Partially Paid' ? 'warning' : 'default'
                } 
              /></Typography>
              <Typography><strong>Payment Type:</strong> {apt.payment.payment_type}</Typography>
              <Typography><strong>Date:</strong> {
                apt.payment.payment_date ? 
                  new Date(apt.payment.payment_date).toLocaleString() : 'N/A'
              }</Typography>
            </>
          ) : (
            <Typography>No payment information available.</Typography>
          )}
        </Grid>
        
        <Grid item xs={12}>
          {apt.cancellation_status === 'None' && apt.appointment_status !== 'Cancelled' && (
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 2 }}
              onClick={() => handleCancelRequest(apt.appointment_ID)}
            >
              Request Cancellation
            </Button>
          )}
        </Grid>
      </Grid>
    </Paper>
  );

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>My Profile</Typography>

      {/* Personal Information */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Personal Information</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography><strong>Name:</strong> {profile?.firstname} {profile?.lastname}</Typography>
        <Typography><strong>Email:</strong> {profile?.email}</Typography>
        <Typography><strong>Username:</strong> {profile?.username}</Typography>
      </Paper>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="All Appointments" />
        <Tab label="Upcoming Appointments" />
        <Tab label="Special Requests" />
      </Tabs>

      {/* All Appointments Tab */}
      {activeTab === 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6">All Appointments & Payments</Typography>
          <Divider sx={{ my: 1 }} />
          {appointments.length === 0 ? (
            <Typography>No appointments found.</Typography>
          ) : (
            appointments.map(apt => renderAppointmentCard(apt))
          )}
        </Paper>
      )}

      {/* Upcoming Appointments Tab */}
      {activeTab === 1 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6">Upcoming Appointments</Typography>
          <Divider sx={{ my: 1 }} />
          {upcomingAppointments.length === 0 ? (
            <Typography>No upcoming appointments found.</Typography>
          ) : (
            upcomingAppointments.map(apt => renderAppointmentCard(apt))
          )}
        </Paper>
      )}

      {/* Special Requests Tab */}
      {activeTab === 2 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6">My Special Requests</Typography>
          <Divider sx={{ my: 1 }} />
          {specialRequests.length === 0 ? (
            <Typography>You haven't made any special requests yet.</Typography>
          ) : (
            specialRequests.map((request) => (
              <Paper key={request.id} sx={{ p: 2, my: 2, backgroundColor: "#f9f9f9" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">
                    Request #{request.id}
                  </Typography>
                  <Chip 
                    label={request.status} 
                    color={
                      request.status === 'approved' ? 'success' :
                      request.status === 'rejected' ? 'error' :
                      request.status === 'completed' ? 'primary' : 'warning'
                    } 
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Submitted on: {new Date(request.created_at).toLocaleString()}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">
                  {request.request_details}
                </Typography>
              </Paper>
            ))
          )}
        </Paper>
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerProfile;