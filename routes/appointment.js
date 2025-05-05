// const express = require('express');
// const router = express.Router();
// const appointmentController = require('../controllers/appointmentController'); // Import the controller

// // Route to create appointment
// // ✅ Automatically clears the cart after successful appointment creation
// router.post('/create', appointmentController.createAppointment);

// // Route to check if customer is a first-timer
// router.get('/check-first-time/:customer_id', appointmentController.checkIfFirstTimeCustomer);

// module.exports = router;







const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Route to create appointment
router.post('/create', appointmentController.createAppointment);

// Route to check if customer is a first-timer
router.get('/check-first-time/:customer_id', appointmentController.checkIfFirstTimeCustomer);

// Route to request appointment cancellation
router.post('/cancel-request/:id', appointmentController.requestCancelAppointment);

router.get('/customer/:customer_id', appointmentController.getAppointmentsByCustomer);

// Get all pending cancellation requests (admin only)
router.get('/cancellation-requests', 
     
    appointmentController.getPendingCancellationRequests
  );
  
  // Process cancellation request (admin only)
  router.post('/process-cancellation/:id', 
    appointmentController.processCancellationRequest
  );


module.exports = router;
