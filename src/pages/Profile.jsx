














// import React, { useEffect, useState } from 'react';
// import {
//   Box, Typography, Paper, Divider, Grid, Button, CircularProgress,
//   Chip, Snackbar, Alert, Tabs, Tab
// } from '@mui/material';
// import axios from '../utils/axiosWithAuth';

// const CustomerProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [upcomingAppointments, setUpcomingAppointments] = useState([]);
//   const [specialRequests, setSpecialRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState(0);
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

//   const filterUpcomingAppointments = (allAppointments) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
    
//     return allAppointments.filter(apt => {
//       // Parse the date string properly - assuming format is "YYYY-MM-DD"
//       const aptDate = new Date(apt.appointment_date);
//       aptDate.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
      
//       // Only include future appointments that aren't cancelled
//       return aptDate >= today && apt.appointment_status !== 'Cancelled';
//     });
//   };

//   const fetchAppointmentsWithPayments = async (customerId) => {
//     try {
//       const appointmentsRes = await axios.get(`http://localhost:5001/api/appointment/customer/${customerId}`);
//       const appointmentsList = appointmentsRes.data.data || [];
      
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
//       setUpcomingAppointments(filterUpcomingAppointments(appointmentsWithPayments));
//     } catch (err) {
//       console.error('Error fetching appointments with payments:', err);
//       setSnackbar({ open: true, message: 'Failed to fetch appointments data.', severity: 'error' });
//     }
//   };

//   const fetchSpecialRequests = async (customerId) => {
//     try {
//       const res = await axios.get(`http://localhost:5001/api/specialRequest/customer-requests`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setSpecialRequests(res.data.requests || []);
//     } catch (err) {
//       console.error('Error fetching special requests:', err);
//       setSnackbar({ open: true, message: 'Failed to fetch special requests.', severity: 'error' });
//     }
//   };

//   const handleCancelRequest = async (appointmentId) => {
//     try {
//       await axios.post(`http://localhost:5001/api/appointment/cancel-request/${appointmentId}`);
//       setSnackbar({ open: true, message: 'Cancellation request sent.', severity: 'success' });
//       if (profile) {
//         await fetchAppointmentsWithPayments(profile.customer_ID);
//       }
//     } catch (err) {
//       console.error('Cancel request error:', err);
//       setSnackbar({ open: true, message: 'Failed to send cancel request.', severity: 'error' });
//     }
//   };

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       const customerId = await fetchProfile();
//       if (customerId) {
//         await Promise.all([
//           fetchAppointmentsWithPayments(customerId),
//           fetchSpecialRequests(customerId)
//         ]);
//       }
//       setLoading(false);
//     };
//     loadData();
//   }, []);

//   const renderAppointmentCard = (apt) => (
//     <Paper key={apt.appointment_ID} sx={{ p: 2, my: 2, backgroundColor: "#f9f9f9" }}>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
//             Appointment #{apt.appointment_ID}
//           </Typography>
//         </Grid>
        
//         <Grid item xs={12} sm={6}>
//           <Typography><strong>Date:</strong> {apt.appointment_date}</Typography>
//           <Typography><strong>Time:</strong> {apt.appointment_time?.substring(0, 5)}</Typography>
//           <Typography><strong>Status:</strong> <Chip label={apt.appointment_status} /></Typography>
//           <Typography><strong>Cancellation:</strong> <Chip label={apt.cancellation_status} color={
//             apt.cancellation_status === 'Approved' ? 'success' :
//               apt.cancellation_status === 'Requested' ? 'warning' :
//                 apt.cancellation_status === 'Rejected' ? 'error' : 'default'
//           } /></Typography>
//           <Typography><strong>Services:</strong> {apt.services}</Typography>
//           <Typography><strong>Stylists:</strong> {apt.stylists}</Typography>
//         </Grid>
        
//         <Grid item xs={12} sm={6}>
//           <Typography variant="subtitle2">Payment Information</Typography>
//           {apt.payment ? (
//             <>
//               <Typography><strong>Amount:</strong> ${apt.payment.payment_amount}</Typography>
//               <Typography><strong>Paid:</strong> ${apt.payment.amount_paid || 0}</Typography>
//               <Typography><strong>Status:</strong> <Chip 
//                 label={apt.payment.payment_status} 
//                 color={
//                   apt.payment.payment_status === 'Paid' ? 'success' :
//                   apt.payment.payment_status === 'Partially Paid' ? 'warning' : 'default'
//                 } 
//               /></Typography>
//               <Typography><strong>Payment Type:</strong> {apt.payment.payment_type}</Typography>
//               <Typography><strong>Date:</strong> {
//                 apt.payment.payment_date ? 
//                   new Date(apt.payment.payment_date).toLocaleString() : 'N/A'
//               }</Typography>
//             </>
//           ) : (
//             <Typography>No payment information available.</Typography>
//           )}
//         </Grid>
        
//         <Grid item xs={12}>
//           {apt.cancellation_status === 'None' && apt.appointment_status !== 'Cancelled' && (
//             <Button
//               variant="outlined"
//               color="error"
//               sx={{ mt: 2 }}
//               onClick={() => handleCancelRequest(apt.appointment_ID)}
//             >
//               Request Cancellation
//             </Button>
//           )}
//         </Grid>
//       </Grid>
//     </Paper>
//   );

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

//       {/* Tabs for different sections */}
//       <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
//         <Tab label="All Appointments" />
//         <Tab label="Upcoming Appointments" />
//         <Tab label="Special Requests" />
//       </Tabs>

