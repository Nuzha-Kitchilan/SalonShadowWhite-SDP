const express = require('express');
const router = express.Router();
const PerformanceController = require('../../controllers/dashboard/performanceController');

router.get('/heatmap', PerformanceController.getTimeHeatmapData);

module.exports = router;