

const appointmentModel = require('../models/appointmentModel');
const CartModel = require('../models/cartModel');


const createAppointment = async (req, res) => {
  const { customer_id, selected_date, selected_time, services = [], stylist_ids = [] } = req.body;

  try {
    // 1. Validate required fields
    if (!customer_id || !selected_date || !selected_time) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (customer_id, selected_date, selected_time)"
      });
    }

    // 2. Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(selected_date)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD"
      });
    }

    // 3. Validate and normalize time format (accept HH:MM or HH:MM:SS)
    let normalizedTime = selected_time;
    if (selected_time.includes(':')) {
      const timeParts = selected_time.split(':');
      if (timeParts.length > 2) {
        normalizedTime = `${timeParts[0]}:${timeParts[1]}`; // Keep only HH:MM
      }
    }

    if (!/^\d{2}:\d{2}$/.test(normalizedTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format. Use HH:MM"
      });
    }

    // 4. Format cart items for processing
    // Combine services with stylist_ids if provided separately
    let cartItems = [];
    
    if (Array.isArray(services) && services.length > 0) {
      // Create cart items from services and optional stylist IDs
      cartItems = services.map((service, index) => {
        // Handle different service formats (object or ID)
        const service_id = typeof service === 'object' ? service.service_id || service.id : service;
        
        // Get stylist ID if available (can be null/undefined)
        const stylist_id = stylist_ids[index] || null;
        
        return {
          service_id,
          stylist_id
        };
      });
    }

    // 5. Validate at least one service is required
    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one service is required"
      });
    }

    // 6. Create complete appointment with normalized time and exact date string
    const result = await appointmentModel.createCompleteAppointment(
      customer_id,
      selected_date,
      normalizedTime,
      cartItems
    );

    // 7. Clear the cart
    await CartModel.clearCartByCustomerId(customer_id);

    res.status(201).json({
      success: true,
      appointment_ID: result.appointment_ID,
      services_processed: result.inserted_records.length,
      stylists_assigned: result.inserted_records.filter(r => r.stylist_ID !== null).length
    });

  } catch (err) {
    console.error("Appointment creation error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
      received_data: req.body
    });
  }
};



const checkIfFirstTimeCustomer = async (req, res) => {
  const { customer_id } = req.params;
  try {
    const isFirstTime = await appointmentModel.checkIfFirstTimeCustomer(customer_id);
    res.status(200).json({ isFirstTime });
  } catch (err) {
    console.error("Error checking first-time customer status:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


const requestCancelAppointment = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const result = await appointmentModel.sendCancelRequest(appointmentId);

    if (!result || result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed appointment.'
      });
    }

    if (appointment_status === 'Cancelled') {
  return res.status(400).json({ message: 'This appointment is already cancelled.' });
}


    res.status(200).json({
      success: true,
      message: "Cancellation request submitted successfully"
    });
  } catch (err) {
    console.error("Error sending cancel request:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};




const getAppointmentsByCustomer = async (req, res) => {
  const customerId = req.params.customer_id;

  try {
    const appointments = await appointmentModel.getAppointmentsByCustomer(customerId);
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    console.error("Error fetching customer appointments:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get all pending cancellation requests
const getPendingCancellationRequests = async (req, res) => {
  try {
    const requests = await appointmentModel.getPendingCancellationRequests();
    
    // Fetch payment details for each request
    const requestsWithPayments = await Promise.all(
      requests.map(async (request) => {
        try {
          const paymentRes = await axios.get(`http://localhost:5001/api/payment/appointment-payment/${request.appointment_ID}`);
          return {
            ...request,
            payment: paymentRes.data.paymentDetails[0] || null
          };
        } catch (error) {
          return request; // Continue even if payment fetch fails
        }
      })
    );
    
    res.status(200).json({ success: true, data: requestsWithPayments });
  } catch (err) {
    console.error("Error fetching cancellation requests:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Process cancellation request (approve/reject)
const processCancellationRequest = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'Approved' or 'Rejected'

  if (!['Approved', 'Rejected'].includes(action)) {
    return res.status(400).json({
      success: false,
      message: "Invalid action. Must be 'Approved' or 'Rejected'"
    });
  }

  try {
    const result = await appointmentModel.processCancellationRequest(id, action);
    res.status(200).json({ 
      success: true, 
      message: `Cancellation request ${action.toLowerCase()}`,
      data: result
    });
  } catch (err) {
    console.error("Error processing cancellation request:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};




// Get all approved cancellation requests
const getApprovedCancellationRequests = async (req, res) => {
  try {
    const requests = await appointmentModel.getCancellationRequestsByStatus('Approved');
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    console.error("Error fetching approved cancellations:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all rejected cancellation requests
const getRejectedCancellationRequests = async (req, res) => {
  try {
    const requests = await appointmentModel.getCancellationRequestsByStatus('Rejected');
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    console.error("Error fetching rejected cancellations:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = { 
  createAppointment,
  checkIfFirstTimeCustomer,
  requestCancelAppointment,
  getAppointmentsByCustomer,
  getPendingCancellationRequests,
  processCancellationRequest,
  getApprovedCancellationRequests,
  getRejectedCancellationRequests
};
