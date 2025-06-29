import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  Radio,
  Avatar,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";

const StylistSelectModal = ({ service, onBack, onClose, onStylistSelected }) => {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const getCustomerId = () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAuthError("Please login to continue");
          return;
        }

        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          setAuthError("Session expired. Please login again");
          return;
        }

        if (!decoded.customer_ID) {
          setAuthError("Invalid token format");
          return;
        }

        setCustomerId(decoded.customer_ID);
      } catch (error) {
        console.error("Error decoding token:", error);
        setAuthError("Invalid session. Please login again");
      }
    };

    getCustomerId();
  }, []);

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/stylists");
        const data = await response.json();
        setStylists(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching stylists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStylists();
  }, []);

  const handleSelectStylist = (stylist) => {
    setSelectedStylist(selectedStylist?.stylist_ID === stylist.stylist_ID ? null : stylist);
  };

  const handleContinue = () => {
    onStylistSelected(selectedStylist);
  };

  return (
    <Box sx={{ 
      width: "100%", 
      height: "100vh",
      display: "flex", 
      flexDirection: "column",
      bgcolor: "#f9f5f0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Header */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        p: 2,
        borderBottom: "1px solid #e0e0e0",
        background: "linear-gradient(to right, #f9f5f0, #ffffff)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        flexShrink: 0,
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
            SELECT A PROFESSIONAL
          </Typography>
        </Box>
      </Box>

      {/* Message */}
      <Box 
        sx={{ 
          p: 2, 
          backgroundColor: "rgba(190, 175, 155, 0.1)",
          borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
          flexShrink: 0,
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: "#666", 
            fontStyle: "italic",
            textAlign: "center",
            fontFamily: "'Poppins', 'Roboto', sans-serif"
          }}
        >
          Please choose your preferred stylist for {service?.service_name || "this service"}
        </Typography>
      </Box>

      {/* Error display */}
      {authError && (
        <Box 
          sx={{ 
            p: 2, 
            backgroundColor: "rgba(255, 0, 0, 0.05)", 
            color: "#d32f2f", 
            textAlign: "center",
            borderRadius: "8px",
            m: 2,
            border: "1px solid rgba(255, 0, 0, 0.1)",
            flexShrink: 0,
          }}
        >
          <Typography variant="body2">{authError}</Typography>
        </Box>
      )}

      {/* Content */}
      <Box sx={{
        flexGrow: 1,
        overflowY: "auto",
        px: 2,
        pb: 8, 
      }}>
        {loading ? (
          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              height: "100%",
            }}
          >
            <CircularProgress sx={{ color: "#BEAF9B" }} />
          </Box>
        ) : (
          <List 
            sx={{
              bgcolor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              overflow: "hidden",
              mb: 2,
            }}
          >
            <ListItem 
              sx={{ 
                p: 2, 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                borderBottom: "1px dashed rgba(0,0,0,0.1)",
                bgcolor: "rgba(190, 175, 155, 0.05)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(190, 175, 155, 0.1)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Radio
                  checked={!selectedStylist}
                  onChange={() => setSelectedStylist(null)}
                  name="stylist-selection"
                  sx={{ 
                    color: "#BEAF9B",
                    '&.Mui-checked': {
                      color: "#BEAF9B",
                    }
                  }}
                />
                <Typography 
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    color: "#453C33",
                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                  }}
                >
                  Any Available Stylist
                </Typography>
              </Box>
            </ListItem>

            {stylists.map((stylist, index) => (
              <ListItem
                key={stylist.stylist_ID}
                sx={{ 
                  p: 2, 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  borderBottom: index < stylists.length - 1 ? "1px dashed rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(190, 175, 155, 0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Radio
                    checked={selectedStylist?.stylist_ID === stylist.stylist_ID}
                    onChange={() => handleSelectStylist(stylist)}
                    name="stylist-selection"
                    sx={{ 
                      color: "#BEAF9B",
                      '&.Mui-checked': {
                        color: "#BEAF9B",
                      }
                    }}
                  />
                  <Box sx={{ display: "flex", ml: 1 }}>
                    <Avatar 
                      src={stylist.profile_url} 
                      alt={stylist.firstname} 
                      sx={{ 
                        mr: 2,
                        width: 48,
                        height: 48,
                        border: selectedStylist?.stylist_ID === stylist.stylist_ID ? 
                          "2px solid #BEAF9B" : "2px solid transparent",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                      }} 
                    />
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography 
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: "#453C33",
                            fontFamily: "'Poppins', 'Roboto', sans-serif"
                          }}
                        >
                          {stylist.firstname} {stylist.lastname}
                        </Typography>
                        {stylist.first_available && (
                          <Box 
                            sx={{ 
                              display: "flex", 
                              alignItems: "center", 
                              ml: 1,
                              bgcolor: "rgba(255, 215, 0, 0.1)",
                              borderRadius: "4px",
                              px: 1,
                              py: 0.2
                            }}
                          >
                            <StarIcon sx={{ color: "#FFD700", fontSize: 16, mr: 0.5 }} />
                            <Typography 
                              variant="caption"
                              sx={{
                                color: "#665500",
                                fontWeight: 500
                              }}
                            >
                              First Available
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{
                          color: "#666",
                          fontFamily: "'Poppins', 'Roboto', sans-serif"
                        }}
                      >
                        {stylist.role}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Sticky Footer Button */}
      <Box
        sx={{
          p: 2, 
          bgcolor: "#fff",
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          boxShadow: "0 -2px 8px rgba(0,0,0,0.08)"
        }}
      >
        <Button
          variant="contained"
          disabled={!customerId || stylists.length === 0}
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
            },
            '&.Mui-disabled': {
              background: "#e0e0e0",
              color: "#a0a0a0"
            }
          }}
          onClick={handleContinue}
        >
          Confirm Selection
        </Button>
      </Box>
    </Box>
  );
};

export default StylistSelectModal;