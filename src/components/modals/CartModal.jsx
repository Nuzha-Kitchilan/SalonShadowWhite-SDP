import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  CircularProgress,
  Snackbar,
  IconButton,
  Alert,
  Divider,
  Fade,
  Paper,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentModal from "./PaymentModal";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51RDJZvRoY9Bz5tbfvhKKD5yhGQIeJDZJD81prZzEpAcHhUJwAeqM4f1P6iQACa5b13VktbnT8mtkOgSeqhADVzuN00CW2jt9Cm");

const CartModal = ({ onBack, onClose, customerId, onAddMore }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removeLoading, setRemoveLoading] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [stylists, setStylists] = useState([]);
  const [paymentMode, setPaymentMode] = useState(false);
  const [transitionIn, setTransitionIn] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/cart/${customerId}`);
        const data = await response.json();
        setCartItems(data);
      } catch (err) {
        console.error("Error fetching cart items:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchStylists = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/stylists`);
        if (response.ok) {
          const data = await response.json();
          setStylists(data);
        }
      } catch (err) {
        console.error("Error fetching stylists:", err);
      }
    };

    fetchCartItems();
    fetchStylists();
  }, [customerId]);

  const handleRemoveItem = async (cartId) => {
    setRemoveLoading(cartId);
    try {
      const response = await fetch(`http://localhost:5001/api/cart/remove/${cartId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item.cart_id !== cartId));
        setSnackbar({ 
          open: true, 
          message: "Item removed from cart successfully", 
          severity: "success" 
        });
      } else {
        setSnackbar({ 
          open: true, 
          message: "Failed to remove item from cart", 
          severity: "error" 
        });
      }
    } catch (err) {
      console.error("Error removing item from cart:", err);
      setSnackbar({ 
        open: true, 
        message: "Error removing item from cart", 
        severity: "error" 
      });
    } finally {
      setRemoveLoading(null);
    }
  };

  const handleCheckout = () => {
    setTransitionIn(false);
    setTimeout(() => {
      setPaymentMode(true);
      setTransitionIn(true);
    }, 300);
  };

  const handleBackToCart = () => {
    setTransitionIn(false);
    setTimeout(() => {
      setPaymentMode(false);
      setTransitionIn(true);
    }, 300);
  };

  const handlePaymentSuccess = async () => {
    setSnackbar({ open: true, message: "Appointment booked successfully!", severity: "success" });
    setCartItems([]);
    onClose();
  };

  const handleAddMore = () => {
    onClose(); // Close the cart modal
    // The parent component should handle navigating back to service categories
  };

  const formatTimeForDisplay = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (err) {
      console.error("Error formatting time:", err);
      return timeString;
    }
  };

  const formatDateForDisplay = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateString;
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);

  return (
    <Box sx={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      overflow: "hidden",
      bgcolor: "#f9f5f0",
    }}>
      <Fade in={transitionIn} timeout={300}>
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
          {paymentMode ? (
            <Elements stripe={stripePromise}>
              <PaymentModal
                onClose={onClose}
                onBack={handleBackToCart}
                onPaymentSuccess={handlePaymentSuccess}
                totalAmount={totalPrice}
                customer_ID={customerId}
                appointmentDate={cartItems[0]?.selected_date}
                appointmentTime={cartItems[0]?.selected_time}
                cartItems={cartItems}
              />
            </Elements>
          ) : (
            <>
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
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ShoppingCartIcon sx={{ color: "#BEAF9B", mr: 1 }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 500,
                        color: "#453C33",
                        letterSpacing: "0.3px",
                        fontFamily: "'Poppins', 'Roboto', sans-serif"
                      }}
                    >
                      YOUR CART
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Message */}
              <Box 
                sx={{ 
                  p: 2, 
                  backgroundColor: "rgba(190, 175, 155, 0.1)",
                  borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
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
                  Review your selected services before checkout
                </Typography>
              </Box>

              {loading ? (
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  py: 4, 
                  flexGrow: 1 
                }}>
                  <CircularProgress sx={{ color: "#BEAF9B" }} />
                </Box>
              ) : (
                <Box sx={{ 
                  overflowY: "auto", 
                  flexGrow: 1,
                  p: 2,
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none"
                }}>
                  {cartItems.length === 0 ? (
                    <Paper
                      elevation={0}
                      sx={{
                        textAlign: "center", 
                        mt: 4, 
                        p: 4,
                        borderRadius: "12px",
                        bgcolor: "#fff",
                        border: "1px dashed rgba(190, 175, 155, 0.5)",
                      }}
                    >
                      <ShoppingCartIcon sx={{ fontSize: 50, color: "rgba(190, 175, 155, 0.5)", mb: 2 }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: "#453C33",
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          mb: 1
                        }}
                      >
                        Your cart is empty
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: "#666",
                          fontFamily: "'Poppins', 'Roboto', sans-serif"
                        }}
                      >
                        Add services to continue
                      </Typography>
                    </Paper>
                  ) : (
                    <List sx={{ p: 0 }}>
                      {cartItems.map((item, index) => (
                        <Paper
                          key={item.cart_id}
                          elevation={0}
                          sx={{
                            mb: 2,
                            borderRadius: "12px",
                            overflow: "hidden",
                            border: "1px solid rgba(190, 175, 155, 0.3)",
                          }}
                        >
                          <Box sx={{ 
                            p: 2, 
                            bgcolor: "rgba(190, 175, 155, 0.05)",
                            borderBottom: "1px dashed rgba(190, 175, 155, 0.3)"
                          }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  fontWeight: 600, 
                                  color: "#453C33",
                                  fontFamily: "'Poppins', 'Roboto', sans-serif"
                                }}
                              >
                                {item.service_name}
                              </Typography>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  fontWeight: "bold", 
                                  color: "#BEAF9B",
                                  fontFamily: "'Poppins', 'Roboto', sans-serif"
                                }}
                              >
                                Rs.{item.price}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ p: 2, bgcolor: "#fff" }}>
                            <Box sx={{ 
                              display: "flex", 
                              flexDirection: "column",
                              gap: 1.5
                            }}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <PersonIcon sx={{ color: "#BEAF9B", mr: 1, fontSize: 20 }} />
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: "#666",
                                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                                  }}
                                >
                                  Stylist: <span style={{ fontWeight: 500, color: "#453C33" }}>{item.stylist_name || "Any available"}</span>
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <AccessTimeIcon sx={{ color: "#BEAF9B", mr: 1, fontSize: 20 }} />
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: "#666",
                                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                                  }}
                                >
                                  Duration: <span style={{ fontWeight: 500, color: "#453C33" }}>{item.time_duration} minutes</span>
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <EventNoteIcon sx={{ color: "#BEAF9B", mr: 1, fontSize: 20 }} />
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: "#666",
                                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                                  }}
                                >
                                  Date & Time: <span style={{ fontWeight: 500, color: "#453C33" }}>
                                    {formatDateForDisplay(item.selected_date)} at {formatTimeForDisplay(item.selected_time)}
                                  </span>
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                              <Button
                                startIcon={removeLoading === item.cart_id ? <CircularProgress size={16} /> : <DeleteOutlineIcon />}
                                onClick={() => handleRemoveItem(item.cart_id)}
                                disabled={removeLoading === item.cart_id}
                                variant="outlined"
                                size="small"
                                sx={{
                                  borderColor: "rgba(190, 175, 155, 0.5)",
                                  color: "#BEAF9B",
                                  '&:hover': {
                                    borderColor: "#BEAF9B",
                                    backgroundColor: "rgba(190, 175, 155, 0.05)",
                                  }
                                }}
                              >
                                Remove
                              </Button>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                      
                      {/* Order Summary */}
                      <Paper
                        elevation={0}
                        sx={{
                          mt: 3,
                          p: 2,
                          borderRadius: "12px",
                          border: "1px solid rgba(190, 175, 155, 0.3)",
                          bgcolor: "white",
                        }}
                      >
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600, 
                            color: "#453C33",
                            mb: 2,
                            fontFamily: "'Poppins', 'Roboto', sans-serif"
                          }}
                        >
                          APPOINTMENT SUMMARY
                        </Typography>
                        
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              color: "#666",
                              fontFamily: "'Poppins', 'Roboto', sans-serif"
                            }}
                          >
                            Subtotal
                          </Typography>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              fontWeight: 500,
                              color: "#453C33",
                              fontFamily: "'Poppins', 'Roboto', sans-serif"
                            }}
                          >
                            Rs.{totalPrice}
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 1, borderStyle: "dashed", borderColor: "rgba(190, 175, 155, 0.3)" }} />
                        
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography 
                            variant="subtitle1"
                            sx={{ 
                              fontWeight: 600,
                              color: "#453C33",
                              fontFamily: "'Poppins', 'Roboto', sans-serif"
                            }}
                          >
                            Total
                          </Typography>
                          <Typography 
                            variant="subtitle1"
                            sx={{ 
                              fontWeight: 600,
                              color: "#BEAF9B",
                              fontFamily: "'Poppins', 'Roboto', sans-serif"
                            }}
                          >
                            Rs.{totalPrice}
                          </Typography>
                        </Box>
                      </Paper>
                    </List>
                  )}
                </Box>
              )}

              {/* Footer */}
              <Box
                sx={{
                  p: 2, 
                  bgcolor: "#fff",
                  borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  boxShadow: "0 -2px 8px rgba(0,0,0,0.03)"
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddMore}
                  sx={{
                    borderColor: "rgba(190, 175, 155, 0.5)",
                    color: "#BEAF9B",
                    px: 3,
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    textTransform: "none",
                    '&:hover': {
                      borderColor: "#BEAF9B",
                      backgroundColor: "rgba(190, 175, 155, 0.05)",
                    }
                  }}
                >
                  Add More
                </Button>
                
                <Button
                  variant="contained"
                  disabled={cartItems.length === 0}
                  sx={{
                    background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
                    color: '#fff',
                    px: 4,
                    borderRadius: "8px",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    textTransform: "none",
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
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ 
            width: '100%',
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontFamily: "'Poppins', 'Roboto', sans-serif"
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartModal;