// routes/stylists.js
const express = require('express');
const router = express.Router();
const stylistController = require('../../controllers/dashboard/stylistController');

router.get('/popularity', stylistController.getStylistPopularity);

module.exports = router;