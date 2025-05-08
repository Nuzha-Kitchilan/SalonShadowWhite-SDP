// const express = require('express');
// const router = express.Router();
// const reportController = require('../controllers/reportController');

// router.get('/revenue', reportController.getRevenueReport);


// // In reportRoutes.js
// router.get('/test-pdf', reportController.testPDF);


// module.exports = router;






const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Basic Report Routes
router.get('/revenue', reportController.getRevenueReport);
router.get('/test-pdf', reportController.testPDF);

// Advanced Report Routes
router.get('/advanced-revenue', reportController.getAdvancedRevenueReport);

module.exports = router;