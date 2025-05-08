const stylistModel = require("../models/stylistModel");
const cloudinary = require('../config/cloudinary');

// Input validation helpers
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
};

const validatePhoneNumbers = (phone_numbers) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone_numbers || !Array.isArray(phone_numbers)) return true;
    
    for (let phone of phone_numbers) {
        if (phone && phone.trim() && !phoneRegex.test(phone.trim())) {
            return false;
        }
    }
    return true;
};

// Get all stylists
const getStylists = async (req, res) => {
    try {
        const stylists = await stylistModel.getAllStylists();
        res.json(stylists);
    } catch (error) {
        console.error("Error fetching stylists:", error);
        res.status(500).json({ message: "Error fetching stylists", error: error.message });
    }
};

// Get a specific stylist
const getStylist = async (req, res) => {
    try {
        const { stylist_ID } = req.params;
        const stylist = await stylistModel.getStylistById(stylist_ID);
        
        if (!stylist) {
            return res.status(404).json({ message: "Stylist not found" });
        }
        
        res.json(stylist);
    } catch (error) {
        console.error("Error fetching stylist:", error);
        res.status(500).json({ message: "Error fetching stylist details", error: error.message });
    }
};



const addStylist = async (req, res) => {
    try {
        console.log("Request body:", JSON.stringify(req.body, null, 2));
        
        const { firstname, lastname, email, username, role,
                house_no, street, city, phone_numbers, password, bio } = req.body;
        
        let profile_url = null;

        // Check for missing required fields
        if (!firstname || !lastname || !email || !username || !password || !role || !house_no || !street || !city) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Validate email format
        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // Check phone number format if provided
        if (!validatePhoneNumbers(phone_numbers)) {
            return res.status(400).json({ message: "Invalid phone number format. Please use 10-digit numbers." });
        }

        // Check if username already exists
        const existingStylist = await stylistModel.findStylistByUsername(username);
        if (existingStylist) {
            return res.status(409).json({ message: "Username already exists." });
        }

        // Handle profile image upload to Cloudinary if it exists in the request
        if (req.file) {
            try {
                // Upload image to Cloudinary
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'stylist_profiles', // Optional: create a folder in your Cloudinary account
                    use_filename: true,
                    unique_filename: true
                });
                
                // Save only the secure URL from Cloudinary
                profile_url = result.secure_url;
                
            
            } catch (uploadError) {
                console.error("Error uploading to Cloudinary:", uploadError);
                return res.status(500).json({
                    message: "Error uploading profile image",
                    error: uploadError.message
                });
            }
        } else if (req.body.profile_url && req.body.profile_url.startsWith('data:image')) {
            // If profile_url is a base64 string (data URL)
            try {
                // Upload base64 image to Cloudinary
                const result = await cloudinary.uploader.upload(req.body.profile_url, {
                    folder: 'stylist_profiles',
                });
                
                // Save only the secure URL from Cloudinary
                profile_url = result.secure_url;
            } catch (uploadError) {
                console.error("Error uploading base64 to Cloudinary:", uploadError);
                return res.status(500).json({
                    message: "Error uploading profile image",
                    error: uploadError.message
                });
            }
        } else if (req.body.profile_url) {
            // If it's already a URL (perhaps from previous upload)
            profile_url = req.body.profile_url;
        }

        const stylist_ID = await stylistModel.createStylist({
            firstname, lastname, email, username, role, profile_url,
            house_no, street, city, phone_numbers, password, bio
        });

        res.status(201).json({ 
            message: "Stylist registered successfully", 
            stylist_ID 
        });
        
    } catch (error) {
        console.error("Error adding stylist:", error);
        res.status(500).json({ 
            message: "Error registering stylist", 
            error: error.message
        });
    }
};





const updateStylist = async (req, res) => {
    try {
        const { stylist_ID } = req.params;
        const {
            firstname, lastname, email, username, role,
            house_no, street, city, phone_numbers, password, bio
        } = req.body;
        
        let profile_url = req.body.profile_url;

        // Check for missing required fields
        if (!firstname || !lastname || !email || !username || !role || !house_no || !street || !city) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Validate email format
        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // Check phone number format if provided
        if (!validatePhoneNumbers(phone_numbers)) {
            return res.status(400).json({ message: "Invalid phone number format. Please use 10-digit numbers." });
        }

        // Check if stylist exists
        const existingStylist = await stylistModel.getStylistById(stylist_ID);
        if (!existingStylist) {
            return res.status(404).json({ message: "Stylist not found." });
        }

        // Handle profile image upload to Cloudinary if it exists in the request
        if (req.file) {
            try {
                // Upload image to Cloudinary
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'stylist_profiles',
                    use_filename: true,
                    unique_filename: true
                });
                
                // Save only the secure URL from Cloudinary
                profile_url = result.secure_url;
                
                // If using multer with disk storage, you might want to delete the local file
                // const fs = require('fs');
                // fs.unlinkSync(req.file.path);
            } catch (uploadError) {
                console.error("Error uploading to Cloudinary:", uploadError);
                return res.status(500).json({
                    message: "Error uploading profile image",
                    error: uploadError.message
                });
            }
        } else if (profile_url && profile_url.startsWith('data:image')) {
            // Handle base64 image string
            try {
                // Upload base64 image to Cloudinary
                const result = await cloudinary.uploader.upload(profile_url, {
                    folder: 'stylist_profiles',
                });
                
                // Save only the secure URL from Cloudinary
                profile_url = result.secure_url;
            } catch (uploadError) {
                console.error("Error uploading base64 to Cloudinary:", uploadError);
                return res.status(500).json({
                    message: "Error uploading profile image",
                    error: uploadError.message
                });
            }
        }

        await stylistModel.updateStylist(stylist_ID, {
            firstname, lastname, email, username, role, profile_url,
            house_no, street, city, phone_numbers, password, bio
        });

        res.json({ message: "Stylist updated successfully" });

    } catch (error) {
        console.error("Error updating stylist:", error);
        res.status(500).json({ 
            message: "Error updating stylist", 
            error: error.message
        });
    }
};

// Delete a stylist
const deleteStylist = async (req, res) => {
    try {
        const { stylist_ID } = req.params;
        
        // Check if stylist exists
        const existingStylist = await stylistModel.getStylistById(stylist_ID);
        if (!existingStylist) {
            return res.status(404).json({ message: "Stylist not found." });
        }
        
        await stylistModel.deleteStylist(stylist_ID);
        res.json({ message: "Stylist deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting stylist:", error);
        res.status(500).json({ 
            message: "Error deleting stylist", 
            error: error.message
        });
    }
};

// Login and authenticate a stylist
const loginStylist = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check for missing fields
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }
        
        // Authenticate stylist
        const result = await stylistModel.authenticateStylist(username, password);
        
        if (!result.success) {
            return res.status(401).json({ message: result.message });
        }
        
        // Return token and user data
        res.json({
            message: "Login successful",
            token: result.token,
            user: result.user
        });
        
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ 
            message: "Error during login", 
            error: error.message
        });
    }
};

module.exports = { 
    getStylists, 
    getStylist,
    addStylist, 
    updateStylist, 
    deleteStylist,
    loginStylist
};