//       {/* All Appointments Tab */}
//       {activeTab === 0 && (
//         <Paper elevation={3} sx={{ p: 3 }}>
//           <Typography variant="h6">All Appointments & Payments</Typography>
//           <Divider sx={{ my: 1 }} />
//           {appointments.length === 0 ? (
//             <Typography>No appointments found.</Typography>
//           ) : (
//             appointments.map(apt => renderAppointmentCard(apt))
//           )}
//         </Paper>
//       )}

//       {/* Upcoming Appointments Tab */}
//       {activeTab === 1 && (
//         <Paper elevation={3} sx={{ p: 3 }}>
//           <Typography variant="h6">Upcoming Appointments</Typography>
//           <Divider sx={{ my: 1 }} />
//           {upcomingAppointments.length === 0 ? (
//             <Typography>No upcoming appointments found.</Typography>
//           ) : (
//             upcomingAppointments.map(apt => renderAppointmentCard(apt))
//           )}
//         </Paper>
//       )}

//       {/* Special Requests Tab */}
//       {activeTab === 2 && (
//         <Paper elevation={3} sx={{ p: 3 }}>
//           <Typography variant="h6">My Special Requests</Typography>
//           <Divider sx={{ my: 1 }} />
//           {specialRequests.length === 0 ? (
//             <Typography>You haven't made any special requests yet.</Typography>
//           ) : (
//             specialRequests.map((request) => (
//               <Paper key={request.id} sx={{ p: 2, my: 2, backgroundColor: "#f9f9f9" }}>
//                 <Box display="flex" justifyContent="space-between" alignItems="center">
//                   <Typography variant="subtitle1">
//                     Request #{request.id}
//                   </Typography>
//                   <Chip 
//                     label={request.status} 
//                     color={
//                       request.status === 'approved' ? 'success' :
//                       request.status === 'rejected' ? 'error' :
//                       request.status === 'completed' ? 'primary' : 'warning'
//                     } 
//                     size="small"
//                   />
//                 </Box>
//                 <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                   Submitted on: {new Date(request.created_at).toLocaleString()}
//                 </Typography>
//                 <Divider sx={{ my: 2 }} />
//                 <Typography variant="body1">
//                   {request.request_details}
//                 </Typography>
//               </Paper>
//             ))
//           )}
//         </Paper>
//       )}

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












// import React, { useEffect, useState } from 'react';
// import {
//   Box, Typography, Paper, Divider, Grid, Button, CircularProgress,
//   Chip, Snackbar, Alert, Tabs, Tab, Dialog, DialogTitle, DialogContent,
//   DialogActions, TextField, Rating
// } from '@mui/material';
// import axios from '../utils/axiosWithAuth';

// const CustomerProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [upcomingAppointments, setUpcomingAppointments] = useState([]);
//   const [specialRequests, setSpecialRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState(0);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//   // Review dialog states
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [reviewRating, setReviewRating] = useState(0);
//   const [reviewComment, setReviewComment] = useState('');
//   const [reviewDialogType, setReviewDialogType] = useState(null); // 'general' or 'stylist'

//   const fetchProfile = async () => {
//     try {
//       const res = await axios.get('http://localhost:5001/api/customers/profile');
//       const customer = res.data;
//       if (!customer || !customer.customer_ID) throw new Error("Invalid profile data");
//       setProfile(customer);
//       return customer.customer_ID;
//     } catch (err) {
//       setSnackbar({ open: true, message: 'Unauthorized. Please login again.', severity: 'error' });
//     }
//   };

//   const filterUpcomingAppointments = (allAppointments) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return allAppointments.filter(apt => {
//       const aptDate = new Date(apt.appointment_date);
//       aptDate.setHours(0, 0, 0, 0);
//       return aptDate >= today && apt.appointment_status !== 'Cancelled';
//     });
//   };

//   const fetchAppointmentsWithPayments = async (customerId) => {
//     try {
//       const res = await axios.get(`http://localhost:5001/api/appointment/customer/${customerId}`);
//       const appointmentsList = res.data.data || [];
//       const appointmentsWithPayments = await Promise.all(
//         appointmentsList.map(async (appointment) => {
//           try {
//             const paymentRes = await axios.get(`http://localhost:5001/api/payment/appointment-payment/${appointment.appointment_ID}`);
//             return {
//               ...appointment,
//               payment: paymentRes.data.paymentDetails[0] || null
//             };
//           } catch {
//             return { ...appointment, payment: null };
//           }
//         })
//       );
//       setAppointments(appointmentsWithPayments);
//       setUpcomingAppointments(filterUpcomingAppointments(appointmentsWithPayments));
//     } catch {
//       setSnackbar({ open: true, message: 'Failed to fetch appointments data.', severity: 'error' });
//     }
//   };

//   const fetchSpecialRequests = async (customerId) => {
//     try {
//       const res = await axios.get(`http://localhost:5001/api/specialRequest/customer-requests`);
//       setSpecialRequests(res.data.requests || []);
//     } catch {
//       setSnackbar({ open: true, message: 'Failed to fetch special requests.', severity: 'error' });
//     }
//   };

//   const handleCancelRequest = async (appointmentId) => {
//     try {
//       await axios.post(`http://localhost:5001/api/appointment/cancel-request/${appointmentId}`);
//       setSnackbar({ open: true, message: 'Cancellation request sent.', severity: 'success' });
//       if (profile) await fetchAppointmentsWithPayments(profile.customer_ID);
//     } catch {
//       setSnackbar({ open: true, message: 'Failed to send cancel request.', severity: 'error' });
//     }
//   };

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       const customerId = await fetchProfile();
//       if (customerId) {
//         await Promise.all([
//           fetchAppointmentsWithPayments(customerId),
//           fetchSpecialRequests(customerId)
//         ]);
//       }
//       setLoading(false);
//     };
//     loadData();
//   }, []);

//   const handleSubmitReview = async () => {
//     try {
//       const response = await axios.post(
//         `/review/appointment/${selectedAppointment.appointment_ID}`,
//         {
//           rating: reviewRating,
//           comment: reviewComment,
//           stylistId: reviewDialogType === 'stylist' ? selectedAppointment.stylist_ID : null
//         }
//       );

//       setSnackbar({
//         open: true,
//         message: 'Review submitted successfully!',
//         severity: 'success'
//       });
//       setReviewDialogType(null);
//       setReviewRating(0);
//       setReviewComment('');
//       fetchAppointmentsWithPayments(profile.customer_ID);
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: err.response?.data?.error || 'Failed to submit review',
//         severity: 'error'
//       });
//     }
//   };

//   const renderAppointmentCard = (apt) => (
//     <Paper key={apt.appointment_ID} sx={{ p: 2, my: 2, backgroundColor: "#f9f9f9" }}>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
//             Appointment #{apt.appointment_ID}
//           </Typography>
//         </Grid>
        
//         <Grid item xs={12} sm={6}>
//           <Typography><strong>Date:</strong> {apt.appointment_date}</Typography>
//           <Typography><strong>Time:</strong> {apt.appointment_time?.substring(0, 5)}</Typography>
//           <Typography><strong>Status:</strong> <Chip label={apt.appointment_status} /></Typography>
//           <Typography><strong>Cancellation:</strong> <Chip label={apt.cancellation_status} /></Typography>
//           <Typography><strong>Services:</strong> {apt.services}</Typography>
//           <Typography><strong>Stylists:</strong> {apt.stylists}</Typography>
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <Typography variant="subtitle2">Payment Information</Typography>
//           {apt.payment ? (
//             <>
//               <Typography><strong>Amount:</strong> ${apt.payment.payment_amount}</Typography>
//               <Typography><strong>Paid:</strong> ${apt.payment.amount_paid || 0}</Typography>
//               <Typography><strong>Status:</strong> <Chip label={apt.payment.payment_status} /></Typography>
//               <Typography><strong>Type:</strong> {apt.payment.payment_type}</Typography>
//               <Typography><strong>Date:</strong> {
//                 apt.payment.payment_date ? new Date(apt.payment.payment_date).toLocaleString() : 'N/A'
//               }</Typography>
//             </>
//           ) : <Typography>No payment info.</Typography>}
//         </Grid>

//         <Grid item xs={12}>
//           {apt.cancellation_status === 'None' && apt.appointment_status !== 'Cancelled' && (
//             <Button variant="outlined" color="error" sx={{ mt: 2 }} onClick={() => handleCancelRequest(apt.appointment_ID)}>
//               Request Cancellation
//             </Button>
//           )}

//           {apt.appointment_status === 'Completed' && !apt.has_review && (
//             <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
//               <Button 
//                 variant="outlined"
//                 onClick={() => {
//                   setSelectedAppointment(apt);
//                   setReviewDialogType('general');
//                 }}
//               >
//                 Review Experience
//               </Button>
//               {apt.stylist_ID && (
//                 <Button 
//                   variant="contained"
//                   onClick={() => {
//                     setSelectedAppointment(apt);
//                     setReviewDialogType('stylist');
//                   }}
//                 >
//                   Review Stylist
//                 </Button>
//               )}
//             </Box>
//           )}
//         </Grid>
//       </Grid>
//     </Paper>
//   );

//   if (loading) return <Box textAlign="center"><CircularProgress /></Box>;

//   return (
//     <Box p={4}>
//       <Typography variant="h4" gutterBottom>My Profile</Typography>

//       <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
//         <Typography variant="h6">Personal Information</Typography>
//         <Divider sx={{ my: 1 }} />
//         <Typography><strong>Name:</strong> {profile?.firstname} {profile?.lastname}</Typography>
//         <Typography><strong>Email:</strong> {profile?.email}</Typography>
//         <Typography><strong>Username:</strong> {profile?.username}</Typography>
//       </Paper>

//       <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
//         <Tab label="All Appointments" />
//         <Tab label="Upcoming Appointments" />
//         <Tab label="Special Requests" />
//       </Tabs>

//       {activeTab === 0 && (
//         <Paper elevation={3} sx={{ p: 3 }}>
//           <Typography variant="h6">All Appointments & Payments</Typography>
//           <Divider sx={{ my: 1 }} />
//           {appointments.length === 0 ? (
//             <Typography>No appointments found.</Typography>
//           ) : (
//             appointments.map(apt => renderAppointmentCard(apt))
//           )}
//         </Paper>
//       )}

//       {activeTab === 1 && (
//         <Paper elevation={3} sx={{ p: 3 }}>
//           <Typography variant="h6">Upcoming Appointments</Typography>
//           <Divider sx={{ my: 1 }} />
//           {upcomingAppointments.length === 0 ? (
//             <Typography>No upcoming appointments found.</Typography>
//           ) : (
//             upcomingAppointments.map(apt => renderAppointmentCard(apt))
//           )}
//         </Paper>
//       )}

