// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   CircularProgress,
//   IconButton,
//   Divider,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   FormLabel,
//   Alert
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import axios from "axios";

// const PaymentModal = ({
//   onClose,
//   onBack,
//   onPaymentSuccess,
//   totalAmount,
//   isFirstTimeCustomer,
//   customer_ID: propCustomerID,
//   appointmentDate,
//   appointmentTime,
//   cartItems = [] // Default empty array to prevent undefined errors
// }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [cardholderName, setCardholderName] = useState("");
//   const [paymentOption, setPaymentOption] = useState("payNow");
//   const [customerID, setCustomerID] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [clientSecret, setClientSecret] = useState("");

//   useEffect(() => {
//     const storedID = localStorage.getItem("customer_ID");
//     const id = propCustomerID || storedID;
//     if (!id) {
//       setError("Customer ID is missing. Please try again.");
//     }
//     setCustomerID(id);
//   }, [propCustomerID]);

//   // Create payment intent when component loads if payment option is payNow
//   useEffect(() => {
//     if (paymentOption === "payNow" && customerID && totalAmount > 0) {
//       const createIntent = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.post(
//             "http://localhost:5001/api/payment/create-payment-intent",
//             {
//               amount: totalAmount,
//               customer_ID: customerID,
//               isFirstTime: isFirstTimeCustomer,
//               appointment_date: appointmentDate,
//               appointment_time: appointmentTime
//             }
//           );
//           setClientSecret(response.data.clientSecret);
//         } catch (err) {
//           console.error("Error creating payment intent:", err);
//           setError("Failed to initialize payment system. Please try again.");
//         } finally {
//           setLoading(false);
//         }
//       };
      
//       createIntent();
//     }
//   }, [paymentOption, customerID, totalAmount, isFirstTimeCustomer, appointmentDate, appointmentTime]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
  
//     if (!customerID) {
//       setError("Customer ID is missing. Cannot proceed with payment.");
//       return;
//     }
  
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null);
  
//     try {
//       // Format the date to YYYY-MM-DD
//       const formattedDate = new Date(appointmentDate).toISOString().split('T')[0];
      
//       // Prepare services data
//       const servicesData = cartItems.map(item => ({
//         service_id: item.service_id || item.id,
//         price: item.price
//       })).filter(service => service.service_id);
  
//       // Prepare stylist IDs (filter out undefined/null)
//       const stylistIds = cartItems
//         .map(item => item.stylist_id || item.stylist_ID)
//         .filter(id => id !== undefined && id !== null);
  
//       const payload = {
//         customer_ID: customerID,
//         payment_amount: totalAmount,
//         is_first_time: isFirstTimeCustomer,
//         selected_date: formattedDate,
//         selected_time: appointmentTime,
//         services: servicesData,
//         stylist_ids: stylistIds
//       };
  
//       console.log('Submitting payload:', payload);
  
//       if (paymentOption === "payNow") {
//         if (!stripe || !elements || !clientSecret) {
//           setError("Payment system not initialized properly. Please try again.");
//           setLoading(false);
//           return;
//         }

//         const cardElement = elements.getElement(CardElement);
        
//         // Confirm card payment with Stripe
//         const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//           payment_method: {
//             card: cardElement,
//             billing_details: {
//               name: cardholderName
//             }
//           }
//         });

//         if (stripeError) {
//           setError(stripeError.message);
//           return;
//         }

//         if (paymentIntent.status === "succeeded") {
//           // Payment succeeded, now create appointment with the payment details
//           payload.stripe_payment_intent_id = paymentIntent.id;
//           payload.payment_status = "Paid";
//           payload.payment_type = "Online";
          
//           // Create appointment
//           const appointmentResponse = await axios.post(
//             "http://localhost:5001/api/appointment/create", 
//             {
//               customer_id: customerID,
//               selected_date: formattedDate,
//               selected_time: appointmentTime,
//               services: servicesData,
//               stylist_ids: stylistIds
//             }
//           );
          
//           const appointment_ID = appointmentResponse.data.appointment_ID;
          
//           // Record payment
//           await axios.post("http://localhost:5001/api/payment/record-payment", {
//             appointment_ID,
//             customer_ID: customerID,
//             payment_amount: totalAmount,
//             payment_status: "Paid",
//             payment_type: "Online",
//             is_first_time: isFirstTimeCustomer,
//             stripe_payment_intent_id: paymentIntent.id
//           });
          
