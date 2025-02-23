import React, { useState } from "react";
import {
  Card, CardContent, CardActions, Typography, Avatar, IconButton,
  Button, Grid, TextField, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions
} from "@mui/material";
import { Visibility, VisibilityOff, Edit, Delete, Add } from "@mui/icons-material";

const Stylists = () => {
  const [stylists, setStylists] = useState([
    {
      id: 1,
      profilePicture: "https://via.placeholder.com/100",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      contactNumber: "+1234567890",
      address: "123 Street, City",
      role: "Admin",
      username: "johndoe",
      password: "password123",
      showPassword: false,
    },
    {
      id: 2,
      profilePicture: "https://via.placeholder.com/100",
      firstName: "Jane",
      lastName: "Smith",
      email: "janesmith@example.com",
      contactNumber: "+9876543210",
      address: "456 Avenue, Town",
      role: "Beautician",
      username: "janesmith",
      password: "mypassword",
      showPassword: false,
    },
  ]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentStylist, setCurrentStylist] = useState(null);

  const handleTogglePassword = (id) => {
    setStylists((prev) =>
      prev.map((stylist) =>
        stylist.id === id ? { ...stylist, showPassword: !stylist.showPassword } : stylist
      )
    );
  };

  const handleEditClick = (stylist) => {
    setCurrentStylist(stylist);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (stylist) => {
    setCurrentStylist(stylist);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setStylists((prev) => prev.filter((stylist) => stylist.id !== currentStylist.id));
    setDeleteDialogOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentStylist((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    setStylists((prev) =>
      prev.map((stylist) => (stylist.id === currentStylist.id ? currentStylist : stylist))
    );
    setEditDialogOpen(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button
        variant="contained"
        style={{ backgroundColor: "#FE8DA1", color: "white", marginBottom: "20px" }}
        startIcon={<Add />}
      >
        Add Stylist
      </Button>

      <Grid container spacing={3}>
        {stylists.map((stylist) => (
          <Grid item xs={12} sm={6} md={4} key={stylist.id}>
            <Card sx={{ padding: 3, textAlign: "center", boxShadow: "0px 4px 10px #FE8DA1" }}>
              <Avatar
                src={stylist.profilePicture}
                sx={{ width: 80, height: 80, margin: "auto" }}
              />
              <CardContent>
                <Typography><strong>Name:</strong> {stylist.firstName} {stylist.lastName}</Typography>
                <Typography><strong>Email:</strong> {stylist.email}</Typography>
                <Typography><strong>Phone:</strong> {stylist.contactNumber}</Typography>
                <Typography><strong>Address:</strong> {stylist.address}</Typography>
                <Typography><strong>Role:</strong> {stylist.role}</Typography>
                <Typography><strong>Username:</strong> {stylist.username}</Typography>
                <TextField
                  type={stylist.showPassword ? "text" : "password"}
                  value={stylist.password}
                  variant="standard"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleTogglePassword(stylist.id)}>
                          {stylist.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ marginTop: 1 }}
                />
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <IconButton style={{ color: "green" }} onClick={() => handleEditClick(stylist)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteClick(stylist)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Stylist</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            name="firstName"
            value={currentStylist?.firstName || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={currentStylist?.lastName || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={currentStylist?.email || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="contactNumber"
            value={currentStylist?.contactNumber || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={currentStylist?.address || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Role"
            name="role"
            value={currentStylist?.role || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Username"
            name="username"
            value={currentStylist?.username || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type={currentStylist?.showPassword ? "text" : "password"}
            value={currentStylist?.password || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleTogglePassword(currentStylist.id)}>
                    {currentStylist?.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} 
          style={{ backgroundColor: "#FE8DA1", color: "white" }}
          >
            Cancel
          </Button>
          <Button onClick={handleEditSave} style={{ backgroundColor: "#FE8DA1", color: "white" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
<Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <Typography>
      Are you sure you want to delete {currentStylist?.firstName} {currentStylist?.lastName}?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => setDeleteDialogOpen(false)}
      style={{ color: "blue" }} // No button background, just blue text
    >
      No
    </Button>
    <Button
      onClick={handleDeleteConfirm}
      style={{ color: "red" }} // Delete button in red
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>


    </div>
  );
};

export default Stylists;
