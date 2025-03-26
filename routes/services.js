{/*const express = require("express");
const router = express.Router();
const servicesController = require("../controllers/serviceController"); // Import controller

// Get all services with category names
router.get("/services", servicesController.getAllServices);

// Get all categories (for dropdown in the edit form)
router.get("/categories", servicesController.getAllCategories);

// Add a service
router.post("/services", servicesController.addService);

// Update a service
router.put("/services/:id", servicesController.updateService);

// Delete a service
router.delete("/services/:id", servicesController.deleteService);

module.exports = router; */}


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

module.exports = router;