//           setSuccessMessage("Payment successful! Your appointment is confirmed.");
//           setTimeout(() => onPaymentSuccess(), 2000);
//         }
//       } else {
//         // Pay at Salon - keep existing functionality
//         const response = await axios.post(
//           "http://localhost:5001/api/payment/pay-at-salon",
//           payload
//         );
//         setSuccessMessage("Appointment booked! Please pay at the salon.");
//         setTimeout(() => onPaymentSuccess(), 2000);
//       }
//     } catch (err) {
//       console.error("Payment Error:", err);
//       const errorMsg = err.response?.data?.message || 
//                       err.message || 
//                       "Payment failed. Please try again.";
//       setError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Card element options
//   const cardElementOptions = {
//     style: {
//       base: {
//         fontSize: '16px',
//         color: '#424770',
//         '::placeholder': {
//           color: '#aab7c4',
//         },
//       },
//       invalid: {
//         color: '#9e2146',
//       },
//     },
//     hidePostalCode: true,
//   };

//   return (
//     <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
//       {/* Header */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <IconButton onClick={onBack} sx={{ mr: 1 }} disabled={loading}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="h6">Payment for Appointment</Typography>
//         </Box>
//         <IconButton onClick={onClose} sx={{ color: "black" }} disabled={loading}>
//           <CloseIcon />
//         </IconButton>
//       </Box>

//       <Divider />

//       <Box sx={{ p: 3, overflowY: "auto", flexGrow: 1 }}>
//         <Typography variant="h6" sx={{ mb: 3 }}>
//           Total: ${totalAmount}
//         </Typography>

//         {successMessage && (
//           <Alert severity="success" sx={{ mb: 3 }}>
//             {successMessage}
//           </Alert>
//         )}

//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {error}
//           </Alert>
//         )}

//         {!isFirstTimeCustomer && (
//           <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
//             <FormLabel component="legend">Payment Options</FormLabel>
//             <RadioGroup
//               value={paymentOption}
//               onChange={(e) => setPaymentOption(e.target.value)}
//               row
//             >
//               <FormControlLabel
//                 value="payNow"
//                 control={<Radio />}
//                 label="Pay Now with Credit Card"
//                 disabled={loading}
//               />
//               <FormControlLabel
//                 value="payAtSalon"
//                 control={<Radio />}
//                 label="Pay at the Salon"
//                 disabled={loading}
//               />
//             </RadioGroup>
//           </FormControl>
//         )}

//         {paymentOption === "payNow" && (
//           <form onSubmit={handleSubmit}>
//             <TextField
//               label="Cardholder Name"
//               fullWidth
//               value={cardholderName}
//               onChange={(e) => setCardholderName(e.target.value)}
//               required
//               disabled={loading}
//               sx={{ mb: 3 }}
//             />

//             <Box sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1, mb: 3 }}>
//               <CardElement options={cardElementOptions} />
//             </Box>
//           </form>
//         )}

//         {paymentOption === "payAtSalon" && (
//           <Typography variant="body1" sx={{ mb: 3 }}>
//             You can pay when you arrive at the salon. Please bring cash or card.
//           </Typography>
//         )}

//         <Box sx={{ mt: 3 }}>
//           <Typography variant="subtitle2" sx={{ mb: 1 }}>Appointment Details:</Typography>
//           <Typography variant="body2">Date: {appointmentDate}</Typography>
//           <Typography variant="body2">Time: {appointmentTime}</Typography>
//           {cartItems.length > 0 && (
//             <>
//               <Typography variant="body2" sx={{ mt: 1 }}>
//                 Services: {cartItems.map(item => item.service_name).join(", ")}
//               </Typography>
//               {cartItems.some(item => item.stylist_name) && (
//                 <Typography variant="body2">
//                   Stylists: {cartItems.map(item => item.stylist_name).filter(Boolean).join(", ")}
//                 </Typography>
//               )}
//             </>
//           )}
//         </Box>
//       </Box>

//       <Box sx={{ p: 2, borderTop: "1px solid #eee", bgcolor: "#f5f5f5" }}>
//         <Button
//           variant="outlined"
//           onClick={onBack}
//           disabled={loading}
//           sx={{ minWidth: 120 }}
//         >
//           Back
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading || !customerID || !stripe || (paymentOption === "payNow" && !clientSecret) || successMessage}
//           sx={{ minWidth: 120, bgcolor: "#2196f3", ml: 2 }}
//         >
//           {loading ? <CircularProgress size={24} /> : paymentOption === "payNow" ? "Pay Now" : "Confirm"}
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default PaymentModal;






//the last working code is the below one 



// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   CircularProgress,
//   IconButton,
//   Divider,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   FormLabel,
//   Alert
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import axios from "axios";

// const PaymentModal = ({
//   onClose,
//   onBack,
//   onPaymentSuccess,
//   totalAmount,
//   isFirstTimeCustomer,
//   customer_ID: propCustomerID,
//   appointmentDate,
//   appointmentTime,
//   cartItems = [] // Default empty array to prevent undefined errors
// }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [cardholderName, setCardholderName] = useState("");
//   const [paymentOption, setPaymentOption] = useState("payNow");
//   const [customerID, setCustomerID] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [clientSecret, setClientSecret] = useState("");

//   useEffect(() => {
//     const storedID = localStorage.getItem("customer_ID");
//     const id = propCustomerID || storedID;
//     if (!id) {
//       setError("Customer ID is missing. Please try again.");
//     }
//     setCustomerID(id);
//   }, [propCustomerID]);

//   // Create payment intent when component loads if payment option is payNow
//   useEffect(() => {
//     if (paymentOption === "payNow" && customerID && totalAmount > 0) {
//       const createIntent = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.post(
//             "http://localhost:5001/api/payment/create-payment-intent",
//             {
//               amount: totalAmount,
//               customer_ID: customerID,
//               isFirstTime: isFirstTimeCustomer,
//               appointment_date: appointmentDate,
//               appointment_time: appointmentTime
//             }
//           );
//           setClientSecret(response.data.clientSecret);
//         } catch (err) {
//           console.error("Error creating payment intent:", err);
//           setError("Failed to initialize payment system. Please try again.");
//         } finally {
//           setLoading(false);
//         }
//       };
      
//       createIntent();
//     }
//   }, [paymentOption, customerID, totalAmount, isFirstTimeCustomer, appointmentDate, appointmentTime]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
  
//     if (!customerID) {
//       setError("Customer ID is missing. Cannot proceed with payment.");
//       return;
//     }
  
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null);
  
//     try {
//       // Format the date to YYYY-MM-DD
//       const formattedDate = new Date(appointmentDate).toISOString().split('T')[0];
      
//       // Prepare services data
//       const servicesData = cartItems.map(item => ({
//         service_id: item.service_id || item.id,
//         price: item.price
//       })).filter(service => service.service_id);
  
//       // Prepare stylist IDs (filter out undefined/null)
//       const stylistIds = cartItems
//         .map(item => item.stylist_id || item.stylist_ID)
//         .filter(id => id !== undefined && id !== null);
  
//       const payload = {
//         customer_ID: customerID,
//         payment_amount: totalAmount,
//         is_first_time: isFirstTimeCustomer,
//         selected_date: formattedDate,
//         selected_time: appointmentTime,
//         services: servicesData,
//         stylist_ids: stylistIds
//       };
  
//       console.log('Submitting payload:', payload);
  
//       if (paymentOption === "payNow") {
//         if (!stripe || !elements || !clientSecret) {
//           setError("Payment system not initialized properly. Please try again.");
//           setLoading(false);
//           return;
//         }

//         const cardElement = elements.getElement(CardElement);
        
//         // Confirm card payment with Stripe
//         const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//           payment_method: {
//             card: cardElement,
//             billing_details: {
//               name: cardholderName
//             }
//           }
//         });

//         if (stripeError) {
//           setError(stripeError.message);
//           setLoading(false);
//           return;
//         }

//         if (paymentIntent.status === "succeeded") {
//           // Payment succeeded, now create appointment with the payment details
//           payload.stripe_payment_intent_id = paymentIntent.id;
//           payload.payment_status = "Paid";
//           payload.payment_type = "Online";
          
//           // Create appointment
//           const appointmentResponse = await axios.post(
//             "http://localhost:5001/api/appointment/create", 
//             {
//               customer_id: customerID,
//               selected_date: formattedDate,
//               selected_time: appointmentTime,
//               services: servicesData,
//               stylist_ids: stylistIds
//             }
//           );
          
//           const appointment_ID = appointmentResponse.data.appointment_ID;
          
//           // Record payment with amount_paid equal to payment_amount for online payments
//           await axios.post("http://localhost:5001/api/payment/record-payment", {
//             appointment_ID,
//             customer_ID: customerID,
//             payment_amount: totalAmount,
//             amount_paid: totalAmount, // Full amount is paid for online payment
//             payment_status: "Paid",
//             payment_type: "Online",
//             is_first_time: isFirstTimeCustomer,
//             stripe_payment_intent_id: paymentIntent.id
//           });
          
//           setSuccessMessage("Payment successful! Your appointment is confirmed.");
//           setTimeout(() => onPaymentSuccess(), 2000);
//         }
//       } else {
//         // Pay at Salon - keep existing functionality
//         const response = await axios.post(
//           "http://localhost:5001/api/payment/pay-at-salon",
//           payload
//         );
//         setSuccessMessage("Appointment booked! Please pay at the salon.");
//         setTimeout(() => onPaymentSuccess(), 2000);
//       }
//     } catch (err) {
//       console.error("Payment Error:", err);
//       const errorMsg = err.response?.data?.message || 
//                       err.message || 
//                       "Payment failed. Please try again.";
//       setError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Card element options
//   const cardElementOptions = {
//     style: {
//       base: {
//         fontSize: '16px',
//         color: '#424770',
//         '::placeholder': {
//           color: '#aab7c4',
//         },
//       },
//       invalid: {
//         color: '#9e2146',
//       },
//     },
//     hidePostalCode: true,
//   };

//   return (
//     <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
//       {/* Header */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <IconButton onClick={onBack} sx={{ mr: 1 }} disabled={loading}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="h6">Payment for Appointment</Typography>
//         </Box>
//         <IconButton onClick={onClose} sx={{ color: "black" }} disabled={loading}>
//           <CloseIcon />
//         </IconButton>
//       </Box>

//       <Divider />

//       <Box sx={{ p: 3, overflowY: "auto", flexGrow: 1 }}>
//         <Typography variant="h6" sx={{ mb: 3 }}>
//           Total: ${totalAmount}
//         </Typography>

//         {successMessage && (
//           <Alert severity="success" sx={{ mb: 3 }}>
//             {successMessage}
//           </Alert>
//         )}

//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {error}
//           </Alert>
//         )}

//         {!isFirstTimeCustomer && (
//           <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
//             <FormLabel component="legend">Payment Options</FormLabel>
//             <RadioGroup
//               value={paymentOption}
//               onChange={(e) => setPaymentOption(e.target.value)}
//               row
//             >
//               <FormControlLabel
//                 value="payNow"
//                 control={<Radio />}
//                 label="Pay Now with Credit Card"
//                 disabled={loading}
//               />
//               <FormControlLabel
//                 value="payAtSalon"
//                 control={<Radio />}
//                 label="Pay at the Salon"
//                 disabled={loading}
//               />
//             </RadioGroup>
//           </FormControl>
//         )}

//         {paymentOption === "payNow" && (
//           <form onSubmit={handleSubmit}>
//             <TextField
//               label="Cardholder Name"
//               fullWidth
//               value={cardholderName}
//               onChange={(e) => setCardholderName(e.target.value)}
//               required
//               disabled={loading}
//               sx={{ mb: 3 }}
//             />

//             <Box sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1, mb: 3 }}>
//               <CardElement options={cardElementOptions} />
//             </Box>
//           </form>
//         )}

//         {paymentOption === "payAtSalon" && (
//           <Typography variant="body1" sx={{ mb: 3 }}>
//             You can pay when you arrive at the salon. Please bring cash or card.
//           </Typography>
//         )}

//         <Box sx={{ mt: 3 }}>
//           <Typography variant="subtitle2" sx={{ mb: 1 }}>Appointment Details:</Typography>
//           <Typography variant="body2">Date: {appointmentDate}</Typography>
//           <Typography variant="body2">Time: {appointmentTime}</Typography>
//           {cartItems.length > 0 && (
//             <>
//               <Typography variant="body2" sx={{ mt: 1 }}>
//                 Services: {cartItems.map(item => item.service_name).join(", ")}
//               </Typography>
//               {cartItems.some(item => item.stylist_name) && (
//                 <Typography variant="body2">
//                   Stylists: {cartItems.map(item => item.stylist_name).filter(Boolean).join(", ")}
//                 </Typography>
//               )}
//             </>
//           )}
//         </Box>
//       </Box>

//       <Box sx={{ p: 2, borderTop: "1px solid #eee", bgcolor: "#f5f5f5" }}>
//         <Button
//           variant="outlined"
//           onClick={onBack}
//           disabled={loading}
//           sx={{ minWidth: 120 }}
//         >
//           Back
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading || !customerID || !stripe || (paymentOption === "payNow" && !clientSecret) || successMessage}
//           sx={{ minWidth: 120, bgcolor: "#2196f3", ml: 2 }}
//         >
//           {loading ? <CircularProgress size={24} /> : paymentOption === "payNow" ? "Pay Now" : "Confirm"}
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default PaymentModal;









// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   CircularProgress,
//   IconButton,
//   Divider,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   FormLabel,
//   Alert
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import axios from "axios";

// const PaymentModal = ({
//   onClose,
//   onBack,
//   onPaymentSuccess,
//   totalAmount,
//   isFirstTimeCustomer,
//   customer_ID: propCustomerID,
//   appointmentDate,
//   appointmentTime,
//   cartItems = []
// }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [cardholderName, setCardholderName] = useState("");
//   const [paymentOption, setPaymentOption] = useState("payNow");
//   const [customerID, setCustomerID] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [clientSecret, setClientSecret] = useState("");
//   // Ensure amountToPay is initialized as a number
//   const [amountToPay, setAmountToPay] = useState(parseFloat(totalAmount) || 0);

//   useEffect(() => {
//     const storedID = localStorage.getItem("customer_ID");
//     const id = propCustomerID || storedID;
//     if (!id) {
//       setError("Customer ID is missing. Please try again.");
//     }
//     setCustomerID(id);
//   }, [propCustomerID]);

//   // Calculate amount to pay based on first-time status
//   useEffect(() => {
//     // Ensure totalAmount is treated as a number
//     const numTotalAmount = parseFloat(totalAmount) || 0;
//     if (isFirstTimeCustomer) {
//       setAmountToPay(numTotalAmount * 0.5); // 50% for first-time customers
//     } else {
//       setAmountToPay(numTotalAmount);
//     }
//   }, [isFirstTimeCustomer, totalAmount]);

//   // Create payment intent when component loads if payment option is payNow
//   useEffect(() => {
//     // Ensure totalAmount is a number
//     const numTotalAmount = parseFloat(totalAmount) || 0;
    
//     if (paymentOption === "payNow" && customerID && numTotalAmount > 0) {
//       const createIntent = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.post(
//             "http://localhost:5001/api/payment/create-payment-intent",
//             {
//               amount: numTotalAmount,
//               customer_ID: customerID,
//               isFirstTime: isFirstTimeCustomer,
//               appointment_date: appointmentDate,
//               appointment_time: appointmentTime
//             }
//           );
//           setClientSecret(response.data.clientSecret);
//         } catch (err) {
//           console.error("Error creating payment intent:", err);
//           setError("Failed to initialize payment system. Please try again.");
//         } finally {
//           setLoading(false);
//         }
//       };
      
//       createIntent();
//     }
//   }, [paymentOption, customerID, totalAmount, isFirstTimeCustomer, appointmentDate, appointmentTime]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
  
//     if (!customerID) {
//       setError("Customer ID is missing. Cannot proceed with payment.");
//       return;
//     }
  
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null);
  
//     try {
//       // Format the date to YYYY-MM-DD
//       const formattedDate = new Date(appointmentDate).toISOString().split('T')[0];
      
//       // Prepare services data
//       const servicesData = cartItems.map(item => ({
//         service_id: item.service_id || item.id,
//         price: item.price
//       })).filter(service => service.service_id);
  
//       // Prepare stylist IDs (filter out undefined/null)
//       const stylistIds = cartItems
//         .map(item => item.stylist_id || item.stylist_ID)
//         .filter(id => id !== undefined && id !== null);
      
//       // Ensure totalAmount is a number
//       const numTotalAmount = parseFloat(totalAmount) || 0;
  
//       console.log('Processing payment with data:', {
//         customer_ID: customerID,
//         payment_amount: numTotalAmount,
//         is_first_time: isFirstTimeCustomer,
//         appointment_date: formattedDate,
//         appointment_time: appointmentTime
//       });
      
//       if (paymentOption === "payNow") {
//         if (!stripe || !elements || !clientSecret) {
//           setError("Payment system not initialized properly. Please try again.");
//           setLoading(false);
//           return;
//         }

//         const cardElement = elements.getElement(CardElement);
        
//         // Confirm card payment with Stripe
//         const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//           payment_method: {
//             card: cardElement,
//             billing_details: {
//               name: cardholderName
//             }
//           }
//         });

//         if (stripeError) {
//           setError(stripeError.message);
//           setLoading(false);
//           return;
//         }

//         if (paymentIntent.status === "succeeded") {
//           console.log('Stripe payment succeeded:', paymentIntent.id);
          
//           // Create appointment
//           const appointmentResponse = await axios.post(
//             "http://localhost:5001/api/appointment/create", 
//             {
//               customer_id: customerID,
//               selected_date: formattedDate,
//               selected_time: appointmentTime,
//               services: servicesData,
//               stylist_ids: stylistIds
//             }
//           );
          
//           console.log('Appointment created:', appointmentResponse.data);
//           const appointment_ID = appointmentResponse.data.appointment_ID;
          
//           // Calculate amount paid (for first-time customers)
//           const amountPaid = isFirstTimeCustomer ? numTotalAmount * 0.5 : numTotalAmount;
          
//           // Record payment with amount_paid equal to 50% for first-time customers
//           const paymentResponse = await axios.post("http://localhost:5001/api/payment/record-payment", {
//             appointment_ID,
//             customer_ID: customerID,
//             payment_amount: numTotalAmount,
//             amount_paid: amountPaid,
//             payment_status: isFirstTimeCustomer ? "Partially Paid" : "Paid",
//             payment_type: "Online",
//             is_first_time: isFirstTimeCustomer,
//             stripe_payment_intent_id: paymentIntent.id
//           });
          
//           console.log('Payment recorded:', paymentResponse.data);
          
//           setSuccessMessage(
//             isFirstTimeCustomer 
//               ? "Payment successful! 50% deposit paid. Remaining balance due at salon." 
//               : "Payment successful! Your appointment is confirmed."
//           );
//           setTimeout(() => onPaymentSuccess(), 2000);
//         }
//       } else {
//         // Pay at Salon - handle first-time customers differently
//         const payload = {
//           customer_ID: customerID,
//           payment_amount: numTotalAmount,
//           is_first_time: isFirstTimeCustomer,
//           selected_date: formattedDate,
//           selected_time: appointmentTime,
//           services: servicesData,
//           stylist_ids: stylistIds
//         };
        
//         console.log('Pay at Salon payload:', payload);
        
//         const response = await axios.post(
//           "http://localhost:5001/api/payment/pay-at-salon",
//           payload
//         );
        
//         console.log('Pay at Salon response:', response.data);
        
//         setSuccessMessage(
//           isFirstTimeCustomer
//             ? "Appointment booked! 50% deposit required at salon."
//             : "Appointment booked! Please pay at the salon."
//         );
//         setTimeout(() => onPaymentSuccess(), 2000);
//       }
//     } catch (err) {
//       console.error("Payment Error:", err);
//       // More detailed error logging
//       if (err.response) {
//         console.error('Error response data:', err.response.data);
//         console.error('Error response status:', err.response.status);
//       }
      
//       const errorMsg = err.response?.data?.message || 
//                       err.response?.data?.error ||
//                       err.message || 
//                       "Payment failed. Please try again.";
//       setError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Card element options
//   const cardElementOptions = {
//     style: {
//       base: {
//         fontSize: '16px',
//         color: '#424770',
//         '::placeholder': {
//           color: '#aab7c4',
//         },
//       },
//       invalid: {
//         color: '#9e2146',
//       },
//     },
//     hidePostalCode: true,
//   };

//   // Safely format the amount to 2 decimal places
//   const formatAmount = (amount) => {
//     const num = parseFloat(amount);
//     return isNaN(num) ? "0.00" : num.toFixed(2);
//   };

//   return (
//     <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
//       {/* Header */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <IconButton onClick={onBack} sx={{ mr: 1 }} disabled={loading}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="h6">Payment for Appointment</Typography>
//         </Box>
//         <IconButton onClick={onClose} sx={{ color: "black" }} disabled={loading}>
//           <CloseIcon />
//         </IconButton>
//       </Box>

//       <Divider />

//       <Box sx={{ p: 3, overflowY: "auto", flexGrow: 1 }}>
//         <Typography variant="h6" sx={{ mb: 3 }}>
//           Total: ${formatAmount(totalAmount)}
//         </Typography>

//         {isFirstTimeCustomer && (
//           <Alert severity="info" sx={{ mb: 3 }}>
//             As a first-time customer, a 50% deposit (${formatAmount(amountToPay)}) is required now.
//           </Alert>
//         )}

//         {successMessage && (
//           <Alert severity="success" sx={{ mb: 3 }}>
//             {successMessage}
//           </Alert>
//         )}

//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {error}
//           </Alert>
//         )}

//         <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
//           <FormLabel component="legend">Payment Options</FormLabel>
//           <RadioGroup
//             value={paymentOption}
//             onChange={(e) => setPaymentOption(e.target.value)}
//             row
//           >
//             <FormControlLabel
//               value="payNow"
//               control={<Radio />}
//               label="Pay Now with Credit Card"
//               disabled={loading}
//             />
//             <FormControlLabel
//               value="payAtSalon"
//               control={<Radio />}
//               label="Pay at the Salon"
//               disabled={loading}
//             />
//           </RadioGroup>
//         </FormControl>

//         {paymentOption === "payNow" && (
//           <form onSubmit={handleSubmit}>
//             <TextField
//               label="Cardholder Name"
//               fullWidth
//               value={cardholderName}
//               onChange={(e) => setCardholderName(e.target.value)}
//               required
//               disabled={loading}
//               sx={{ mb: 3 }}
//             />

//             <Box sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1, mb: 3 }}>
//               <CardElement options={cardElementOptions} />
//             </Box>

//             <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//               {isFirstTimeCustomer
//                 ? `You'll be charged a 50% deposit of $${formatAmount(amountToPay)} now. The remaining balance will be due at the salon.`
//                 : `You'll be charged the full amount of $${formatAmount(amountToPay)}.`}
//             </Typography>
//           </form>
//         )}

//         {paymentOption === "payAtSalon" && (
//           <Typography variant="body1" sx={{ mb: 3 }}>
//             {isFirstTimeCustomer
//               ? "As a first-time customer, you'll need to pay a 50% deposit when you arrive at the salon."
//               : "You can pay when you arrive at the salon. Please bring cash or card."}
//           </Typography>
//         )}

//         <Box sx={{ mt: 3 }}>
//           <Typography variant="subtitle2" sx={{ mb: 1 }}>Appointment Details:</Typography>
//           <Typography variant="body2">Date: {appointmentDate}</Typography>
//           <Typography variant="body2">Time: {appointmentTime}</Typography>
//           {cartItems.length > 0 && (
//             <>
//               <Typography variant="body2" sx={{ mt: 1 }}>
//                 Services: {cartItems.map(item => item.service_name).join(", ")}
//               </Typography>
//               {cartItems.some(item => item.stylist_name) && (
//                 <Typography variant="body2">
//                   Stylists: {cartItems.map(item => item.stylist_name).filter(Boolean).join(", ")}
//                 </Typography>
//               )}
//             </>
//           )}
//         </Box>
//       </Box>

//       <Box sx={{ p: 2, borderTop: "1px solid #eee", bgcolor: "#f5f5f5" }}>
//         <Button
//           variant="outlined"
//           onClick={onBack}
//           disabled={loading}
//           sx={{ minWidth: 120 }}
//         >
//           Back
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading || !customerID || (paymentOption === "payNow" && (!stripe || !clientSecret)) || successMessage}
//           sx={{ minWidth: 120, bgcolor: "#2196f3", ml: 2 }}
//         >
//           {loading ? <CircularProgress size={24} /> : paymentOption === "payNow" ? `Pay $${formatAmount(amountToPay)} Now` : "Confirm"}
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default PaymentModal;


