//       {activeTab === 2 && (
//         <Paper elevation={3} sx={{ p: 3 }}>
//           <Typography variant="h6">My Special Requests</Typography>
//           <Divider sx={{ my: 1 }} />
//           {specialRequests.length === 0 ? (
//             <Typography>You haven't made any special requests yet.</Typography>
//           ) : (
//             specialRequests.map((request) => (
//               <Paper key={request.id} sx={{ p: 2, my: 2, backgroundColor: "#f9f9f9" }}>
//                 <Box display="flex" justifyContent="space-between" alignItems="center">
//                   <Typography variant="subtitle1">Request #{request.id}</Typography>
//                   <Chip label={request.status} color={
//                     request.status === 'approved' ? 'success' :
//                       request.status === 'rejected' ? 'error' :
//                         request.status === 'completed' ? 'primary' : 'warning'
//                   } size="small" />
//                 </Box>
//                 <Typography variant="body2" sx={{ mt: 1 }}>
//                   Submitted on: {new Date(request.created_at).toLocaleString()}
//                 </Typography>
//                 <Divider sx={{ my: 2 }} />
//                 <Typography>{request.request_details}</Typography>
//               </Paper>
//             ))
//           )}
//         </Paper>
//       )}

//       <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
//         <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
//       </Snackbar>

//       {/* Review Dialog */}
//       <Dialog open={!!reviewDialogType} onClose={() => setReviewDialogType(null)}>
//         <DialogTitle>
//           {reviewDialogType === 'stylist' 
//             ? `Review Stylist: ${selectedAppointment?.stylist_name}`
//             : 'Review Your Experience'}
//         </DialogTitle>
//         <DialogContent>
//           <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//             <Typography variant="subtitle1" sx={{ mr: 1 }}>
//               Rating:
//             </Typography>
//             <Rating
//               value={reviewRating}
//               onChange={(e, newValue) => setReviewRating(newValue)}
//               size="large"
//             />
//           </Box>
          
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             label="Your feedback"
//             placeholder={
//               reviewDialogType === 'stylist'
//                 ? `What did you like about ${selectedAppointment?.stylist_name}'s service?`
//                 : "How was your overall experience at our salon?"
//             }
//             value={reviewComment}
//             onChange={(e) => setReviewComment(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setReviewDialogType(null)}>Cancel</Button>
//           <Button 
//             onClick={handleSubmitReview} 
//             variant="contained"
//             disabled={reviewRating === 0}
//           >
//             Submit Review
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default CustomerProfile;

















// import React, { useEffect, useState } from 'react';
// import {
//   Box, Typography, Paper, Divider, Grid, Button, CircularProgress,
//   Chip, Snackbar, Alert, Tabs, Tab, Dialog, DialogTitle, DialogContent,
//   DialogActions, TextField, Rating, Container, List, ListItem, ListItemText
// } from '@mui/material';
// import { motion } from "framer-motion";
// import axios from '../utils/axiosWithAuth';
// import profileHeaderImage from '../assets/ProfileHeader.png'; // Import the header image
// import CustomerProfileManagement from '../components/ProfileManagement'; // Import the profile management component

// const CustomerProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [upcomingAppointments, setUpcomingAppointments] = useState([]);
//   const [specialRequests, setSpecialRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState(0);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//   // Review dialog states
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [reviewRating, setReviewRating] = useState(0);
//   const [reviewComment, setReviewComment] = useState('');
//   const [reviewDialogType, setReviewDialogType] = useState(null); // 'general' or 'stylist'

//   const fetchProfile = async () => {
//     try {
//       const res = await axios.get('http://localhost:5001/api/customers/profile');
//       const customer = res.data;
//       if (!customer || !customer.customer_ID) throw new Error("Invalid profile data");
//       setProfile(customer);
//       return customer.customer_ID;
//     } catch (err) {
//       setSnackbar({ open: true, message: 'Unauthorized. Please login again.', severity: 'error' });
//     }
//   };

//   const filterUpcomingAppointments = (allAppointments) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return allAppointments.filter(apt => {
//       const aptDate = new Date(apt.appointment_date);
//       aptDate.setHours(0, 0, 0, 0);
//       return aptDate >= today && apt.appointment_status !== 'Cancelled';
//     });
//   };

//   const fetchAppointmentsWithPayments = async (customerId) => {
//     try {
//       const res = await axios.get(`http://localhost:5001/api/appointment/customer/${customerId}`);
//       const appointmentsList = res.data.data || [];
//       const appointmentsWithPayments = await Promise.all(
//         appointmentsList.map(async (appointment) => {
//           try {
//             const paymentRes = await axios.get(`http://localhost:5001/api/payment/appointment-payment/${appointment.appointment_ID}`);
//             return {
//               ...appointment,
//               payment: paymentRes.data.paymentDetails[0] || null
//             };
//           } catch {
//             return { ...appointment, payment: null };
//           }
//         })
//       );
//       setAppointments(appointmentsWithPayments);
//       setUpcomingAppointments(filterUpcomingAppointments(appointmentsWithPayments));
//     } catch {
//       setSnackbar({ open: true, message: 'Failed to fetch appointments data.', severity: 'error' });
//     }
//   };

//   const fetchSpecialRequests = async (customerId) => {
//     try {
//       const res = await axios.get(`http://localhost:5001/api/specialRequest/customer-requests`);
//       setSpecialRequests(res.data.requests || []);
//     } catch {
//       setSnackbar({ open: true, message: 'Failed to fetch special requests.', severity: 'error' });
//     }
//   };

