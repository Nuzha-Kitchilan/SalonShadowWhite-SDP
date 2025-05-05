import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  List,
  ListItem,
  Radio,
  Avatar,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import TimeSelectionModal from "./TimeSelection"; // Make sure this component exists

const StylistSelectModal = ({ service, onBack, onClose }) => {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [showTimeModal, setShowTimeModal] = useState(false);
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
    if (!customerId || !service) return;
    setShowTimeModal(true);
  };

  if (showTimeModal) {
    return (
      <TimeSelectionModal
        service={service}
        customerId={customerId}
        selectedStylist={selectedStylist}
        onBack={() => setShowTimeModal(false)}
        onClose={onClose}
      />
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={onBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">SELECT A PROFESSIONAL</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      {/* Error display */}
      {authError && (
        <Box sx={{ p: 2, backgroundColor: "#ffeeee", color: "red", textAlign: "center" }}>
          <Typography variant="body2">{authError}</Typography>
        </Box>
      )}

      {/* Content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4, flexGrow: 1 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
          <List>
            <ListItem sx={{ py: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Radio
                  checked={!selectedStylist}
                  onChange={() => setSelectedStylist(null)}
                  name="stylist-selection"
                  sx={{ color: "#1976d2" }}
                />
                <Typography variant="subtitle1">Any Available Stylist</Typography>
              </Box>
            </ListItem>

            {stylists.map((stylist) => (
              <ListItem
                key={stylist.stylist_ID}
                sx={{ py: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Radio
                    checked={selectedStylist?.stylist_ID === stylist.stylist_ID}
                    onChange={() => handleSelectStylist(stylist)}
                    name="stylist-selection"
                    sx={{ color: "#1976d2" }}
                  />
                  <Box sx={{ display: "flex", ml: 1 }}>
                    <Avatar src={stylist.profile_url} alt={stylist.firstname} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1">
                        {stylist.firstname} {stylist.lastname}
                        {stylist.first_available && <StarIcon sx={{ color: "#FFD700", ml: 1 }} />}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stylist.role}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  ${stylist.price}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          bgcolor: "#fff",
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          disabled={!customerId || stylists.length === 0}
          sx={{
            width: "100%",
            bgcolor: "#333",
            "&:hover": { bgcolor: "#444" },
            color: "white",
            py: 1.5,
            borderRadius: 1,
          }}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default StylistSelectModal;
