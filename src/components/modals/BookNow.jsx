import React, { useState } from "react";
import {
  Button,
  Drawer,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SpecialRequest from "../SpecialRequest";
import CategoryMenu from "./CategoryMenu";
import bookingHeaderImg from "../../assets/booking-header.png";

const BookingButton = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentView, setCurrentView] = useState("main");

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
    if (!openDrawer) {
      setCurrentView("main");
    }
  };

  const handleShowSpecialRequest = () => setCurrentView("specialRequest");
  const handleShowCategories = () => setCurrentView("categories");
  const handleBackToMain = () => setCurrentView("main");

  const renderHeader = () => (
    <Box sx={{ position: "relative" }}>
      <img
        src={bookingHeaderImg}
        alt="Booking Header"
        style={{
          width: "100%",
          height: "240px",
          objectFit: "cover",
        }}
      />
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "#fff",
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );

  const renderMainView = () => (
    <Box sx={{ px: 2, pt: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        APPOINTMENT PREFERENCE
      </Typography>

      {/* Individual Appointment */}
      <Box
        onClick={handleShowCategories}
        sx={{
          py: 2,
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Box>
          <Typography
            variant="body1"
            sx={{ color: "#007bff", fontWeight: "bold" }}
          >
            Individual Appointment
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Schedule services for yourself
          </Typography>
        </Box>
        <ArrowForwardIosIcon sx={{ fontSize: "16px", color: "#888" }} />
      </Box>

      {/* Special Request */}
      <Box
        onClick={handleShowSpecialRequest}
        sx={{
          py: 2,
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Box>
          <Typography
            variant="body1"
            sx={{ color: "#007bff", fontWeight: "bold" }}
          >
            Special Request
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Make a custom service request
          </Typography>
        </Box>
        <ArrowForwardIosIcon sx={{ fontSize: "16px", color: "#888" }} />
      </Box>
    </Box>
  );

  const renderContent = () => {
    switch (currentView) {
      case "specialRequest":
        return <SpecialRequest setCurrentView={setCurrentView} />;
      case "categories":
        return <CategoryMenu setCurrentView={setCurrentView} />;
      default:
        return renderMainView();
    }
  };

  return (
    <>
      <Button
        variant="contained"
        size="large"
        onClick={toggleDrawer}
        sx={{
          backgroundColor: "#d3d3d3",
          color: "#333",
          px: 4,
          py: 1.5,
          fontWeight: "bold",
          fontSize: "1rem",
          borderRadius: "30px",
          marginTop: "250px",
          "&:hover": {
            backgroundColor: "#c0c0c0",
          },
        }}
      >
        Book Now
      </Button>

      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 500 },
            backgroundColor: "#fff",
          },
        }}
      >
        {renderHeader()}
        <Box
          sx={{
            px: currentView === "categories" ? 0 : 2,
            py: currentView === "main" ? 0 : 2,
          }}
        >
          {renderContent()}
        </Box>
      </Drawer>
    </>
  );
};

export default BookingButton;
