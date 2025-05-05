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

module.exports = router;