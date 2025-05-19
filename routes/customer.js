const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// Register route
router.post("/register", customerController.registerCustomer);

// Login route
router.post("/login", customerController.loginCustomer);

// Logout route
router.post("/logout", customerController.logoutCustomer);

// Get Customer Profile (protected route)
router.get("/profile", customerController.authenticateToken, customerController.getCustomerProfile);

router.put('/profile-update', customerController.authenticateToken, customerController.updateProfile);
router.put('/profile/password', customerController.authenticateToken, customerController.changePassword);



router.get("/admin-customer", customerController.getCustomers);
router.get("/admin-customer/:id", customerController.getCustomerDetails);
router.put("/admin-customer/update/:id", customerController.updateCustomer);
router.put("/admin-customer/:id/reset-password", customerController.resetCustomerPassword);
router.delete("/admin-customer/delete/:id", customerController.deleteCustomer);
router.get("/admin-customer/:id/appointments", customerController.getCustomerAppointments);

module.exports = router;