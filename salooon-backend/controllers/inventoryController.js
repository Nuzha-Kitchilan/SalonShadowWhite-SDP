const inventoryModel = require('../models/inventoryModel');

// Get all inventory items
exports.getAllInventory = async (req, res) => {
    try {
        const results = await inventoryModel.getAllInventoryItems();
        res.status(200).json(results);
    } catch (err) {
        console.error("Error fetching inventory:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Add new inventory item
exports.addInventory = async (req, res) => {
    const { product_name, quantity, price, manufacture_date, expire_date, brand, admin_id } = req.body;

    if (!product_name || !quantity || !price || !manufacture_date || !expire_date || !brand || !admin_id) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const result = await inventoryModel.createInventoryItem(product_name, quantity, price, manufacture_date, expire_date, brand, admin_id);
        res.status(201).json({ message: 'Inventory item added successfully', id: result.insertId });
    } catch (err) {
        console.error("Error adding inventory:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update inventory item
exports.updateInventory = async (req, res) => {
    const inventory_id = parseInt(req.params.inventory_id, 10);
    const { product_name, quantity, price, manufacture_date, expire_date, brand } = req.body;

    if (!inventory_id || isNaN(inventory_id)) {
        return res.status(400).json({ error: "Invalid inventory ID" });
    }

    if (!product_name || !quantity || !price || !manufacture_date || !expire_date || !brand) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const result = await inventoryModel.updateInventoryItem(inventory_id, product_name, quantity, price, manufacture_date, expire_date, brand);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Inventory item not found" });
        }

        res.status(200).json({ message: 'Inventory item updated successfully' });
    } catch (err) {
        console.error("Error updating inventory:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete inventory item
exports.deleteInventory = async (req, res) => {
    const inventory_id = parseInt(req.params.inventory_id, 10);

    if (!inventory_id || isNaN(inventory_id)) {
        return res.status(400).json({ error: "Invalid inventory ID" });
    }

    try {
        const result = await inventoryModel.deleteInventoryItem(inventory_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Inventory item not found" });
        }

        res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (err) {
        console.error("Error deleting inventory:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
