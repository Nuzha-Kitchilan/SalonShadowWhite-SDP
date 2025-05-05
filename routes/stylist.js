










// // routes/stylistRoutes.js
// const express = require("express");
// const router = express.Router();
// const stylistController = require("../controllers/stylistController");
// const { authenticateToken, authenticateAdmin } = require("../middleware/auth");

// // Public routes
// router.post('/login', stylistController.loginStylist);               // Login endpoint
// router.post('/register', stylistController.addStylist);              // Registration endpoint (alias to addStylist)

// // Protected routes
// router.get('/stylists', authenticateToken, stylistController.getStylists);  // Fetch all stylists
// router.get('/stylists/:stylist_ID', authenticateToken, stylistController.getStylist);  // Get stylist by ID

// // Admin-only routes
// router.post('/stylists', authenticateAdmin, stylistController.addStylist);  // Add a new stylist (admin)
// router.put('/stylists/:stylist_ID', authenticateAdmin, stylistController.updateStylist);  // Update a stylist
// router.delete('/stylists/:stylist_ID', authenticateAdmin, stylistController.deleteStylist);  // Delete a stylist

// module.exports = router;



// routes/stylistRoutes.js
const express = require("express");
const router = express.Router();
const stylistController = require("../controllers/stylistController");
const { authenticateToken, authenticateAdmin } = require("../middleware/auth");

// Public routes (no authentication required)
router.get('/stylists', stylistController.getStylists);              // Public access to all stylists
router.get('/stylists/:stylist_ID', stylistController.getStylist);   // Public access to a specific stylist
router.post('/login', stylistController.loginStylist);               // Login endpoint
router.post('/register', stylistController.addStylist);              // Registration endpoint

// Protected routes (admin-only)
router.post('/stylists', authenticateAdmin, stylistController.addStylist);  // Add a new stylist (admin)
router.put('/stylists/:stylist_ID', authenticateAdmin, stylistController.updateStylist);  // Update a stylist
router.delete('/stylists/:stylist_ID', authenticateAdmin, stylistController.deleteStylist);  // Delete a stylist

module.exports = router;