//   const handleCancelRequest = async (appointmentId) => {
//     try {
//       await axios.post(`http://localhost:5001/api/appointment/cancel-request/${appointmentId}`);
//       setSnackbar({ open: true, message: 'Cancellation request sent.', severity: 'success' });
//       if (profile) await fetchAppointmentsWithPayments(profile.customer_ID);
//     } catch {
//       setSnackbar({ open: true, message: 'Failed to send cancel request.', severity: 'error' });
//     }
//   };

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       const customerId = await fetchProfile();
//       if (customerId) {
//         await Promise.all([
//           fetchAppointmentsWithPayments(customerId),
//           fetchSpecialRequests(customerId)
//         ]);
//       }
//       setLoading(false);
//     };
//     loadData();
//   }, []);

//   const getStylistName = (apt) => {
//     if (!apt) return '';
    
//     // Check for direct stylist_name property
//     if (apt.stylist_name) return apt.stylist_name;
    
//     // Check stylists array
//     if (Array.isArray(apt.stylists) && apt.stylists.length > 0) {
//       const stylist = apt.stylists[0];
//       return stylist.name || '';
//     }
    
//     // Check if stylists is a single object
//     if (apt.stylists && typeof apt.stylists === 'object' && apt.stylists.name) {
//       return apt.stylists.name;
//     }
    
//     return 'Stylist';
//   };

//   const handleSubmitReview = async () => {
//     try {
//       const response = await axios.post(
//         `/review/appointment/${selectedAppointment.appointment_ID}`,
//         {
//           rating: reviewRating,
//           comment: reviewComment,
//           stylistId: reviewDialogType === 'stylist' ? 
//             (selectedAppointment.stylist_ID || 
//              selectedAppointment.stylist_IDs || 
//              (selectedAppointment.stylists && selectedAppointment.stylists[0]?.id)) : null
//         }
//       );

//       setSnackbar({
//         open: true,
//         message: 'Review submitted successfully!',
//         severity: 'success'
//       });
//       setReviewDialogType(null);
//       setReviewRating(0);
//       setReviewComment('');
//       fetchAppointmentsWithPayments(profile.customer_ID);
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: err.response?.data?.error || 'Failed to submit review',
//         severity: 'error'
//       });
//     }
//   };

//   const renderAppointmentCard = (apt) => (
//     <motion.div
//       key={apt.appointment_ID}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <Paper 
//         sx={{ 
//           p: 3, 
//           my: 2, 
//           backgroundColor: "#fff", 
//           borderRadius: 2,
//           boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//           overflow: "hidden",
//           "&:hover": {
//             boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
//             transform: "translateY(-4px)",
//             transition: "all 0.3s ease"
//           }
//         }}
//       >
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <Typography 
//               variant="h6" 
//               sx={{ 
//                 fontWeight: '500', 
//                 mb: 1, 
//                 color: "#72614e", 
//                 borderBottom: "2px solid #b8a99a",
//                 pb: 1
//               }}
//             >
//               Appointment #{apt.appointment_ID}
//             </Typography>
//           </Grid>
          
//           <Grid item xs={12} sm={6}>
//             <List sx={{ pl: 0 }}>
//               <ListItem sx={{ px: 0 }}>
//                 <ListItemText 
//                   primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Date</Typography>} 
//                   secondary={apt.appointment_date} 
//                 />
//               </ListItem>
//               <ListItem sx={{ px: 0 }}>
//                 <ListItemText 
//                   primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Time</Typography>} 
//                   secondary={apt.appointment_time?.substring(0, 5)} 
//                 />
//               </ListItem>
//               <ListItem sx={{ px: 0 }}>
//                 <ListItemText 
//                   primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Status</Typography>} 
//                   secondary={
//                     <Chip 
//                       label={apt.appointment_status || 'N/A'} 
//                       sx={{ 
//                         backgroundColor: 
//                           apt.appointment_status === 'Completed' ? "#6da58a" : 
//                           apt.appointment_status === 'Cancelled' ? "#d47777" :
//                           apt.appointment_status === 'Confirmed' ? "#6a8fd5" : "#b8a99a",
//                         color: "white",
//                         fontWeight: 500,
//                         fontSize: "0.75rem"
//                       }} 
//                     />
//                   } 
//                 />
//               </ListItem>
//               <ListItem sx={{ px: 0 }}>
//                 <ListItemText 
//                   primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Cancellation</Typography>} 
//                   secondary={
//                     <Chip 
//                       label={apt.cancellation_status || 'N/A'} 
//                       sx={{ 
//                         backgroundColor: 
//                           apt.cancellation_status === 'Approved' ? "#6da58a" : 
//                           apt.cancellation_status === 'Rejected' ? "#d47777" :
//                           apt.cancellation_status === 'Pending' ? "#d9c17a" : "#b8a99a",
//                         color: "white",
//                         fontWeight: 500,
//                         fontSize: "0.75rem"
//                       }} 
//                     />
//                   } 
//                 />
//               </ListItem>
//               <ListItem sx={{ px: 0 }}>
//                 <ListItemText 
//                   primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Services</Typography>} 
//                   secondary={typeof apt.services === 'string' ? apt.services : (Array.isArray(apt.services) ? apt.services.join(', ') : 'None')} 
//                 />
//               </ListItem>
//               <ListItem sx={{ px: 0 }}>
//                 <ListItemText 
//                   primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Stylists</Typography>} 
//                   secondary={
//                     typeof apt.stylists === 'string' ? apt.stylists : 
//                     Array.isArray(apt.stylists) ? apt.stylists.map(stylist => 
//                       typeof stylist === 'object' ? (stylist.name || '') : stylist
//                     ).join(', ') : 
//                     apt.stylists && typeof apt.stylists === 'object' ? 
//                       (apt.stylists.name || '') : 
//                       'None'
//                   } 
//                 />
//               </ListItem>
//             </List>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <Box sx={{ backgroundColor: "#f9f7f4", p: 2, borderRadius: 2 }}>
//               <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1, color: "#72614e" }}>
//                 Payment Information
//               </Typography>
//               {apt.payment ? (
//                 <List dense>
//                   <ListItem sx={{ px: 0 }}>
//                     <ListItemText 
//                       primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Amount</Typography>} 
//                       secondary={`$${apt.payment.payment_amount}`} 
//                     />
//                   </ListItem>
//                   <ListItem sx={{ px: 0 }}>
//                     <ListItemText 
//                       primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Paid</Typography>} 
//                       secondary={`$${apt.payment.amount_paid || 0}`} 
//                     />
//                   </ListItem>
//                   <ListItem sx={{ px: 0 }}>
//                     <ListItemText 
//                       primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Status</Typography>} 
//                       secondary={
//                         <Chip 
//                           label={apt.payment.payment_status || 'N/A'} 
//                           sx={{ 
//                             backgroundColor: 
//                               apt.payment.payment_status === 'Paid' ? "#6da58a" : 
//                               apt.payment.payment_status === 'Unpaid' ? "#d47777" :
//                               apt.payment.payment_status === 'Partial' ? "#d9c17a" : "#b8a99a",
//                             color: "white",
//                             fontWeight: 500,
//                             fontSize: "0.75rem"
//                           }} 
//                         />
//                       } 
//                     />
//                   </ListItem>
//                   <ListItem sx={{ px: 0 }}>
//                     <ListItemText 
//                       primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Type</Typography>} 
//                       secondary={apt.payment.payment_type || 'N/A'} 
//                     />
//                   </ListItem>
//                   <ListItem sx={{ px: 0 }}>
//                     <ListItemText 
//                       primary={<Typography sx={{ fontWeight: 'bold', color: "#72614e" }}>Date</Typography>} 
//                       secondary={
//                         apt.payment.payment_date ? new Date(apt.payment.payment_date).toLocaleString() : 'N/A'
//                       } 
//                     />
//                   </ListItem>
//                 </List>
//               ) : (
//                 <Typography sx={{ fontStyle: 'italic', color: '#999' }}>No payment information available.</Typography>
//               )}
//             </Box>
//           </Grid>

