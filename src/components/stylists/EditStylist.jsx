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
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const EditStylistDialog = ({ 
  open, 
  handleClose, 
  handleSave,
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

  const renderPhoneInputs = (phoneNumbers) => {
    return phoneNumbers.map((phone, index) => (
      <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <TextField
          fullWidth
          label={`Phone ${index + 1}`}
          value={phone}
          onChange={(e) => handlePhoneChange(index, e.target.value)}
          margin="dense"
          InputProps={{ autoComplete: "off" }}
        />
        {phoneNumbers.length > 1 && (
          <Button
            onClick={() => handleRemovePhoneNumber(index)}
            color="error"
            style={{ marginLeft: "8px" }}
            tabIndex={0}
          >
            Remove
          </Button>
        )}
      </div>
    ));
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Stylist</DialogTitle>
      <DialogContent>
        <Avatar
          sx={{
            width: 120,
            height: 120,
            margin: "10px auto",
            fontSize: "3rem",
            backgroundColor: "lightgray",
          }}
          src={formData.profile_url || ""}
        >
          {formData.firstname ? formData.firstname[0] : "S"}
        </Avatar>
        <Button
          variant="contained"
          component="label"
          sx={{
            backgroundColor: "#FE8DA1",
            color: "white",
            "&:hover": { backgroundColor: "#ff6f91" },
            marginBottom: "10px",
            display: "block",
            width: "100%",
            textAlign: "center",
          }}
        >
          Choose Picture
          <input type="file" onChange={handleImageChange} hidden />
        </Button>
        <TextField
          fullWidth
          label="First Name"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Bio"
          name="bio"
          value={formData.bio || ""}
          onChange={handleChange}
          margin="dense"
          multiline
          rows={3}
          placeholder="A brief description about this stylist"
        />
        <TextField
          fullWidth
          label="House No"
          name="house_no"
          value={formData.house_no}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          margin="dense"
        />

        {renderPhoneInputs(formData.phone_numbers)}

        <Button onClick={handleAddPhoneNumber} sx={{ mt: 1 }}>
          Add Phone Number
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}
          sx={{ backgroundColor: "#FE8DA1", color: "#fff", '&:hover': { backgroundColor: "#fe6a9f" } }}>
          Cancel
        </Button>
        <Button onClick={handleSave} 
          sx={{ backgroundColor: "#FE8DA1", color: "#fff", '&:hover': { backgroundColor: "#fe6a9f" } }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStylistDialog;