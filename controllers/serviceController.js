// {/*const db = require("../config/db");

// // Get all services with category names and optional search
// const getAllServices = async (req, res) => {
//     try {
//         const { category, search } = req.query;

//         let query = `
//             SELECT s.service_id, s.service_name, sc.category_id, sc.category_name, 
//                    s.time_duration, s.price
//             FROM Service s
//             JOIN ServiceCategory sc ON s.category_id = sc.category_id
//             WHERE 1=1
//         `;

//         const queryParams = [];

//         // Add category filter if provided
//         if (category) {
//             query += " AND sc.category_name = ?";
//             queryParams.push(category);
//         }

//         // Add search filter if provided (case-insensitive partial match)
//         if (search) {
//             query += " AND s.service_name LIKE ?";
//             queryParams.push(`%${search}%`);
//         }

//         const [results] = await db.query(query, queryParams);
//         res.json(results);
//     } catch (error) {
//         console.error("Error fetching services:", error);
//         res.status(500).json({ error: "Failed to fetch services" });
//     }
// };

// // Get all categories (for dropdown in the edit form)
// const getAllCategories = async (req, res) => {
//     try {
//         const [results] = await db.query("SELECT category_id, category_name FROM ServiceCategory");
//         res.json(results);
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//         res.status(500).json({ error: "Failed to fetch categories" });
//     }
// };

// // Add a service
// const addService = async (req, res) => {
//     try {
        
//         const { service_name, category_id, time_duration, price, admin_id } = req.body;

//         if (!service_name || !category_id || !time_duration || !price || !admin_id) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         // Verify the category exists
//         const [categoryResults] = await db.query(
//             "SELECT category_id FROM ServiceCategory WHERE category_id = ?", 
//             [category_id]
//         );

//         if (categoryResults.length === 0) {
//             return res.status(400).json({ error: "Category does not exist" });
//         }

//         // Insert service directly with the provided category_id
//         await db.query(
//             "INSERT INTO Service (service_name, category_id, admin_id, time_duration, price) VALUES (?, ?, ?, ?, ?)",
//             [service_name, category_id, admin_id, time_duration, price]
//         );

//         res.json({ message: "Service added successfully" });
//     } catch (error) {
//         console.error("Error adding service:", error);
//         res.status(500).json({ error: "Failed to add service" });
//     }
// };

// // Update a service
// const updateService = async (req, res) => {
//     try {
//         const { service_name, category_id, time_duration, price } = req.body;
//         const { id } = req.params;

//         if (!service_name || !category_id || !time_duration || !price) {
//             return res.status(400).json({ error: "All fields are required for updating a service" });
//         }

//         const [result] = await db.query(
//             "UPDATE Service SET service_name=?, category_id=?, time_duration=?, price=? WHERE service_id=?",
//             [service_name, category_id, time_duration, price, id]
//         );

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: "Service not found" });
//         }

//         res.json({ message: "Service updated successfully" });
//     } catch (error) {
//         console.error("Error updating service:", error);
//         res.status(500).json({ error: "Failed to update service" });
//     }
// };

// // Delete a service
// const deleteService = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const [result] = await db.query("DELETE FROM Service WHERE service_id=?", [id]);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: "Service not found" });
//         }

//         res.json({ message: "Service deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting service:", error);
//         res.status(500).json({ error: "Failed to delete service" });
//     }
// };

// module.exports = {
//     getAllServices,
//     getAllCategories,
//     addService,
//     updateService,
//     deleteService
// };  */}



// const serviceModel = require('../models/serviceModel');
// const categoryModel = require('../models/serCatModel');

// // Get all services with category names and optional search
// const getAllServices = async (req, res) => {
//     try {
//         const { category, search } = req.query;

//         // Fetch services using the service model
//         const services = await serviceModel.getAllServices(search, category);

//         res.json(services);
//     } catch (error) {
//         console.error("Error fetching services:", error);
//         res.status(500).json({ error: "Failed to fetch services" });
//     }
// };

// // Get all categories (for dropdown in the edit form)
// const getAllCategories = async (req, res) => {
//     try {
//         const categories = await categoryModel.getAllCategories();
//         res.json(categories);
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//         res.status(500).json({ error: "Failed to fetch categories" });
//     }
// };

// // Add a service
// const addService = async (req, res) => {
//     try {
//         const { service_name, category_id, time_duration, price, admin_id } = req.body;

//         if (!service_name || !category_id || !time_duration || !price || !admin_id) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         // Verify the category exists using the category model
//         const category = await categoryModel.getCategoryById(category_id);
//         if (!category) {
//             return res.status(400).json({ error: "Category does not exist" });
//         }

//         // Add the service using the service model
//         await serviceModel.addService(service_name, category_id, time_duration, price, admin_id);

//         res.json({ message: "Service added successfully" });
//     } catch (error) {
//         console.error("Error adding service:", error);
//         res.status(500).json({ error: "Failed to add service" });
//     }
// };

// // Update a service
// const updateService = async (req, res) => {
//     try {
//         const { service_name, category_id, time_duration, price } = req.body;
//         const { id } = req.params;

//         if (!service_name || !category_id || !time_duration || !price) {
//             return res.status(400).json({ error: "All fields are required for updating a service" });
//         }

//         // Update the service using the service model
//         const result = await serviceModel.updateService(id, service_name, category_id, time_duration, price);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: "Service not found" });
//         }

//         res.json({ message: "Service updated successfully" });
//     } catch (error) {
//         console.error("Error updating service:", error);
//         res.status(500).json({ error: "Failed to update service" });
//     }
// };

// // Delete a service
// const deleteService = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Delete the service using the service model
//         const result = await serviceModel.deleteService(id);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: "Service not found" });
//         }

//         res.json({ message: "Service deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting service:", error);
//         res.status(500).json({ error: "Failed to delete service" });
//     }
// };

// module.exports = {
//     getAllServices,
//     getAllCategories,
//     addService,
//     updateService,
//     deleteService
// };

const serviceModel = require('../models/serviceModel');
const categoryModel = require('../models/serCatModel');

// Get all services with category names and optional search
const getAllServices = async (req, res) => {
    try {
        const { category, search } = req.query;

        // Fetch services using the service model
        const services = await serviceModel.getAllServices(search, category);

        res.json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ error: "Failed to fetch services" });
    }
};

// Get all categories (for dropdown in the edit form)
const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryModel.getAllCategories();
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};

// Add a service
const addService = async (req, res) => {
    try {
        const { service_name, category_id, time_duration, price, description, admin_id } = req.body;

        if (!service_name || !category_id || !time_duration || !price || !description || !admin_id) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Verify the category exists using the category model
        const category = await categoryModel.getCategoryById(category_id);
        if (!category) {
            return res.status(400).json({ error: "Category does not exist" });
        }

        // Add the service using the service model
        await serviceModel.addService(service_name, category_id, time_duration, price, description, admin_id);

        res.json({ message: "Service added successfully" });
    } catch (error) {
        console.error("Error adding service:", error);
        res.status(500).json({ error: "Failed to add service" });
    }
};

// Update a service
const updateService = async (req, res) => {
    try {
        const { service_name, category_id, time_duration, price, description } = req.body;
        const { id } = req.params;

        if (!service_name || !category_id || !time_duration || !price || !description) {
            return res.status(400).json({ error: "All fields are required for updating a service" });
        }

        // Update the service using the service model
        const result = await serviceModel.updateService(id, service_name, category_id, time_duration, price, description);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Service not found" });
        }

        res.json({ message: "Service updated successfully" });
    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ error: "Failed to update service" });
    }
};

// Delete a service
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the service using the service model
        const result = await serviceModel.deleteService(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Service not found" });
        }

        res.json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({ error: "Failed to delete service" });
    }
};

module.exports = {
    getAllServices,
    getAllCategories,
    addService,
    updateService,
    deleteService
};
