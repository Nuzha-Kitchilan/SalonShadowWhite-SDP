// const express = require('express');
// const router = express.Router();
// const adminController = require('../controllers/adminAppointmentCont.js');

// // Appointments
// router.get('/appointments', adminController.getAppointments); // List view
// router.get('/appointments/:id', adminController.getAppointment); // Detailed view
// router.put('/appointments/:id', adminController.updateAppointment); // Update
// router.delete('/appointments/:id', adminController.deleteAppointment); // Delete

// // Payments
// router.get('/payments', adminController.getPayments); // List view
// router.get('/payments/:id', adminController.getPayment); // Detailed view
// router.put('/payments/:id', adminController.updatePayment); // Update

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const adminController = require('../controllers/adminAppointmentCont');
// const customerController = require('../controllers/customerController');

// // Appointments CRUD
// router.get('/appointments', adminController.getAppointments);
// router.post('/appointments', adminController.createAppointment);
// router.get('/appointments/:id', adminController.getAppointment);
// router.put('/appointments/:id', adminController.updateAppointment);
// router.delete('/appointments/:id', adminController.deleteAppointment);

// router.get('/appointments/today', adminController.getTodayAppointments);

// router.post('/customers/walkin', customerController.createWalkInCustomer);

// // Additional data
// router.get('/services', adminController.getServices);
// router.get('/stylists', adminController.getStylists);
// router.get('/customers', adminController.getCustomers);


// router.get('/test-today', (req, res) => {
//     res.send('✅ adminAppointment route is working');
//   });

  
// module.exports = router;




const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminAppointmentCont');
const customerController = require('../controllers/customerController');

// Today's appointments - Make sure this is BEFORE the /:id route to avoid conflicts
router.get('/appointments/today', adminController.getTodayAppointments);

// Appointments CRUD
router.get('/appointments', adminController.getAppointments);
router.post('/appointments', adminController.createAppointment);
router.get('/appointments/:id', adminController.getAppointment);
router.put('/appointments/:id', adminController.updateAppointment);
router.delete('/appointments/:id', adminController.deleteAppointment);

router.post('/customers/walkin', customerController.createWalkInCustomer);

// Additional data
router.get('/services', adminController.getServices);
router.get('/stylists', adminController.getStylists);
router.get('/customers', adminController.getCustomers);

module.exports = router;