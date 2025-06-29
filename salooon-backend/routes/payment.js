const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create a Stripe payment intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

// Record payment details in database
router.post('/record-payment', paymentController.recordPayment);

// Handle Pay at Salon option
router.post('/pay-at-salon', paymentController.handlePayAtSalon);


// Get payment details by appointment ID
router.get('/appointment-payment/:appointment_ID', paymentController.getPaymentDetailsByAppointment);


module.exports = router;
