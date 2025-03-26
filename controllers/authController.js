{/* const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();
const mysql = require('mysql2');

// Admin Registration
const registerAdmin = (req, res) => {
    console.log('Registration attempt:', req.body);
    const { first_name, last_name, email, username, password, role } = req.body;
    
    if (!first_name || !last_name || !email || !username || !password || !role) {
        console.log('Registration failed: Missing required fields');
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    const sql = 'INSERT INTO admins (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [first_name + ' ' + last_name, email, username, password, role], (error, result) => {
        if (error) {
            console.error('Registration database error:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Username or email already exists' });
            }
            return res.status(500).json({ message: 'Database error', error: error.message });
        }
        console.log('Admin registered successfully:', username);
        res.status(201).json({ message: 'Admin registered successfully' });
    });
};

// Admin Login
const loginAdmin = async (req, res) => {
    console.log('Login attempt:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
        console.log('Login failed: Missing credentials');
        return res.status(400).json({ message: 'Username and password are required' });
    }
    
    console.log('Checking database for user:', username);
    const sql = 'SELECT * FROM admins WHERE username = ?';
    console.log('Preparing to query database');
    
    try {
        const [results] = await db.query(sql, [username]);
        console.log('Database query executed');
        
        if (results.length === 0) {
            console.log('Login failed: User not found');
            return res.status(401).json({ message: 'Admin not found' });
        }
        
        const admin = results[0];
        console.log('User found, validating password');
        
        // Direct password comparison (use hashed password for production)
        if (admin.password !== password) {
            console.log('Login failed: Invalid password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        try {
            // Check if JWT_SECRET is properly set
            if (!process.env.JWT_SECRET) {
                console.error('JWT_SECRET is missing in environment variables');
                return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing' });
            }
            
            console.log('Credentials valid, generating token');
            // Generate JWT token
            const token = jwt.sign(
                { id: admin.id, username: admin.username, role: admin.role }, 
                process.env.JWT_SECRET,
                { expiresIn: '24h' } // Extended token lifetime for testing
            );
            
            console.log('Token generated successfully');
            // Send the token and user details to the client
            return res.json({ 
                token, 
                user: { 
                    id: admin.id, 
                    username: admin.username, 
                    role: admin.role 
                },
                message: 'Login successful'
            });
        } catch (jwtError) {
            console.error('JWT generation error:', jwtError);
            return res.status(500).json({ message: 'Token generation failed', error: jwtError.message });
        }
    } catch (error) {
        console.error('Login database error:', error);
        return res.status(500).json({ message: 'Database error', error: error.message });
    }
};


// Token validation middleware
const verifyToken = (req, res, next) => {
    console.log('Verifying token from request');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        console.log('Token verification failed: No token provided');
        return res.status(403).json({ message: 'No token provided' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        console.log('Token verified successfully for user:', decoded.username);
        req.user = decoded;
        next();
    });
};

// Test route to check if authentication is working
const getProtectedData = (req, res) => {
    console.log('Protected route accessed by:', req.user.username);
    res.json({ 
        message: 'This is a protected route', 
        user: req.user,
        timestamp: new Date().toISOString()
    });
};

module.exports = { registerAdmin, loginAdmin, verifyToken, getProtectedData }; */}


{/*const db = require('../config/db');  // Import the db connection file
const jwt = require('jsonwebtoken');
const { validateRegisterAdmin, validateLoginAdmin } = require('../middleware/validationMiddleware');

// Admin Registration
const registerAdmin = (req, res) => {
    const { first_name, last_name, email, username, password, role } = req.body;
    const sql = 'INSERT INTO admins (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [first_name + ' ' + last_name, email, username, password, role], (error, result) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Username or email already exists' });
            }
            return res.status(500).json({ message: 'Database error', error: error.message });
        }
        res.status(201).json({ message: 'Admin registered successfully' });
    });
};

// Admin Login
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM admins WHERE username = ?';
    
    try {
        const [results] = await db.query(sql, [username]);
        
        if (results.length === 0) {
            return res.status(401).json({ message: 'Admin not found' });
        }
        
        const admin = results[0];
        
        if (admin.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: admin.id, username: admin.username, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        return res.json({ token, user: { id: admin.id, username: admin.username, role: admin.role }, message: 'Login successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Database error', error: error.message });
    }
};


module.exports = { registerAdmin, loginAdmin }; */}



// const Admin = require('../models/adminModel');
// const jwt = require('jsonwebtoken');

// // Admin Registration
// // In authController.js, modify the registration function:
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
                
//                 // Create new admin with all required values
//                 return Admin.createAdmin(
//                     first_name, 
//                     last_name, 
//                     email, 
//                     username, 
//                     password, 
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
//         if (admin.password !== password) {
//             console.log('Password does not match');
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         console.log('Password matches, creating token');
        
//         try {
//             const token = jwt.sign(
//                 { id: admin.id, username: admin.username, role: admin.role },
//                 process.env.JWT_SECRET || 'fallback_secret_key',
//                 { expiresIn: '24h' }
//             );

//             console.log('Token created, sending response');
            
//             return res.status(200).json({
//                 token,
//                 user: { id: admin.id, username: admin.username, role: admin.role },
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
//             const result = await Admin.updatePassword(adminId, newPassword);
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

// module.exports = {
//     registerAdmin,
//     loginAdmin,
//     updateAdmin,
//     updatePassword,
//     deleteAdmin,
//     getAllAdmins,
// };


const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Add this dependency

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

// Admin Registration
const registerAdmin = (req, res) => {
    try {
        const { first_name, last_name, email, username, password, role } = req.body;
        // Use a default value for profile_url if it's not provided
        const profile_url = req.body.profile_url || null;

        // The validation is already handled by the middleware, so no need to call it again here

        // Check if admin already exists by username or email
        Admin.findByUsername(username)
            .then(existingAdminByUsername => {
                if (existingAdminByUsername) {
                    return res.status(409).json({ message: 'Username already exists' });
                }
                
                return Admin.findByEmail(email);
            })
            .then(existingAdminByEmail => {
                if (existingAdminByEmail) {
                    return res.status(409).json({ message: 'Email already exists' });
                }
                
                // Hash the password before storing
                return bcrypt.hash(password, SALT_ROUNDS);
            })
            .then(hashedPassword => {
                // Create new admin with hashed password
                return Admin.createAdmin(
                    first_name, 
                    last_name, 
                    email, 
                    username, 
                    hashedPassword, // Store the hashed password instead of plain text
                    role, 
                    profile_url
                );
            })
            .then(() => {
                return res.status(201).json({ message: 'Admin registered successfully' });
            })
            .catch(err => {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error', error: err.message });
            });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Admin Login
const loginAdmin = async (req, res) => {
    try {
        console.log('Starting login process');
        
        if (!req.body) {
            console.log('Request body is missing');
            return res.status(400).json({ message: 'Request body is missing' });
        }
        
        console.log('Request body:', req.body);
        
        const { username, password } = req.body;
        
        if (!username || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ message: 'Username and password are required' });
        }
        
        console.log('Looking up user:', username);
        
        // Find admin by username using async/await
        const admin = await Admin.findByUsername(username);
        
        console.log('Admin found:', admin ? true : false);
        
        if (!admin) {
            console.log('No admin found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('Admin found, checking password');
        
        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, admin.password);
        
        if (!passwordMatch) {
            console.log('Password does not match');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('Password matches, creating token');
        
        try {
            const token = jwt.sign(
                { id: admin.id, username: admin.username, role: admin.role },
                process.env.JWT_SECRET || 'fallback_secret_key',
                { expiresIn: '24h' }
            );

            console.log('Token created, sending response');
            
            return res.status(200).json({
                token,
                user: { id: admin.id, username: admin.username, role: admin.role },
                message: 'Login successful',
            });
        } catch (tokenError) {
            console.error('JWT signing error:', tokenError);
            return res.status(500).json({ message: 'Error generating authentication token', error: tokenError.message });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Admin Details (excluding password)
const updateAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const { first_name, last_name, email, role, profile_url } = req.body;

        if (!adminId) {
            return res.status(400).json({ message: 'Admin ID is required' });
        }

        try {
            const result = await Admin.updateAdmin(adminId, first_name, last_name, email, role, profile_url);
            return res.json({ message: 'Admin details updated successfully' });
        } catch (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
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

        if (!adminId) {
            return res.status(400).json({ message: 'Admin ID is required' });
        }

        // Validate new password
        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        try {
            // Hash the new password before updating
            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            const result = await Admin.updatePassword(adminId, hashedPassword);
            return res.json({ message: 'Password updated successfully' });
        } catch (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
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

        try {
            const result = await Admin.deleteAdmin(adminId);
            return res.json({ message: 'Admin deleted successfully' });
        } catch (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
    } catch (error) {
        console.error('Delete admin error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        try {
            const admins = await Admin.getAllAdmins();
            return res.json(admins);
        } catch (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
    } catch (error) {
        console.error('Get all admins error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    registerAdmin,
    loginAdmin,
    updateAdmin,
    updatePassword,
    deleteAdmin,
    getAllAdmins,
};