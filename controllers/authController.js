


// const Admin = require('../models/adminModel');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt'); // Add this dependency
// const sendOTPEmail = require('../utils/mailer');



// // Number of salt rounds for bcrypt
// const SALT_ROUNDS = 10;

// // Admin Registration
// const registerAdmin = (req, res) => {
//     try {
//         const { first_name, last_name, email, username, password, role } = req.body;
//         // Use a default value for profile_url if it's not provided
//         const profile_url = req.body.profile_url || null;

//         // The validation is already handled by the middleware, so no need to call it again here

//         // Check if admin already exists by username or email
//         Admin.findByUsername(username)
//             .then(existingAdminByUsername => {
//                 if (existingAdminByUsername) {
//                     return res.status(409).json({ message: 'Username already exists' });
//                 }
                
//                 return Admin.findByEmail(email);
//             })
//             .then(existingAdminByEmail => {
//                 if (existingAdminByEmail) {
//                     return res.status(409).json({ message: 'Email already exists' });
//                 }
                
//                 // Hash the password before storing
//                 return bcrypt.hash(password, SALT_ROUNDS);
//             })
//             .then(hashedPassword => {
//                 // Create new admin with hashed password
//                 return Admin.createAdmin(
//                     first_name, 
//                     last_name, 
//                     email, 
//                     username, 
//                     hashedPassword, // Store the hashed password instead of plain text
//                     role, 
//                     profile_url
//                 );
//             })
//             .then(() => {
//                 return res.status(201).json({ message: 'Admin registered successfully' });
//             })
//             .catch(err => {
//                 console.error('Database error:', err);
//                 return res.status(500).json({ message: 'Database error', error: err.message });
//             });
//     } catch (error) {
//         console.error('Registration error:', error);
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// // Admin Login
// // const loginAdmin = async (req, res) => {
// //     try {
// //         console.log('Starting login process');
        
// //         if (!req.body) {
// //             console.log('Request body is missing');
// //             return res.status(400).json({ message: 'Request body is missing' });
// //         }
        
// //         console.log('Request body:', req.body);
        
// //         const { username, password } = req.body;
        
// //         if (!username || !password) {
// //             console.log('Missing required fields');
// //             return res.status(400).json({ message: 'Username and password are required' });
// //         }
        
// //         console.log('Looking up user:', username);
        
// //         // Find admin by username using async/await
// //         const admin = await Admin.findByUsername(username);
        
// //         console.log('Admin found:', admin ? true : false);
        
// //         if (!admin) {
// //             console.log('No admin found');
// //             return res.status(401).json({ message: 'Invalid credentials' });
// //         }

// //         console.log('Admin found, checking password');
        
// //         // Compare the provided password with the stored hash
// //         const passwordMatch = await bcrypt.compare(password, admin.password);
        
// //         if (!passwordMatch) {
// //             console.log('Password does not match');
// //             return res.status(401).json({ message: 'Invalid credentials' });
// //         }

// //         console.log('Password matches, creating token');
        
// //         try {
// //             const token = jwt.sign(
// //                 { id: admin.id, username: admin.username, role: admin.role },
// //                 process.env.JWT_SECRET || 'fallback_secret_key',
// //                 { expiresIn: '24h' }
// //             );

// //             console.log('Token created, sending response');
            
// //             return res.status(200).json({
// //                 token,
// //                 user: { id: admin.id, username: admin.username, role: admin.role },
// //                 message: 'Login successful',
// //             });
// //         } catch (tokenError) {
// //             console.error('JWT signing error:', tokenError);
// //             return res.status(500).json({ message: 'Error generating authentication token', error: tokenError.message });
// //         }
// //     } catch (error) {
// //         console.error('Login error:', error);
// //         return res.status(500).json({ message: 'Server error', error: error.message });
// //     }
// // };


// const loginAdmin = async (req, res) => {
//     try {
//         console.log('Starting login process');
        
//         if (!req.body) {
//             console.log('Request body is missing');
//             return res.status(400).json({ message: 'Request body is missing' });
//         }
        
//         console.log('Request body:', req.body);
        
//         const { username, password } = req.body;
        
//         if (!username || !password) {
//             console.log('Missing required fields');
//             return res.status(400).json({ message: 'Username and password are required' });
//         }
        
//         console.log('Looking up user:', username);
        
//         // Find admin by username using async/await
//         const admin = await Admin.findByUsername(username);
        
//         console.log('Admin found:', admin ? true : false);
        
//         if (!admin) {
//             console.log('No admin found');
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         console.log('Admin found, checking password');
        
//         // Compare the provided password with the stored hash
//         const passwordMatch = await bcrypt.compare(password, admin.password);
        
//         if (!passwordMatch) {
//             console.log('Password does not match');
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         console.log('Password matches, creating token');
        
//         try {
//             // Generate full name (first + last name)
//             const fullName = `${admin.first_name} ${admin.last_name}`;
            
//             // Create token with additional fields (name & profile_url)
//             const token = jwt.sign(
//                 { 
//                     id: admin.id, 
//                     username: admin.username, 
//                     name: fullName,          // Add full name
//                     profile_url: admin.profile_url,  // Add profile URL (if exists)
//                     role: admin.role 
//                 },
//                 process.env.JWT_SECRET || 'fallback_secret_key',
//                 { expiresIn: '24h' }
//             );

//             console.log('Token created, sending response');
            
//             return res.status(200).json({
//                 token,
//                 user: { 
//                     id: admin.id, 
//                     username: admin.username, 
//                     name: fullName,          // Also send in response
//                     profile_url: admin.profile_url,  // Also send in response
//                     role: admin.role 
//                 },
//                 message: 'Login successful',
//             });
//         } catch (tokenError) {
//             console.error('JWT signing error:', tokenError);
//             return res.status(500).json({ message: 'Error generating authentication token', error: tokenError.message });
//         }
//     } catch (error) {
//         console.error('Login error:', error);
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };


// // Update Admin Details (excluding password)
// const updateAdmin = async (req, res) => {
//     try {
//         const adminId = req.params.id;
//         const { first_name, last_name, email, role, profile_url } = req.body;

//         if (!adminId) {
//             return res.status(400).json({ message: 'Admin ID is required' });
//         }

//         try {
//             const result = await Admin.updateAdmin(adminId, first_name, last_name, email, role, profile_url);
//             return res.json({ message: 'Admin details updated successfully' });
//         } catch (err) {
//             return res.status(500).json({ message: 'Database error', error: err.message });
//         }
//     } catch (error) {
//         console.error('Update admin error:', error);
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// // Update Admin Password
// const updatePassword = async (req, res) => {
//     try {
//         const adminId = req.params.id;
//         const { newPassword } = req.body;

//         if (!adminId) {
//             return res.status(400).json({ message: 'Admin ID is required' });
//         }

//         // Validate new password
//         if (!newPassword) {
//             return res.status(400).json({ message: 'New password is required' });
//         }

//         try {
//             // Hash the new password before updating
//             const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
//             const result = await Admin.updatePassword(adminId, hashedPassword);
//             return res.json({ message: 'Password updated successfully' });
//         } catch (err) {
//             return res.status(500).json({ message: 'Database error', error: err.message });
//         }
//     } catch (error) {
//         console.error('Update password error:', error);
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// // Delete Admin
// const deleteAdmin = async (req, res) => {
//     try {
//         const adminId = req.params.id;

//         if (!adminId) {
//             return res.status(400).json({ message: 'Admin ID is required' });
//         }

//         try {
//             const result = await Admin.deleteAdmin(adminId);
//             return res.json({ message: 'Admin deleted successfully' });
//         } catch (err) {
//             return res.status(500).json({ message: 'Database error', error: err.message });
//         }
//     } catch (error) {
//         console.error('Delete admin error:', error);
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// // Get all admins
// const getAllAdmins = async (req, res) => {
//     try {
//         try {
//             const admins = await Admin.getAllAdmins();
//             return res.json(admins);
//         } catch (err) {
//             return res.status(500).json({ message: 'Database error', error: err.message });
//         }
//     } catch (error) {
//         console.error('Get all admins error:', error);
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// // Add to authController.js
// const getAdminProfile = async (req, res) => {
//     try {
//       // req.user is set by verifyToken middleware
//       const adminId = req.user.id;
//       const admin = await Admin.findById(adminId);
      