import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
  // Ensure amountToPay is initialized as a number
  const [amountToPay, setAmountToPay] = useState(parseFloat(totalAmount) || 0);


  // Format time to HH:MM if it includes seconds
  const formatTime = (time) => {
    if (!time) return "00:00";
    if (time.includes(':')) {
      const parts = time.split(':');
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    }
    return time;
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

  // Calculate amount to pay based on first-time status
  useEffect(() => {
    // Ensure totalAmount is treated as a number
    const numTotalAmount = parseFloat(totalAmount) || 0;
    if (isFirstTimeCustomer) {
      setAmountToPay(numTotalAmount * 0.5); // 50% for first-time customers
    } else {
      setAmountToPay(numTotalAmount);
    }
  }, [isFirstTimeCustomer, totalAmount]);

  // Create payment intent when component loads if payment option is payNow
  useEffect(() => {
    // Ensure totalAmount is a number
    const numTotalAmount = parseFloat(totalAmount) || 0;
    
    if (paymentOption === "payNow" && customerID && numTotalAmount > 0) {
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
  }, [paymentOption, customerID, totalAmount, isFirstTimeCustomer, appointmentDate, formattedTime]);

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
      // FIXED: Use the exact date string without creating a Date object
      // This prevents timezone issues that could shift the date
      const formattedDate = appointmentDate;
      
      // Prepare services data
      const servicesData = cartItems.map(item => ({
        service_id: item.service_id || item.id,
        price: item.price
      })).filter(service => service.service_id);
  
      // Prepare stylist IDs (filter out undefined/null)
      const stylistIds = cartItems
        .map(item => item.stylist_id || item.stylist_ID)
        .filter(id => id !== undefined && id !== null);
      
      // Ensure totalAmount is a number
      const numTotalAmount = parseFloat(totalAmount) || 0;
  
      console.log('Processing payment with data:', {
        customer_ID: customerID,
        payment_amount: numTotalAmount,
        is_first_time: isFirstTimeCustomer,
        appointment_date: formattedDate,
        appointment_time: appointmentTime
      });
      
      if (paymentOption === "payNow") {
        if (!stripe || !elements || !clientSecret) {
          setError("Payment system not initialized properly. Please try again.");
          setLoading(false);
          return;
        }

        const cardElement = elements.getElement(CardElement);
        
        // Confirm card payment with Stripe
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
          console.log('Stripe payment succeeded:', paymentIntent.id);
          
          // Create appointment
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
          
          console.log('Appointment created:', appointmentResponse.data);
          const appointment_ID = appointmentResponse.data.appointment_ID;
          
          // Calculate amount paid (for first-time customers)
          const amountPaid = isFirstTimeCustomer ? numTotalAmount * 0.5 : numTotalAmount;
          
          // Record payment with amount_paid equal to 50% for first-time customers
          const paymentResponse = await axios.post("http://localhost:5001/api/payment/record-payment", {
            appointment_ID,
            customer_ID: customerID,
            payment_amount: numTotalAmount,
            amount_paid: amountPaid,
            payment_status: isFirstTimeCustomer ? "Partially Paid" : "Paid",
            payment_type: "Online",
            is_first_time: isFirstTimeCustomer,
            stripe_payment_intent_id: paymentIntent.id
          });
          
          console.log('Payment recorded:', paymentResponse.data);
          
          setSuccessMessage(
            isFirstTimeCustomer 
              ? "Payment successful! 50% deposit paid. Remaining balance due at salon." 
              : "Payment successful! Your appointment is confirmed."
          );
          setTimeout(() => onPaymentSuccess(), 2000);
        }
      } else {
        // Pay at Salon - handle first-time customers differently
        const payload = {
          customer_ID: customerID,
          payment_amount: numTotalAmount,
          is_first_time: isFirstTimeCustomer,
          selected_date: formattedDate,
          selected_time: formattedTime,
          services: servicesData,
          stylist_ids: stylistIds
        };
        
        console.log('Pay at Salon payload:', payload);
        
        const response = await axios.post(
          "http://localhost:5001/api/payment/pay-at-salon",
          payload
        );
        
        console.log('Pay at Salon response:', response.data);
        
        setSuccessMessage(
          isFirstTimeCustomer
            ? "Appointment booked! 50% deposit required at salon."
            : "Appointment booked! Please pay at the salon."
        );
        setTimeout(() => onPaymentSuccess(), 2000);
      }
    } catch (err) {
      console.error("Payment Error:", err);
      // More detailed error logging
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
      }
      
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error ||
                      err.message || 
                      "Payment failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Card element options
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  // Safely format the amount to 2 decimal places
  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={onBack} sx={{ mr: 1 }} disabled={loading}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Payment for Appointment</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "black" }} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ p: 3, overflowY: "auto", flexGrow: 1 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Total: ${formatAmount(totalAmount)}
        </Typography>

        {isFirstTimeCustomer && (
          <Alert severity="info" sx={{ mb: 3 }}>
            As a first-time customer, a 50% deposit (${formatAmount(amountToPay)}) is required now.
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <FormLabel component="legend">Payment Options</FormLabel>
          <RadioGroup
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
            row
          >
            <FormControlLabel
              value="payNow"
              control={<Radio />}
              label="Pay Now with Credit Card"
              disabled={loading}
            />
            <FormControlLabel
              value="payAtSalon"
              control={<Radio />}
              label="Pay at the Salon"
              disabled={loading}
            />
          </RadioGroup>
        </FormControl>

        {paymentOption === "payNow" && (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Cardholder Name"
              fullWidth
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <Box sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1, mb: 3 }}>
              <CardElement options={cardElementOptions} />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {isFirstTimeCustomer
                ? `You'll be charged a 50% deposit of $${formatAmount(amountToPay)} now. The remaining balance will be due at the salon.`
                : `You'll be charged the full amount of $${formatAmount(amountToPay)}.`}
            </Typography>
          </form>
        )}

        {paymentOption === "payAtSalon" && (
          <Typography variant="body1" sx={{ mb: 3 }}>
            {isFirstTimeCustomer
              ? "As a first-time customer, you'll need to pay a 50% deposit when you arrive at the salon."
              : "You can pay when you arrive at the salon. Please bring cash or card."}
          </Typography>
        )}

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Appointment Details:</Typography>
          <Typography variant="body2">Date: {appointmentDate}</Typography>
          <Typography variant="body2">Time: {appointmentTime}</Typography>
          {cartItems.length > 0 && (
            <>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Services: {cartItems.map(item => item.service_name).join(", ")}
              </Typography>
              {cartItems.some(item => item.stylist_name) && (
                <Typography variant="body2">
                  Stylists: {cartItems.map(item => item.stylist_name).filter(Boolean).join(", ")}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid #eee", bgcolor: "#f5f5f5" }}>
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !customerID || (paymentOption === "payNow" && (!stripe || !clientSecret)) || successMessage}
          sx={{ minWidth: 120, bgcolor: "#2196f3", ml: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : paymentOption === "payNow" ? `Pay $${formatAmount(amountToPay)} Now` : "Confirm"}
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentModal;