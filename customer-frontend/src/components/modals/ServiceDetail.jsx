import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProfessionalSelectModal from "./StylistSelection";
import CartModal from "./CartModal"; 
const ServiceDetailModal = ({
  service,
  onBack,
  onClose,
  onAddToCart,
  cartItems = [] 
}) => {
  const [showStylistSelect, setShowStylistSelect] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false); 

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
    setShowCartModal(true);
  };

  
  const handleCloseCartModal = () => {
    setShowCartModal(false);
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  // If showing cart modal
  if (showCartModal) {
    return (
      <CartModal 
        cartItems={cartItems} 
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
      bgcolor: "#f9f5f0",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        p: 2,
        borderBottom: "1px solid #e0e0e0",
        background: "linear-gradient(to right, #f9f5f0, #ffffff)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
      }}>
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
            {service.service_name}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ 
        p: 3, 
        flexGrow: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 3
      }}>
        <Box sx={{ 
          bgcolor: "#fff", 
          borderRadius: "12px", 
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          p: 3,
          border: "1px solid #f0f0f0"
        }}>
          <Typography 
            variant="body1" 
            paragraph
            sx={{
              color: "#333",
              lineHeight: 1.6,
              fontSize: "1rem",
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            }}
          >
            {service.description || "No description available."}
          </Typography>
          
          {service.additional_note && (
            <Box 
              sx={{ 
                bgcolor: "#BEAF9B10", 
                p: 2, 
                borderRadius: "8px", 
                borderLeft: "3px solid #BEAF9B",
                mt: 2
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontStyle: 'italic',
                  color: "#666"
                }}
              >
                {service.additional_note}
              </Typography>
            </Box>
          )}

          <Box 
            sx={{ 
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              bgcolor: "#f9f9f9",
              borderRadius: "8px"
            }}
          >
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1 
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#666",
                  fontWeight: 500
                }}
              >
                Duration:
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#453C33",
                  fontWeight: 600
                }}
              >
                {service.time_duration} mins
              </Typography>
            </Box>
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1 
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#666",
                  fontWeight: 500
                }}
              >
                Price:
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#453C33",
                  fontWeight: 600
                }}
              >
                Rs.{service.price}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: 2, 
        bgcolor: "#fff",
        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        display: "flex",
        justifyContent: "center",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.03)"
      }}>
        <Button 
          variant="contained" 
          onClick={handleSelectProfessional}
          sx={{ 
            background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
            color: '#fff',
            py: 1.5,
            px: 4,
            borderRadius: "8px",
            width: "100%",
            maxWidth: "500px",
            fontWeight: 500,
            letterSpacing: "0.5px",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: "0 4px 8px rgba(190, 175, 155, 0.3)",
            transition: "all 0.3s ease",
            '&:hover': { 
              background: "linear-gradient(to right, #b0a08d, #cec2b3)",
              boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
              transform: "translateY(-2px)"
            }
          }}
        >
          Select a professional
        </Button>
      </Box>
    </Box>
  );
};

export default ServiceDetailModal;