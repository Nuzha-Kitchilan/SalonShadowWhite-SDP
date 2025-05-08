
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Avatar,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Add, Remove } from '@mui/icons-material';

const RegisterStylistDialog = ({ 
  open, 
  handleClose, 
  handleRegister,
  formData,
  setFormData,
  handleImageChange,
  handlePhoneChange,
  handleAddPhoneNumber,
  handleRemovePhoneNumber
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Function to clear all fields after successful registration
  const handleRegisterAndClear = () => {
    handleRegister().then(success => {
      if (success) {
        // Reset form data with empty values
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          username: "",
          password: "",
          role: "",
          bio: "",
          house_no: "",
          street: "",
          city: "",
          phone_numbers: [""],
          profile_url: ""
        });
      }
    });
  };

  const renderPhoneInputs = (phoneNumbers) => {
    return phoneNumbers.map((phone, index) => (
      <Box 
        key={index} 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          mb: 1.5 
        }}
      >
        <TextField
          fullWidth
          label={`Phone ${index + 1}`}
          value={phone}
          onChange={(e) => handlePhoneChange(index, e.target.value)}
          margin="dense"
          required={index === 0}
          InputProps={{ 
            autoComplete: "off",
            sx: inputSx
          }}
          InputLabelProps={{ sx: labelSx }}
        />
        {phoneNumbers.length > 1 && (
          <IconButton
            onClick={() => handleRemovePhoneNumber(index)}
            color="error"
            sx={{ 
              ml: 1,
              backgroundColor: "rgba(211, 47, 47, 0.05)",
              color: "#d32f2f",
              "&:hover": {
                backgroundColor: "rgba(211, 47, 47, 0.1)",
                transform: "scale(1.1)",
              }
            }}
            tabIndex={0}
          >
            <Remove />
          </IconButton>
        )}
      </Box>
    ));
  };

  const inputSx = {
    borderRadius: "6px",
    backgroundColor: "rgba(249, 245, 240, 0.6)",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(190, 175, 155, 0.3)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(190, 175, 155, 0.5)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#BEAF9B",
    }
  };

  const labelSx = {
    color: "rgba(69, 60, 51, 0.7)",
    "&.Mui-focused": {
      color: "#BEAF9B"
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "12px",
          background: "linear-gradient(145deg, #ffffff, #f9f5f0)",
          boxShadow: "0 8px 32px rgba(190, 175, 155, 0.25)",
          border: "1px solid rgba(190, 175, 155, 0.2)",
          overflow: "hidden"
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: "rgba(190, 175, 155, 0.08)", 
        borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
        py: 2.5
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 500, 
            color: "#453C33",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            textAlign: "center"
          }}
        >
          Register New Stylist
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ px: 4, py: 3, backgroundColor: "#ffffff" }}>
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          mb: 3,
          pb: 3,
          borderBottom: "1px dashed rgba(190, 175, 155, 0.3)"
        }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              fontSize: "3rem",
              fontWeight: 500,
              backgroundColor: "#BEAF9B",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(190, 175, 155, 0.4)",
              border: "3px solid #fff"
            }}
            src={formData.profile_url || ""}
          >
            {formData.firstname ? formData.firstname[0] : "S"}
          </Avatar>
          
          <Button
            variant="contained"
            component="label"
            sx={{
              backgroundColor: "#BEAF9B",
              color: "white",
              borderRadius: "6px",
              padding: "10px 16px",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 500,
              textTransform: "none",
              boxShadow: "0 4px 8px rgba(190, 175, 155, 0.25)",
              "&:hover": { 
                backgroundColor: "#a89683",
                boxShadow: "0 6px 12px rgba(190, 175, 155, 0.35)",
                transform: "translateY(-2px)"
              },
              transition: "all 0.3s ease"
            }}
          >
            Choose Picture
            <input type="file" onChange={handleImageChange} hidden />
          </Button>
        </Box>
        
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 2, 
            color: "#BEAF9B", 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontStyle: "italic"
          }}
        >
          * Required fields
        </Typography>
        
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)", 
          gap: 2.5,
          mb: 3
        }}>
          <TextField
            fullWidth
            label="First Name *"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            margin="dense"
            required
            InputProps={{ sx: inputSx }}
            InputLabelProps={{ sx: labelSx }}
          />
          
          <TextField
            fullWidth
            label="Last Name *"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            margin="dense"
            required
            InputProps={{ sx: inputSx }}
            InputLabelProps={{ sx: labelSx }}
          />
        </Box>
        
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)", 
          gap: 2.5,
          mb: 3 
        }}>
          <TextField
            fullWidth
            label="Email *"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="dense"
            required
            InputProps={{ sx: inputSx }}
            InputLabelProps={{ sx: labelSx }}
          />
          
          <TextField
            fullWidth
            label="Role *"
            name="role"
            value={formData.role}
            onChange={handleChange}
            margin="dense"
            required
            InputProps={{ sx: inputSx }}
            InputLabelProps={{ sx: labelSx }}
          />
        </Box>
        
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)", 
          gap: 2.5,
          mb: 3 
        }}>
          <TextField
            fullWidth
            label="Username *"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="dense"
            required
            InputProps={{ sx: inputSx }}
            InputLabelProps={{ sx: labelSx }}
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            margin="dense"
            placeholder="Leave empty for default (username + 123)"
            InputProps={{
              sx: inputSx,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: "#BEAF9B" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ sx: labelSx }}
            helperText="If left empty, password will be set to username + 123"
          />
        </Box>
        
        <Divider sx={{ 
          my: 2, 
          borderColor: "rgba(190, 175, 155, 0.2)",
          "&::before, &::after": {
            borderColor: "rgba(190, 175, 155, 0.2)",
          }
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#BEAF9B", 
              px: 1,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            Address Information
          </Typography>
        </Divider>
        
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: 2.5,
          mb: 3 
        }}>
          <TextField
            fullWidth
            label="House No *"
            name="house_no"
            value={formData.house_no}
            onChange={handleChange}
            margin="dense"
            required
            InputProps={{ sx: inputSx }}
            InputLabelProps={{ sx: labelSx }}
          />
          
          <TextField
            fullWidth
            label="Street *"
            name="street"
            value={formData.street}
            onChange={handleChange}
            margin="dense"
            required
            InputProps={{ sx: inputSx }}
            InputLabelProps={{ sx: labelSx }}
          />
          
          <TextField
            fullWidth
            label="City *"
            name="city"
            value={formData.city}
            onChange={handleChange}
            margin="dense"
            required
            InputProps={{ sx: inputSx }}
            InputLabelProps={{ sx: labelSx }}
          />
        </Box>
        
        <Divider sx={{ 
          my: 2, 
          borderColor: "rgba(190, 175, 155, 0.2)",
          "&::before, &::after": {
            borderColor: "rgba(190, 175, 155, 0.2)",
          }
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#BEAF9B", 
              px: 1,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            Phone Numbers
          </Typography>
        </Divider>
        
        {renderPhoneInputs(formData.phone_numbers)}
        
        <Button 
          onClick={handleAddPhoneNumber} 
          startIcon={<Add />}
          sx={{ 
            mt: 1,
            mb: 3,
            color: "#BEAF9B",
            borderColor: "rgba(190, 175, 155, 0.5)",
            borderStyle: "dashed",
            borderWidth: "1px",
            borderRadius: "6px",
            padding: "8px 16px",
            textTransform: "none",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            "&:hover": {
              backgroundColor: "rgba(190, 175, 155, 0.05)",
              borderColor: "#BEAF9B",
            }
          }}
        >
          Add Phone Number
        </Button>
        
        <Divider sx={{ 
          my: 2, 
          borderColor: "rgba(190, 175, 155, 0.2)",
          "&::before, &::after": {
            borderColor: "rgba(190, 175, 155, 0.2)",
          }
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#BEAF9B", 
              px: 1,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            Bio
          </Typography>
        </Divider>
        
        <TextField
          fullWidth
          label="Stylist Bio"
          name="bio"
          value={formData.bio || ""}
          onChange={handleChange}
          margin="dense"
          multiline
          rows={4}
          placeholder="A brief description about this stylist"
          InputProps={{ 
            sx: {
              ...inputSx,
              fontStyle: "italic",
            }
          }}
          InputLabelProps={{ sx: labelSx }}
        />
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 3, 
        backgroundColor: "rgba(190, 175, 155, 0.08)",
        borderTop: "1px dashed rgba(190, 175, 155, 0.3)",
        justifyContent: "center",
        gap: 2
      }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ 
            color: "#BEAF9B", 
            borderColor: "#BEAF9B",
            borderRadius: "6px",
            padding: "10px 24px",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            textTransform: "none",
            "&:hover": { 
              borderColor: "#a89683",
              backgroundColor: "rgba(190, 175, 155, 0.05)",
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleRegisterAndClear}
          variant="contained"
          sx={{ 
            backgroundColor: "#BEAF9B",
            color: "white",
            borderRadius: "6px",
            padding: "10px 24px",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "0 4px 8px rgba(190, 175, 155, 0.25)",
            "&:hover": { 
              backgroundColor: "#a89683",
              boxShadow: "0 6px 12px rgba(190, 175, 155, 0.35)",
            }
          }}
        >
          Register Stylist
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterStylistDialog;