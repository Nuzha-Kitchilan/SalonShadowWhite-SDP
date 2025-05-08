import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Portal, Container } from "@mui/material";
import StylistCard from "../components/stylists/StylistCard";
import RegisterStylistDialog from "../components/stylists/RegisterStylistDialog";
import EditStylistDialog from "../components/stylists/EditStylist";
import DeleteConfirmationDialog from "../components/DeleteDialog";

const Stylists = () => {
  const [stylists, setStylists] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState({});
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
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
            "&:hover": { 
              backgroundColor: "#a49683",
              boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
              transform: "translateY(-2px)"
            }
          }}
        >
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