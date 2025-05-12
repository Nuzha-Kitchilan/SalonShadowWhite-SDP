// import React, { useState } from 'react';
// import {
//   Box, TextField, Button, Dialog, DialogActions, DialogContent,
//   Typography, Grid, InputAdornment, IconButton, Alert
// } from "@mui/material";
// import {
//   Save as SaveIcon,
//   Close as CloseIcon,
//   Add as AddIcon,
//   Remove as RemoveIcon
// } from "@mui/icons-material";
// import axios from "axios";

// export default function CustomerRegistration({ open, onClose, onSuccess }) {
//   const [form, setForm] = useState({
//     firstname: '',
//     lastname: '',
//     email: '',
//     phoneNumbers: [''],
//     username: '',
//     password: '',
//     isWalkIn: true
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handlePhoneChange = (index, value) => {
//     const newPhoneNumbers = [...form.phoneNumbers];
//     newPhoneNumbers[index] = value;
//     setForm(prev => ({ ...prev, phoneNumbers: newPhoneNumbers }));
//   };

//   const addPhoneField = () => {
//     setForm(prev => ({ ...prev, phoneNumbers: [...prev.phoneNumbers, ''] }));
//   };

//   const removePhoneField = (index) => {
//     if (form.phoneNumbers.length > 1) {
//       const newPhoneNumbers = [...form.phoneNumbers];
//       newPhoneNumbers.splice(index, 1);
//       setForm(prev => ({ ...prev, phoneNumbers: newPhoneNumbers }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess(false);
  
//     // Filter out empty phone numbers
//     const filteredPhoneNumbers = form.phoneNumbers.filter(phone => phone.trim() !== "");
  
//     const data = {
//       firstname: form.firstname,
//       lastname: form.lastname,
//       phoneNumbers: filteredPhoneNumbers,
//       email: form.email,
//       username: form.username,
//       password: form.password,
//       isWalkIn: form.isWalkIn
//     };
  
//     try {
//       const response = await axios.post("http://localhost:5001/api/customers/register", data);
//       console.log("Registration successful:", response.data);
//       setSuccess(true);
//       if (onSuccess) onSuccess(response.data); // This will trigger the parent's handleRegisterCustomer
//       // Reset form after successful registration
//       setForm({
//         firstname: '',
//         lastname: '',
//         email: '',
//         phoneNumbers: [''],
//         username: '',
//         password: '',
//         isWalkIn: true
//       });
//     } catch (err) {
//       console.error("Registration error:", err.response?.data || err.message);
//       setError(err.response?.data?.message || "Registration failed. Please try again.");
//     }
//   };

//   const handleClose = () => {
//     setError("");
//     setSuccess(false);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//       <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
//         <Typography variant="h6">Register Walk-In Customer</Typography>
//       </Box>
      
//       <DialogContent>
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}
        
//         {success && (
//           <Alert severity="success" sx={{ mb: 2 }}>
//             Customer registered successfully!
//           </Alert>
//         )}
        
//         <Box component="form" onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="First Name"
//                 name="firstname"
//                 value={form.firstname}
//                 onChange={handleInputChange}
//                 required
//                 margin="normal"
//               />
//             </Grid>
            
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Last Name"
//                 name="lastname"
//                 value={form.lastname}
//                 onChange={handleInputChange}
//                 required
//                 margin="normal"
//               />
//             </Grid>
            
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Email"
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={handleInputChange}
//                 required
//                 margin="normal"
//               />
//             </Grid>
            
//             {form.phoneNumbers.map((phone, index) => (
//               <Grid item xs={12} key={index}>
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <TextField
//                     fullWidth
//                     label={`Phone ${index + 1}`}
//                     value={phone}
//                     onChange={(e) => handlePhoneChange(index, e.target.value)}
//                     margin="normal"
//                     required={index === 0}
//                   />
//                   {index === form.phoneNumbers.length - 1 ? (
//                     <IconButton onClick={addPhoneField} sx={{ ml: 1 }}>
//                       <AddIcon />
//                     </IconButton>
//                   ) : (
//                     <IconButton onClick={() => removePhoneField(index)} sx={{ ml: 1 }}>
//                       <RemoveIcon />
//                     </IconButton>
//                   )}
//                 </Box>
//               </Grid>
//             ))}
            
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Username"
//                 name="username"
//                 value={form.username}
//                 onChange={handleInputChange}
//                 required
//                 margin="normal"
//               />
//             </Grid>
            
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Password"
//                 name="password"
//                 type="password"
//                 value={form.password}
//                 onChange={handleInputChange}
//                 required
//                 margin="normal"
//               />
//             </Grid>
//           </Grid>
          
//           <DialogActions sx={{ mt: 3, borderTop: '1px solid #e0e0e0' }}>
//             <Button 
//               type="submit"
//               variant="contained"
//               startIcon={<SaveIcon />}
//               sx={{ backgroundColor: "green", '&:hover': { backgroundColor: "darkgreen" } }}
//             >
//               Register Customer
//             </Button>
//             <Button 
//               onClick={handleClose}
//               sx={{ backgroundColor: "#e0e0e0", color: "#000", '&:hover': { backgroundColor: "#c0c0c0" } }}
//             >
//               Close
//             </Button>
//           </DialogActions>
//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// }




















import React, { useState } from 'react';
import {
  Box, TextField, Button, Dialog, DialogContent,
  Typography, Grid, IconButton, Alert, Paper,
  DialogActions, InputAdornment
} from "@mui/material";
import {
  Save as SaveIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from "@mui/icons-material";
import axios from "axios";

export default function CustomerRegistration({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumbers: [''],
    username: '',
    password: '',
    isWalkIn: true
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (index, value) => {
    const newPhoneNumbers = [...form.phoneNumbers];
    newPhoneNumbers[index] = value;
    setForm(prev => ({ ...prev, phoneNumbers: newPhoneNumbers }));
  };

  const addPhoneField = () => {
    setForm(prev => ({ ...prev, phoneNumbers: [...prev.phoneNumbers, ''] }));
  };

  const removePhoneField = (index) => {
    if (form.phoneNumbers.length > 1) {
      const newPhoneNumbers = [...form.phoneNumbers];
      newPhoneNumbers.splice(index, 1);
      setForm(prev => ({ ...prev, phoneNumbers: newPhoneNumbers }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
  
    // Filter out empty phone numbers
    const filteredPhoneNumbers = form.phoneNumbers.filter(phone => phone.trim() !== "");
  
    const data = {
      firstname: form.firstname,
      lastname: form.lastname,
      phoneNumbers: filteredPhoneNumbers,
      email: form.email,
      username: form.username,
      password: form.password,
      isWalkIn: form.isWalkIn
    };
  
    try {
      const response = await axios.post("http://localhost:5001/api/customers/register", data);
      console.log("Registration successful:", response.data);
      setSuccess(true);
      if (onSuccess) onSuccess(response.data);
      // Reset form after successful registration
      setForm({
        firstname: '',
        lastname: '',
        email: '',
        phoneNumbers: [''],
        username: '',
        password: '',
        isWalkIn: true
      });
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleClose = () => {
    setError("");
    setSuccess(false);
    onClose();
  };

  const inputStyles = {
    '& .MuiInputLabel-root': {
      fontFamily: "'Poppins', 'Roboto', sans-serif",
      color: "#666"
    },
    '& .MuiOutlinedInput-root': {
      fontFamily: "'Poppins', 'Roboto', sans-serif",
      '& fieldset': {
        borderColor: 'rgba(190, 175, 155, 0.3)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(190, 175, 155, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#BEAF9B',
      },
    },
    '& .MuiInputBase-input': {
      color: '#453C33',
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          overflow: "hidden",
        }
      }}
    >
      <Box 
        sx={{ 
          p: 3, 
          borderBottom: '1px solid rgba(190, 175, 155, 0.2)',
          backgroundColor: 'rgba(190, 175, 155, 0.05)'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: "#453C33",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}
        >
          Register Walk-In Customer
        </Typography>
      </Box>
      
      <DialogContent 
        sx={{ 
          backgroundColor: "#fff",
          p: 3
        }}
      >
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              '& .MuiAlert-icon': {
                color: '#b71c1c'
              }
            }}
          >
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 2,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              '& .MuiAlert-icon': {
                color: '#2e7d32'
              }
            }}
          >
            Customer registered successfully!
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstname"
                value={form.firstname}
                onChange={handleInputChange}
                required
                margin="normal"
                sx={inputStyles}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastname"
                value={form.lastname}
                onChange={handleInputChange}
                required
                margin="normal"
                sx={inputStyles}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleInputChange}
                required
                margin="normal"
                sx={inputStyles}
              />
            </Grid>
            
            {form.phoneNumbers.map((phone, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    label={`Phone ${index + 1}`}
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    margin="normal"
                    required={index === 0}
                    sx={inputStyles}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {index === form.phoneNumbers.length - 1 ? (
                            <IconButton 
                              onClick={addPhoneField}
                              sx={{ color: "#BEAF9B" }}
                            >
                              <AddIcon />
                            </IconButton>
                          ) : (
                            <IconButton 
                              onClick={() => removePhoneField(index)}
                              sx={{ color: "#ff6b6b" }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>
            ))}
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={form.username}
                onChange={handleInputChange}
                required
                margin="normal"
                sx={inputStyles}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleInputChange}
                required
                margin="normal"
                sx={inputStyles}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions 
        sx={{ 
          p: 2, 
          borderTop: '1px solid rgba(190, 175, 155, 0.2)',
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(190, 175, 155, 0.05)'
        }}
      >
        <Button 
          onClick={handleClose}
          sx={{ 
            color: "#666",
            mr: 1,
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            '&:hover': { 
              backgroundColor: "rgba(190, 175, 155, 0.1)" 
            }
          }}
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{ 
            backgroundColor: "#BEAF9B", 
            '&:hover': { 
              backgroundColor: "#a89681" 
            },
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            px: 3
          }}
        >
          Register Customer
        </Button>
      </DialogActions>
    </Dialog>
  );
}