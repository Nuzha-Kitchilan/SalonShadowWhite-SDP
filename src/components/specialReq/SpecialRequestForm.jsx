// import React, { useState, useEffect } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Box, Typography, TextField, Button, CircularProgress,
//   Paper, FormControl, InputLabel, Select, MenuItem, Chip,
//   InputAdornment
// } from '@mui/material';
// import {
//   Save as SaveIcon,
//   Person as PersonIcon,
//   CalendarToday as CalendarIcon,
//   Spa as SpaIcon,
//   People as PeopleIcon,
//   Description as DescriptionIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon
// } from "@mui/icons-material";

// const SpecialRequestForm = ({ open, onClose, request, onUpdateStatus, processing }) => {
//   const [newStatus, setNewStatus] = useState('pending');

//   useEffect(() => {
//     if (request) {
//       setNewStatus(request.status);
//     }
//   }, [request]);

//   const handleSubmit = () => {
//     onUpdateStatus(request.id, newStatus);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString();
//   };

//   const formatTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleTimeString();
//   };

//   // Format date for input field (YYYY-MM-DD)
//   const formatDateForInput = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toISOString().split('T')[0];
//   };

//   if (!request) return null;

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose} 
//       maxWidth="md" 
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: "12px",
//           background: "linear-gradient(to right bottom, #F7F4F0, #FFFFFF)"
//         }
//       }}
//     >
//       <DialogTitle sx={{ 
//         color: "#453C33",
//         fontFamily: "'Poppins', 'Roboto', sans-serif",
//         fontWeight: 500,
//         borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
//         pb: 2
//       }}>
//         Special Request Review
//       </DialogTitle>
      
//       <DialogContent dividers sx={{ p: 3 }}>
//         <Box component="form">
//           {/* Form title */}
//           <Box sx={{ mb: 3 }}>
//             <Typography 
//               variant="h5" 
//               component="h2"
//               sx={{ 
//                 color: "#453C33",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 fontWeight: 500,
//                 mb: 1
//               }}
//             >
//               Special Request #{request.id}
//             </Typography>
//             <Typography 
//               variant="body2" 
//               sx={{ 
//                 color: "text.secondary",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//               }}
//             >
//               Review the request details and update the status if needed
//             </Typography>
//           </Box>

//           <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
//             {/* Customer Details section */}
//             <Paper 
//               elevation={0} 
//               sx={{ 
//                 p: 2.5, 
//                 borderRadius: "8px",
//                 border: "1px solid rgba(190, 175, 155, 0.3)",
//                 background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
//               }}
//             >
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <PersonIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//                 <Typography 
//                   variant="subtitle1" 
//                   sx={{ 
//                     fontWeight: 600, 
//                     color: "#453C33",
//                     fontFamily: "'Poppins', 'Roboto', sans-serif",
//                   }}
//                 >
//                   Customer Details
//                 </Typography>
//               </Box>
//               <TextField
//                 label="Full Name"
//                 value={`${request.first_name} ${request.last_name}`}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <PersonIcon sx={{ color: "#BEAF9B" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                     '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                     '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                   },
//                   '& .Mui-focused': { color: '#BEAF9B' },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//               <TextField
//                 label="Email"
//                 value={request.email}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <EmailIcon sx={{ color: "#BEAF9B" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                     '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                     '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                   },
//                   '& .Mui-focused': { color: '#BEAF9B' },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//               <TextField
//                 label="Phone Number"
//                 value={request.phone_number}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <PhoneIcon sx={{ color: "#BEAF9B" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                     '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                     '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                   },
//                   '& .Mui-focused': { color: '#BEAF9B' },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//             </Paper>

//             {/* Request Details section */}
//             <Paper 
//               elevation={0} 
//               sx={{ 
//                 p: 2.5, 
//                 borderRadius: "8px",
//                 border: "1px solid rgba(190, 175, 155, 0.3)",
//                 background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
//               }}
//             >
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <SpaIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//                 <Typography 
//                   variant="subtitle1" 
//                   sx={{ 
//                     fontWeight: 600, 
//                     color: "#453C33",
//                     fontFamily: "'Poppins', 'Roboto', sans-serif",
//                   }}
//                 >
//                   Request Information
//                 </Typography>
//               </Box>
//               <TextField
//                 label="Service Type"
//                 value={request.service_type || 'Not specified'}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SpaIcon sx={{ color: "#BEAF9B" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                     '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                     '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                   },
//                   '& .Mui-focused': { color: '#BEAF9B' },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//               <TextField
//                 label="Date Submitted"
//                 value={formatDateForInput(request.created_at)}
//                 type="date"
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <CalendarIcon sx={{ color: "#BEAF9B" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 InputLabelProps={{ shrink: true }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                     '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                     '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                   },
//                   '& .Mui-focused': { color: '#BEAF9B' },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//               <TextField
//                 label="Time Submitted"
//                 value={formatTime(request.created_at)}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <CalendarIcon sx={{ color: "#BEAF9B" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                     '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                     '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                   },
//                   '& .Mui-focused': { color: '#BEAF9B' },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//             </Paper>

//             {/* Request Details section */}
//             <Paper 
//               elevation={0} 
//               sx={{ 
//                 p: 2.5, 
//                 borderRadius: "8px",
//                 border: "1px solid rgba(190, 175, 155, 0.3)",
//                 background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))",
//                 gridColumn: '1 / -1'
//               }}
//             >
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <DescriptionIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//                 <Typography 
//                   variant="subtitle1" 
//                   sx={{ 
//                     fontWeight: 600, 
//                     color: "#453C33",
//                     fontFamily: "'Poppins', 'Roboto', sans-serif",
//                   }}
//                 >
//                   Request Details
//                 </Typography>
//               </Box>
//               <TextField
//                 label="Request Details"
//                 value={request.request_details}
//                 fullWidth
//                 margin="normal"
//                 multiline
//                 rows={4}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                     '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                     '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                   },
//                   '& .Mui-focused': { color: '#BEAF9B' },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//             </Paper>

//             {/* Status Update section */}
//             <Paper 
//               elevation={0} 
//               sx={{ 
//                 p: 2.5, 
//                 borderRadius: "8px",
//                 border: "1px solid rgba(190, 175, 155, 0.3)",
//                 background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))",
//                 gridColumn: '1 / -1'
//               }}
//             >
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <PeopleIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//                 <Typography 
//                   variant="subtitle1" 
//                   sx={{ 
//                     fontWeight: 600, 
//                     color: "#453C33",
//                     fontFamily: "'Poppins', 'Roboto', sans-serif",
//                   }}
//                 >
//                   Update Status
//                 </Typography>
//               </Box>
//               <FormControl fullWidth margin="normal">
//                 <InputLabel sx={{ '&.Mui-focused': { color: '#BEAF9B' } }}>
//                   Request Status
//                 </InputLabel>
//                 <Select
//                   value={newStatus}
//                   onChange={(e) => setNewStatus(e.target.value)}
//                   sx={{
//                     '& .MuiOutlinedInput-notchedOutline': {
//                       borderColor: 'rgba(190, 175, 155, 0.3)',
//                     },
//                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                       borderColor: 'rgba(190, 175, 155, 0.5)',
//                     },
//                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                       borderColor: '#BEAF9B',
//                     },
//                   }}
//                 >
//                   <MenuItem value="pending">
//                     <Chip 
//                       label="Pending" 
//                       size="small" 
//                       sx={{ 
//                         backgroundColor: "#ff9800",
//                         color: 'white',
//                         minWidth: '80px',
//                         justifyContent: 'center'
//                       }} 
//                     />
//                   </MenuItem>
//                   <MenuItem value="approved">
//                     <Chip 
//                       label="Approved" 
//                       size="small" 
//                       sx={{ 
//                         backgroundColor: "#4caf50",
//                         color: 'white',
//                         minWidth: '80px',
//                         justifyContent: 'center'
//                       }} 
//                     />
//                   </MenuItem>
//                   <MenuItem value="rejected">
//                     <Chip 
//                       label="Rejected" 
//                       size="small" 
//                       sx={{ 
//                         backgroundColor: "#f44336",
//                         color: 'white',
//                         minWidth: '80px',
//                         justifyContent: 'center'
//                       }} 
//                     />
//                   </MenuItem>
//                   <MenuItem value="completed">
//                     <Chip 
//                       label="Completed" 
//                       size="small" 
//                       sx={{ 
//                         backgroundColor: "#2196f3",
//                         color: 'white',
//                         minWidth: '80px',
//                         justifyContent: 'center'
//                       }} 
//                     />
//                   </MenuItem>
//                 </Select>
//               </FormControl>
//             </Paper>
//           </Box>
//         </Box>
//       </DialogContent>
      
//       <DialogActions sx={{ 
//         padding: "20px",
//         borderTop: "1px dashed rgba(190, 175, 155, 0.3)"
//       }}>
//         <Button 
//           onClick={handleSubmit} 
//           variant="contained"
//           startIcon={<SaveIcon />}
//           disabled={processing || (request && request.status === newStatus)}
//           sx={{ 
//             backgroundColor: "#BEAF9B", 
//             color: "white", 
//             fontFamily: "'Poppins', 'Roboto', sans-serif",
//             fontWeight: 500,
//             boxShadow: "0 2px 6px rgba(190, 175, 155, 0.3)",
//             transition: "transform 0.3s ease, box-shadow 0.3s ease",
//             px: 3,
//             '&:hover': { 
//               backgroundColor: "#A89583",
//               transform: "translateY(-2px)",
//               boxShadow: "0 4px 10px rgba(190, 175, 155, 0.4)"
//             }
//           }}
//         >
//           {processing ? <CircularProgress size={24} color="inherit" /> : 'Update Status'}
//         </Button>
//         <Button 
//           onClick={onClose} 
//           disabled={processing}
//           sx={{ 
//             color: "#453C33", 
//             fontFamily: "'Poppins', 'Roboto', sans-serif",
//             fontWeight: 500,
//             '&:hover': { 
//               backgroundColor: "rgba(190, 175, 155, 0.1)" 
//             } 
//           }}
//         >
//           Cancel
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default SpecialRequestForm;




























// import React, { useState, useEffect } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Box, Typography, TextField, Button, CircularProgress,
//   Paper, FormControl, InputLabel, Select, MenuItem, Chip,
//   InputAdornment, FormHelperText
// } from '@mui/material';
// import {
//   Save as SaveIcon,
//   Person as PersonIcon,
//   CalendarToday as CalendarIcon,
//   Spa as SpaIcon,
//   People as PeopleIcon,
//   Description as DescriptionIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   AccessTime as TimeIcon,
//   ContentCut as StylistIcon
// } from "@mui/icons-material";

// const SpecialRequestForm = ({ open, onClose, request, onUpdateStatus, processing }) => {
//   const [newStatus, setNewStatus] = useState('pending');
//   const [stylists, setStylists] = useState([]);
//   const [selectedStylist, setSelectedStylist] = useState('');
//   const [isLoadingStylists, setIsLoadingStylists] = useState(false);
//   const [stylistsError, setStylistsError] = useState('');

//   useEffect(() => {
//     if (request) {
//       setNewStatus(request.status);
//       if (request.stylist_id) {
//         setSelectedStylist(request.stylist_id);
//       } else {
//         setSelectedStylist('');
//       }
//     }
//   }, [request]);

//   // Fetch stylists when the form opens
//   useEffect(() => {
//     if (open) {
//       console.log('Form opened, fetching stylists...');
//       fetchStylists();
//     }
//   }, [open]);
  
//   // Debug logging for stylists state changes
//   useEffect(() => {
//     console.log('Stylists state updated:', stylists);
//   }, [stylists]);

//   const fetchStylists = async () => {
//   try {
//     setIsLoadingStylists(true);
//     setStylistsError('');
//     console.log('Fetching stylists from API...');
//     const response = await fetch('http://localhost:5001/api/stylists');
    
//     if (!response.ok) {
//       throw new Error(`Failed to fetch stylists (${response.status})`);
//     }
    
//     const data = await response.json();
//     console.log('Stylists received:', data);
    
//     // Check if data is an array
//     if (Array.isArray(data)) {
//       setStylists(data);
//     } else if (data.stylists && Array.isArray(data.stylists)) {
//       // If data is wrapped in an object with a 'stylists' property
//       setStylists(data.stylists);
//     } else {
//       throw new Error('Invalid stylists data format');
//     }
//   } catch (error) {
//     console.error('Error fetching stylists:', error);
//     setStylistsError('Failed to load stylists. Please try again.');
//   } finally {
//     setIsLoadingStylists(false);
//   }
// };

//   const handleSubmit = () => {
//     // Include the selected stylist in the update
//     onUpdateStatus(request.id, newStatus, selectedStylist);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString();
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return 'N/A';
//     // Handle TIME fields (preferred_time)
//     if (typeof timeString === 'string') {
//       const [hours, minutes] = timeString.split(':');
//       const time = new Date();
//       time.setHours(hours, minutes);
//       return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     }
//     // Handle TIMESTAMP fields (created_at)
//     return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   // Format date for input field (YYYY-MM-DD)
//   const formatDateForInput = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const offset = date.getTimezoneOffset();
//     const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
//     return adjustedDate.toISOString().split('T')[0];
//   };

//   if (!request) return null;

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose} 
//       maxWidth="md" 
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: "12px",
//           background: "linear-gradient(to right bottom, #F7F4F0, #FFFFFF)"
//         }
//       }}
//     >
//       <DialogTitle sx={{ 
//         color: "#453C33",
//         fontFamily: "'Poppins', 'Roboto', sans-serif",
//         fontWeight: 500,
//         borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
//         pb: 2
//       }}>
//         Special Request Review
//       </DialogTitle>
      
//       <DialogContent dividers sx={{ p: 3 }}>
//         <Box component="form">
//           {/* Form title */}
//           <Box sx={{ mb: 3 }}>
//             <Typography 
//               variant="h5" 
//               component="h2"
//               sx={{ 
//                 color: "#453C33",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 fontWeight: 500,
//                 mb: 1
//               }}
//             >
//               Special Request #{request.id}
//             </Typography>
//             <Typography 
//               variant="body2" 
//               sx={{ 
//                 color: "text.secondary",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//               }}
//             >
//               Review the request details and update the status if needed
//             </Typography>
//           </Box>

//           <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
//             {/* Customer Details section */}
//             <Paper 
//               elevation={0} 
//               sx={{ 
//                 p: 2.5, 
//                 borderRadius: "8px",
//                 border: "1px solid rgba(190, 175, 155, 0.3)",
//                 background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
//               }}
//             >
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <PersonIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//                 <Typography 
//                   variant="subtitle1" 
//                   sx={{ 
//                     fontWeight: 600, 
//                     color: "#453C33",
//                     fontFamily: "'Poppins', 'Roboto', sans-serif",
//                   }}
//                 >
//                   Customer Details
//                 </Typography>
//               </Box>
//               <TextField
//                 label="Full Name"
//                 value={`${request.first_name} ${request.last_name}`}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <PersonIcon sx={{ color: "#BEAF9B" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                     '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                     '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                   },
//                   '& .Mui-focused': { color: '#BEAF9B' },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//               <TextField
//                 label="Email"
//                 value={request.email}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <EmailIcon sx={{ color: "#BEAF9B" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                     '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                     '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                   },
//                   '& .Mui-focused': { color: '#BEAF9B' },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//               <TextField
//                 label="Phone Number"
//                 value={request.phone_number}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <PhoneIcon sx={{ color: "#BEAF9B" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                     '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                     '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                   },
//                   '& .Mui-focused': { color: '#BEAF9B' },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//             </Paper>

//             {/* Request Details section */}
//             <Paper 
//               elevation={0} 
//               sx={{ 
//                 p: 2.5, 
//                 borderRadius: "8px",
//                 border: "1px solid rgba(190, 175, 155, 0.3)",
//                 background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
//               }}
//             >
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <SpaIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//                 <Typography 
//                   variant="subtitle1" 
//                   sx={{ 
//                     fontWeight: 600, 
//                     color: "#453C33",
//                     fontFamily: "'Poppins', 'Roboto', sans-serif",
//                   }}
//                 >
//                   Request Information
//                 </Typography>
//               </Box>
//               <TextField
//                 label="Service"
//                 value={request.service_name || 'Not specified'}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SpaIcon sx={{ color: "#BEAF9B" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                     '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                     '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                   },
//                   '& .Mui-focused': { color: '#BEAF9B' },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//               <TextField
//                 label="Preferred Date"
//                 value={formatDateForInput(request.preferred_date)}
//                 type="date"
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <CalendarIcon sx={{ color: "#BEAF9B" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 InputLabelProps={{ shrink: true }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                     '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                     '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                   },
//                   '& .Mui-focused': { color: '#BEAF9B' },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//               <TextField
//                 label="Preferred Time"
//                 value={formatTime(request.preferred_time)}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <TimeIcon sx={{ color: "#BEAF9B" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                     '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                     '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                   },
//                   '& .Mui-focused': { color: '#BEAF9B' },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//             </Paper>

//             {/* Request Details section */}
//             <Paper 
//               elevation={0} 
//               sx={{ 
//                 p: 2.5, 
//                 borderRadius: "8px",
//                 border: "1px solid rgba(190, 175, 155, 0.3)",
//                 background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))",
//                 gridColumn: '1 / -1'
//               }}
//             >
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <DescriptionIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//                 <Typography 
//                   variant="subtitle1" 
//                   sx={{ 
//                     fontWeight: 600, 
//                     color: "#453C33",
//                     fontFamily: "'Poppins', 'Roboto', sans-serif",
//                   }}
//                 >
//                   Request Details
//                 </Typography>
//               </Box>
//               <TextField
//                 label="Request Details"
//                 value={request.request_details}
//                 fullWidth
//                 margin="normal"
//                 multiline
//                 rows={4}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: 'rgba(190, 175, 155, 0.3)' },
//                     '&:hover fieldset': { borderColor: 'rgba(190, 175, 155, 0.5)' },
//                     '&.Mui-focused fieldset': { borderColor: '#BEAF9B' },
//                   },
//                   '& .Mui-focused': { color: '#BEAF9B' },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//             </Paper>

//             {/* Status Update section */}
//             <Paper 
//               elevation={0} 
//               sx={{ 
//                 p: 2.5, 
//                 borderRadius: "8px",
//                 border: "1px solid rgba(190, 175, 155, 0.3)",
//                 background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))",
//                 gridColumn: '1 / -1'
//               }}
//             >
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <PeopleIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//                 <Typography 
//                   variant="subtitle1" 
//                   sx={{ 
//                     fontWeight: 600, 
//                     color: "#453C33",
//                     fontFamily: "'Poppins', 'Roboto', sans-serif",
//                   }}
//                 >
//                   Update Request
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
//                 {/* Status field */}
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel sx={{ '&.Mui-focused': { color: '#BEAF9B' } }}>
//                     Request Status
//                   </InputLabel>
//                   <Select
//                     value={newStatus}
//                     onChange={(e) => setNewStatus(e.target.value)}
//                     sx={{
//                       '& .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'rgba(190, 175, 155, 0.3)',
//                       },
//                       '&:hover .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'rgba(190, 175, 155, 0.5)',
//                       },
//                       '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                         borderColor: '#BEAF9B',
//                       },
//                     }}
//                   >
//                     <MenuItem value="pending">
//                       <Chip 
//                         label="Pending" 
//                         size="small" 
//                         sx={{ 
//                           backgroundColor: "#ff9800",
//                           color: 'white',
//                           minWidth: '80px',
//                           justifyContent: 'center'
//                         }} 
//                       />
//                     </MenuItem>
//                     <MenuItem value="approved">
//                       <Chip 
//                         label="Approved" 
//                         size="small" 
//                         sx={{ 
//                           backgroundColor: "#4caf50",
//                           color: 'white',
//                           minWidth: '80px',
//                           justifyContent: 'center'
//                         }} 
//                       />
//                     </MenuItem>
//                     <MenuItem value="rejected">
//                       <Chip 
//                         label="Rejected" 
//                         size="small"
//                         sx={{ 
//                           backgroundColor: "#f44336",
//                           color: 'white',
//                           minWidth: '80px',
//                           justifyContent: 'center'
//                         }} 
//                       />
//                     </MenuItem>
//                     <MenuItem value="completed">
//                       <Chip 
//                         label="Completed" 
//                         size="small" 
//                         sx={{ 
//                           backgroundColor: "#2196f3",
//                           color: 'white',
//                           minWidth: '80px',
//                           justifyContent: 'center'
//                         }} 
//                       />
//                     </MenuItem>
//                   </Select>
//                 </FormControl>

//                 {/* Stylist field */}
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel sx={{ '&.Mui-focused': { color: '#BEAF9B' } }}>
//                     Assigned Stylist
//                   </InputLabel>
//                   <Select
//   value={selectedStylist}
//   onChange={(e) => setSelectedStylist(e.target.value)}
//   disabled={isLoadingStylists}
//   startAdornment={
//     <InputAdornment position="start" sx={{ ml: 2 }}>
//       <StylistIcon sx={{ color: "#BEAF9B" }} />
//     </InputAdornment>
//   }
//   sx={{
//     '& .MuiOutlinedInput-notchedOutline': {
//       borderColor: 'rgba(190, 175, 155, 0.3)',
//     },
//     '&:hover .MuiOutlinedInput-notchedOutline': {
//       borderColor: 'rgba(190, 175, 155, 0.5)',
//     },
//     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//       borderColor: '#BEAF9B',
//     },
//   }}
// >
//   <MenuItem value="">
//     <em>Not assigned</em>
//   </MenuItem>
//   {isLoadingStylists ? (
//     <MenuItem disabled>
//       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//         <CircularProgress size={20} sx={{ mr: 1 }} />
//         Loading stylists...
//       </Box>
//     </MenuItem>
//   ) : stylists.length > 0 ? (
//     stylists.map((stylist) => (
//       <MenuItem key={stylist.stylist_ID} value={stylist.stylist_ID}>
//         {stylist.firstname} {stylist.lastname}
//       </MenuItem>
//     ))
//   ) : (
//     <MenuItem disabled>
//       <em>No stylists available</em>
//     </MenuItem>
//   )}
// </Select>
//                   {stylistsError && (
//                     <FormHelperText error>{stylistsError}</FormHelperText>
//                   )}
//                 </FormControl>
//               </Box>
//             </Paper>
//           </Box>
//         </Box>
//       </DialogContent>
      
//       <DialogActions sx={{ 
//         padding: "20px",
//         borderTop: "1px dashed rgba(190, 175, 155, 0.3)"
//       }}>
//         <Button 
//           onClick={handleSubmit} 
//           variant="contained"
//           startIcon={<SaveIcon />}
//           disabled={processing || (request && request.status === newStatus && request.stylist_id === selectedStylist)}
//           sx={{ 
//             backgroundColor: "#BEAF9B", 
//             color: "white", 
//             fontFamily: "'Poppins', 'Roboto', sans-serif",
//             fontWeight: 500,
//             boxShadow: "0 2px 6px rgba(190, 175, 155, 0.3)",
//             transition: "transform 0.3s ease, box-shadow 0.3s ease",
//             px: 3,
//             '&:hover': { 
//               backgroundColor: "#A89583",
//               transform: "translateY(-2px)",
//               boxShadow: "0 4px 10px rgba(190, 175, 155, 0.4)"
//             }
//           }}
//         >
//           {processing ? <CircularProgress size={24} color="inherit" /> : 'Update Request'}
//         </Button>
//         <Button 
//           onClick={onClose} 
//           disabled={processing}
//           sx={{ 
//             color: "#453C33", 
//             fontFamily: "'Poppins', 'Roboto', sans-serif",
//             fontWeight: 500,
//             '&:hover': { 
//               backgroundColor: "rgba(190, 175, 155, 0.1)" 
//             } 
//           }}
//         >
//           Cancel
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default SpecialRequestForm;






















// import React, { useState, useEffect } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Box, Typography, TextField, Button, CircularProgress,
//   Paper, FormControl, InputLabel, Select, MenuItem, Chip,
//   InputAdornment, FormHelperText
// } from '@mui/material';
// import {
//   Save as SaveIcon,
//   Person as PersonIcon,
//   CalendarToday as CalendarIcon,
//   Spa as SpaIcon,
//   People as PeopleIcon,
//   Description as DescriptionIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   AccessTime as TimeIcon,
//   ContentCut as StylistIcon
// } from "@mui/icons-material";

// const SpecialRequestForm = ({ open, onClose, request, onUpdateStatus, processing }) => {
//   const [newStatus, setNewStatus] = useState('pending');
//   const [stylists, setStylists] = useState([]);
//   const [selectedStylist, setSelectedStylist] = useState('');
//   const [isLoadingStylists, setIsLoadingStylists] = useState(false);
//   const [stylistsError, setStylistsError] = useState('');

//   useEffect(() => {
//     if (request) {
//       setNewStatus(request.status);
//       if (request.stylist_id) {
//         setSelectedStylist(request.stylist_id);
//       } else {
//         setSelectedStylist('');
//       }
//     }
//   }, [request]);

//   useEffect(() => {
//     if (open) {
//       console.log('Form opened, fetching stylists...');
//       fetchStylists();
//     }
//   }, [open]);
  
//   useEffect(() => {
//     console.log('Stylists state updated:', stylists);
//   }, [stylists]);

//   const fetchStylists = async () => {
//     try {
//       setIsLoadingStylists(true);
//       setStylistsError('');
//       console.log('Fetching stylists from API...');
//       const response = await fetch('http://localhost:5001/api/stylists');
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch stylists (${response.status})`);
//       }
      
//       const data = await response.json();
//       console.log('Stylists received:', data);
      
//       if (Array.isArray(data)) {
//         setStylists(data);
//       } else if (data.stylists && Array.isArray(data.stylists)) {
//         setStylists(data.stylists);
//       } else {
//         throw new Error('Invalid stylists data format');
//       }
//     } catch (error) {
//       console.error('Error fetching stylists:', error);
//       setStylistsError('Failed to load stylists. Please try again.');
//     } finally {
//       setIsLoadingStylists(false);
//     }
//   };

//   const handleSubmit = () => {
//     onUpdateStatus(request.id, newStatus, selectedStylist);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString();
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return 'N/A';
//     if (typeof timeString === 'string') {
//       const [hours, minutes] = timeString.split(':');
//       const time = new Date();
//       time.setHours(hours, minutes);
//       return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     }
//     return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const formatDateForInput = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const offset = date.getTimezoneOffset();
//     const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
//     return adjustedDate.toISOString().split('T')[0];
//   };

//   if (!request) return null;

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose} 
//       maxWidth="md" 
//       fullWidth
//     >
//       <DialogTitle>
//         Special Request Review
//       </DialogTitle>
      
//       <DialogContent dividers>
//         <Box component="form">
//           <Box>
//             <Typography variant="h5" component="h2">
//               Special Request #{request.id}
//             </Typography>
//             <Typography variant="body2">
//               Review the request details and update the status if needed
//             </Typography>
//           </Box>

//           <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
//             {/* Customer Details section */}
//             <Paper sx={{ p: 2 }}>
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <PersonIcon sx={{ mr: 1 }} />
//                 <Typography variant="subtitle1">
//                   Customer Details
//                 </Typography>
//               </Box>
//               <TextField
//                 label="Full Name"
//                 value={`${request.first_name} ${request.last_name}`}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <PersonIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <TextField
//                 label="Email"
//                 value={request.email}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <EmailIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <TextField
//                 label="Phone Number"
//                 value={request.phone_number}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <PhoneIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Paper>

//             {/* Request Details section */}
//             <Paper sx={{ p: 2 }}>
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <SpaIcon sx={{ mr: 1 }} />
//                 <Typography variant="subtitle1">
//                   Request Information
//                 </Typography>
//               </Box>
//               <TextField
//                 label="Service"
//                 value={request.service_name || 'Not specified'}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SpaIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <TextField
//                 label="Preferred Date"
//                 value={formatDateForInput(request.preferred_date)}
//                 type="date"
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <CalendarIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//                 InputLabelProps={{ shrink: true }}
//               />
//               <TextField
//                 label="Preferred Time"
//                 value={formatTime(request.preferred_time)}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <TimeIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Paper>

//             {/* Request Details section */}
//             <Paper sx={{ p: 2, gridColumn: '1 / -1' }}>
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <DescriptionIcon sx={{ mr: 1 }} />
//                 <Typography variant="subtitle1">
//                   Request Details
//                 </Typography>
//               </Box>
//               <TextField
//                 label="Request Details"
//                 value={request.request_details}
//                 fullWidth
//                 margin="normal"
//                 multiline
//                 rows={4}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//               />
//             </Paper>

//             {/* Status Update section */}
//             <Paper sx={{ p: 2, gridColumn: '1 / -1' }}>
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <PeopleIcon sx={{ mr: 1 }} />
//                 <Typography variant="subtitle1">
//                   Update Request
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
//                 {/* Status field */}
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel>
//                     Request Status
//                   </InputLabel>
//                   <Select
//                     value={newStatus}
//                     onChange={(e) => setNewStatus(e.target.value)}
//                   >
//                     <MenuItem value="pending">
//                       <Chip 
//                         label="Pending" 
//                         size="small" 
//                         sx={{ backgroundColor: "#ff9800", color: 'white' }} 
//                       />
//                     </MenuItem>
//                     <MenuItem value="approved">
//                       <Chip 
//                         label="Approved" 
//                         size="small" 
//                         sx={{ backgroundColor: "#4caf50", color: 'white' }} 
//                       />
//                     </MenuItem>
//                     <MenuItem value="rejected">
//                       <Chip 
//                         label="Rejected" 
//                         size="small"
//                         sx={{ backgroundColor: "#f44336", color: 'white' }} 
//                       />
//                     </MenuItem>
//                     <MenuItem value="completed">
//                       <Chip 
//                         label="Completed" 
//                         size="small" 
//                         sx={{ backgroundColor: "#2196f3", color: 'white' }} 
//                       />
//                     </MenuItem>
//                   </Select>
//                 </FormControl>

//                 {/* Stylist field */}
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel>
//                     Assigned Stylist
//                   </InputLabel>
//                   <Select
//                     value={selectedStylist}
//                     onChange={(e) => setSelectedStylist(e.target.value)}
//                     disabled={isLoadingStylists}
//                     startAdornment={
//                       <InputAdornment position="start">
//                         <StylistIcon />
//                       </InputAdornment>
//                     }
//                   >
//                     <MenuItem value="">
//                       <em>Not assigned</em>
//                     </MenuItem>
//                     {isLoadingStylists ? (
//                       <MenuItem disabled>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <CircularProgress size={20} sx={{ mr: 1 }} />
//                           Loading stylists...
//                         </Box>
//                       </MenuItem>
//                     ) : stylists.length > 0 ? (
//                       stylists.map((stylist) => (
//                         <MenuItem key={stylist.stylist_ID} value={stylist.stylist_ID}>
//                           {stylist.firstname} {stylist.lastname}
//                         </MenuItem>
//                       ))
//                     ) : (
//                       <MenuItem disabled>
//                         <em>No stylists available</em>
//                       </MenuItem>
//                     )}
//                   </Select>
//                   {stylistsError && (
//                     <FormHelperText error>{stylistsError}</FormHelperText>
//                   )}
//                 </FormControl>
//               </Box>
//             </Paper>
//           </Box>
//         </Box>
//       </DialogContent>
      
//       <DialogActions>
//         <Button 
//           onClick={handleSubmit} 
//           variant="contained"
//           startIcon={<SaveIcon />}
//           disabled={processing || (request && request.status === newStatus && request.stylist_id === selectedStylist)}
//           color="primary"
//         >
//           {processing ? <CircularProgress size={24} color="inherit" /> : 'Update Request'}
//         </Button>
//         <Button 
//           onClick={onClose} 
//           disabled={processing}
//         >
//           Cancel
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default SpecialRequestForm;





// import React, { useState, useEffect } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Box, Typography, TextField, Button, CircularProgress,
//   Paper, FormControl, InputLabel, Select, MenuItem, Chip,
//   InputAdornment, FormHelperText, Snackbar, Alert
// } from '@mui/material';
// import {
//   Save as SaveIcon,
//   Person as PersonIcon,
//   CalendarToday as CalendarIcon,
//   Spa as SpaIcon,
//   People as PeopleIcon,
//   Description as DescriptionIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   AccessTime as TimeIcon,
//   ContentCut as StylistIcon
// } from "@mui/icons-material";

// const SpecialRequestForm = ({ open, onClose, request, onUpdateStatus, processing }) => {
//   const [newStatus, setNewStatus] = useState('pending');
//   const [stylists, setStylists] = useState([]);
//   const [selectedStylist, setSelectedStylist] = useState('');
//   const [isLoadingStylists, setIsLoadingStylists] = useState(false);
//   const [stylistsError, setStylistsError] = useState('');
//   const [showAppointmentModal, setShowAppointmentModal] = useState(false);
//   const [appointmentSuccess, setAppointmentSuccess] = useState(false);
//   const [appointmentError, setAppointmentError] = useState('');
//   const [services, setServices] = useState([]);
//   const [paymentAmount, setPaymentAmount] = useState(0);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [newAppointmentId, setNewAppointmentId] = useState(null);

//   useEffect(() => {
//     if (request) {
//       setNewStatus(request.status);
//       if (request.stylist_id) {
//         setSelectedStylist(request.stylist_id);
//       } else {
//         setSelectedStylist('');
//       }
//     }
//   }, [request]);

//   useEffect(() => {
//     if (open) {
//       console.log('Form opened, fetching stylists and services...');
//       fetchStylists();
//       fetchServices();
//     }
//   }, [open]);
  
//   useEffect(() => {
//     console.log('Stylists state updated:', stylists);
//   }, [stylists]);
  
//   useEffect(() => {
//     if (request && services.length > 0) {
//       // Calculate payment amount when request or services change
//       calculatePaymentAmount();
//     }
//   }, [request, services]);

//   const fetchStylists = async () => {
//     try {
//       setIsLoadingStylists(true);
//       setStylistsError('');
//       console.log('Fetching stylists from API...');
//       const response = await fetch('http://localhost:5001/api/stylists');
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch stylists (${response.status})`);
//       }
      
//       const data = await response.json();
//       console.log('Stylists received:', data);
      
//       if (Array.isArray(data)) {
//         setStylists(data);
//       } else if (data.stylists && Array.isArray(data.stylists)) {
//         setStylists(data.stylists);
//       } else {
//         throw new Error('Invalid stylists data format');
//       }
//     } catch (error) {
//       console.error('Error fetching stylists:', error);
//       setStylistsError('Failed to load stylists. Please try again.');
//     } finally {
//       setIsLoadingStylists(false);
//     }
//   };
  
//   const fetchServices = async () => {
//     try {
//       console.log('Fetching services from API...');
//       const response = await fetch('http://localhost:5001/api/services');
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch services (${response.status})`);
//       }
      
//       const data = await response.json();
//       console.log('Services received:', data);
      
//       if (Array.isArray(data)) {
//         setServices(data);
//       } else if (data.services && Array.isArray(data.services)) {
//         setServices(data.services);
//       } else {
//         throw new Error('Invalid services data format');
//       }
//     } catch (error) {
//       console.error('Error fetching services:', error);
//     }
//   };
  
//   const calculatePaymentAmount = () => {
//     if (!services.length || !request || !request.service_id) return 0;
    
//     // Find the service that matches the request's service_id
//     const serviceObj = services.find(s => s.service_id === request.service_id);
    
//     if (serviceObj && serviceObj.price) {
//       const amount = parseFloat(serviceObj.price);
//       setPaymentAmount(amount);
//       return amount;
//     }
    
//     setPaymentAmount(0);
//     return 0;
//   };

//   const handleSubmit = () => {
//     onUpdateStatus(request.id, newStatus, selectedStylist);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString();
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return 'N/A';
//     if (typeof timeString === 'string') {
//       const [hours, minutes] = timeString.split(':');
//       const time = new Date();
//       time.setHours(hours, minutes);
//       return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     }
//     return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const formatDateForInput = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const offset = date.getTimezoneOffset();
//     const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
//     return adjustedDate.toISOString().split('T')[0];
//   };

//   const handleCreateAppointment = async () => {
//     setShowAppointmentModal(false);
//     try {
//       // Calculate the payment amount one more time before creating appointment
//       const amount = calculatePaymentAmount();
      
//       // Build appointment object from request data - updated to match backend expectations
//       const appointment = {
//         customer_ID: request.customer_id, // Changed to match backend field name
//         appointment_date: request.preferred_date,
//         appointment_time: request.preferred_time,
//         appointment_status: 'Scheduled', // Capitalized to match backend
//         serviceStylists: selectedStylist ? [
//           {
//             service_ID: request.service_id, // Changed to match backend field name
//             stylist_ID: selectedStylist, // Changed to match backend field name
//           }
//         ] : [],
//         payment_status: 'Pending', // Capitalized to match backend
//         payment_amount: amount,
//         payment_type: 'Pay at Salon',
//         notes: `Created from special request #${request.id}: ${request.request_details}`
//       };
      
//       console.log('Sending appointment data:', appointment);
      
//       // Updated endpoint to match backend route
//       const response = await fetch('http://localhost:5001/api/admin/appointments', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(appointment)
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(`Failed to create appointment (${response.status}): ${errorData.message || ''}`);
//       }
      
//       // Parse response to get appointment details
//       const responseData = await response.json();
//       const appointmentId = responseData.data?.appointmentId || 'N/A';
      
//       // Set success state and message
//       setAppointmentSuccess(true);
//       setSuccessMessage(`Appointment #${appointmentId} has been created successfully!`);
//       setNewAppointmentId(appointmentId);
      
//       // Optionally update the original request status to completed
//       if (newStatus !== 'completed') {
//         onUpdateStatus(request.id, 'completed', selectedStylist);
//       }
//     } catch (error) {
//       console.error('Error creating appointment:', error);
//       setAppointmentError(`Failed to create appointment: ${error.message}`);
//     }
//   };

//   const handleDismissSuccess = () => {
//     setSuccessMessage('');
//     setNewAppointmentId(null);
//     onClose(); // Close the form after success
//   };

//   if (!request) return null;

//   // If we have a success message, show success view
//   if (successMessage) {
//     return (
//       <Dialog 
//         open={open} 
//         onClose={handleDismissSuccess}
//         maxWidth="sm" 
//         fullWidth
//       >
//         <DialogTitle sx={{ bgcolor: '#4caf50', color: 'white' }}>
//           Appointment Created Successfully
//         </DialogTitle>
        
//         <DialogContent dividers>
//           <Box sx={{ 
//             display: 'flex', 
//             flexDirection: 'column', 
//             alignItems: 'center',
//             py: 3 
//           }}>
//             <Box 
//               sx={{ 
//                 width: 70, 
//                 height: 70, 
//                 borderRadius: '50%', 
//                 bgcolor: '#e8f5e9', 
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 alignItems: 'center',
//                 mb: 2
//               }}
//             >
//               <SaveIcon sx={{ color: '#4caf50', fontSize: 40 }} />
//             </Box>
            
//             <Typography variant="h6" gutterBottom>
//               Success!
//             </Typography>
            
//             <Typography variant="body1" align="center" paragraph>
//               {successMessage}
//             </Typography>
            
//             {newAppointmentId && (
//               <Paper 
//                 elevation={1} 
//                 sx={{ 
//                   p: 2, 
//                   width: '100%', 
//                   mb: 2,
//                   bgcolor: '#f5f5f5',
//                   border: '1px solid #e0e0e0'
//                 }}
//               >
//                 <Typography variant="subtitle2" gutterBottom>
//                   Appointment Details:
//                 </Typography>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2">Appointment ID:</Typography>
//                   <Typography variant="body2" fontWeight="bold">#{newAppointmentId}</Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2">Customer:</Typography>
//                   <Typography variant="body2">{`${request.first_name} ${request.last_name}`}</Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2">Date & Time:</Typography>
//                   <Typography variant="body2">{formatDateForInput(request.preferred_date)} at {formatTime(request.preferred_time)}</Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="body2">Service:</Typography>
//                   <Typography variant="body2">{request.service_name || 'Not specified'}</Typography>
//                 </Box>
//               </Paper>
//             )}
//           </Box>
//         </DialogContent>
        
//         <DialogActions>
//           <Button 
//             onClick={handleDismissSuccess} 
//             variant="contained"
//             color="primary"
//             fullWidth
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     );
//   }

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose} 
//       maxWidth="md" 
//       fullWidth
//     >
//       <DialogTitle>
//         Special Request Review
//       </DialogTitle>
      
//       <DialogContent dividers>
//         <Box component="form">
//           <Box>
//             <Typography variant="h5" component="h2">
//               Special Request #{request.id}
//             </Typography>
//             <Typography variant="body2">
//               Review the request details and update the status if needed
//             </Typography>
//           </Box>

//           <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
//             {/* Customer Details section */}
//             <Paper sx={{ p: 2 }}>
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <PersonIcon sx={{ mr: 1 }} />
//                 <Typography variant="subtitle1">
//                   Customer Details
//                 </Typography>
//               </Box>
//               <TextField
//                 label="Full Name"
//                 value={`${request.first_name} ${request.last_name}`}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <PersonIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <TextField
//                 label="Email"
//                 value={request.email}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <EmailIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <TextField
//                 label="Phone Number"
//                 value={request.phone_number}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <PhoneIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Paper>

//             {/* Request Details section */}
//             <Paper sx={{ p: 2 }}>
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <SpaIcon sx={{ mr: 1 }} />
//                 <Typography variant="subtitle1">
//                   Request Information
//                 </Typography>
//               </Box>
//               <TextField
//                 label="Service"
//                 value={request.service_name || 'Not specified'}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SpaIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <TextField
//                 label="Preferred Date"
//                 value={formatDateForInput(request.preferred_date)}
//                 type="date"
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <CalendarIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//                 InputLabelProps={{ shrink: true }}
//               />
//               <TextField
//                 label="Preferred Time"
//                 value={formatTime(request.preferred_time)}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{
//                   readOnly: true,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <TimeIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Paper>