//       if (!admin) {
//         return res.status(404).json({ message: 'Admin not found' });
//       }
  
//       // Return only necessary fields (exclude password)
//       const { id, first_name, last_name, email, role, profile_url } = admin;
//       res.json({ id, first_name, last_name, email, role, profile_url });
//     } catch (error) {
//       console.error('Get admin profile error:', error);
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   };


  


//   const otpStore = new Map();
//   const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
  
//   // Forgot Password - Send OTP
//   const forgotPassword = async (req, res) => {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ message: 'Email is required.' });
  
//     try {
//       const userExists = await findUserByEmail(email);
//       if (!userExists) return res.status(404).json({ message: 'No account found with this email.' });
  
//       const otp = generateOTP();
//       otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });
  
//       await sendOTPEmail(email, otp);
//       return res.status(200).json({ message: 'OTP sent to your email.' });
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Server error sending OTP.' });
//     }
//   };
  
//   // Verify OTP
//   const verifyOTP = (req, res) => {
//     const { email, otp } = req.body;
//     const record = otpStore.get(email);
  
//     if (!record) return res.status(400).json({ message: 'No OTP found.' });
//     if (Date.now() > record.expires) return res.status(400).json({ message: 'OTP expired.' });
//     if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP.' });
  
//     otpStore.delete(email);
//     return res.status(200).json({ message: 'OTP verified successfully. You may now reset your password.' });
//   };
  
//   // Reset Password
//   const resetPassword = async (req, res) => {
//     const { email, newPassword } = req.body;
  
//     try {
//       const adminUpdated = await updateAdminPassword(email, newPassword);
//       if (adminUpdated) return res.status(200).json({ message: 'Admin password updated.' });
  
//       const customerUpdated = await updateCustomerPassword(email, newPassword);
//       if (customerUpdated) return res.status(200).json({ message: 'Customer password updated.' });
  
//       return res.status(404).json({ message: 'Email not found.' });
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Error updating password.' });
//     }
//   };
  
 
  

// module.exports = {
//     registerAdmin,
//     loginAdmin,
//     updateAdmin,
//     updatePassword,
//     deleteAdmin,
//     getAllAdmins,
//     getAdminProfile,
//     forgotPassword,
//     verifyOTP,
//     resetPassword,
    
// };



















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

// Admin Login
// const loginAdmin = async (req, res) => {
//     try {
//         const { username, password } = req.body;
        
//         if (!username || !password) {
//             return res.status(400).json({ message: 'Username and password are required' });
//         }

//         const admin = await Admin.findByUsername(username);
//         if (!admin) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         const passwordMatch = await bcrypt.compare(password, admin.password);
//         if (!passwordMatch) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         const fullName = `${admin.first_name} ${admin.last_name}`;
//         const token = jwt.sign(
//             { 
//                 id: admin.id, 
//                 username: admin.username, 
//                 name: fullName,
//                 profile_url: admin.profile_url,
//                 role: admin.role 
//             },
//             process.env.JWT_SECRET || 'fallback_secret_key',
//             { expiresIn: '24h' }
//         );

//         return res.status(200).json({
//             token,
//             user: { 
//                 id: admin.id, 
//                 username: admin.username, 
//                 name: fullName,
//                 profile_url: admin.profile_url,
//                 role: admin.role 
//             },
//             message: 'Login successful',
//         });
//     } catch (error) {
//         console.error('Login error:', error);
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };



const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Try admin first
        let user = await Admin.findByUsername(username);
        let userType = 'admin';

        if (!user) {
            // Try stylist if admin not found
            user = await Stylist.findStylistByUsername(username);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            userType = user.role || 'stylist';
        }

        // Debugging log (remove in production)
        console.log('User found:', user);

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
            profile_url: user.profile_url || null
        };

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



// Update Admin Details
const updateAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const { first_name, last_name, email, role, profile_url } = req.body;

        if (!adminId) {
            return res.status(400).json({ message: 'Admin ID is required' });
        }

        await Admin.updateAdmin(adminId, first_name, last_name, email, role, profile_url);
        return res.json({ message: 'Admin details updated successfully' });
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