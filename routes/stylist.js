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

const express = require("express");
const router = express.Router();

// Import functions from stylistController
const stylistController = require("../controllers/stylistController");

// Define the routes for Stylist CRUD operations
router.get('/stylists', stylistController.getStylists);  // Fetch all stylists
router.post('/stylists', stylistController.addStylist);  // Add a new stylist
router.put('/stylists/:stylist_ID', stylistController.updateStylist);  // Update a stylist
router.delete('/stylists/:stylist_ID', stylistController.deleteStylist);  // Delete a stylist

module.exports = router;

