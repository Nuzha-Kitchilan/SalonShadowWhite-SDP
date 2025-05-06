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
    <Box sx={{  width: "100%", 
      position: "relative",
      height: { xs: '180px', sm: '300px', md: '400px' },
      overflow: "hidden"  }}>
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
          px: { xs: 3, sm: 4 }, // Reduce horizontal padding on mobile
          py: { xs: 0, sm: 1.5 }, // Reduce vertical padding on mobile  
          fontWeight: "bold",
          fontSize: "1rem",
          borderRadius: "30px",
          marginTop: { xs: "200px", sm: "250px" }, // Only 20px on mobile, 250px on desktop
          position: { xs: "relative", sm: "static" }, // Relative on mobile
          top: { xs: "-80px", sm: "auto" }, // Pull up on mobile
          left: { xs: "50%", sm: "auto" }, // Center on mobile
          transform: { xs: "translateX(-50%)", sm: "none" },
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
            overflowY: "auto",
            height: "calc(100% - 180px)",
            "& ::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {renderContent()}
        </Box>
      </Drawer>
    </>
  );
};

export default BookingButton;
