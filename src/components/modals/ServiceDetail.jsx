import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import ProfessionalSelectModal from "./StylistSelection";
import CartModal from "./CartModal"; // Import CartModal

const ServiceDetailModal = ({
  service,
  onBack,
  onClose,
  onAddToCart,
  cartItems = [] // ✅ Fix: define cartItems as a prop with default empty array
}) => {
  const [showStylistSelect, setShowStylistSelect] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false); // Add state for CartModal

  const handleSelectProfessional = () => {
    setShowStylistSelect(true);
  };

  const handleBackToServiceDetail = () => {
    setShowStylistSelect(false);
  };

  const handleSelectStylist = (stylist) => {
    // Add service and stylist to cart
    if (onAddToCart) {
      onAddToCart({
        service: service,
        stylist: stylist
      });
    }
    setShowStylistSelect(false);
    // Show the cart modal after adding to cart
    setShowCartModal(true);
  };

  // Handle closing the CartModal
  const handleCloseCartModal = () => {
    setShowCartModal(false);
    // Close all modals after closing CartModal if needed
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  // If showing cart modal
  if (showCartModal) {
    return (
      <CartModal 
        cartItems={cartItems} // ✅ Now properly passed
        onBack={() => setShowCartModal(false)}
        onClose={handleCloseCartModal}
      />
    );
  }

  // If showing stylist selection
  if (showStylistSelect) {
    return (
      <ProfessionalSelectModal
        service={service}
        onBack={handleBackToServiceDetail}
        onClose={typeof onClose === 'function' ? onClose : () => {}}
        onSelectProfessional={handleSelectStylist}
      />
    );
  }

  if (!service) return null;

  return (
    <Box sx={{ 
      width: "100%", 
      height: "100%", 
      bgcolor: "#f5f5f5",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={onBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">{service.service_name}</Typography>
        </Box>
        <IconButton onClick={typeof onClose === 'function' ? onClose : () => {}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      {/* Content */}
      <Box sx={{ 
        p: 3, 
        flexGrow: 1,
        overflow: "auto"
      }}>
        <Box sx={{ 
          bgcolor: "#fff", 
          borderRadius: "8px", 
          boxShadow: 3,
          p: 3
        }}>
          <Typography variant="body1" paragraph>
            {service.description || "No description available."}
          </Typography>
          
          {service.additional_note && (
            <Typography variant="body2" color="text.secondary" paragraph sx={{ fontStyle: 'italic' }}>
              *{service.additional_note}
            </Typography>
          )}

          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Duration: {service.time_duration} mins | Price: ${service.price}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: 2, 
        bgcolor: "#fff",
        borderTop: "1px solid rgba(0, 0, 0, 0.12)",
        display: "flex",
        justifyContent: "center"
      }}>
        <Button 
          variant="contained" 
          onClick={handleSelectProfessional}
          sx={{ 
            bgcolor: '#333', 
            '&:hover': { bgcolor: '#444' }, 
            color: 'white',
            py: 1,
            px: 4,
            borderRadius: 1,
            width: "100%",
            maxWidth: "500px"
          }}
        >
          Select a professional
        </Button>
      </Box>
    </Box>
  );
};

export default ServiceDetailModal;
