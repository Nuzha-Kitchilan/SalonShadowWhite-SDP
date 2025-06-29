import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  Paper
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PaymentIcon from "@mui/icons-material/Payment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const PaymentModal = ({
  onClose,
  onBack,
  onPaymentSuccess,
  totalAmount,
  isFirstTimeCustomer,
  customer_ID: propCustomerID,
  appointmentDate,
  appointmentTime,
  cartItems = []
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardholderName, setCardholderName] = useState("");
  const [paymentOption, setPaymentOption] = useState("payNow");
  const [customerID, setCustomerID] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [amountToPay, setAmountToPay] = useState(parseFloat(totalAmount) || 0);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const formatTime = (time) => {
    if (!time) return "00:00";
    if (time.includes(':')) {
      const parts = time.split(':');
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    }
    return time;
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

  const formattedTime = formatTime(appointmentTime);

  useEffect(() => {
    const storedID = localStorage.getItem("customer_ID");
    const id = propCustomerID || storedID;
    if (!id) {
      setError("Customer ID is missing. Please try again.");
    }
    setCustomerID(id);
  }, [propCustomerID]);

  useEffect(() => {
    const numTotalAmount = parseFloat(totalAmount) || 0;
    if (isFirstTimeCustomer) {
      setAmountToPay(numTotalAmount * 0.5);
    } else {
      setAmountToPay(numTotalAmount);
    }
  }, [isFirstTimeCustomer, totalAmount]);

  useEffect(() => {
    const numTotalAmount = parseFloat(totalAmount) || 0;
    
    if (paymentOption === "payNow" && customerID && numTotalAmount > 0 && !bookingSuccess) {
      const createIntent = async () => {
        try {
          setLoading(true);
          const response = await axios.post(
            "http://localhost:5001/api/payment/create-payment-intent",
            {
              amount: numTotalAmount,
              customer_ID: customerID,
              isFirstTime: isFirstTimeCustomer,
              appointment_date: appointmentDate,
              appointment_time: formattedTime
            }
          );
          setClientSecret(response.data.clientSecret);
        } catch (err) {
          console.error("Error creating payment intent:", err);
          setError("Failed to initialize payment system. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      
      createIntent();
    }
  }, [paymentOption, customerID, totalAmount, isFirstTimeCustomer, appointmentDate, formattedTime, bookingSuccess]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!customerID) {
      setError("Customer ID is missing. Cannot proceed with payment.");
      return;
    }
  
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
  
    try {
      const formattedDate = appointmentDate;
      const servicesData = cartItems.map(item => ({
        service_id: item.service_id || item.id,
        price: item.price
      })).filter(service => service.service_id);
  
      const stylistIds = cartItems
        .map(item => item.stylist_id || item.stylist_ID)
        .filter(id => id !== undefined && id !== null);
      
      const numTotalAmount = parseFloat(totalAmount) || 0;
  
      if (paymentOption === "payNow") {
        if (!stripe || !elements || !clientSecret) {
          setError("Payment system not initialized properly. Please try again.");
          setLoading(false);
          return;
        }

        const cardElement = elements.getElement(CardElement);
        
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardholderName
            }
          }
        });

        if (stripeError) {
          setError(stripeError.message);
          setLoading(false);
          return;
        }

        if (paymentIntent.status === "succeeded") {
          const appointmentResponse = await axios.post(
            "http://localhost:5001/api/appointment/create", 
            {
              customer_id: customerID,
              selected_date: formattedDate,
              selected_time: formattedTime,
              services: servicesData,
              stylist_ids: stylistIds
            }
          );
          
          const appointment_ID = appointmentResponse.data.appointment_ID;
          const amountPaid = isFirstTimeCustomer ? numTotalAmount * 0.5 : numTotalAmount;
          
          await axios.post("http://localhost:5001/api/payment/record-payment", {
            appointment_ID,
            customer_ID: customerID,
            payment_amount: numTotalAmount,
            amount_paid: amountPaid,
            payment_status: isFirstTimeCustomer ? "Partially Paid" : "Paid",
            payment_type: "Online",
            is_first_time: isFirstTimeCustomer,
            stripe_payment_intent_id: paymentIntent.id
          });
          
          setSuccessMessage(
            isFirstTimeCustomer 
              ? "Payment successful! 10% deposit paid. Remaining balance due at salon." 
              : "Payment successful! Your appointment is confirmed."
          );
          setBookingSuccess(true);
          setTimeout(() => onPaymentSuccess(), 3000);
        }
      } else {
        const payload = {
          customer_ID: customerID,
          payment_amount: numTotalAmount,
          is_first_time: isFirstTimeCustomer,
          selected_date: formattedDate,
          selected_time: formattedTime,
          services: servicesData,
          stylist_ids: stylistIds
        };
        
        await axios.post("http://localhost:5001/api/payment/pay-at-salon", payload);
        
        setSuccessMessage(
          isFirstTimeCustomer
            ? "Appointment booked! Please pay the rest at salon."
            : "Appointment booked! Please pay at the salon."
        );
        setBookingSuccess(true);
        setTimeout(() => onPaymentSuccess(), 3000);
      }
    } catch (err) {
      console.error("Payment Error:", err);
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error ||
                      err.message || 
                      "Payment failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#453C33',
        fontFamily: "'Poppins', 'Roboto', sans-serif",
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#d32f2f',
      },
    },
    hidePostalCode: true,
  };

  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const handleCloseSuccess = () => {
    onPaymentSuccess();
    onClose();
  };

  if (bookingSuccess) {
    return (
      <Box sx={{ 
        width: "100%", 
        height: "100%", 
        display: "flex", 
        flexDirection: "column",
        bgcolor: "#f9f5f0",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        textAlign: "center"
      }}>
        <CheckCircleOutlineIcon 
          sx={{ 
            fontSize: 80, 
            color: "#4CAF50",
            mb: 3 
          }} 
        />
        
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600,
            color: "#453C33",
            mb: 2,
            fontFamily: "'Poppins', 'Roboto', sans-serif"
          }}
        >
          Thank You!
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 500,
            color: "#453C33",
            mb: 3,
            fontFamily: "'Poppins', 'Roboto', sans-serif"
          }}
        >
          {successMessage}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: "#666",
            mb: 4,
            fontFamily: "'Poppins', 'Roboto', sans-serif"
          }}
        >
          Your appointment was successfully created. See you soon!
        </Typography>
        
        <Button
          variant="contained"
          onClick={handleCloseSuccess}
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
            }
          }}
        >
          Close
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column",
      bgcolor: "#f9f5f0",
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
            onClick={onBack}
            sx={{
              color: "#BEAF9B",
              "&:hover": {
                backgroundColor: "rgba(190, 175, 155, 0.1)",
                transform: "scale(1.05)",
                transition: "all 0.2s",
              },
            }}
            disabled={loading}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PaymentIcon sx={{ color: "#BEAF9B", mr: 1 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 500,
                color: "#453C33",
                letterSpacing: "0.3px",
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              }}
            >
              PAYMENT
            </Typography>
          </Box>
        </Box>
        <IconButton 
          onClick={onClose} 
          sx={{
            color: "#BEAF9B",
            "&:hover": {
              backgroundColor: "rgba(190, 175, 155, 0.1)",
            },
          }} 
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>
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
          Complete your appointment booking
        </Typography>
      </Box>

      <Box sx={{ 
        p: 3, 
        overflowY: "auto", 
        flexGrow: 1,
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        msOverflowStyle: "none"
      }}>
        {successMessage ? (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            }}
          >
            {successMessage}
          </Alert>
        ) : (
          <>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: "12px",
                border: "1px solid rgba(190, 175, 155, 0.3)",
                bgcolor: "white",
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  fontWeight: 600,
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif"
                }}
              >
                PAYMENT SUMMARY
              </Typography>
              
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: "#666",
                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                  }}
                >
                  Total Amount
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#BEAF9B",
                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                  }}
                >
                  Rs.{formatAmount(totalAmount)}
                </Typography>
              </Box>

              {isFirstTimeCustomer && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 2,
                    borderRadius: "8px",
                    border: "1px dashed rgba(190, 175, 155, 0.5)",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    "& .MuiAlert-icon": {
                      color: "#BEAF9B"
                    }
                  }}
                >
                  As a first-time customer, a 10% deposit (Rs.{formatAmount(amountToPay)}) is required now.
                </Alert>
              )}
            </Paper>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                  fontFamily: "'Poppins', 'Roboto', sans-serif"
                }}
              >
                {error}
              </Alert>
            )}

            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: "12px",
                border: "1px solid rgba(190, 175, 155, 0.3)",
                bgcolor: "white",
              }}
            >
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormLabel 
                  component="legend"
                  sx={{ 
                    fontWeight: 500,
                    color: "#453C33",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    mb: 1
                  }}
                >
                  PAYMENT OPTIONS
                </FormLabel>
                <RadioGroup
                  value={paymentOption}
                  onChange={(e) => setPaymentOption(e.target.value)}
                  sx={{ 
                    "& .MuiFormControlLabel-label": {
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      fontSize: "15px"
                    }
                  }}
                >
                  <FormControlLabel
                    value="payNow"
                    control={<Radio sx={{ 
                      color: "#BEAF9B",
                      '&.Mui-checked': {
                        color: "#BEAF9B",
                      },
                    }} />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CreditCardIcon sx={{ mr: 1, fontSize: 20, color: "#BEAF9B" }} />
                        <Typography sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", color: "#453C33" }}>
                          Pay Now with Credit Card
                        </Typography>
                      </Box>
                    }
                    disabled={loading}
                  />
                  <FormControlLabel
                    value="payAtSalon"
                    control={<Radio sx={{ 
                      color: "#BEAF9B",
                      '&.Mui-checked': {
                        color: "#BEAF9B",
                      },
                    }} />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <StoreIcon sx={{ mr: 1, fontSize: 20, color: "#BEAF9B" }} />
                        <Typography sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", color: "#453C33" }}>
                          Pay at the Salon
                        </Typography>
                      </Box>
                    }
                    disabled={loading}
                  />
                </RadioGroup>
              </FormControl>
            </Paper>

            {paymentOption === "payNow" && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: "12px",
                  border: "1px solid rgba(190, 175, 155, 0.3)",
                  bgcolor: "white",
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 2,
                    fontWeight: 600,
                    color: "#453C33",
                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                  }}
                >
                  CARD DETAILS
                </Typography>
                
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Cardholder Name"
                    fullWidth
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    required
                    disabled={loading}
                    sx={{ 
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "&.Mui-focused fieldset": {
                          borderColor: "#BEAF9B",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#BEAF9B",
                      },
                      fontFamily: "'Poppins', 'Roboto', sans-serif"
                    }}
                  />

                  <Box sx={{ 
                    border: "1px solid rgba(190, 175, 155, 0.5)", 
                    p: 2, 
                    borderRadius: "8px", 
                    mb: 3,
                    bgcolor: "rgba(190, 175, 155, 0.02)"
                  }}>
                    <CardElement options={cardElementOptions} />
                  </Box>

                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      fontStyle: "italic",
                      color: "#666",
                      fontFamily: "'Poppins', 'Roboto', sans-serif"
                    }}
                  >
                    {isFirstTimeCustomer
                      ? `You'll be charged a 10% deposit of Rs.${formatAmount(amountToPay)} now. The remaining balance will be due at the salon.`
                      : `You'll be charged the full amount of Rs.${formatAmount(amountToPay)}.`}
                  </Typography>
                </form>
              </Paper>
            )}

            {paymentOption === "payAtSalon" && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: "12px",
                  border: "1px solid rgba(190, 175, 155, 0.3)",
                  bgcolor: "white",
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 1,
                    color: "#453C33",
                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                  }}
                >
                  {isFirstTimeCustomer
                    ? "As a first-time customer, you'll need to pay a 10% deposit when you arrive at the salon."
                    : "You can pay when you arrive at the salon. Please bring cash."}
                </Typography>
              </Paper>
            )}

            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: "12px",
                border: "1px solid rgba(190, 175, 155, 0.3)",
                bgcolor: "white",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EventNoteIcon sx={{ color: "#BEAF9B", mr: 1 }} />
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#453C33",
                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                  }}
                >
                  APPOINTMENT DETAILS
                </Typography>
              </Box>
              
              <Box sx={{ pl: 4 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1,
                    color: "#666",
                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                  }}
                >
                  Date: <span style={{ fontWeight: 500, color: "#453C33" }}>{formatDateForDisplay(appointmentDate)}</span>
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1,
                    color: "#666",
                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                  }}
                >
                  Time: <span style={{ fontWeight: 500, color: "#453C33" }}>{formatTimeForDisplay(appointmentTime)}</span>
                </Typography>
                
                {cartItems.length > 0 && (
                  <>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 1,
                        color: "#666",
                        fontFamily: "'Poppins', 'Roboto', sans-serif"
                      }}
                    >
                      Services: <span style={{ fontWeight: 500, color: "#453C33" }}>{cartItems.map(item => item.service_name).join(", ")}</span>
                    </Typography>
                    
                    {cartItems.some(item => item.stylist_name) && (
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: "#666",
                          fontFamily: "'Poppins', 'Roboto', sans-serif"
                        }}
                      >
                        Stylists: <span style={{ fontWeight: 500, color: "#453C33" }}>{cartItems.map(item => item.stylist_name).filter(Boolean).join(", ")}</span>
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            </Paper>
          </>
        )}
      </Box>

      {!successMessage && (
        <Box 
          sx={{
            p: 2, 
            bgcolor: "#fff",
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            display: "flex",
            justifyContent: "flex-end",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.03)"
          }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !customerID || (paymentOption === "payNow" && (!stripe || !clientSecret))}
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
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              paymentOption === "payNow" 
                ? `Pay Rs.${formatAmount(amountToPay)} Now` 
                : "Confirm Appointment"
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PaymentModal;