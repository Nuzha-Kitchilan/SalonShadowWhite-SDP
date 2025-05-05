import React, { useState } from "react";
import {
  Box,
  Typography,
  Modal,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ServiceDetailModal from "./ServiceDetail";

const ServiceModal = ({
  open,
  onClose = () => {},
  categoryName,
  loading = false,
  services = [],
  onBack = () => {},
  isInDrawer = false,
  onAddToCart = () => {},
  cartItems = [],
}) => {
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceDetail, setShowServiceDetail] = useState(false);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowServiceDetail(true);
  };

  const handleBackToServices = () => {
    setShowServiceDetail(false);
    setSelectedService(null);
  };

  if (isInDrawer && showServiceDetail) {
    return (
      <ServiceDetailModal
        service={selectedService}
        onBack={handleBackToServices}
        onClose={onClose}
        onAddToCart={onAddToCart}
        cartItems={cartItems}
      />
    );
  }

  const content = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "background.paper",
        p: isInDrawer ? 0 : 3,
        maxHeight: isInDrawer ? "100vh" : "80vh",
        overflowY: "hidden",
      }}
    >
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        p: 2,
        borderBottom: "1px solid #e0e0e0",
        background: "linear-gradient(to right, #f9f5f0, #ffffff)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
      }}>
        {isInDrawer ? (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center",
            gap: 1
          }}>
            <IconButton
              sx={{
                color: "#BEAF9B",
                "&:hover": {
                  backgroundColor: "rgba(190, 175, 155, 0.1)",
                  transform: "scale(1.05)",
                  transition: "all 0.2s",
                },
              }}
              onClick={onBack}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 500,
                color: "#453C33",
                letterSpacing: "0.3px",
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              }}
            >
              {categoryName || "Services"}
            </Typography>
          </Box>
        ) : (
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 500,
              color: "#453C33",
              letterSpacing: "0.3px",
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            }}
          >
            {categoryName || "Services"}
          </Typography>
        )}
      </Box>
      {/* Removed divider as we now have a border-bottom in the header */}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : services.length === 0 ? (
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          p: 4, 
          height: "50vh" 
        }}>
          <Box 
            sx={{ 
              bgcolor: "#f5f5f5", 
              borderRadius: "50%", 
              p: 2, 
              mb: 2 
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                color: "#BEAF9B", 
                width: "40px", 
                height: "40px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}
            >
              !
            </Typography>
          </Box>
          <Typography 
            sx={{ 
              p: 2, 
              color: "#666", 
              fontWeight: "medium", 
              textAlign: "center" 
            }}
          >
            No services available for this category.
          </Typography>
        </Box>
      ) : (
        <List 
          disablePadding 
          sx={{ 
            maxHeight: "calc(100vh - 130px)", 
            overflowY: "auto", 
            scrollbarWidth: "none", 
            "&::-webkit-scrollbar": { display: "none" }, 
            msOverflowStyle: "none",
            pt: 2,
            pb: 4
          }}>
          {services.map((service, index) => (
            <React.Fragment key={service.service_id}>
              <ListItem
                component="div"
                sx={{
                  py: 2,
                  px: 2,
                  cursor: "pointer",
                  color: "#000",
                  borderRadius: "10px",
                  mx: 1,
                  my: 0.5,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => handleServiceClick(service)}
              >
                <ListItemText
                  primary={service.service_name}
                  secondary={`Duration: ${service.time_duration} mins | Price: ${service.price}`}
                  primaryTypographyProps={{
                    fontWeight: "600",
                    fontSize: "1rem",
                    color: "#453C33",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                  }}
                  secondaryTypographyProps={{
                    color: "#666",
                    fontSize: "0.85rem",
                    fontWeight: "400",
                    marginTop: "4px",
                  }}
                />
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1 
                }}>
                  <Box 
                    sx={{ 
                      bgcolor: "#BEAF9B20", 
                      borderRadius: "50%", 
                      p: 0.8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s"
                    }}
                  >
                    <ArrowForwardIosIcon sx={{ fontSize: "14px", color: "#BEAF9B" }} />
                  </Box>
                </Box>
              </ListItem>
              {index < services.length - 1 && <Divider sx={{ opacity: 0.6, borderStyle: 'dashed', mx: 2 }} />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );

  if (isInDrawer) return content;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        {content}
      </Box>
    </Modal>
  );
};

export default ServiceModal;