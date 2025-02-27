import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Portal,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Stylists = () => {
  const [stylists, setStylists] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [showPasswordInForm, setShowPasswordInForm] = useState(false);
  const [showPasswordInEditForm, setShowPasswordInEditForm] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    role: "",
    house_no: "",
    street: "",
    city: "",
    phone_numbers: [""], // Phone numbers as an array
    profile_url: "",
    password: "",  // Add password field
  });

  // Fix aria-hidden issues on root element
  useEffect(() => {
    const fixAriaHiddenIssue = () => {
      const rootElement = document.getElementById("root");
      if (rootElement && rootElement.getAttribute("aria-hidden") === "true") {
        rootElement.removeAttribute("aria-hidden");
      }
    };

    // Run immediately
    fixAriaHiddenIssue();

    // Set up an interval to continuously check and fix
    const intervalId = setInterval(fixAriaHiddenIssue, 500);

    // Add event listeners to catch focus events
    document.addEventListener("focusin", fixAriaHiddenIssue);
    document.addEventListener("mousedown", fixAriaHiddenIssue);
    document.addEventListener("keydown", fixAriaHiddenIssue);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("focusin", fixAriaHiddenIssue);
      document.removeEventListener("mousedown", fixAriaHiddenIssue);
      document.removeEventListener("keydown", fixAriaHiddenIssue);
    };
  }, []);

  // Fetch stylists from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/stylists")
      .then((response) => {
        const stylistsWithPhoneNumbers = response.data.map((stylist) => ({
          ...stylist,
          phone_numbers: Array.isArray(stylist.phone_numbers)
            ? stylist.phone_numbers
            : stylist.phone_numbers
            ? stylist.phone_numbers.split(",")
            : [], // Handle phone numbers correctly
        }));
        setStylists(stylistsWithPhoneNumbers);
        
        // Initialize password visibility state for all stylists
        const initialVisibilityState = {};
        stylistsWithPhoneNumbers.forEach(stylist => {
          initialVisibilityState[stylist.stylist_ID] = false;
        });
        setPasswordVisibility(initialVisibilityState);
      })
      .catch((error) => console.error("Error fetching stylists:", error));
  }, []);

  const togglePasswordVisibility = (stylistId) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [stylistId]: !prev[stylistId]
    }));
  };

  const handleEdit = (stylist) => {
    setSelectedStylist(stylist);
    setFormData({
      ...stylist,
      phone_numbers: Array.isArray(stylist.phone_numbers)
        ? stylist.phone_numbers // If it's already an array
        : stylist.phone_numbers
        ? stylist.phone_numbers.split(",")
        : [], // Handle string case
    });
    setOpenEdit(true);
    setShowPasswordInEditForm(false); // Reset password visibility when opening edit form
  };

  const handleDelete = (stylist) => {
    setSelectedStylist(stylist);
    setOpenDelete(true);
  };

  // Simplified phone number handling
  const handlePhoneChange = (index, value) => {
    const updatedPhones = [...formData.phone_numbers];
    updatedPhones[index] = value;
    setFormData({ ...formData, phone_numbers: updatedPhones });
  };

  const handleAddPhoneNumber = () => {
    setFormData({
      ...formData,
      phone_numbers: [...formData.phone_numbers, ""],
    });
  };

  const handleRemovePhoneNumber = (index) => {
    const updatedPhones = formData.phone_numbers.filter((_, i) => i !== index);
    setFormData({ ...formData, phone_numbers: updatedPhones });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          profile_url: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = () => {
    // Ensure root is not aria-hidden before saving
    const rootElement = document.getElementById("root");
    if (rootElement) rootElement.removeAttribute("aria-hidden");

    axios
      .put(
        `http://localhost:5001/api/stylists/${selectedStylist.stylist_ID}`,
        formData
      )
      .then(() => {
        setStylists(
          stylists.map((stylist) =>
            stylist.stylist_ID === selectedStylist.stylist_ID
              ? formData
              : stylist
          )
        );
        setOpenEdit(false);
      })
      .catch((error) => console.error("Error updating stylist:", error));
  };

  const handleConfirmDelete = () => {
    // Ensure root is not aria-hidden before deleting
    const rootElement = document.getElementById("root");
    if (rootElement) rootElement.removeAttribute("aria-hidden");

    axios
      .delete(
        `http://localhost:5001/api/stylists/${selectedStylist.stylist_ID}`
      )
      .then(() => {
        setStylists(
          stylists.filter(
            (stylist) => stylist.stylist_ID !== selectedStylist.stylist_ID
          )
        );
        setOpenDelete(false);
      })
      .catch((error) => console.error("Error deleting stylist:", error));
  };

  // Add validation before submission
  const handleAddStylist = () => {
    // Check required fields
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.username ||
      !formData.role ||
      !formData.house_no ||
      !formData.street ||
      !formData.city
    ) {
      alert("Please fill all required fields");
      return;
    }
  
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }
  
    // Filter out empty phone numbers
    const filteredPhoneNumbers = formData.phone_numbers.filter(
      (phone) => phone && phone.trim() !== ""
    );
  
    // Validate phone format if provided
    const phoneRegex = /^[0-9]{10}$/;
    for (let phone of filteredPhoneNumbers) {
      if (!phoneRegex.test(phone)) {
        alert(`Invalid phone number format: ${phone}. Must be 10 digits.`);
        return;
      }
    }
  
    // Generate a default password if none is provided
    const password = formData.password || formData.username + "123";
  
    // Create a copy with filtered phone numbers and password
    const submissionData = {
      ...formData,
      password: password,  // Add the password
      profile_url: formData.profile_url ? formData.profile_url : null,
      phone_numbers: filteredPhoneNumbers,
    };
  
    console.log("Submitting data:", submissionData);
  
    axios
      .post("http://localhost:5001/api/stylists", submissionData)
      .then((response) => {
        console.log("Stylist added successfully:", response.data);
        // After successful addition, fetch the updated list
        axios.get("http://localhost:5001/api/stylists").then((response) => {
          const stylistsWithPhoneNumbers = response.data.map((stylist) => ({
            ...stylist,
            phone_numbers: Array.isArray(stylist.phone_numbers)
              ? stylist.phone_numbers
              : stylist.phone_numbers
              ? stylist.phone_numbers.split(",")
              : [],
          }));
          setStylists(stylistsWithPhoneNumbers);
          
          // Update password visibility state for new stylists
          const updatedVisibilityState = {...passwordVisibility};
          stylistsWithPhoneNumbers.forEach(stylist => {
            if (!(stylist.stylist_ID in updatedVisibilityState)) {
              updatedVisibilityState[stylist.stylist_ID] = false;
            }
          });
          setPasswordVisibility(updatedVisibilityState);
        });
        setOpenAdd(false);
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          username: "",
          role: "",
          house_no: "",
          street: "",
          city: "",
          phone_numbers: [""],
          profile_url: "",
          password: ""  // Reset password field
        });
        setShowPasswordInForm(false); // Reset password visibility
      })
      .catch((error) => {
        console.error("Error adding stylist:", error);
        let errorMessage = "Failed to add stylist";
        
        if (error.response) {
          console.error("Error response data:", error.response.data);
          errorMessage += ": " + (error.response.data.message || "Unknown error");
          
          if (error.response.data.details) {
            console.error("Error details:", error.response.data.details);
            errorMessage += " - " + error.response.data.details;
          }
        }
        
        alert(errorMessage);
      });
  };
  
  // Clean up dialog closing
  const handleCloseDialog = (setter) => {
    const rootElement = document.getElementById("root");
    if (rootElement) rootElement.removeAttribute("aria-hidden");
    setter(false);
  };

  // Render phone number inputs with special handling
  const renderPhoneInputs = (phoneNumbers) => {
    return phoneNumbers.map((phone, index) => (
      <div
        key={index}
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <TextField
          fullWidth
          label={`Phone ${index + 1}`}
          value={phone}
          onChange={(e) => handlePhoneChange(index, e.target.value)}
          margin="dense"
          // Remove any attributes that might interfere with focus
          InputProps={{
            autoComplete: "off",
          }}
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
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Button
          onClick={() => {
            setOpenAdd(true);
            setShowPasswordInForm(false); // Reset password visibility when opening add form
          }}
          sx={{
            backgroundColor: "#FE8DA1",
            color: "white",
            "&:hover": { backgroundColor: "#ff6f91" },
            marginBottom: "15px",
          }}
        >
          Add Stylist
        </Button>
      </Grid>
      {stylists.map((stylist) => (
        <Grid item key={stylist.stylist_ID} xs={12} sm={6} md={4}>
          <Card
            sx={{
              textAlign: "center",
              height: 420,
              boxShadow: `0 6px 12px rgba(254, 141, 161, 0.8)`,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: `0 12px 24px rgba(254, 141, 161, 1)`,
              },
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: "20px auto 10px",
                fontSize: "3rem",
                backgroundColor: "lightgray",
              }}
              src={stylist.profile_url || ""}
            >
              {stylist.firstname ? stylist.firstname[0] : "S"}
            </Avatar>
            <CardContent>
              <Typography variant="h6">
                {stylist.firstname} {stylist.lastname}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Role: {stylist.role}
              </Typography>
              <Typography variant="body2">Email: {stylist.email}</Typography>
              <Typography variant="body2">
                Username: {stylist.username}
              </Typography>
              <Typography variant="body2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Password: {passwordVisibility[stylist.stylist_ID] ? stylist.password : '••••••••'} 
                <IconButton 
                  onClick={() => togglePasswordVisibility(stylist.stylist_ID)} 
                  size="small" 
                  style={{ marginLeft: '5px' }}
                >
                  {passwordVisibility[stylist.stylist_ID] ? 
                    <VisibilityOffIcon fontSize="small" /> : 
                    <VisibilityIcon fontSize="small" />
                  }
                </IconButton>
              </Typography>
              <Typography variant="body2">
                Address: {stylist.house_no}, {stylist.street}, {stylist.city}
              </Typography>
              <Typography variant="body2">
                Phone:{" "}
                {stylist.phone_numbers && Array.isArray(stylist.phone_numbers)
                  ? stylist.phone_numbers.join(", ")
                  : "N/A"}
              </Typography>

              <div style={{ marginTop: "10px" }}>
                <IconButton color="success" onClick={() => handleEdit(stylist)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(stylist)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* Using Portal to render dialogs outside of the potentially aria-hidden root */}
      <Portal container={document.body}>
        {/* Add Stylist Dialog */}
        <Dialog
          open={openAdd}
          onClose={() => handleCloseDialog(setOpenAdd)}
          fullWidth
          maxWidth="sm"
          disablePortal={false}
          container={document.body}
        >
          <DialogTitle>Add Stylist</DialogTitle>
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
              type={showPasswordInForm ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="dense"
              placeholder="Leave empty for default (username + 123)"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswordInForm(!showPasswordInForm)}
                      edge="end"
                    >
                      {showPasswordInForm ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
            <Button onClick={() => handleCloseDialog(setOpenAdd)}
              sx={{ backgroundColor: "#FE8DA1", color: "#fff", '&:hover': { backgroundColor: "#fe6a9f" } }}>
              Cancel
            </Button>
            <Button onClick={handleAddStylist}
            sx={{ backgroundColor: "#FE8DA1", color: "#fff", '&:hover': { backgroundColor: "#fe6a9f" } }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Stylist Dialog */}
        <Dialog
          open={openEdit}
          onClose={() => handleCloseDialog(setOpenEdit)}
          fullWidth
          maxWidth="sm"
          disablePortal={false}
          container={document.body}
        >
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
              type={showPasswordInEditForm ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="dense"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswordInEditForm(!showPasswordInEditForm)}
                      edge="end"
                    >
                      {showPasswordInEditForm ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
            <Button onClick={() => handleCloseDialog(setOpenEdit)}
              sx={{ backgroundColor: "#FE8DA1", color: "#fff", '&:hover': { backgroundColor: "#fe6a9f" } }}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} 
            sx={{ backgroundColor: "#FE8DA1", color: "#fff", '&:hover': { backgroundColor: "#fe6a9f" } }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Stylist Dialog */}
        <Dialog
          open={openDelete}
          onClose={() => handleCloseDialog(setOpenDelete)}
          disablePortal={false}
          container={document.body}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this stylist?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleCloseDialog(setOpenDelete)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Portal>
    </Grid>
  );
};

export default Stylists;