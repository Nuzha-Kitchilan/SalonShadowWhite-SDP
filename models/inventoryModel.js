const db = require('../config/db'); 

// Create a new inventory item
const createInventoryItem = async (product_name, quantity, price, manufacture_date, expire_date, brand, admin_id) => {
  const query = `INSERT INTO inventory (product_name, quantity, price, manufacture_date, expire_date, brand, admin_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  try {
    const [result] = await db.execute(query, [product_name, quantity, price, manufacture_date, expire_date, brand, admin_id]);
    return result;
  } catch (error) {
    throw new Error('Error creating inventory item: ' + error.message);
  }
};

// Get all inventory items
const getAllInventoryItems = async () => {
  const query = 'SELECT * FROM inventory';
  try {
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    throw new Error('Error fetching inventory items: ' + error.message);
  }
};

// Get an inventory item by ID
const getInventoryItemById = async (inventory_id) => {
  const query = 'SELECT * FROM inventory WHERE inventory_id = ?';
  try {
    const [rows] = await db.execute(query, [inventory_id]);
    return rows[0];
  } catch (error) {
    throw new Error('Error fetching inventory item by ID: ' + error.message);
  }
};

// Update an inventory item
const updateInventoryItem = async (inventory_id, product_name, quantity, price, manufacture_date, expire_date, brand) => {
  const query = `UPDATE inventory SET 
                 product_name = ?, quantity = ?, price = ?, manufacture_date = ?, expire_date = ?, brand = ?
                 WHERE inventory_id = ?`;
  try {
    const [result] = await db.execute(query, [product_name, quantity, price, manufacture_date, expire_date, brand, inventory_id]);
    return result;
  } catch (error) {
    throw new Error('Error updating inventory item: ' + error.message);
  }
};

// Delete an inventory item
const deleteInventoryItem = async (inventory_id) => {
  const query = 'DELETE FROM inventory WHERE inventory_id = ?';
  try {
    const [result] = await db.execute(query, [inventory_id]);
    return result;
  } catch (error) {
    throw new Error('Error deleting inventory item: ' + error.message);
  }
};

module.exports = {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem
};
