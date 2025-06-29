
const Admin = require('../models/adminModel');
const Stylist = require('../models/stylistModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendOTPEmail = require('../utils/mailer');

// Constants
const SALT_ROUNDS = 10;
const otpStore = new Map();

// Helper function
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Admin Registration
const registerAdmin = async (req, res) => {
    try {
        const { first_name, last_name, email, username, password, role } = req.body;
        const profile_url = req.body.profile_url || null;

        // Check if admin exists by username or email
        const existingAdminByUsername = await Admin.findByUsername(username);
        if (existingAdminByUsername) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const existingAdminByEmail = await Admin.findByEmail(email);
        if (existingAdminByEmail) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // Hash password and create admin
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await Admin.createAdmin(
            first_name, 
            last_name, 
            email, 
            username, 
            hashedPassword,
            role, 
            profile_url
        );

        return res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};



const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Try admin first
        let user = await Admin.findByUsername(username);
        let userType = 'admin';
        let userSource = 'Admin table';

        if (!user) {
            // Try stylist if admin not found
            user = await Stylist.findStylistByUsername(username);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            userType = user.role || 'stylist';
            userSource = 'Stylist table';
        }

        // Enhanced debugging
        console.log(`User found in ${userSource}:`, JSON.stringify(user, null, 2));
        console.log(`profile_url value:`, user.profile_url);
        console.log(`profile_url type:`, typeof user.profile_url);
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Standardize response format
        const userData = {
            id: user.id || user.stylist_ID,
            username: user.username,
            email: user.email,
            name: user.first_name ? 
                `${user.first_name} ${user.last_name}` : 
                `${user.firstname} ${user.lastname}`,
            role: userType,
            profile_url: user.profile_url 
        };

        console.log('Final userData being encoded in JWT:', JSON.stringify(userData, null, 2));

        const token = jwt.sign(
            userData,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: userData,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};





const updateAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const { first_name, last_name, email, role } = req.body;
        // Note: profile_url might be coming from req.body in a hidden field 
        const profile_url = req.body.profile_url;
        const profile_pic_file = req.file;

        console.log('Update admin request:');
        console.log('Admin ID:', adminId);
        console.log('Form data:', { first_name, last_name, email, role, profile_url });
        console.log('File:', profile_pic_file ? 'File uploaded' : 'No file uploaded');

        // Check for admin ID first
        if (!adminId) {
            return res.status(400).json({ message: 'Admin ID is required' });
        }

        // Debug the validation checks
        const validationChecks = {
            first_name: Boolean(first_name),
            last_name: Boolean(last_name),
            email: Boolean(email),
            role: Boolean(role)
        };
        
        console.log('Validation checks:', validationChecks);

        // Modify validation to handle empty strings too
        if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !role?.trim()) {
            console.log('Validation failed: One or more required fields are missing or empty');
            return res.status(400).json({ 
                message: 'Required fields are missing or empty',
                validationErrors: {
                    first_name: !first_name?.trim() ? 'First name is required' : null,
                    last_name: !last_name?.trim() ? 'Last name is required' : null,
                    email: !email?.trim() ? 'Email is required' : null,
                    role: !role?.trim() ? 'Role is required' : null
                }
            });
        }

        const result = await Admin.updateAdmin(
            adminId, 
            first_name.trim(), 
            last_name.trim(), 
            email.trim(), 
            role.trim(), 
            profile_url, 
            profile_pic_file
        );
        
        return res.json({ 
            message: 'Admin details updated successfully',
            admin: result
        });
    } catch (error) {
        console.error('Update admin error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};




// Update Admin Password
const updatePassword = async (req, res) => {
    try {
        const adminId = req.params.id;
        const { newPassword } = req.body;

        if (!adminId || !newPassword) {
            return res.status(400).json({ message: 'Admin ID and new password are required' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await Admin.updatePassword(adminId, hashedPassword);
        return res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Update password error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        if (!adminId) {
            return res.status(400).json({ message: 'Admin ID is required' });
        }

        await Admin.deleteAdmin(adminId);
        return res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Delete admin error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.getAllAdmins();
        return res.json(admins);
    } catch (error) {
        console.error('Get all admins error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get admin profile
const getAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.id;
        const admin = await Admin.findById(adminId);
        
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const { id, first_name, last_name, email, role, profile_url } = admin;
        return res.json({ id, first_name, last_name, email, role, profile_url });
    } catch (error) {
        console.error('Get admin profile error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Forgot Password - Send OTP
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const userExists = await Admin.findUserByEmail(email);
        if (!userExists) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        const otp = generateOTP();
        otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 }); // 10 minutes expiry

        await sendOTPEmail(email, otp);
        return res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Verify OTP
const verifyOTP = (req, res) => {
    try {
        const { email, otp } = req.body;
        const record = otpStore.get(email);

        if (!record) {
            return res.status(400).json({ message: 'No OTP found' });
        }
        if (Date.now() > record.expires) {
            return res.status(400).json({ message: 'OTP expired' });
        }
        if (record.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        otpStore.delete(email);
        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Verify OTP error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Email and new password are required' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        
        const adminUpdated = await Admin.updateAdminPassword(email, hashedPassword);
        if (adminUpdated) {
            return res.status(200).json({ message: 'Password updated successfully' });
        }

        const customerUpdated = await Admin.updateCustomerPassword(email, hashedPassword);
        if (customerUpdated) {
            return res.status(200).json({ message: 'Password updated successfully' });
        }

        return res.status(404).json({ message: 'Email not found' });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    registerAdmin,
    loginUser,
    updateAdmin,
    updatePassword,
    deleteAdmin,
    getAllAdmins,
    getAdminProfile,
    forgotPassword,
    verifyOTP,
    resetPassword
};