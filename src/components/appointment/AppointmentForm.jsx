// import React from 'react';
// import {
//   Box, FormControl, InputLabel, Select,
//   MenuItem, TextField, Button, DialogActions,
//   Typography, Divider, Paper, FormHelperText,
//   InputAdornment, Chip
// } from "@mui/material";
// import {
//   Save as SaveIcon,
//   Person as PersonIcon,
//   CalendarToday as CalendarIcon,
//   Spa as SpaIcon,
//   People as PeopleIcon,
//   Payment as PaymentIcon
// } from "@mui/icons-material";
// import TimeSlotSelector from './TimeSlotSelector';

// export default function AppointmentForm({
//   isEdit,
//   editForm,
//   setEditForm,
//   services,
//   stylists,
//   customers,
//   statusOptions,
//   paymentStatusOptions,
//   paymentTypeOptions,
//   handleSubmit,
//   handleInputChange,
//   handleMultiSelectChange,
//   loadingTimeSlots,
//   availableTimeSlots,
//   selectedAppointment,
//   onClose
// }) {

//   // Add this at the top of your AppointmentForm component
// console.log('Current form values:', {
//   services: editForm.services,
//   stylists: editForm.stylists,
//   customer_ID: editForm.customer_ID,
//   payment_amount: editForm.payment_amount
// });

// console.log('Available options:', {
//   services: services.map(s => s.service_name),
//   stylists: stylists.map(s => s.stylist_ID),
//   customers: customers.map(c => c.customer_ID)
// });
//   // Helper to generate service price total
//   const calculateTotalPrice = () => {
//     if (!editForm.services.length || !services.length) return 0;
    
//     return services
//       .filter(service => editForm.services.includes(service.service_name))
//       .reduce((total, service) => total + (parseFloat(service.price) || 0), 0)
//       .toFixed(2);
//   };

//   return (
//     <Box component="form" onSubmit={(e) => handleSubmit(e, isEdit)}>
//       {/* Form title */}
//       <Box sx={{ mb: 3 }}>
//         <Typography 
//           variant="h5" 
//           component="h2"
//           sx={{ 
//             color: "#453C33",
//             fontFamily: "'Poppins', 'Roboto', sans-serif",
//             fontWeight: 500,
//             mb: 1
//           }}
//         >
//           {isEdit ? 'Edit Appointment' : 'Create New Appointment'}
//         </Typography>
//         <Typography 
//           variant="body2" 
//           sx={{ 
//             color: "text.secondary",
//             fontFamily: "'Poppins', 'Roboto', sans-serif",
//           }}
//         >
//           {isEdit 
//             ? 'Update the appointment details below' 
//             : 'Fill in the details to create a new appointment'}
//         </Typography>
//       </Box>

//       <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
//         {/* Customer and Appointment Date section */}
//         <Paper 
//           elevation={0} 
//           sx={{ 
//             p: 2.5, 
//             borderRadius: "8px",
//             border: "1px solid rgba(190, 175, 155, 0.3)",
//             background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
//           }}
//         >
//           <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//             <PersonIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//             <Typography 
//               variant="subtitle1" 
//               sx={{ 
//                 fontWeight: 600, 
//                 color: "#453C33",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//               }}
//             >
//               Customer Details
//             </Typography>
//           </Box>
//           <FormControl fullWidth margin="normal" required>
//             <InputLabel sx={{ 
//               '&.Mui-focused': { color: '#BEAF9B' } 
//             }}>Customer</InputLabel>
//             <Select
//               name="customer_ID"
//               value={editForm.customer_ID}
//               onChange={handleInputChange}
//               sx={{
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: 'rgba(190, 175, 155, 0.3)',
//                 },
//                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                   borderColor: 'rgba(190, 175, 155, 0.5)',
//                 },
//                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#BEAF9B',
//                 },
//               }}
//             >
//               {customers.length > 0 ? (
//                 customers.map(customer => (
//                   <MenuItem key={customer.customer_ID} value={customer.customer_ID}>
//                     {customer.firstname} {customer.lastname}
//                   </MenuItem>
//                 ))
//               ) : (
//                 <MenuItem value="" disabled>Loading customers...</MenuItem>
//               )}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth margin="normal" required>
//             <TextField
//               label="Appointment Date"
//               type="date"
//               name="appointment_date"
//               value={editForm.appointment_date}
//               onChange={handleInputChange}
//               InputLabelProps={{ 
//                 shrink: true,
//               }}
//               required
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <CalendarIcon sx={{ color: "#BEAF9B" }} />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: 'rgba(190, 175, 155, 0.3)',
//                   },
//                   '&:hover fieldset': {
//                     borderColor: 'rgba(190, 175, 155, 0.5)',
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#BEAF9B',
//                   },
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: '#BEAF9B',
//                 },
//               }}
//             />
//           </FormControl>
//         </Paper>

//         {/* Services section */}
//         <Paper 
//           elevation={0} 
//           sx={{ 
//             p: 2.5, 
//             borderRadius: "8px",
//             border: "1px solid rgba(190, 175, 155, 0.3)",
//             background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
//           }}
//         >
//           <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//             <SpaIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//             <Typography 
//               variant="subtitle1" 
//               sx={{ 
//                 fontWeight: 600, 
//                 color: "#453C33",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//               }}
//             >
//               Services
//             </Typography>
//           </Box>
//           <FormControl fullWidth margin="normal" required>
//             <InputLabel sx={{ 
//               '&.Mui-focused': { color: '#BEAF9B' } 
//             }}>Services</InputLabel>
//             <Select
//               name="services"
//               multiple
//               value={editForm.services || []}
//               onChange={handleMultiSelectChange}
//               renderValue={(selected) => (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                   {selected.map((value) => (
//                     <Chip 
//                       key={value} 
//                       label={value} 
//                       size="small"
//                       sx={{ 
//                         backgroundColor: "rgba(190, 175, 155, 0.15)", 
//                         color: "#453C33",
//                         borderRadius: "4px",
//                       }} 
//                     />
//                   ))}
//                 </Box>
//               )}
//               required
//               sx={{
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: 'rgba(190, 175, 155, 0.3)',
//                 },
//                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                   borderColor: 'rgba(190, 175, 155, 0.5)', 
//                 },
//                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#BEAF9B',
//                 },
//               }}
//             >
//               {services.length > 0 ? (
//                 services.map(service => (
//                   <MenuItem key={service.service_ID} value={service.service_name}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//                       <Typography>{service.service_name}</Typography>
//                       <Box>
//                         <Typography component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
//                           ${service.price || '0'}
//                         </Typography>
//                         <Typography component="span" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
//                           ({service.time_duration || '0'} min)
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </MenuItem>
//                 ))
//               ) : (
//                 <MenuItem value="" disabled>Loading services...</MenuItem>
//               )}
//             </Select>
//             {editForm.services.length > 0 && (
//               <FormHelperText sx={{ textAlign: 'right', fontWeight: '500', color: '#453C33' }}>
//                 Total: Rs.{calculateTotalPrice()}
//               </FormHelperText>
//             )}
//           </FormControl>
//           <FormControl fullWidth margin="normal" required>
//             <InputLabel sx={{ 
//               '&.Mui-focused': { color: '#BEAF9B' } 
//             }}>Stylists</InputLabel>
//             <Select
//               name="stylists"
//               multiple
//               value={editForm.stylists}
//               onChange={handleMultiSelectChange}
//               renderValue={(selected) => {
//                 const selectedStylists = stylists.filter(stylist => 
//                   selected.includes(stylist.stylist_ID)
//                 );
//                 return (
//                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                     {selectedStylists.map(s => (
//                       <Chip 
//                         key={s.stylist_ID} 
//                         label={`${s.firstname} ${s.lastname}`} 
//                         size="small"
//                         sx={{ 
//                           backgroundColor: "rgba(190, 175, 155, 0.15)", 
//                           color: "#453C33",
//                           borderRadius: "4px",
//                         }} 
//                       />
//                     ))}
//                   </Box>
//                 );
//               }}
//               required
//               sx={{
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: 'rgba(190, 175, 155, 0.3)',
//                 },
//                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                   borderColor: 'rgba(190, 175, 155, 0.5)',
//                 },
//                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#BEAF9B',
//                 },
//               }}
//             >
//               {stylists.length > 0 ? (
//                 stylists.map(stylist => (
//                   <MenuItem key={stylist.stylist_ID} value={stylist.stylist_ID}>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       <PeopleIcon fontSize="small" sx={{ color: '#BEAF9B', mr: 1 }} />
//                       {stylist.firstname} {stylist.lastname}
//                     </Box>
//                   </MenuItem>
//                 ))
//               ) : (
//                 <MenuItem value="" disabled>Loading stylists...</MenuItem>
//               )}
//             </Select>
//           </FormControl>
//         </Paper>

//         {/* Status and Payment section */}
//         <Paper 
//           elevation={0} 
//           sx={{ 
//             p: 2.5, 
//             borderRadius: "8px",
//             border: "1px solid rgba(190, 175, 155, 0.3)",
//             background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))",
//             gridColumn: '1 / -1'
//           }}
//         >
//           <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//             <PaymentIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//             <Typography 
//               variant="subtitle1" 
//               sx={{ 
//                 fontWeight: 600, 
//                 color: "#453C33",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//               }}
//             >
//               Status & Payment
//             </Typography>
//           </Box>
//           <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
//             <FormControl fullWidth margin="normal" required>
//               <InputLabel sx={{ 
//                 '&.Mui-focused': { color: '#BEAF9B' } 
//               }}>Status</InputLabel>
//               <Select
//                 name="appointment_status"
//                 value={editForm.appointment_status}
//                 onChange={handleInputChange}
//                 required
//                 sx={{
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(190, 175, 155, 0.3)',
//                   },
//                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(190, 175, 155, 0.5)',
//                   },
//                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#BEAF9B',
//                   },
//                 }}
//               >
//                 {statusOptions.map(status => {
//                   // Define colors for different status options
//                   let chipColor;
//                   switch(status.toLowerCase()) {
//                     case 'confirmed': chipColor = '#4caf50'; break;
//                     case 'pending': chipColor = '#ff9800'; break;
//                     case 'cancelled': chipColor = '#f44336'; break;
//                     case 'completed': chipColor = '#2196f3'; break;
//                     default: chipColor = '#BEAF9B';
//                   }
                  
//                   return (
//                     <MenuItem key={status} value={status}>
//                       <Chip 
//                         label={status} 
//                         size="small" 
//                         sx={{ 
//                           backgroundColor: chipColor,
//                           color: 'white',
//                           minWidth: '80px',
//                           justifyContent: 'center'
//                         }} 
//                       />
//                     </MenuItem>
//                   );
//                 })}
//               </Select>
//             </FormControl>

//             <FormControl fullWidth margin="normal">
//               <TextField
//                 label="Payment Amount"
//                 type="number"
//                 name="payment_amount"
//                 value={editForm.payment_amount || calculateTotalPrice()}
//                 onChange={handleInputChange}
//                 InputProps={{ 
//                   startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
//                   readOnly: editForm.services.length > 0
//                 }}
//                 helperText={editForm.services.length > 0 ? "Auto-calculated from services" : ""}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': {
//                       borderColor: 'rgba(190, 175, 155, 0.3)',
//                     },
//                     '&:hover fieldset': {
//                       borderColor: 'rgba(190, 175, 155, 0.5)',
//                     },
//                     '&.Mui-focused fieldset': {
//                       borderColor: '#BEAF9B',
//                     },
//                   },
//                   '& .MuiInputLabel-root.Mui-focused': {
//                     color: '#BEAF9B',
//                   },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//             </FormControl>

//             <FormControl fullWidth margin="normal">
//               <InputLabel sx={{ 
//                 '&.Mui-focused': { color: '#BEAF9B' } 
//               }}>Payment Status</InputLabel>
//               <Select
//                 name="payment_status"
//                 value={editForm.payment_status}
//                 onChange={handleInputChange}
//                 sx={{
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(190, 175, 155, 0.3)',
//                   },
//                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(190, 175, 155, 0.5)',
//                   },
//                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#BEAF9B',
//                   },
//                 }}
//               >
//                 {paymentStatusOptions.map(status => {
//                   // Define colors for payment status options
//                   const color = status.toLowerCase() === 'paid' ? '#4caf50' : '#ff9800';
                  
//                   return (
//                     <MenuItem key={status} value={status}>
//                       <Chip 
//                         label={status} 
//                         size="small" 
//                         sx={{ 
//                           backgroundColor: color,
//                           color: 'white',
//                           minWidth: '80px',
//                           justifyContent: 'center'
//                         }} 
//                       />
//                     </MenuItem>
//                   );
//                 })}
//               </Select>
//             </FormControl>

//             <FormControl fullWidth margin="normal">
//               <InputLabel sx={{ 
//                 '&.Mui-focused': { color: '#BEAF9B' } 
//               }}>Payment Type</InputLabel>
//               <Select
//                 name="payment_type"
//                 value={editForm.payment_type}
//                 onChange={handleInputChange}
//                 sx={{
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(190, 175, 155, 0.3)',
//                   },
//                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(190, 175, 155, 0.5)',
//                   },
//                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#BEAF9B',
//                   },
//                 }}
//               >
//                 {paymentTypeOptions.map(type => (
//                   <MenuItem key={type} value={type}>{type}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Box>
//         </Paper>
//       </Box>
      
//       <Box sx={{ mt: 3 }}>
//         <Paper 
//           elevation={0} 
//           sx={{ 
//             p: 2.5, 
//             borderRadius: "8px",
//             border: "1px solid rgba(190, 175, 155, 0.3)",
//             background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
//           }}
//         >
//           <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//             <CalendarIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//             <Typography 
//               variant="subtitle1" 
//               sx={{ 
//                 fontWeight: 600, 
//                 color: "#453C33",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//               }}
//             >
//               Time Slot
//             </Typography>
//           </Box>
//           <TimeSlotSelector
//             loadingTimeSlots={loadingTimeSlots}
//             editForm={editForm}
//             setEditForm={setEditForm}
//             availableTimeSlots={availableTimeSlots}
//             selectedAppointment={selectedAppointment}
//           />
//         </Paper>
//       </Box>
      
//       <DialogActions sx={{ 
//         padding: "20px 0", 
//         borderTop: "1px dashed rgba(190, 175, 155, 0.3)",
//         mt: 4
//       }}>
//         <Button 
//           type="submit"
//           variant="contained"
//           startIcon={<SaveIcon />}
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
//           {isEdit ? 'Save Changes' : 'Create Appointment'}
//         </Button>
//         <Button 
//           onClick={onClose}
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
//     </Box>
//   );
// }














// import React from 'react';
// import {
//   Box, FormControl, InputLabel, Select,
//   MenuItem, TextField, Button, DialogActions,
//   Typography, Divider, Paper, FormHelperText,
//   InputAdornment, Chip, Grid, List, ListItem, 
//   ListItemText, Stack, Autocomplete
// } from "@mui/material";
// import {
//   Save as SaveIcon,
//   Person as PersonIcon,
//   CalendarToday as CalendarIcon,
//   Spa as SpaIcon,
//   People as PeopleIcon,
//   Payment as PaymentIcon
// } from "@mui/icons-material";
// import TimeSlotSelector from './TimeSlotSelector';

// export default function AppointmentForm({
//   isEdit,
//   editForm,
//   setEditForm,
//   services,
//   stylists,
//   customers,
//   statusOptions,
//   paymentStatusOptions,
//   paymentTypeOptions,
//   handleSubmit,
//   handleInputChange,
//   handleMultiSelectChange,
//   loadingTimeSlots,
//   availableTimeSlots,
//   selectedAppointment,
//   onClose
// }) {
//   // Add this at the top of your AppointmentForm component for debugging
//   console.log('Current form values:', {
//     services: editForm.services,
//     stylists: editForm.stylists,
//     customer_ID: editForm.customer_ID,
//     payment_amount: editForm.payment_amount,
//     service_stylist_assignments: editForm.service_stylist_assignments || []
//   });

//   // Helper to generate service price total
//   const calculateTotalPrice = () => {
//     if (!editForm.services.length || !services.length) return 0;
    
//     return services
//       .filter(service => editForm.services.includes(service.service_name))
//       .reduce((total, service) => total + (parseFloat(service.price) || 0), 0)
//       .toFixed(2);
//   };

//   // Get service objects based on selected service names
//   const getSelectedServiceObjects = () => {
//     return services.filter(service => 
//       editForm.services.includes(service.service_name)
//     );
//   };

//   // Initialize service-stylist assignments if not already present
//   React.useEffect(() => {
//     if (!editForm.service_stylist_assignments) {
//       const initialAssignments = editForm.services.map(serviceName => {
//         const service = services.find(s => s.service_name === serviceName);
//         return {
//           service_id: service ? service.service_ID : null,
//           service_name: serviceName,
//           stylist_id: ''
//         };
//       });
      
//       setEditForm(prev => ({
//         ...prev,
//         service_stylist_assignments: initialAssignments
//       }));
//     }
//   }, [editForm.services]);

//   // Handle service selection with Autocomplete
//   const handleServicesChange = (event, newValues) => {
//     // Extract just the names of the selected services
//     const serviceNames = newValues.map(service => service.service_name);
    
//     // Update service_stylist_assignments to maintain existing assignments
//     // and remove assignments for services that are no longer selected
//     const updatedAssignments = (editForm.service_stylist_assignments || [])
//       .filter(assignment => serviceNames.includes(assignment.service_name));
    
//     // Add new services without stylist assignments
//     serviceNames.forEach(serviceName => {
//       if (!updatedAssignments.some(a => a.service_name === serviceName)) {
//         const service = services.find(s => s.service_name === serviceName);
//         updatedAssignments.push({
//           service_id: service ? service.service_ID : null,
//           service_name: serviceName,
//           stylist_id: '' // Empty = not assigned yet
//         });
//       }
//     });
    
//     setEditForm(prev => ({
//       ...prev,
//       services: serviceNames,
//       service_stylist_assignments: updatedAssignments
//     }));
//   };

//   // Handle stylist assignment for a specific service
//   const handleStylistAssignment = (serviceName) => (event) => {
//     const stylistId = event.target.value;
    
//     // Update the assignment for this service
//     const updatedAssignments = (editForm.service_stylist_assignments || []).map(assignment => {
//       if (assignment.service_name === serviceName) {
//         return { ...assignment, stylist_id: stylistId };
//       }
//       return assignment;
//     });
    
//     // Update stylists array for backend compatibility
//     const stylistsSet = new Set();
//     updatedAssignments.forEach(assignment => {
//       if (assignment.stylist_id) {
//         stylistsSet.add(assignment.stylist_id);
//       }
//     });
    
//     setEditForm(prev => ({
//       ...prev,
//       service_stylist_assignments: updatedAssignments,
//       stylists: Array.from(stylistsSet)
//     }));
//   };

//   // Get assigned stylist ID for a service
//   const getAssignedStylistForService = (serviceName) => {
//     const assignment = (editForm.service_stylist_assignments || []).find(
//       a => a.service_name === serviceName
//     );
//     return assignment ? assignment.stylist_id : '';
//   };

//   return (
//     <Box component="form" onSubmit={(e) => handleSubmit(e, isEdit)}>
//       {/* Form title */}
//       <Box sx={{ mb: 3 }}>
//         <Typography 
//           variant="h5" 
//           component="h2"
//           sx={{ 
//             color: "#453C33",
//             fontFamily: "'Poppins', 'Roboto', sans-serif",
//             fontWeight: 500,
//             mb: 1
//           }}
//         >
//           {isEdit ? 'Edit Appointment' : 'Create New Appointment'}
//         </Typography>
//         <Typography 
//           variant="body2" 
//           sx={{ 
//             color: "text.secondary",
//             fontFamily: "'Poppins', 'Roboto', sans-serif",
//           }}
//         >
//           {isEdit 
//             ? 'Update the appointment details below' 
//             : 'Fill in the details to create a new appointment'}
//         </Typography>
//       </Box>

//       <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
//         {/* Customer and Appointment Date section */}
//         <Paper 
//           elevation={0} 
//           sx={{ 
//             p: 2.5, 
//             borderRadius: "8px",
//             border: "1px solid rgba(190, 175, 155, 0.3)",
//             background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
//           }}
//         >
//           <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//             <PersonIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//             <Typography 
//               variant="subtitle1" 
//               sx={{ 
//                 fontWeight: 600, 
//                 color: "#453C33",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//               }}
//             >
//               Customer Details
//             </Typography>
//           </Box>
//           <FormControl fullWidth margin="normal" required>
//             <InputLabel sx={{ 
//               '&.Mui-focused': { color: '#BEAF9B' } 
//             }}>Customer</InputLabel>
//             <Select
//               name="customer_ID"
//               value={editForm.customer_ID}
//               onChange={handleInputChange}
//               sx={{
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: 'rgba(190, 175, 155, 0.3)',
//                 },
//                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                   borderColor: 'rgba(190, 175, 155, 0.5)',
//                 },
//                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#BEAF9B',
//                 },
//               }}
//             >
//               {customers.length > 0 ? (
//                 customers.map(customer => (
//                   <MenuItem key={customer.customer_ID} value={customer.customer_ID}>
//                     {customer.firstname} {customer.lastname}
//                   </MenuItem>
//                 ))
//               ) : (
//                 <MenuItem value="" disabled>Loading customers...</MenuItem>
//               )}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth margin="normal" required>
//             <TextField
//               label="Appointment Date"
//               type="date"
//               name="appointment_date"
//               value={editForm.appointment_date}
//               onChange={handleInputChange}
//               InputLabelProps={{ 
//                 shrink: true,
//               }}
//               required
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <CalendarIcon sx={{ color: "#BEAF9B" }} />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: 'rgba(190, 175, 155, 0.3)',
//                   },
//                   '&:hover fieldset': {
//                     borderColor: 'rgba(190, 175, 155, 0.5)',
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#BEAF9B',
//                   },
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: '#BEAF9B',
//                 },
//               }}
//             />
//           </FormControl>
//         </Paper>

//         {/* Services section */}
//         <Paper 
//           elevation={0} 
//           sx={{ 
//             p: 2.5, 
//             borderRadius: "8px",
//             border: "1px solid rgba(190, 175, 155, 0.3)",
//             background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
//           }}
//         >
//           <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//             <SpaIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//             <Typography 
//               variant="subtitle1" 
//               sx={{ 
//                 fontWeight: 600, 
//                 color: "#453C33",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//               }}
//             >
//               Services
//             </Typography>
//           </Box>

//           {/* Services selection with Autocomplete */}
//           <FormControl fullWidth margin="normal" required>
//             <Autocomplete
//               multiple
//               options={services}
//               getOptionLabel={(option) => `${option.service_name} (${option.price || '0'} Rs., ${option.time_duration || '0'} min)`}
//               value={getSelectedServiceObjects()}
//               onChange={handleServicesChange}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Services"
//                   InputLabelProps={{
//                     sx: { '&.Mui-focused': { color: '#BEAF9B' } }
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       '& fieldset': {
//                         borderColor: 'rgba(190, 175, 155, 0.3)',
//                       },
//                       '&:hover fieldset': {
//                         borderColor: 'rgba(190, 175, 155, 0.5)',
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: '#BEAF9B',
//                       },
//                     }
//                   }}
//                 />
//               )}
//               renderTags={(value, getTagProps) =>
//                 value.map((option, index) => (
//                   <Chip
//                     {...getTagProps({ index })}
//                     key={option.service_ID}
//                     label={option.service_name}
//                     size="small"
//                     sx={{ 
//                       backgroundColor: "rgba(190, 175, 155, 0.15)", 
//                       color: "#453C33",
//                       borderRadius: "4px",
//                     }}
//                   />
//                 ))
//               }
//               isOptionEqualToValue={(option, value) => option.service_ID === value.service_ID}
//             />
//             {editForm.services.length > 0 && (
//               <FormHelperText sx={{ textAlign: 'right', fontWeight: '500', color: '#453C33' }}>
//                 Total: Rs.{calculateTotalPrice()}
//               </FormHelperText>
//             )}
//           </FormControl>
//         </Paper>

//         {/* Service-Stylist Assignment Section */}
//         {editForm.services.length > 0 && (
//           <Paper 
//             elevation={0} 
//             sx={{ 
//               p: 2.5, 
//               borderRadius: "8px",
//               border: "1px solid rgba(190, 175, 155, 0.3)",
//               background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))",
//               gridColumn: '1 / -1'
//             }}
//           >
//             <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//               <PeopleIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//               <Typography 
//                 variant="subtitle1" 
//                 sx={{ 
//                   fontWeight: 600, 
//                   color: "#453C33",
//                   fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 }}
//               >
//                 Stylist Assignments
//               </Typography>
//             </Box>
//             <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
//               Assign stylists to each selected service
//             </Typography>
//             <List sx={{ bgcolor: 'background.paper', borderRadius: '4px' }}>
//               {editForm.services.map((serviceName) => {
//                 const service = services.find(s => s.service_name === serviceName);
//                 return (
//                   <ListItem 
//                     key={serviceName} 
//                     divider 
//                     sx={{ 
//                       py: 1,
//                       borderBottom: '1px solid rgba(190, 175, 155, 0.15)'
//                     }}
//                   >
//                     <Grid container spacing={2} alignItems="center">
//                       <Grid item xs={12} md={6}>
//                         <ListItemText 
//                           primary={
//                             <Typography sx={{ fontWeight: 500, color: '#453C33' }}>
//                               {serviceName}
//                             </Typography>
//                           }
//                           secondary={service ? `Rs.${service.price || '0'} (${service.time_duration || '0'} min)` : ''}
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={6}>
//                         <FormControl fullWidth size="small">
//                           <InputLabel 
//                             id={`stylist-select-${serviceName}-label`}
//                             sx={{ '&.Mui-focused': { color: '#BEAF9B' } }}
//                           >
//                             Assign Stylist
//                           </InputLabel>
//                           <Select
//                             labelId={`stylist-select-${serviceName}-label`}
//                             id={`stylist-select-${serviceName}`}
//                             value={getAssignedStylistForService(serviceName)}
//                             onChange={handleStylistAssignment(serviceName)}
//                             label="Assign Stylist"
//                             sx={{
//                               '& .MuiOutlinedInput-notchedOutline': {
//                                 borderColor: 'rgba(190, 175, 155, 0.3)',
//                               },
//                               '&:hover .MuiOutlinedInput-notchedOutline': {
//                                 borderColor: 'rgba(190, 175, 155, 0.5)',
//                               },
//                               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                 borderColor: '#BEAF9B',
//                               },
//                             }}
//                           >
//                             <MenuItem value="">
//                               <em>No specific stylist</em>
//                             </MenuItem>
//                             {stylists.map((stylist) => (
//                               <MenuItem key={stylist.stylist_ID} value={stylist.stylist_ID}>
//                                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                   <PeopleIcon fontSize="small" sx={{ color: '#BEAF9B', mr: 1 }} />
//                                   {stylist.firstname} {stylist.lastname}
//                                 </Box>
//                               </MenuItem>
//                             ))}
//                           </Select>
//                         </FormControl>
//                       </Grid>
//                     </Grid>
//                   </ListItem>
//                 );
//               })}
//             </List>
//           </Paper>
//         )}

//         {/* Status and Payment section */}
//         <Paper 
//           elevation={0} 
//           sx={{ 
//             p: 2.5, 
//             borderRadius: "8px",
//             border: "1px solid rgba(190, 175, 155, 0.3)",
//             background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))",
//             gridColumn: '1 / -1'
//           }}
//         >
//           <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//             <PaymentIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//             <Typography 
//               variant="subtitle1" 
//               sx={{ 
//                 fontWeight: 600, 
//                 color: "#453C33",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//               }}
//             >
//               Status & Payment
//             </Typography>
//           </Box>
//           <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
//             <FormControl fullWidth margin="normal" required>
//               <InputLabel sx={{ 
//                 '&.Mui-focused': { color: '#BEAF9B' } 
//               }}>Status</InputLabel>
//               <Select
//                 name="appointment_status"
//                 value={editForm.appointment_status}
//                 onChange={handleInputChange}
//                 required
//                 sx={{
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(190, 175, 155, 0.3)',
//                   },
//                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(190, 175, 155, 0.5)',
//                   },
//                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#BEAF9B',
//                   },
//                 }}
//               >
//                 {statusOptions.map(status => {
//                   // Define colors for different status options
//                   let chipColor;
//                   switch(status.toLowerCase()) {
//                     case 'confirmed': chipColor = '#4caf50'; break;
//                     case 'pending': chipColor = '#ff9800'; break;
//                     case 'cancelled': chipColor = '#f44336'; break;
//                     case 'completed': chipColor = '#2196f3'; break;
//                     default: chipColor = '#BEAF9B';
//                   }
                  
//                   return (
//                     <MenuItem key={status} value={status}>
//                       <Chip 
//                         label={status} 
//                         size="small" 
//                         sx={{ 
//                           backgroundColor: chipColor,
//                           color: 'white',
//                           minWidth: '80px',
//                           justifyContent: 'center'
//                         }} 
//                       />
//                     </MenuItem>
//                   );
//                 })}
//               </Select>
//             </FormControl>

//             <FormControl fullWidth margin="normal">
//               <TextField
//                 label="Payment Amount"
//                 type="number"
//                 name="payment_amount"
//                 value={editForm.payment_amount || calculateTotalPrice()}
//                 onChange={handleInputChange}
//                 InputProps={{ 
//                   startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
//                   readOnly: editForm.services.length > 0
//                 }}
//                 helperText={editForm.services.length > 0 ? "Auto-calculated from services" : ""}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': {
//                       borderColor: 'rgba(190, 175, 155, 0.3)',
//                     },
//                     '&:hover fieldset': {
//                       borderColor: 'rgba(190, 175, 155, 0.5)',
//                     },
//                     '&.Mui-focused fieldset': {
//                       borderColor: '#BEAF9B',
//                     },
//                   },
//                   '& .MuiInputLabel-root.Mui-focused': {
//                     color: '#BEAF9B',
//                   },
//                   '& .Mui-disabled, & .Mui-readOnly': {
//                     backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                     WebkitTextFillColor: '#453C33',
//                   }
//                 }}
//               />
//             </FormControl>

//             <FormControl fullWidth margin="normal">
//               <InputLabel sx={{ 
//                 '&.Mui-focused': { color: '#BEAF9B' } 
//               }}>Payment Status</InputLabel>
//               <Select
//                 name="payment_status"
//                 value={editForm.payment_status}
//                 onChange={handleInputChange}
//                 sx={{
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(190, 175, 155, 0.3)',
//                   },
//                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(190, 175, 155, 0.5)',
//                   },
//                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#BEAF9B',
//                   },
//                 }}
//               >
//                 {paymentStatusOptions.map(status => {
//                   // Define colors for payment status options
//                   const color = status.toLowerCase() === 'paid' ? '#4caf50' : '#ff9800';
                  
//                   return (
//                     <MenuItem key={status} value={status}>
//                       <Chip 
//                         label={status} 
//                         size="small" 
//                         sx={{ 
//                           backgroundColor: color,
//                           color: 'white',
//                           minWidth: '80px',
//                           justifyContent: 'center'
//                         }} 
//                       />
//                     </MenuItem>
//                   );
//                 })}
//               </Select>
//             </FormControl>

//             <FormControl fullWidth margin="normal">
//               <InputLabel sx={{ 
//                 '&.Mui-focused': { color: '#BEAF9B' } 
//               }}>Payment Type</InputLabel>
//               <Select
//                 name="payment_type"
//                 value={editForm.payment_type}
//                 onChange={handleInputChange}
//                 sx={{
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(190, 175, 155, 0.3)',
//                   },
//                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(190, 175, 155, 0.5)',
//                   },
//                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#BEAF9B',
//                   },
//                 }}
//               >
//                 {paymentTypeOptions.map(type => (
//                   <MenuItem key={type} value={type}>{type}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Box>
//         </Paper>
//       </Box>
      
//       <Box sx={{ mt: 3 }}>
//         <Paper 
//           elevation={0} 
//           sx={{ 
//             p: 2.5, 
//             borderRadius: "8px",
//             border: "1px solid rgba(190, 175, 155, 0.3)",
//             background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
//           }}
//         >
//           <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//             <CalendarIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
//             <Typography 
//               variant="subtitle1" 
//               sx={{ 
//                 fontWeight: 600, 
//                 color: "#453C33",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//               }}
//             >
//               Time Slot
//             </Typography>
//           </Box>
//           <TimeSlotSelector
//             loadingTimeSlots={loadingTimeSlots}
//             editForm={editForm}
//             setEditForm={setEditForm}
//             availableTimeSlots={availableTimeSlots}
//             selectedAppointment={selectedAppointment}
//           />
//         </Paper>
//       </Box>
      
//       <DialogActions sx={{ 
//         padding: "20px 0", 
//         borderTop: "1px dashed rgba(190, 175, 155, 0.3)",
//         mt: 4
//       }}>
//         <Button 
//           type="submit"
//           variant="contained"
//           startIcon={<SaveIcon />}
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
//           {isEdit ? 'Save Changes' : 'Create Appointment'}
//         </Button>
//         <Button 
//           onClick={onClose}
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
//     </Box>
//   );
// }






import React, { useState, useEffect } from 'react';
import {
  Box, FormControl, InputLabel, Select,
  MenuItem, TextField, Button, DialogActions,
  Typography, Paper, FormHelperText,
  InputAdornment, Chip, Grid, List, ListItem, 
  ListItemText, Autocomplete, Stack, Alert
} from "@mui/material";
import {
  Save as SaveIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Spa as SpaIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  Notes as NotesIcon
} from "@mui/icons-material";
import TimeSlotSelector from './TimeSlotSelector';

export default function AppointmentForm({
  isEdit,
  editForm,
  setEditForm,
  services,
  stylists,
  customers,
  statusOptions,
  paymentStatusOptions,
  paymentTypeOptions,
  handleSubmit,
  handleInputChange,
  loadingTimeSlots,
  availableTimeSlots,
  selectedAppointment,
  onClose
}) {
  // Form validation state
  const [errors, setErrors] = useState({});
  // Selected service objects for Autocomplete
  const [selectedServiceObjects, setSelectedServiceObjects] = useState([]);
  
  // Initialize form with proper service and stylist structures
  useEffect(() => {
    if (editForm.service_objects) {
      setSelectedServiceObjects(editForm.service_objects);
    } else if (editForm.services && services.length > 0) {
      const serviceObjs = services.filter(service => {
        const serviceId = service.service_id || service.service_ID;
        return editForm.services.some(id => 
          id === serviceId || id.toString() === serviceId.toString()
        );
      });
      setSelectedServiceObjects(serviceObjs);
    }
    
    if (!editForm.service_stylist_assignments) {
      setEditForm(prev => ({ ...prev, service_stylist_assignments: [] }));
    }
  }, [editForm.services, editForm.service_objects, services]);

  // Calculate total price from selected services
  const calculateTotalPrice = () => {
    if (!selectedServiceObjects || !selectedServiceObjects.length) {
      return '0.00';
    }
    
    const total = selectedServiceObjects.reduce((total, service) => {
      const price = parseFloat(service.price);
      return total + (isNaN(price) ? 0 : price);
    }, 0);
    
    return total.toFixed(2);
  };
  
  // Handle services selection with Autocomplete
  const handleServicesChange = (event, newValues) => {
    const selectedServices = Array.isArray(newValues) ? newValues : [];
    
    setSelectedServiceObjects(selectedServices);
    
    const serviceIds = selectedServices.map(service => service.service_id || service.service_ID);
    
    setEditForm(prev => {
      const currentAssignments = prev.service_stylist_assignments || [];
      const updatedAssignments = [];
      
      serviceIds.forEach(serviceId => {
        const existingAssignment = currentAssignments.find(a => 
          (a.service_id && a.service_id.toString() === serviceId.toString()) || 
          (a.service_ID && a.service_ID.toString() === serviceId.toString())
        );
        
        if (existingAssignment) {
          updatedAssignments.push({
            service_id: serviceId,
            service_ID: serviceId,
            service_name: existingAssignment.service_name || '',
            stylist_id: existingAssignment.stylist_id || ''
          });
        } else {
          const service = services.find(s => 
            (s.service_id && s.service_id.toString() === serviceId.toString()) || 
            (s.service_ID && s.service_ID.toString() === serviceId.toString())
          );
          
          if (!service) {
            console.warn(`Warning: Service ${serviceId} not found in services array`);
          }
          
          updatedAssignments.push({
            service_id: serviceId,
            service_ID: serviceId,
            service_name: service?.service_name || `Service ${serviceId}`,
            stylist_id: ''
          });
        }
      });
      
      const stylistIds = new Set();
      updatedAssignments.forEach(assignment => {
        if (assignment.stylist_id) {
          stylistIds.add(assignment.stylist_id);
        }
      });

      const paymentAmount = selectedServices.reduce((total, service) => {
        const price = parseFloat(service.price);
        return total + (isNaN(price) ? 0 : price);
      }, 0).toFixed(2);
      
      return {
        ...prev,
        services: serviceIds,
        service_stylist_assignments: updatedAssignments,
        stylists: Array.from(stylistIds),
        payment_amount: paymentAmount
      };
    });
    
    if (errors.services) {
      setErrors(prev => ({ ...prev, services: null }));
    }
  };
  
  // Handle stylist assignment for a specific service
  const handleStylistAssignment = (serviceId) => (event) => {
    const stylistId = event.target.value;
    
    setEditForm(prev => {
      const assignments = [...(prev.service_stylist_assignments || [])];
      
      const index = assignments.findIndex(a => 
        (a.service_id && a.service_id.toString() === serviceId.toString()) || 
        (a.service_ID && a.service_ID.toString() === serviceId.toString())
      );
      
      if (index >= 0) {
        assignments[index] = {
          ...assignments[index],
          stylist_id: stylistId
        };
      } else {
        const service = services.find(s => 
          (s.service_id && s.service_id.toString() === serviceId.toString()) || 
          (s.service_ID && s.service_ID.toString() === serviceId.toString())
        );
        
        if (!service) {
          console.warn(`Warning: Service ${serviceId} not found in services array`);
        }
        
        assignments.push({
          service_id: serviceId,
          service_ID: serviceId,
          service_name: service?.service_name || `Service ${serviceId}`,
          stylist_id: stylistId
        });
      }
      
      const stylistIds = new Set();
      assignments.forEach(assignment => {
        if (assignment.stylist_id) {
          stylistIds.add(assignment.stylist_id);
        }
      });
      
      return {
        ...prev,
        service_stylist_assignments: assignments,
        stylists: Array.from(stylistIds)
      };
    });
    
    if (errors.stylist_assignments) {
      setErrors(prev => ({ ...prev, stylist_assignments: null }));
    }
  };
  
  // Get assigned stylist ID for a service
  const getAssignedStylistForService = (serviceId) => {
    if (!serviceId) return '';
    
    const assignment = (editForm.service_stylist_assignments || []).find(
      a => (a.service_id && a.service_id.toString() === serviceId.toString()) || 
          (a.service_ID && a.service_ID.toString() === serviceId.toString())
    );
    return assignment ? assignment.stylist_id : '';
  };
  
  // Get stylist name
  const getStylistName = (stylistId) => {
    const stylist = stylists.find(s => s.stylist_ID === stylistId);
    return stylist ? `${stylist.firstname} ${stylist.lastname}` : '';
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!editForm.customer_ID) {
      newErrors.customer_ID = 'Please select a customer';
    }
    
    if (!editForm.appointment_date) {
      newErrors.appointment_date = 'Please select an appointment date';
    }
    
    if (!editForm.appointment_time) {
      newErrors.appointment_time = 'Please select an appointment time';
    }
    
    if (!selectedServiceObjects || selectedServiceObjects.length === 0) {
      newErrors.services = 'Please select at least one service';
    }
    
    if (editForm.service_stylist_assignments && editForm.service_stylist_assignments.length > 0) {
      const hasAssignedStylist = editForm.service_stylist_assignments.some(
        assignment => assignment.stylist_id && assignment.stylist_id !== ''
      );
      
      if (!hasAssignedStylist) {
        newErrors.stylist_assignments = 'Please assign at least one stylist to a service';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Extended form submission handler with validation
  const submitWithValidation = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      handleSubmit(e, isEdit);
    }
  };

  // Define color scheme
  const primaryColor = "#453C33";
  const secondaryColor = "#BEAF9B";
  const lightBg = "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))";
  const borderStyle = "1px solid rgba(190, 175, 155, 0.3)";
  
  return (
    <Box component="form" onSubmit={submitWithValidation}>
      {/* Form title */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            color: primaryColor,
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            mb: 1
          }}
        >
          {isEdit ? 'Edit Appointment' : 'Create New Appointment'}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: "text.secondary",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}
        >
          {isEdit 
            ? 'Update the appointment details below' 
            : 'Fill in the details to create a new appointment'}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Customer and Appointment Date section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, 
            borderRadius: "8px",
            border: borderStyle,
            background: lightBg
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ color: secondaryColor, mr: 1.5 }} />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                color: primaryColor,
                fontFamily: "'Poppins', 'Roboto', sans-serif",
              }}
            >
              Customer Details
            </Typography>
          </Box>
          
          <FormControl fullWidth margin="normal" error={!!errors.customer_ID} required>
            <InputLabel sx={{ '&.Mui-focused': { color: secondaryColor } }}>Customer *</InputLabel>
            <Select
              name="customer_ID"
              value={editForm.customer_ID || ''}
              onChange={handleInputChange}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(190, 175, 155, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(190, 175, 155, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: secondaryColor,
                },
              }}
            >
              <MenuItem value="">
                <em>Select a customer</em>
              </MenuItem>
              {customers.length > 0 ? (
                customers.map(customer => (
                  <MenuItem key={customer.customer_ID} value={customer.customer_ID}>
                    {customer.firstname} {customer.lastname}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>Loading customers...</MenuItem>
              )}
            </Select>
            {errors.customer_ID && (
              <FormHelperText error>{errors.customer_ID}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.appointment_date}>
            <TextField
              label="Appointment Date *"
              type="date"
              name="appointment_date"
              value={editForm.appointment_date || ''}
              onChange={handleInputChange}
              InputLabelProps={{ 
                shrink: true,
                sx: { '&.Mui-focused': { color: secondaryColor } }
              }}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon sx={{ color: secondaryColor }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(190, 175, 155, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(190, 175, 155, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: secondaryColor,
                  },
                }
              }}
              helperText={errors.appointment_date}
            />
          </FormControl>
        </Paper>

        {/* Services section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, 
            borderRadius: "8px",
            border: borderStyle,
            background: lightBg
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <SpaIcon sx={{ color: secondaryColor, mr: 1.5 }} />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                color: primaryColor,
                fontFamily: "'Poppins', 'Roboto', sans-serif",
              }}
            >
              Services *
            </Typography>
          </Box>

          <FormControl fullWidth margin="normal" error={!!errors.services}>
            <Autocomplete
              multiple
              id="service-selection"
              options={services || []}
              getOptionLabel={(option) => `${option.service_name} (Rs.${option.price || '0'}, ${option.time_duration || '0'} min)`}
              value={selectedServiceObjects || []}
              onChange={handleServicesChange}
              isOptionEqualToValue={(option, value) => {
                const optionId = option.service_id || option.service_ID;
                const valueId = value.service_id || value.service_ID;
                return optionId == valueId;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Services *"
                  placeholder="Select services"
                  InputLabelProps={{
                    sx: { '&.Mui-focused': { color: secondaryColor } }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(190, 175, 155, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(190, 175, 155, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: secondaryColor,
                      },
                    }
                  }}
                  error={!!errors.services}
                  helperText={errors.services}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.service_id || option.service_ID || index}
                    label={`${option.service_name} (Rs.${option.price || '0'})`}
                    size="small"
                    sx={{ 
                      backgroundColor: "rgba(190, 175, 155, 0.15)", 
                      color: primaryColor,
                      borderRadius: "4px",
                    }}
                  />
                ))
              }
            />
            {Array.isArray(editForm.services) && editForm.services.length > 0 && (
              <FormHelperText sx={{ textAlign: 'right', fontWeight: '500', color: primaryColor }}>
                Total: Rs.{calculateTotalPrice()}
              </FormHelperText>
            )}
          </FormControl>
        </Paper>
      </Box>

      {/* Service-Stylist Assignment Section */}
      {selectedServiceObjects && selectedServiceObjects.length > 0 && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, 
            borderRadius: "8px",
            border: borderStyle,
            background: lightBg,
            mt: 3
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <PeopleIcon sx={{ color: secondaryColor, mr: 1.5 }} />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                color: primaryColor,
                fontFamily: "'Poppins', 'Roboto', sans-serif",
              }}
            >
              Stylist Assignments *
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Assign stylists to each selected service (at least one required)
          </Typography>
          
          {errors.stylist_assignments && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.stylist_assignments}
            </Alert>
          )}
          
          <List sx={{ bgcolor: 'background.paper', borderRadius: '4px' }}>
            {selectedServiceObjects.map((service) => {
              const serviceId = service.service_id || service.service_ID;
              if (!serviceId) {
                console.warn('Service without ID found:', service);
                return null;
              }
              
              const assignedStylistId = getAssignedStylistForService(serviceId);
              
              return (
                <ListItem 
                  key={serviceId} 
                  divider 
                  sx={{ 
                    py: 1,
                    borderBottom: '1px solid rgba(190, 175, 155, 0.15)'
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <ListItemText 
                        primary={
                          <Typography sx={{ fontWeight: 500, color: primaryColor }}>
                            {service.service_name}
                          </Typography>
                        }
                        secondary={`Rs.${service.price || '0'} (${service.time_duration || '0'} min)`}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel 
                          id={`stylist-select-${serviceId}-label`}
                          sx={{ '&.Mui-focused': { color: secondaryColor } }}
                        >
                          Assign Stylist
                        </InputLabel>
                        <Select
                          labelId={`stylist-select-${serviceId}-label`}
                          id={`stylist-select-${serviceId}`}
                          value={assignedStylistId}
                          onChange={handleStylistAssignment(serviceId)}
                          label="Assign Stylist"
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(190, 175, 155, 0.3)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(190, 175, 155, 0.5)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: secondaryColor,
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>No specific stylist</em>
                          </MenuItem>
                          {stylists.map((stylist) => (
                            <MenuItem key={stylist.stylist_ID} value={stylist.stylist_ID}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PeopleIcon fontSize="small" sx={{ color: secondaryColor, mr: 1 }} />
                                {stylist.firstname} {stylist.lastname}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}

      {/* Time Slot Selector */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2.5, 
          borderRadius: "8px",
          border: borderStyle,
          background: lightBg,
          mt: 3
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <CalendarIcon sx={{ color: secondaryColor, mr: 1.5 }} />
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600, 
              color: primaryColor,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            Time Slot *
          </Typography>
        </Box>
        <TimeSlotSelector
          loadingTimeSlots={loadingTimeSlots}
          editForm={editForm}
          setEditForm={setEditForm}
          availableTimeSlots={availableTimeSlots}
          selectedAppointment={selectedAppointment}
        />
        {errors.appointment_time && (
          <FormHelperText error>{errors.appointment_time}</FormHelperText>
        )}
      </Paper>

      {/* Status and Payment section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2.5, 
          borderRadius: "8px",
          border: borderStyle,
          background: lightBg,
          mt: 3
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <PaymentIcon sx={{ color: secondaryColor, mr: 1.5 }} />
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600, 
              color: primaryColor,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            Status & Payment
          </Typography>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel sx={{ '&.Mui-focused': { color: secondaryColor } }}>Status *</InputLabel>
            <Select
              name="appointment_status"
              value={editForm.appointment_status || ''}
              onChange={handleInputChange}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(190, 175, 155, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(190, 175, 155, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: secondaryColor,
                },
              }}
            >
              {statusOptions.map(status => {
                let chipColor;
                switch(status.toLowerCase()) {
                  case 'confirmed': chipColor = '#4caf50'; break;
                  case 'pending': chipColor = '#ff9800'; break;
                  case 'cancelled': chipColor = '#f44336'; break;
                  case 'completed': chipColor = '#2196f3'; break;
                  default: chipColor = secondaryColor;
                }
                
                return (
                  <MenuItem key={status} value={status}>
                    <Chip 
                      label={status} 
                      size="small" 
                      sx={{ 
                        backgroundColor: chipColor,
                        color: 'white',
                        minWidth: '80px',
                        justifyContent: 'center'
                      }} 
                    />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ '&.Mui-focused': { color: secondaryColor } }}>Payment Status</InputLabel>
            <Select
              name="payment_status"
              value={editForm.payment_status || ''}
              onChange={handleInputChange}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(190, 175, 155, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(190, 175, 155, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: secondaryColor,
                },
              }}
            >
              {paymentStatusOptions.map(status => {
                const color = status.toLowerCase() === 'paid' ? '#4caf50' : '#ff9800';
                return (
                  <MenuItem key={status} value={status}>
                    <Chip 
                      label={status} 
                      size="small" 
                      sx={{ 
                        backgroundColor: color,
                        color: 'white',
                        minWidth: '80px',
                        justifyContent: 'center'
                      }} 
                    />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Payment Amount (Rs.)"
              type="number"
              name="payment_amount"
              value={editForm.payment_amount || calculateTotalPrice()}
              onChange={handleInputChange}
              InputProps={{ 
                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                readOnly: Array.isArray(editForm.services) && editForm.services.length > 0
              }}
              helperText={Array.isArray(editForm.services) && editForm.services.length > 0 ? "Auto-calculated from services" : ""}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(190, 175, 155, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(190, 175, 155, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: secondaryColor,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: secondaryColor,
                },
                '& .Mui-disabled, & .Mui-readOnly': {
                  backgroundColor: 'rgba(190, 175, 155, 0.05)',
                  WebkitTextFillColor: primaryColor,
                }
              }}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ '&.Mui-focused': { color: secondaryColor } }}>Payment Type</InputLabel>
            <Select
              name="payment_type"
              value={editForm.payment_type || ''}
              onChange={handleInputChange}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(190, 175, 155, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(190, 175, 155, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: secondaryColor,
                },
              }}
            >
              {paymentTypeOptions.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
      
      {/* Notes */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2.5, 
          borderRadius: "8px",
          border: borderStyle,
          background: lightBg,
          mt: 3
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <NotesIcon sx={{ color: secondaryColor, mr: 1.5 }} />
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600, 
              color: primaryColor,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            Additional Information
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Notes"
          name="notes"
          value={editForm.notes || ''}
          onChange={handleInputChange}
          multiline
          rows={3}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(190, 175, 155, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(190, 175, 155, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: secondaryColor,
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: secondaryColor,
            },
          }}
        />
      </Paper>
      
      {/* Summary section */}
      {Array.isArray(editForm.services) && editForm.services.length > 0 && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, 
            borderRadius: "8px",
            border: borderStyle,
            background: lightBg,
            mt: 3
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: primaryColor, mb: 2 }}>
            Appointment Summary
          </Typography>
          
          <Stack spacing={1}>
            <Typography variant="body2" sx={{ color: primaryColor }}>
              <strong>Total Price:</strong> Rs.{calculateTotalPrice()}
            </Typography>
            <Typography variant="body2" sx={{ color: primaryColor }}>
              <strong>Stylist Assignments:</strong>
            </Typography>
            <List dense disablePadding>
              {(editForm.service_stylist_assignments || [])
                .filter(a => a.stylist_id)
                .map(assignment => (
                  <ListItem 
                    key={assignment.service_id || assignment.service_ID} 
                    dense 
                    disableGutters
                    sx={{ color: primaryColor }}
                  >
                    <ListItemText 
                      primary={`${assignment.service_name} → ${getStylistName(assignment.stylist_id)}`}
                    />
                  </ListItem>
                ))
              }
            </List>
          </Stack>
        </Paper>
      )}
      
      <DialogActions sx={{ 
        padding: "20px 0", 
        borderTop: "1px dashed rgba(190, 175, 155, 0.3)",
        mt: 4
      }}>
        <Button 
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{ 
            backgroundColor: secondaryColor, 
            color: "white", 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            boxShadow: "0 2px 6px rgba(190, 175, 155, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            px: 3,
            '&:hover': { 
              backgroundColor: "#A89583",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 10px rgba(190, 175, 155, 0.4)"
            }
          }}
        >
          {isEdit ? 'Save Changes' : 'Create Appointment'}
        </Button>
        <Button 
          onClick={onClose}
          sx={{ 
            color: primaryColor, 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            '&:hover': { 
              backgroundColor: "rgba(190, 175, 155, 0.1)" 
            } 
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Box>
  );
}