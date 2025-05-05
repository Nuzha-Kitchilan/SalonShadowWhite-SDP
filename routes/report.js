const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/revenue', reportController.getRevenueReport);


// In reportRoutes.js
router.get('/test-pdf', reportController.testPDF);


module.exports = router;