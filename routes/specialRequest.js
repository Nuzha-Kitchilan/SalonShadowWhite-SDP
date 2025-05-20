// const express = require('express');
// const router = express.Router();
// const specialRequestController = require('../controllers/specialRequestController');

// router.post('/', specialRequestController.submitRequest);
// router.get('/customer-info', specialRequestController.getCustomerInfo);
// router.get('/customer-requests', specialRequestController.getCustomerRequests);

// module.exports = router;










const express = require('express');
const router = express.Router();
const specialRequestController = require('../controllers/specialRequestController');

// Existing routes
router.post('/', specialRequestController.submitRequest);
router.get('/customer-info', specialRequestController.getCustomerInfo);
router.get('/customer-requests', specialRequestController.getCustomerRequests);

// New admin routes
router.get('/admin/all-requests', specialRequestController.getAllRequests);
router.put('/admin/update-status', specialRequestController.updateRequestStatus);


router.get('/admin/filtered-requests', specialRequestController.getFilteredRequests);

module.exports = router;