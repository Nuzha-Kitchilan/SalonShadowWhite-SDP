
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const paymentModel = require('../models/paymentModel');
const axios = require('axios');

// Create Payment Intent for Stripe Payments
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, customer_ID, isFirstTime, appointment_date, appointment_time } = req.body;

    if (!amount || !customer_ID) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate amount based on whether it's first time customer
    const calculatedAmount = isFirstTime 
      ? Math.floor(amount * 10) 
      : Math.floor(amount * 100); 

    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculatedAmount,
      currency: 'usd',
      metadata: {
        customer_ID: String(customer_ID),
        isFirstTime: String(isFirstTime),
        appointment_date: String(appointment_date),
        appointment_time: String(appointment_time),
        total_amount: String(amount)
      },
    });

    res.status(200).json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Stripe Payment Intent Error:', error);
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error.message 
    });
  }
};

// Handle 'Pay at Salon' option
const handlePayAtSalon = async (req, res) => {
  try {
    const {
      customer_ID,
      payment_amount,
      is_first_time = false,
      selected_date,
      selected_time,
      services = [],
      stylist_ids = []
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!customer_ID) missingFields.push('customer_ID');
    if (!selected_date) missingFields.push('selected_date');
    if (!selected_time) missingFields.push('selected_time');
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate services
    if (services.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one service is required'
      });
    }

    // Create appointment
    const appointmentResponse = await axios.post('http://localhost:5001/api/appointment/create', {
      customer_id: customer_ID,
      selected_date,
      selected_time,
      services,
      stylist_ids
    });

    console.log('Appointment created:', appointmentResponse.data);
    const appointment_ID = appointmentResponse.data.appointment_ID;

    const amount_paid = is_first_time ? payment_amount * 0.1 : 0;

    // Record payment
    const paymentData = {
      appointment_ID,
      customer_ID,
      payment_amount,
      amount_paid,
      payment_status: is_first_time ? 'Partially Paid' : 'Pending',
      payment_type: 'Pay at Salon',
      is_first_time,
      stripe_payment_intent_id: null
    };
    
    console.log('Payment data to be saved:', paymentData);
    const paymentId = await paymentModel.savePaymentDetails(paymentData);
    console.log('Payment saved with ID:', paymentId);

    res.status(201).json({
      success: true,
      message: is_first_time 
        ? 'Appointment created successfully. 50% deposit required at salon.' 
        : 'Appointment created successfully. Please pay at the salon.',
      appointment_ID,
      payment_ID: paymentId
    });

  } catch (error) {
    console.error('Pay at Salon Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process payment',
      details: error.message,
    });
  }
};

// Record Payment details
const recordPayment = async (req, res) => {
  try {
    const {
      appointment_ID,
      customer_ID,
      payment_amount,
      amount_paid,
      payment_status = 'Pending',
      payment_type = 'Online',
      is_first_time = false,
      stripe_payment_intent_id = null
    } = req.body;

    // Validate required fields
    if (!customer_ID || !payment_amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customer_ID and payment_amount are required'
      });
    }

    // For first-time online payments, amount_paid should be 10% of payment_amount
    const finalAmountPaid = payment_type === 'Online' && is_first_time
      ? payment_amount * 0.1
      : amount_paid || (payment_status === 'Paid' ? payment_amount : null);

    // Save payment details
    const paymentData = {
      appointment_ID,
      customer_ID,
      payment_amount,
      amount_paid: finalAmountPaid,
      payment_status: is_first_time && payment_type === 'Online' ? 'Partially Paid' : payment_status,
      payment_type,
      is_first_time,
      stripe_payment_intent_id
    };
    
    console.log('Payment data to be saved (recordPayment):', paymentData);
    const paymentId = await paymentModel.savePaymentDetails(paymentData);
    console.log('Payment saved with ID (recordPayment):', paymentId);

    res.status(201).json({ 
      success: true,
      message: 'Payment details saved successfully',
      paymentId
    });
  } catch (error) {
    console.error('Error saving payment details:', error);
    res.status(500).json({ 
      error: 'Failed to save payment details',
      details: error.message 
    });
  }
};


// New function to fetch payment details by appointment ID
const getPaymentDetailsByAppointment = async (req, res) => {
  try {
    const { appointment_ID } = req.params;

    if (!appointment_ID) {
      return res.status(400).json({ error: 'Appointment ID is required' });
    }

    const paymentDetails = await paymentModel.getPaymentDetailsByAppointment(appointment_ID);

    if (paymentDetails.length === 0) {
      return res.status(404).json({ message: 'No payment details found for this appointment' });
    }

    res.status(200).json({ success: true, paymentDetails });
  } catch (error) {
    console.error('Error fetching payment details by appointment:', error);
    res.status(500).json({ error: 'Failed to fetch payment details', details: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  handlePayAtSalon,
  recordPayment,
  getPaymentDetailsByAppointment
};