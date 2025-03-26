const db = require("../config/db"); // Import the db connection

// Get all categories
const getAllCategories = async () => {
    try {
        const [results] = await db.query("SELECT category_id, category_name FROM ServiceCategory");
        return results;
    } catch (error) {
        throw new Error('Error fetching categories: ' + error.message);
    }
};

// Get a category by ID
const getCategoryById = async (category_id) => {
    try {
        const [result] = await db.query("SELECT * FROM ServiceCategory WHERE category_id = ?", [category_id]);
        return result[0]; // Return the first result or null if not found
    } catch (error) {
        throw new Error('Error fetching category by ID: ' + error.message);
    }
};

// Add a new category
const addCategory = async (category_name, admin_id) => {
    try {
        const result = await db.query(
            "INSERT INTO ServiceCategory (category_name, admin_id) VALUES (?, ?)",
            [category_name, admin_id]
        );
        return result;
    } catch (error) {
        throw new Error('Error adding category: ' + error.message);
    }
};

// Update a category by ID
const updateCategory = async (category_id, category_name) => {
    try {
        const result = await db.query(
            "UPDATE ServiceCategory SET category_name = ? WHERE category_id = ?",
            [category_name, category_id]
        );
        return result;
    } catch (error) {
        throw new Error('Error updating category: ' + error.message);
    }
};

// Delete a category by ID
const deleteCategory = async (category_id) => {
    try {
        const result = await db.query("DELETE FROM ServiceCategory WHERE category_id = ?", [category_id]);
        return result;
    } catch (error) {
        throw new Error('Error deleting category: ' + error.message);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,  // Added the missing method
    addCategory,
    updateCategory,
    deleteCategory
};
