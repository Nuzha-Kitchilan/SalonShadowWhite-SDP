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

// Get all pending cancellation requests 
router.get('/cancellation-requests', 
     
    appointmentController.getPendingCancellationRequests
  );
  
  // Process cancellation request 
  router.post('/process-cancellation/:id', 
    appointmentController.processCancellationRequest
  );


  // Get all approved cancellation requests 
router.get('/approved-cancellations', 
  appointmentController.getApprovedCancellationRequests
);

// Get all rejected cancellation requests 
router.get('/rejected-cancellations', 
  appointmentController.getRejectedCancellationRequests
);


module.exports = router;
