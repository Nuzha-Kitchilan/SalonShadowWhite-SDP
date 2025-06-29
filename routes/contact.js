
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST endpoint for contact form submissions
router.post('/', contactController.sendContactEmail);

module.exports = router;