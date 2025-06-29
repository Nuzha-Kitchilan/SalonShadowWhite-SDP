const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Routes for services
router.get('/services', serviceController.getAllServices); // Get all services
router.post('/services', serviceController.addService); // Add a new service
router.put('/services/:id', serviceController.updateService); // Update an existing service
router.delete('/services/:id', serviceController.deleteService); // Delete a service

// Routes for categories
router.get('/categories', serviceController.getAllCategories); // Get all service categories

router.get('/services/category/:category_id', serviceController.getServicesByCategoryId);


router.post('/categories', serviceController.addCategory); // Add a new category

router.put('/categories/:id', serviceController.updateCategory);


router.delete('/categories/:id', serviceController.deleteCategory);


module.exports = router;