//             {/* Request Details section */}
//             <Paper sx={{ p: 2, gridColumn: '1 / -1' }}>
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <DescriptionIcon sx={{ mr: 1 }} />
//                 <Typography variant="subtitle1">
//                   Request Details
//                 </Typography>
//               </Box>
//               <TextField
//                 label="Request Details"
//                 value={request.request_details}
//                 fullWidth
//                 margin="normal"
//                 multiline
//                 rows={4}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//               />
//             </Paper>

//             {/* Status Update section */}
//             <Paper sx={{ p: 2, gridColumn: '1 / -1' }}>
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <PeopleIcon sx={{ mr: 1 }} />
//                 <Typography variant="subtitle1">
//                   Update Request
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
//                 {/* Status field */}
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel>
//                     Request Status
//                   </InputLabel>
//                   <Select
//                     value={newStatus}
//                     onChange={(e) => setNewStatus(e.target.value)}
//                   >
//                     <MenuItem value="pending">
//                       <Chip 
//                         label="Pending" 
//                         size="small" 
//                         sx={{ backgroundColor: "#ff9800", color: 'white' }} 
//                       />
//                     </MenuItem>
//                     <MenuItem value="approved">
//                       <Chip 
//                         label="Approved" 
//                         size="small" 
//                         sx={{ backgroundColor: "#4caf50", color: 'white' }} 
//                       />
//                     </MenuItem>
//                     <MenuItem value="rejected">
//                       <Chip 
//                         label="Rejected" 
//                         size="small"
//                         sx={{ backgroundColor: "#f44336", color: 'white' }} 
//                       />
//                     </MenuItem>
//                     <MenuItem value="completed">
//                       <Chip 
//                         label="Completed" 
//                         size="small" 
//                         sx={{ backgroundColor: "#2196f3", color: 'white' }} 
//                       />
//                     </MenuItem>
//                   </Select>
//                 </FormControl>

//                 {/* Stylist field */}
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel>
//                     Assigned Stylist
//                   </InputLabel>
//                   <Select
//                     value={selectedStylist}
//                     onChange={(e) => setSelectedStylist(e.target.value)}
//                     disabled={isLoadingStylists}
//                     startAdornment={
//                       <InputAdornment position="start">
//                         <StylistIcon />
//                       </InputAdornment>
//                     }
//                   >
//                     <MenuItem value="">
//                       <em>Not assigned</em>
//                     </MenuItem>
//                     {isLoadingStylists ? (
//                       <MenuItem disabled>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <CircularProgress size={20} sx={{ mr: 1 }} />
//                           Loading stylists...
//                         </Box>
//                       </MenuItem>
//                     ) : stylists.length > 0 ? (
//                       stylists.map((stylist) => (
//                         <MenuItem key={stylist.stylist_ID} value={stylist.stylist_ID}>
//                           {stylist.firstname} {stylist.lastname}
//                         </MenuItem>
//                       ))
//                     ) : (
//                       <MenuItem disabled>
//                         <em>No stylists available</em>
//                       </MenuItem>
//                     )}
//                   </Select>
//                   {stylistsError && (
//                     <FormHelperText error>{stylistsError}</FormHelperText>
//                   )}
//                 </FormControl>
//               </Box>
//             </Paper>
//           </Box>
//         </Box>
//       </DialogContent>
      
//       <DialogActions>
//         <Button 
//           onClick={handleSubmit} 
//           variant="contained"
//           startIcon={<SaveIcon />}
//           disabled={processing || (request && request.status === newStatus && request.stylist_id === selectedStylist)}
//           color="primary"
//         >
//           {processing ? <CircularProgress size={24} color="inherit" /> : 'Update Request'}
//         </Button>
//         <Button 
//           variant="contained"
//           color="secondary"
//           disabled={processing || newStatus !== 'approved'} // Removed stylist requirement
//           onClick={() => setShowAppointmentModal(true)}
//           sx={{ mx: 1 }}
//         >
//           Create Appointment
//         </Button>
//         <Button 
//           onClick={onClose} 
//           disabled={processing}
//         >
//           Cancel
//         </Button>
//       </DialogActions>
      
//       {/* Appointment Creation Modal */}
//       <Dialog open={showAppointmentModal} onClose={() => setShowAppointmentModal(false)} maxWidth="md" fullWidth>
//         <DialogTitle>Create Appointment from Request</DialogTitle>
//         <DialogContent dividers>
//           <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
//             {/* Customer Section */}
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="subtitle1" sx={{ mb: 2 }}>Customer Details</Typography>
//               <TextField
//                 label="Customer"
//                 value={`${request.first_name} ${request.last_name}`}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{ readOnly: true }}
//               />
//             </Paper>
            
//             {/* Appointment Details Section */}
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="subtitle1" sx={{ mb: 2 }}>Appointment Details</Typography>
//               <TextField
//                 label="Appointment Date"
//                 type="date"
//                 value={formatDateForInput(request.preferred_date)}
//                 fullWidth
//                 margin="normal"
//                 InputLabelProps={{ shrink: true }}
//                 InputProps={{ readOnly: true }}
//               />
//               <TextField
//                 label="Appointment Time"
//                 value={request.preferred_time}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{ readOnly: true }}
//               />
//             </Paper>
            
//             {/* Services Section */}
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="subtitle1" sx={{ mb: 2 }}>Services</Typography>
//               <TextField
//                 label="Service"
//                 value={request.service_name || "Not specified"}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{ readOnly: true }}
//               />
//               <FormControl fullWidth margin="normal">
//                 <InputLabel>Stylist</InputLabel>
//                 <Select 
//                   value={selectedStylist}
//                   onChange={(e) => setSelectedStylist(e.target.value)} // Made stylist selectable in modal
//                 >
//                   <MenuItem value="">
//                     <em>Not assigned</em>
//                   </MenuItem>
//                   {stylists.map((stylist) => (
//                     <MenuItem key={stylist.stylist_ID} value={stylist.stylist_ID}>
//                       {stylist.firstname} {stylist.lastname}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {/* Added helper text to indicate stylist is optional */}
//                 <FormHelperText>Optional: You can assign a stylist now or later</FormHelperText>
//               </FormControl>
//             </Paper>
            
//             {/* Status & Payment Section */}
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="subtitle1" sx={{ mb: 2 }}>Status & Payment</Typography>
//               <TextField
//                 label="Appointment Status"
//                 value="Scheduled"
//                 fullWidth
//                 margin="normal"
//                 InputProps={{ readOnly: true }}
//               />
              
//               <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
//                 <TextField
//                   label="Payment Amount"
//                   type="number"
//                   value={paymentAmount}
//                   fullWidth
//                   InputProps={{
//                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
//                     readOnly: true
//                   }}
//                 />
//                 <TextField
//                   label="Payment Status"
//                   value="Pending"
//                   fullWidth
//                   InputProps={{ readOnly: true }}
//                 />
//               </Box>
              
//               <TextField
//                 label="Payment Type"
//                 value="Pay at Salon"
//                 fullWidth
//                 margin="normal"
//                 InputProps={{ readOnly: true }}
//               />
//             </Paper>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCreateAppointment} variant="contained" color="primary">
//             Create Appointment
//           </Button>
//           <Button onClick={() => setShowAppointmentModal(false)}>
//             Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>
      
//       {/* Success message */}
//       <Snackbar 
//         open={appointmentSuccess} 
//         autoHideDuration={6000} 
//         onClose={() => setAppointmentSuccess(false)}
//       >
//         <Alert onClose={() => setAppointmentSuccess(false)} severity="success">
//           Appointment created successfully!
//         </Alert>
//       </Snackbar>
      
//       {/* Error message */}
//       <Snackbar 
//         open={!!appointmentError} 
//         autoHideDuration={6000} 
//         onClose={() => setAppointmentError('')}
//       >
//         <Alert onClose={() => setAppointmentError('')} severity="error">
//           {appointmentError}
//         </Alert>
//       </Snackbar>
//     </Dialog>
//   );
// };

// export default SpecialRequestForm;












import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, TextField, Button, CircularProgress,
  Paper, FormControl, InputLabel, Select, MenuItem, Chip,
  InputAdornment, FormHelperText, Snackbar, Alert
} from '@mui/material';
import {
  Save as SaveIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Spa as SpaIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccessTime as TimeIcon,
  ContentCut as StylistIcon
} from "@mui/icons-material";
import CreateAppointmentModal from './CreateAppointmentModal';

const SpecialRequestForm = ({ open, onClose, request, onUpdateStatus, processing }) => {
  const [newStatus, setNewStatus] = useState('pending');
  const [stylists, setStylists] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState('');
  const [isLoadingStylists, setIsLoadingStylists] = useState(false);
  const [stylistsError, setStylistsError] = useState('');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [appointmentError, setAppointmentError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [newAppointmentId, setNewAppointmentId] = useState(null);
  const [hasAppointmentCreated, setHasAppointmentCreated] = useState(false);

  useEffect(() => {
    if (request) {
      setNewStatus(request.status);
      if (request.stylist_id) {
        setSelectedStylist(request.stylist_id);
      } else {
        setSelectedStylist('');
      }
      
      // Check if this request already has an appointment created
      if (request.has_appointment || request.appointment_ID) {
        setHasAppointmentCreated(true);
      } else {
        setHasAppointmentCreated(false);
      }
    }
  }, [request]);

  useEffect(() => {
    if (open) {
      console.log('Form opened, fetching stylists...');
      fetchStylists();
    }
  }, [open]);
  
  useEffect(() => {
    console.log('Stylists state updated:', stylists);
  }, [stylists]);

  const fetchStylists = async () => {
    try {
      setIsLoadingStylists(true);
      setStylistsError('');
      console.log('Fetching stylists from API...');
      const response = await fetch('http://localhost:5001/api/stylists');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stylists (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Stylists received:', data);
      
      if (Array.isArray(data)) {
        setStylists(data);
      } else if (data.stylists && Array.isArray(data.stylists)) {
        setStylists(data.stylists);
      } else {
        throw new Error('Invalid stylists data format');
      }
    } catch (error) {
      console.error('Error fetching stylists:', error);
      setStylistsError('Failed to load stylists. Please try again.');
    } finally {
      setIsLoadingStylists(false);
    }
  };

  const handleSubmit = () => {
    onUpdateStatus(request.id, newStatus, selectedStylist);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    if (typeof timeString === 'string') {
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(hours, minutes);
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().split('T')[0];
  };

  const handleCreateAppointment = async (appointmentData) => {
    setShowAppointmentModal(false);
    try {
      // Check if this request already has an appointment
      if (hasAppointmentCreated) {
        setAppointmentError('An appointment has already been created for this request.');
        return;
      }
      
      console.log('Sending appointment data:', appointmentData);
      
      // Updated endpoint to match backend route
      const response = await fetch('http://localhost:5001/api/admin/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...appointmentData,
          request_id: request.id // Ensure request_id is included
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to create appointment (${response.status}): ${errorData.message || ''}`);
      }
      
      // Parse response to get appointment details
      const responseData = await response.json();
      console.log('Appointment response:', responseData);
      
      // Extract appointment ID - try different possible formats
      // Extract appointment ID - check the actual response structure from your API
let appointmentId = 
        responseData.appointment_ID || 
        //responseData.appointment_id || 
        //responseData.id || 
        //responseData.data?.appointment_ID || 
        'N/A';
      
      // Prepare the full request object for success view
         const successRequestData = {
        ...request,
        appointment_ID: appointmentId,
        //appointment_id: appointmentId,
        newAppointmentId: appointmentId
      };
      
      // Set success state and message
      setAppointmentSuccess(true);
      setSuccessMessage(`Appointment was created successfully!`);
      setNewAppointmentId(appointmentId);
      setHasAppointmentCreated(true);
      
      // Update the original request status to completed and attach the appointment_id
      onUpdateStatus(request.id, 'completed', selectedStylist, appointmentId);
      
      // If there's a handleViewSuccess prop, call it with the success request data
      // This is assuming the parent component passes this prop
      if (typeof onViewSuccess === 'function') {
        onViewSuccess(successRequestData);
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      setAppointmentError(`Failed to create appointment: ${error.message}`);
    }
  };

  const handleDismissSuccess = () => {
    setSuccessMessage('');
    setNewAppointmentId(null);
    onClose(); // Close the form after success
  };

  if (!request) return null;

  // If we have a success message, show success view
  // if (successMessage) {
  //   return (
  //     <Dialog 
  //       open={open} 
  //       onClose={handleDismissSuccess}
  //       maxWidth="sm" 
  //       fullWidth
  //     >
  //       <DialogTitle sx={{ bgcolor: '#4caf50', color: 'white' }}>
  //         Appointment Created Successfully
  //       </DialogTitle>
        
  //       <DialogContent dividers>
  //         <Box sx={{ 
  //           display: 'flex', 
  //           flexDirection: 'column', 
  //           alignItems: 'center',
  //           py: 3 
  //         }}>
  //           <Box 
  //             sx={{ 
  //               width: 70, 
  //               height: 70, 
  //               borderRadius: '50%', 
  //               bgcolor: '#e8f5e9', 
  //               display: 'flex', 
  //               justifyContent: 'center', 
  //               alignItems: 'center',
  //               mb: 2
  //             }}
  //           >
  //             <SaveIcon sx={{ color: '#4caf50', fontSize: 40 }} />
  //           </Box>
            
  //           <Typography variant="h6" gutterBottom>
  //             Success!
  //           </Typography>
            
  //           <Typography variant="body1" align="center" paragraph>
  //             {successMessage.replace('#', '')}
  //           </Typography>
            
  //           {newAppointmentId && (
  //             <Paper 
  //               elevation={1} 
  //               sx={{ 
  //                 p: 2, 
  //                 width: '100%', 
  //                 mb: 2,
  //                 bgcolor: '#f5f5f5',
  //                 border: '1px solid #e0e0e0'
  //               }}
  //             >
  //               <Typography variant="subtitle2" gutterBottom>
  //                 Appointment Details:
  //               </Typography>
  //               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
  //                 <Typography variant="body2">Appointment ID:</Typography>
  //                 <Typography variant="body2" fontWeight="bold">{newAppointmentId}</Typography>
  //               </Box>
  //               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
  //                 <Typography variant="body2">Customer:</Typography>
  //                 <Typography variant="body2">{`${request.first_name} ${request.last_name}`}</Typography>
  //               </Box>
  //               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
  //                 <Typography variant="body2">Date & Time:</Typography>
  //                 <Typography variant="body2">{formatDateForInput(request.preferred_date)} at {formatTime(request.preferred_time)}</Typography>
  //               </Box>
  //               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
  //                 <Typography variant="body2">Service:</Typography>
  //                 <Typography variant="body2">{request.service_name || 'Not specified'}</Typography>
  //               </Box>
  //             </Paper>
  //           )}
  //         </Box>
  //       </DialogContent>
        
  //       <DialogActions>
  //         <Button 
  //           onClick={handleDismissSuccess} 
  //           variant="contained"
  //           color="primary"
  //           fullWidth
  //         >
  //           Close
  //         </Button>
  //       </DialogActions>
  //     </Dialog>
  //   );
  // }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        Special Request Review
      </DialogTitle>
      
      <DialogContent dividers>
        <Box component="form">
          <Box>
            <Typography variant="h5" component="h2">
              Special Request #{request.id}
            </Typography>
            <Typography variant="body2">
              Review the request details and update the status if needed
            </Typography>
          </Box>

          {/* Show appointment badge if one exists */}
          {hasAppointmentCreated && request.appointment_id && (
            <Paper sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd', border: '1px solid #90caf9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="subtitle1" color="primary">
                  This request has an appointment created
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Appointment ID: {request.appointment_ID || request.appointment_id}
              </Typography>
            </Paper>
          )}
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
            {/* Customer Details section */}
            <Paper sx={{ p: 2 }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  Customer Details
                </Typography>
              </Box>
              <TextField
                label="Full Name"
                value={`${request.first_name} ${request.last_name}`}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Email"
                value={request.email}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Phone Number"
                value={request.phone_number}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>

            {/* Request Details section */}
            <Paper sx={{ p: 2 }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <SpaIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  Request Information
                </Typography>
              </Box>
              <TextField
                label="Service"
                value={request.service_name || 'Not specified'}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SpaIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Preferred Date"
                value={formatDateForInput(request.preferred_date)}
                type="date"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Preferred Time"
                value={formatTime(request.preferred_time)}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>

            {/* Request Details section */}
            <Paper sx={{ p: 2, gridColumn: '1 / -1' }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <DescriptionIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  Request Details
                </Typography>
              </Box>
              <TextField
                label="Request Details"
                value={request.request_details}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Paper>

            {/* Status Update section */}
            <Paper sx={{ p: 2, gridColumn: '1 / -1' }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  Update Request
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {/* Status field */}
                <FormControl fullWidth margin="normal">
                  <InputLabel>
                    Request Status
                  </InputLabel>
                  <Select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <MenuItem value="pending">
                      <Chip 
                        label="Pending" 
                        size="small" 
                        sx={{ backgroundColor: "#ff9800", color: 'white' }} 
                      />
                    </MenuItem>
                    <MenuItem value="approved">
                      <Chip 
                        label="Approved" 
                        size="small" 
                        sx={{ backgroundColor: "#4caf50", color: 'white' }} 
                      />
                    </MenuItem>
                    <MenuItem value="rejected">
                      <Chip 
                        label="Rejected" 
                        size="small"
                        sx={{ backgroundColor: "#f44336", color: 'white' }} 
                      />
                    </MenuItem>
                    <MenuItem value="completed">
                      <Chip 
                        label="Completed" 
                        size="small" 
                        sx={{ backgroundColor: "#2196f3", color: 'white' }} 
                      />
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* Stylist field */}
                <FormControl fullWidth margin="normal">
                  <InputLabel>
                    Assigned Stylist
                  </InputLabel>
                  <Select
                    value={selectedStylist}
                    onChange={(e) => setSelectedStylist(e.target.value)}
                    disabled={isLoadingStylists}
                    startAdornment={
                      <InputAdornment position="start">
                        <StylistIcon />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">
                      <em>Not assigned</em>
                    </MenuItem>
                    {isLoadingStylists ? (
                      <MenuItem disabled>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Loading stylists...
                        </Box>
                      </MenuItem>
                    ) : stylists.length > 0 ? (
                      stylists.map((stylist) => (
                        <MenuItem key={stylist.stylist_ID} value={stylist.stylist_ID}>
                          {stylist.firstname} {stylist.lastname}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <em>No stylists available</em>
                      </MenuItem>
                    )}
                  </Select>
                  {stylistsError && (
                    <FormHelperText error>{stylistsError}</FormHelperText>
                  )}
                </FormControl>
              </Box>
            </Paper>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={processing || (request && request.status === newStatus && request.stylist_id === selectedStylist)}
          color="primary"
        >
          {processing ? <CircularProgress size={24} color="inherit" /> : 'Update Request'}
        </Button>
        <Button 
          variant="contained"
          color="secondary"
          disabled={processing || newStatus !== 'approved' || hasAppointmentCreated}
          onClick={() => setShowAppointmentModal(true)}
          sx={{ mx: 1 }}
          title={hasAppointmentCreated ? "An appointment has already been created for this request" : ""}
        >
          {hasAppointmentCreated ? "Appointment Created" : "Create Appointment"}
        </Button>
        <Button 
          onClick={onClose} 
          disabled={processing}
        >
          Cancel
        </Button>
      </DialogActions>
      
      {/* Import and use CreateAppointmentModal component */}
      <CreateAppointmentModal
        open={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        onCreateAppointment={handleCreateAppointment}
        request={request}
        stylists={stylists}
        selectedStylist={selectedStylist}
        setSelectedStylist={setSelectedStylist}
      />
      
      {/* Success message */}
      <Snackbar 
        open={appointmentSuccess} 
        autoHideDuration={6000} 
        onClose={() => setAppointmentSuccess(false)}
      >
        <Alert onClose={() => setAppointmentSuccess(false)} severity="success">
          Appointment created successfully!
        </Alert>
      </Snackbar>
      
      {/* Error message */}
      <Snackbar 
        open={!!appointmentError} 
        autoHideDuration={6000} 
        onClose={() => setAppointmentError('')}
      >
        <Alert onClose={() => setAppointmentError('')} severity="error">
          {appointmentError}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default SpecialRequestForm;