//           <Grid item xs={12}>
//             <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//               {apt.cancellation_status === 'None' && apt.appointment_status !== 'Cancelled' && (
//                 <Button 
//                   variant="outlined" 
//                   sx={{ 
//                     color: "#d47777", 
//                     borderColor: "#d47777",
//                     "&:hover": {
//                       backgroundColor: "rgba(212, 119, 119, 0.08)",
//                       borderColor: "#c05555"
//                     }
//                   }} 
//                   onClick={() => handleCancelRequest(apt.appointment_ID)}
//                 >
//                   Request Cancellation
//                 </Button>
//               )}

//               {apt.appointment_status === 'Completed' && !apt.has_review && (
//                 <>
//                   <Button 
//                     variant="outlined"
//                     sx={{ 
//                       color: "#b8a99a", 
//                       borderColor: "#b8a99a",
//                       "&:hover": {
//                         backgroundColor: "rgba(184, 169, 154, 0.08)",
//                         borderColor: "#a89987"
//                       }
//                     }}
//                     onClick={() => {
//                       setSelectedAppointment(apt);
//                       setReviewDialogType('general');
//                     }}
//                   >
//                     Review Experience
//                   </Button>
//                   {(apt.stylist_ID || apt.stylist_IDs || (apt.stylists && apt.stylists.length > 0)) && (
//                     <Button 
//                       variant="contained"
//                       sx={{ 
//                         backgroundColor: "#b8a99a",
//                         "&:hover": {
//                           backgroundColor: "#a89987"
//                         }
//                       }}
//                       onClick={() => {
//                         setSelectedAppointment(apt);
//                         setReviewDialogType('stylist');
//                       }}
//                     >
//                       Review Stylist
//                     </Button>
//                   )}
//                 </>
//               )}
//             </Box>
//           </Grid>
//         </Grid>
//       </Paper>
//     </motion.div>
//   );

//   const renderSpecialRequestCard = (request) => (
//     <motion.div
//       key={request.id}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <Paper 
//         sx={{ 
//           p: 3, 
//           my: 2, 
//           backgroundColor: "#fff", 
//           borderRadius: 2,
//           boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//           overflow: "hidden"
//         }}
//       >
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography variant="h6" sx={{ fontWeight: '500', color: "#72614e" }}>
//             Request #{request.id}
//           </Typography>
//           <Chip 
//             label={request.status || 'Pending'} 
//             sx={{ 
//               backgroundColor: 
//                 request.status === 'approved' ? "#6da58a" : 
//                 request.status === 'rejected' ? "#d47777" :
//                 request.status === 'completed' ? "#6a8fd5" : "#d9c17a",
//               color: "white",
//               fontWeight: 500
//             }} 
//           />
//         </Box>
//         <Typography variant="body2" sx={{ mt: 1, color: "#999" }}>
//           Submitted on: {new Date(request.created_at).toLocaleString()}
//         </Typography>
//         <Divider sx={{ my: 2 }} />
//         <Typography sx={{ color: "#555" }}>{request.request_details}</Typography>
//       </Paper>
//     </motion.div>
//   );

