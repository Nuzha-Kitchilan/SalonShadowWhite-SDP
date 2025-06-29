const express = require('express');
const router = express.Router();
const revenueController = require('../../controllers/dashboard/revenueController');

router.get('/', revenueController.getRevenue);

router.get('/by-service', revenueController.getRevenueByService);

router.get('/by-stylist', revenueController.getStylistRevenue);

router.get('/average-ticket', revenueController.getAverageTicket);

router.get('/detailed', revenueController.getDetailedRevenue);

router.get('/trend', revenueController.getRevenueTrendData);



module.exports = router;