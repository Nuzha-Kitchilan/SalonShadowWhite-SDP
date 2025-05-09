import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Box, 
  Button, 
  Portal, 
  Container, 
  Paper, 
  Typography, 
  useMediaQuery, 
  useTheme 
} from "@mui/material";
import StylistCard from "../components/stylists/StylistCard";
import RegisterStylistDialog from "../components/stylists/RegisterStylistDialog";
import EditStylistDialog from "../components/stylists/EditStylist";
import DeleteConfirmationDialog from "../components/DeleteDialog";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { jwtDecode } from 'jwt-decode';

const Stylists = () => {
  const [stylists, setStylists] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [adminId, setAdminId] = useState(null);
  const [adminName, setAdminName] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
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
    password: "",
    bio: "",
  });

  // Get admin info from JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAdminId(decodedToken.id);
        setAdminName(decodedToken.name || decodedToken.username || 'Admin');
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Fix aria-hidden issues on root element
  useEffect(() => {
    const fixAriaHiddenIssue = () => {
      const rootElement = document.getElementById("root");
      if (rootElement && rootElement.getAttribute("aria-hidden") === "true") {
        rootElement.removeAttribute("aria-hidden");
      }
    };

    fixAriaHiddenIssue();
    const intervalId = setInterval(fixAriaHiddenIssue, 500);

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
      .get("/stylists")
      .then((response) => {
        const stylistsWithPhoneNumbers = response.data.map((stylist) => ({
          ...stylist,
          phone_numbers: Array.isArray(stylist.phone_numbers)
            ? stylist.phone_numbers
            : stylist.phone_numbers
            ? stylist.phone_numbers.split(",")
            : [],
        }));
        setStylists(stylistsWithPhoneNumbers);
        
        const initialVisibilityState = {};
        stylistsWithPhoneNumbers.forEach(stylist => {
          initialVisibilityState[stylist.stylist_ID] = false;
        });
        setPasswordVisibility(initialVisibilityState);
      })
      .catch((error) => console.error("Error fetching stylists:", error));
  }, []);

  // Get current time to display greeting
  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

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
        ? stylist.phone_numbers
        : stylist.phone_numbers
        ? stylist.phone_numbers.split(",")
        : [],
    });
    setOpenEdit(true);
  };

  const handleDelete = (stylist) => {
    setSelectedStylist(stylist);
    setOpenDelete(true);
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profile_url: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = () => {
    const rootElement = document.getElementById("root");
    if (rootElement) rootElement.removeAttribute("aria-hidden");

    axios
      .put(
        `/stylists/${selectedStylist.stylist_ID}`,
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
    const rootElement = document.getElementById("root");
    if (rootElement) rootElement.removeAttribute("aria-hidden");

    axios
      .delete(
        `/stylists/${selectedStylist.stylist_ID}`
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

  const handleRegisterStylist = () => {
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
  
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }
  
    const filteredPhoneNumbers = formData.phone_numbers.filter(
      (phone) => phone && phone.trim() !== ""
    );
  
    const phoneRegex = /^[0-9]{10}$/;
    for (let phone of filteredPhoneNumbers) {
      if (!phoneRegex.test(phone)) {
        alert(`Invalid phone number format: ${phone}. Must be 10 digits.`);
        return;
      }
    }
  
    const password = formData.password || formData.username + "123";
  
    const submissionData = {
      ...formData,
      password: password,
      profile_url: formData.profile_url ? formData.profile_url : null,
      bio: formData.bio ? formData.bio : null,
      phone_numbers: filteredPhoneNumbers,
    };
  
    console.log("Submitting data:", submissionData);
  
    axios
      .post("/stylists", submissionData)
      .then((response) => {
        console.log("Stylist registered successfully:", response.data);
        axios.get("/stylists").then((response) => {
          const stylistsWithPhoneNumbers = response.data.map((stylist) => ({
            ...stylist,
            phone_numbers: Array.isArray(stylist.phone_numbers)
              ? stylist.phone_numbers
              : stylist.phone_numbers
              ? stylist.phone_numbers.split(",")
              : [],
          }));
          setStylists(stylistsWithPhoneNumbers);
          
          const updatedVisibilityState = {...passwordVisibility};
          stylistsWithPhoneNumbers.forEach(stylist => {
            if (!(stylist.stylist_ID in updatedVisibilityState)) {
              updatedVisibilityState[stylist.stylist_ID] = false;
            }
          });
          setPasswordVisibility(updatedVisibilityState);
        });
        setOpenRegister(false);
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
          password: "",
          bio: ""
        });
      })
      .catch((error) => {
        console.error("Error registering stylist:", error);
        let errorMessage = "Failed to register stylist";
        
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
  
  const handleCloseDialog = (setter) => {
    const rootElement = document.getElementById("root");
    if (rootElement) rootElement.removeAttribute("aria-hidden");
    setter(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(190, 175, 155, 0.2)',
          mb: 4,
          background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))',
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid rgba(190, 175, 155, 0.2)' }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 600,
              color: '#453C33',
              mb: 1
            }}
          >
            Stylist Management
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#666',
              mb: 1
            }}
          >
            {getCurrentTimeGreeting()}, {adminName}. Manage your salon's stylists here.
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => {
                setOpenRegister(true);
              }}
              sx={{
                backgroundColor: "#BEAF9B",
                color: "white",
                padding: "10px 24px",
                borderRadius: "8px",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "1rem",
                boxShadow: "0 4px 8px rgba(190, 175, 155, 0.3)",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": { 
                  backgroundColor: "#a49683",
                  boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              <PersonAddAltIcon fontSize="small" />
              Register New Stylist
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {stylists.map((stylist) => (
              <StylistCard
                key={stylist.stylist_ID}
                stylist={stylist}
                passwordVisibility={passwordVisibility}
                togglePasswordVisibility={togglePasswordVisibility}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      <Portal container={document.body}>
        <RegisterStylistDialog
          open={openRegister}
          handleClose={() => handleCloseDialog(setOpenRegister)}
          handleRegister={handleRegisterStylist}
          formData={formData}
          setFormData={setFormData}
          handleImageChange={handleImageChange}
          handlePhoneChange={handlePhoneChange}
          handleAddPhoneNumber={handleAddPhoneNumber}
          handleRemovePhoneNumber={handleRemovePhoneNumber}
        />

        <EditStylistDialog
          open={openEdit}
          handleClose={() => handleCloseDialog(setOpenEdit)}
          handleSave={handleSaveEdit}
          formData={formData}
          setFormData={setFormData}
          handleImageChange={handleImageChange}
          handlePhoneChange={handlePhoneChange}
          handleAddPhoneNumber={handleAddPhoneNumber}
          handleRemovePhoneNumber={handleRemovePhoneNumber}
        />

        <DeleteConfirmationDialog
          open={openDelete}
          onClose={() => handleCloseDialog(setOpenDelete)}
          onConfirm={handleConfirmDelete}
        />
      </Portal>
    </Container>
  );
};

export default Stylists;