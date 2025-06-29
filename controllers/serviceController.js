const serviceModel = require('../models/serviceModel');
const categoryModel = require('../models/serCatModel');


const getAllServices = async (req, res) => {
    try {
        const { category, search } = req.query;
        const services = await serviceModel.getAllServices(search, category);

        res.json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ error: "Failed to fetch services" });
    }
};

// Get all categories 
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

// Get services by category ID
const getServicesByCategoryId = async (req, res) => {
    try {
        const { category_id } = req.params;

        if (!category_id) {
            return res.status(400).json({ error: "Category ID is required" });
        }

        const services = await serviceModel.getServicesByCategoryId(category_id);
        res.json(services);
    } catch (error) {
        console.error("Error fetching services by category ID:", error);
        res.status(500).json({ error: "Failed to fetch services by category ID" });
    }
};


// Add a new category
const addCategory = async (req, res) => {
    try {
        const { category_name, admin_id } = req.body;

        if (!category_name || !admin_id) {
            return res.status(400).json({ error: "Category name and admin ID are required" });
        }

        // Add the category using the category model
        await categoryModel.addCategory(category_name, admin_id);

        res.json({ message: "Category added successfully" });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: "Failed to add category" });
    }
};


// Update a category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name } = req.body;

        if (!category_name) {
            return res.status(400).json({ error: "Category name is required" });
        }

        const result = await categoryModel.updateCategory(id, category_name);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json({ message: "Category updated successfully" });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Failed to update category" });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the category has associated services
        const services = await serviceModel.getServicesByCategoryId(id);
        if (services.length > 0) {
            return res.status(400).json({ 
                error: "Cannot delete category with associated services. Delete services first." 
            });
        }

        const result = await categoryModel.deleteCategory(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Failed to delete category" });
    }
};



module.exports = {
    getAllServices,
    getAllCategories,
    addService,
    updateService,
    deleteService,
    getServicesByCategoryId,
    addCategory,
    updateCategory,
    deleteCategory
};
