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

// Bridal appointments
router.post('/appointments/bridal', adminController.createBridalAppointment);
//router.put('/bridal-update/:id', adminController.updateBridalAppointment);

router.put('/bridal-appointments/:id', adminController.updateBridalAppointment);
router.delete('/appointments/bridal/:id', adminController.deleteBridalAppointment);
//router.get('/appointments/bridal', adminController.getAllBridalAppointments);
router.get('/appointments/bridal/:id', adminController.getBridalAppointmentById);
router.get('/bridal-appointments', adminController.getAllBridalAppointments);




// Additional data
router.get('/services', adminController.getServices);
router.get('/stylists', adminController.getStylists);
router.get('/customers', adminController.getCustomers);

module.exports = router;