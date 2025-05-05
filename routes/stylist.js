{/*const express = require("express");
const router = express.Router();

// Import functions from stylistController
//const { getStylists, addStylist, updateStylist, deleteStylist } = require("../controllers/stylistController");
const stylistController = require("../controllers/stylistController");

// Define the routes for Stylist CRUD operations
router.get('/stylists', stylistController.getStylists);  // Fetch all stylists
router.post('/stylists', stylistController.addStylist);  // Add a new stylist
router.put('/stylists/:stylist_ID', stylistController.updateStylist);  // Update a stylist
router.delete('/stylists/:stylist_ID', stylistController.deleteStylist);  // Delete a stylist

module.exports = router; */}

// const express = require("express");
// const router = express.Router();

// // Import functions from stylistController
// const stylistController = require("../controllers/stylistController");

// // Define the routes for Stylist CRUD operations
// router.get('/stylists', stylistController.getStylists);  // Fetch all stylists
// router.post('/stylists', stylistController.addStylist);  // Add a new stylist
// router.put('/stylists/:stylist_ID', stylistController.updateStylist);  // Update a stylist
// router.delete('/stylists/:stylist_ID', stylistController.deleteStylist);  // Delete a stylist

// module.exports = router;










// routes/stylistRoutes.js
const express = require("express");
const router = express.Router();
const stylistController = require("../controllers/stylistController");
const { authenticateToken, authenticateAdmin } = require("../middleware/auth");

// Public routes
router.post('/login', stylistController.loginStylist);               // Login endpoint
router.post('/register', stylistController.addStylist);              // Registration endpoint (alias to addStylist)

// Protected routes
router.get('/stylists', authenticateToken, stylistController.getStylists);  // Fetch all stylists
router.get('/stylists/:stylist_ID', authenticateToken, stylistController.getStylist);  // Get stylist by ID

// Admin-only routes
router.post('/stylists', authenticateAdmin, stylistController.addStylist);  // Add a new stylist (admin)
router.put('/stylists/:stylist_ID', authenticateAdmin, stylistController.updateStylist);  // Update a stylist
router.delete('/stylists/:stylist_ID', authenticateAdmin, stylistController.deleteStylist);  // Delete a stylist

module.exports = router;