//   if (loading) {
//     return (
//       <Box 
//         sx={{ 
//           display: 'flex', 
//           justifyContent: 'center', 
//           alignItems: 'center', 
//           height: '100vh',
//           bgcolor: "#faf5f0" 
//         }}
//       >
//         <CircularProgress sx={{ color: "#b8a99a" }} />
//       </Box>
//     );
//   }

//   return (
//     <Box 
//       sx={{ 
//         width: "100%", 
//         maxWidth: "100%", 
//         minHeight: "100vh",
//         bgcolor: "#faf5f0",
//         scrollbarWidth: "none",
//         "&::-webkit-scrollbar": {
//           display: "none",
//         },
//         msOverflowStyle: "none"
//       }}
//     >
//       {/* Updated Header Section */}
//       <Box sx={{ 
//         width: "100%", 
//         position: "relative", 
//         overflow: "hidden",
//         height: { xs: '180px', sm: '300px', md: '400px' },
//         "&::-webkit-scrollbar": {
//           display: "none",
//         },
//       }}>
//         <Box
//           sx={{
//             backgroundImage: `url(${profileHeaderImage})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             height: "100%",
//             display: "flex",
//             alignItems: { xs: 'flex-start', sm: 'center' },
//             justifyContent: "center",
//             position: "relative",
//             pt: { xs: 2, sm: 0 },
//             '&::before': {
//               content: '""',
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               backgroundColor: "rgba(0,0,0,0.3)",
//               zIndex: 0
//             },
//             "&::-webkit-scrollbar": {
//               display: "none",
//             },
//           }}
//         >
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             style={{ position: "relative", zIndex: 1 }}
//           >
            
//           </motion.div>
//         </Box>
//       </Box>

//       <Container maxWidth="lg" sx={{ py: 5, px: { xs: 2, sm: 3 } }}>
//         {/* Personal Information Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Paper 
//             elevation={0} 
//             sx={{ 
//               p: 4, 
//               mb: 4, 
//               borderRadius: 2,
//               boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//               backgroundColor: "#b8a99a",
//               color: "white"
//             }}
//           >
//             <Typography variant="h5" sx={{ fontWeight: 500, mb: 3 }}>Personal Information</Typography>
//             <Grid container spacing={3}>
//               <Grid item xs={12} md={4}>
//                 <Typography sx={{ fontWeight: 'bold' }}>Name</Typography>
//                 <Typography variant="h6">{profile?.firstname} {profile?.lastname}</Typography>
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <Typography sx={{ fontWeight: 'bold' }}>Email</Typography>
//                 <Typography variant="h6">{profile?.email}</Typography>
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <Typography sx={{ fontWeight: 'bold' }}>Username</Typography>
//                 <Typography variant="h6">{profile?.username}</Typography>
//               </Grid>
//             </Grid>
//           </Paper>
//         </motion.div>

//         {/* Tabs Section */}
//         <Box sx={{ mb: 3 }}>
//           <Tabs 
//             value={activeTab} 
//             onChange={handleTabChange} 
//             variant="fullWidth"
//             sx={{ 
//               mb: 3, 
//               '& .MuiTabs-indicator': { 
//                 backgroundColor: "#b8a99a",
//                 height: 3
//               },
//               '& .MuiTab-root': { 
//                 color: "#72614e",
//                 fontWeight: 500,
//                 fontSize: { xs: '0.875rem', sm: '1rem' },
//                 '&.Mui-selected': {
//                   color: "#b8a99a"
//                 }
//               }
//             }}
//           >
//             <Tab label="All Appointments" />
//             <Tab label="Upcoming Appointments" />
//             <Tab label="Special Requests" />
//             <Tab label="Edit Profile" />
//           </Tabs>

//           {/* Tab Content */}
//           {activeTab === 0 && (
//             <Box>
//               <Typography 
//                 variant="h5" 
//                 sx={{ 
//                   mb: 3, 
//                   color: "#72614e", 
//                   fontWeight: 500,
//                   borderBottom: "2px solid #b8a99a",
//                   pb: 1,
//                   display: "inline-block"
//                 }}
//               >
//                 All Appointments & Payments
//               </Typography>
//               {appointments.length === 0 ? (
//                 <Paper 
//                   sx={{ 
//                     p: 4, 
//                     textAlign: 'center', 
//                     backgroundColor: "#fff",
//                     borderRadius: 2
//                   }}
//                 >
//                   <Typography sx={{ color: "#999", fontStyle: 'italic' }}>
//                     No appointments found.
//                   </Typography>
//                 </Paper>
//               ) : (
//                 appointments.map(apt => renderAppointmentCard(apt))
//               )}
//             </Box>
//           )}

//           {activeTab === 1 && (
//             <Box>
//               <Typography 
//                 variant="h5" 
//                 sx={{ 
//                   mb: 3, 
//                   color: "#72614e", 
//                   fontWeight: 500,
//                   borderBottom: "2px solid #b8a99a",
//                   pb: 1,
//                   display: "inline-block"
//                 }}
//               >
//                 Upcoming Appointments
//               </Typography>
//               {upcomingAppointments.length === 0 ? (
//                 <Paper 
//                   sx={{ 
//                     p: 4, 
//                     textAlign: 'center', 
//                     backgroundColor: "#fff",
//                     borderRadius: 2
//                   }}
//                 >
//                   <Typography sx={{ color: "#999", fontStyle: 'italic' }}>
//                     No upcoming appointments found.
//                   </Typography>
//                 </Paper>
//               ) : (
//                 upcomingAppointments.map(apt => renderAppointmentCard(apt))
//               )}
//             </Box>
//           )}

//           {activeTab === 2 && (
//             <Box>
//               <Typography 
//                 variant="h5" 
//                 sx={{ 
//                   mb: 3, 
//                   color: "#72614e", 
//                   fontWeight: 500,
//                   borderBottom: "2px solid #b8a99a",
//                   pb: 1,
//                   display: "inline-block"
//                 }}
//               >
//                 My Special Requests
//               </Typography>
//               {specialRequests.length === 0 ? (
//                 <Paper 
//                   sx={{ 
//                     p: 4, 
//                     textAlign: 'center', 
//                     backgroundColor: "#fff",
//                     borderRadius: 2
//                   }}
//                 >
//                   <Typography sx={{ color: "#999", fontStyle: 'italic' }}>
//                     You haven't made any special requests yet.
//                   </Typography>
//                 </Paper>
//               ) : (
//                 specialRequests.map(request => renderSpecialRequestCard(request))
//               )}
//             </Box>
//           )}

//           {/* New Profile Management Tab */}
//           {activeTab === 3 && (
//             <Box>
//               <Typography 
//                 variant="h5" 
//                 sx={{ 
//                   mb: 3, 
//                   color: "#72614e", 
//                   fontWeight: 500,
//                   borderBottom: "2px solid #b8a99a",
//                   pb: 1,
//                   display: "inline-block"
//                 }}
//               >
//                 Profile Management
//               </Typography>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 {/* We're using the imported CustomerProfileManagement component here */}
//                 <CustomerProfileManagement />
//               </motion.div>
//             </Box>
//           )}
//         </Box>
//       </Container>

//       {/* Review Dialog */}
//       <Dialog 
//         open={!!reviewDialogType} 
//         onClose={() => setReviewDialogType(null)}
//         sx={{
//           '& .MuiPaper-root': {
//             borderRadius: 2,
//             backgroundColor: "#faf5f0",
//           }
//         }}
//       >
//         <DialogTitle sx={{ bgcolor: "#b8a99a", color: "white", fontWeight: 500 }}>
//           {reviewDialogType === 'stylist' 
//             ? `Review Stylist: ${getStylistName(selectedAppointment)}`
//             : 'Review Your Experience'}
//         </DialogTitle>
//         <DialogContent sx={{ pt: 3, mt: 1 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//             <Typography variant="subtitle1" sx={{ mr: 2, color: "#72614e", fontWeight: 500 }}>
//               Rating:
//             </Typography>
//             <Rating
//               value={reviewRating}
//               onChange={(e, newValue) => setReviewRating(newValue)}
//               size="large"
//               sx={{ 
//                 color: "#b8a99a",
//                 '& .MuiRating-iconEmpty': {
//                   color: "#e0d9d0"
//                 }
//               }}
//             />
//           </Box>
          
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             label="Your feedback"
//             placeholder={
//               reviewDialogType === 'stylist'
//                 ? `What did you like about ${getStylistName(selectedAppointment)}'s service?`
//                 : "How was your overall experience at our salon?"
//             }
//             value={reviewComment}
//             onChange={(e) => setReviewComment(e.target.value)}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 '& fieldset': {
//                   borderColor: '#d0c7bc',
//                 },
//                 '&:hover fieldset': {
//                   borderColor: '#b8a99a',
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: '#b8a99a',
//                 },
//               },
//               '& .MuiInputLabel-root.Mui-focused': {
//                 color: '#72614e',
//               },
//             }}
//           />
//         </DialogContent>
//         <DialogActions sx={{ p: 2, pt: 0 }}>
//           <Button 
//             onClick={() => setReviewDialogType(null)}
//             sx={{ 
//               color: "#72614e"
//             }}
//           >
//             Cancel
//           </Button>
//           <Button 
//             onClick={handleSubmitReview} 
//             variant="contained"
//             disabled={reviewRating === 0}
//             sx={{ 
//               backgroundColor: "#b8a99a",
//               "&:hover": {
//                 backgroundColor: "#a89987"
//               },
//               "&.Mui-disabled": {
//                 backgroundColor: "#e0d9d0"
//               }
//             }}
//           >
//             Submit Review
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar 
//         open={snackbar.open} 
//         autoHideDuration={4000} 
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert 
//           severity={snackbar.severity} 
//           variant="filled" 
//           sx={{ 
//             bgcolor: snackbar.severity === 'success' ? "#6da58a" : 
//                     snackbar.severity === 'error' ? "#d47777" : 
//                     snackbar.severity === 'warning' ? "#d9c17a" : "#6a8fd5"
//           }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//       {/* Global Styles */}
//       <style jsx global>{`
//         * {
//           box-sizing: border-box;
//           margin: 0;
//           padding: 0;
//         }
//         html, body {
//           overflow-x: hidden;
//           width: 100%;
//           max-width: 100%;
//           margin: 0;
//           padding: 0;
//           background-color: #faf5f0;
//         }
//         ::-webkit-scrollbar {
//           display: none;
//         }
//         * {
//           scrollbar-width: none;
//         }
//         .MuiBox-root {
//           max-width: 100%;
//         }
//       `}</style>
//     </Box>
//   );
// };

// export default CustomerProfile;



















import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, CircularProgress,
  Snackbar, Alert, Tabs, Tab, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Rating, Container
} from '@mui/material';
import { motion } from "framer-motion";
import axios from '../utils/axiosWithAuth';
import profileHeaderImage from '../assets/ProfileHeader.png'; // Import the header image

// Import component files
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
  const [reviewDialogType, setReviewDialogType] = useState(null); // 'general' or 'stylist'

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
    // Extract meaningful message from backend if available
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
    
    // Check for direct stylist_name property
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