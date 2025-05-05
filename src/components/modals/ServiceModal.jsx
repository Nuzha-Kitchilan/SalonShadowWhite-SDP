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
import CloseIcon from "@mui/icons-material/Close";
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
        overflowY: "auto",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
        {isInDrawer ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={onBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">{categoryName || "Services"}</Typography>
          </Box>
        ) : (
          <Typography variant="h6">{categoryName || "Services"}</Typography>
        )}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : services.length === 0 ? (
        <Typography sx={{ p: 2 }}>No services available for this category.</Typography>
      ) : (
        <List>
          {services.map((service, index) => (
            <React.Fragment key={service.service_id}>
              <ListItem sx={{ cursor: "pointer" }} onClick={() => handleServiceClick(service)}>
                <ListItemText
                  primary={service.service_name}
                  secondary={`Duration: ${service.time_duration} mins | Price: $${service.price}`}
                />
                <ArrowForwardIosIcon sx={{ fontSize: "16px", color: "#888" }} />
              </ListItem>
              {index < services.length - 1 && <Divider />}
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
