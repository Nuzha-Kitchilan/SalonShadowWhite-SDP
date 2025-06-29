const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Get all inventory items
router.get('/inventory', inventoryController.getAllInventory);

// Add new inventory item
router.post('/inventory', inventoryController.addInventory);

// Update inventory item 
router.put('/inventory/:inventory_id', inventoryController.updateInventory);

// Delete inventory item 
router.delete('/inventory/:inventory_id', inventoryController.deleteInventory);

module.exports = router;

