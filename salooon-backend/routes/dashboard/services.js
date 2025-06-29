// routes/services.js
const express = require('express');
const router = express.Router();
const serviceController = require('../../controllers/dashboard/serviceController');

router.get('/popularity', serviceController.getServicePopularity);

module.exports = router;