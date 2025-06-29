const express = require("express");
const router = express.Router();
const stylistController = require("../controllers/stylistController");
const { authenticateToken, authenticateAdmin } = require("../middleware/auth");

// Public routes (no authentication required)
router.get('/stylists', stylistController.getStylists);              
router.get('/stylists/:stylist_ID', stylistController.getStylist);   
router.post('/login', stylistController.loginStylist);               
router.post('/register', stylistController.addStylist);              

// Protected routes (admin-only)
router.post('/stylists', authenticateAdmin, stylistController.addStylist);  
router.put('/stylists/:stylist_ID', authenticateAdmin, stylistController.updateStylist);  
router.delete('/stylists/:stylist_ID', authenticateAdmin, stylistController.deleteStylist); 

module.exports = router;