import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Snackbar,
  IconButton,
  Alert,
  Divider,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
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
  const [isFirstTimeCustomer, setIsFirstTimeCustomer] = useState(false);
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

    const checkFirstTimeCustomer = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/appointment/check-first-time/${customerId}`);
        const data = await response.json();
        setIsFirstTimeCustomer(data.isFirstTime || false); // Updated to use correct property
      } catch (err) {
        console.error("Error checking previous appointments:", err);
      }
    };

    fetchCartItems();
    fetchStylists();
    checkFirstTimeCustomer();
  }, [customerId]);

  const handleRemoveItem = async (cartId) => {
    setRemoveLoading(cartId);
    try {
      const response = await fetch(`http://localhost:5001/api/cart/remove/${cartId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item.cart_id !== cartId));
      } else {
        console.error("Failed to remove item from cart");
      }
    } catch (err) {
      console.error("Error removing item from cart:", err);
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

  const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Fade in={transitionIn} timeout={300}>
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
          {paymentMode ? (
            <Elements stripe={stripePromise}>
              <PaymentModal
                onClose={onClose}
                onBack={handleBackToCart}
                onPaymentSuccess={handlePaymentSuccess}
                totalAmount={totalPrice}
                isFirstTimeCustomer={isFirstTimeCustomer}
                customer_ID={customerId}
                appointmentDate={cartItems[0]?.selected_date}
                appointmentTime={cartItems[0]?.selected_time}
                cartItems={cartItems} // Pass the cart items to PaymentModal
              />
            </Elements>
          ) : (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                <Typography variant="h6">Your Cart</Typography>
                <IconButton onClick={onClose} sx={{ color: "black" }}>
                  <CloseIcon />
                </IconButton>
              </Box>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
                  {cartItems.length === 0 ? (
                    <Typography variant="subtitle1" sx={{ textAlign: "center", mt: 4 }}>
                      Your cart is empty.
                    </Typography>
                  ) : (
                    <List>
                      {cartItems.map((item) => (
                        <React.Fragment key={item.cart_id}>
                          <ListItem
                            secondaryAction={
                              <IconButton
                                edge="end"
                                onClick={() => handleRemoveItem(item.cart_id)}
                                disabled={removeLoading === item.cart_id}
                              >
                                {removeLoading === item.cart_id ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <DeleteOutlineIcon />
                                )}
                              </IconButton>
                            }
                            alignItems="flex-start"
                          >
                            <ListItemText
                              primary={`${item.service_name} - $${item.price}`}
                              secondary={
                                <>
                                  <Typography variant="body2" component="div">
                                    Stylist: {item.stylist_name || "Any available"}
                                  </Typography>
                                  <Typography variant="body2" component="div">
                                    Duration: {item.time_duration} minutes
                                  </Typography>
                                  <Typography variant="body2" component="div">
                                    Date: {item.selected_date}
                                  </Typography>
                                  <Typography variant="body2" component="div">
                                    Time: {item.selected_time}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
                        <Typography variant="h6">Total: ${totalPrice}</Typography>
                      </Box>
                    </List>
                  )}
                </Box>
              )}

              <Box sx={{ p: 2, bgcolor: "#fff", display: "flex", justifyContent: "space-between", borderTop: "1px solid #eee" }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={onAddMore}
                  sx={{ bgcolor: "#2196f3" }}
                >
                  Add More
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  sx={{ bgcolor: "#2196f3" }}
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
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartModal;