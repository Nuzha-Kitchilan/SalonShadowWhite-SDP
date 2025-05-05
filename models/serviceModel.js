const db = require("../config/db");

// Get all services with optional search and category filter
const getAllServices = async (search, category) => {
    try {
        let query = `
            SELECT s.service_id, s.service_name, sc.category_id, sc.category_name, 
                   s.time_duration, s.price, s.description
            FROM Service s
            JOIN ServiceCategory sc ON s.category_id = sc.category_id
            WHERE 1=1
        `;

        const queryParams = [];

        // Add category filter if provided
        if (category) {
            query += " AND sc.category_name = ?";
            queryParams.push(category);
        }

        // Add search filter if provided (case-insensitive partial match)
        if (search) {
            query += " AND s.service_name LIKE ?";
            queryParams.push(`%${search}%`);
        }

        // Execute query with parameters
        const [results] = await db.execute(query, queryParams);
        return results;
    } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
    }
};

// Get all categories
const getAllCategories = async () => {
    try {
        const [results] = await db.execute("SELECT category_id, category_name FROM ServiceCategory");
        return results;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

// Get a category by ID
const getCategoryById = async (categoryId) => {
    try {
        const [results] = await db.execute("SELECT * FROM ServiceCategory WHERE category_id = ?", [categoryId]);
        return results[0]; // Returns the category or undefined if not found
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
};

// Add a service
const addService = async (service_name, category_id, time_duration, price, description, admin_id) => {
    try {
        const result = await db.execute(
            "INSERT INTO Service (service_name, category_id, admin_id, time_duration, price, description) VALUES (?, ?, ?, ?, ?, ?)",
            [service_name, category_id, admin_id, time_duration, price, description]
        );
        return result;
    } catch (error) {
        console.error("Error adding service:", error);
        throw error;
    }
};

// Update a service
const updateService = async (id, service_name, category_id, time_duration, price, description) => {
    console.log("Received Data:", { id, service_name, category_id, time_duration, price, description }); // Fixed debugging log

    try {
        const result = await db.execute(
            "UPDATE Service SET service_name = ?, category_id = ?, time_duration = ?, price = ?, description = ? WHERE service_id = ?",
            [service_name, category_id, time_duration, price, description, id]
        );
        return result;
    } catch (error) {
        console.error("Error updating service:", error);
        throw error;
    }
};

// Delete a service
const deleteService = async (id) => {
    try {
        const result = await db.execute("DELETE FROM Service WHERE service_id = ?", [id]);
        return result;
    } catch (error) {
        console.error("Error deleting service:", error);
        throw error;
    }
};


// Get services by category ID
const getServicesByCategoryId = async (category_id) => {
    try {
        const [results] = await db.execute(
            `
            SELECT s.service_id, s.service_name, s.category_id, sc.category_name,
                   s.time_duration, s.price, s.description
            FROM Service s
            JOIN ServiceCategory sc ON s.category_id = sc.category_id
            WHERE s.category_id = ?
            `,
            [category_id]
        );
        return results;
    } catch (error) {
        console.error("Error fetching services by category ID:", error);
        throw error;
    }
};

// Add this with your other model functions
// Add a new category
const addCategory = async (category_name, admin_id) => {
    try {
        const result = await db.execute(
            "INSERT INTO ServiceCategory (category_name, admin_id) VALUES (?, ?)",
            [category_name, admin_id]
        );
        return result;
    } catch (error) {
        console.error("Error adding category:", error);
        throw error;
    }
};


// Update a category
const updateCategory = async (id, category_name) => {
    try {
        const [result] = await db.execute(
            "UPDATE ServiceCategory SET category_name = ? WHERE category_id = ?",
            [category_name, id]
        );
        return result;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

// Delete a category
const deleteCategory = async (id) => {
    try {
        const [result] = await db.execute(
            "DELETE FROM ServiceCategory WHERE category_id = ?",
            [id]
        );
        return result;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};




module.exports = {
    getAllServices,
    getAllCategories,
    getCategoryById,
    addService,
    updateService,
    deleteService,
    getServicesByCategoryId,
    addCategory,
    updateCategory,
    deleteCategory
};