const express = require('express');
const router = express.Router();
const CustomerController = require('../../controllers/dashboard/customerController');

router.get('/topCustomers', CustomerController.getTopCustomers);

module.exports = router;