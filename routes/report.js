const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/revenue', reportController.getRevenueReport);


router.get('/advanced-revenue', reportController.getAdvancedRevenueReport);

module.exports = router;