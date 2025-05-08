{/*const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/authController');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

module.exports = router; */}

// const express = require('express');
// const router = express.Router();
// const { validateRegisterAdmin, validateLoginAdmin } = require('../middleware/validationMiddleware');
// const { registerAdmin, loginAdmin } = require('../controllers/authController');
// const verifyToken = require('../middleware/verifyToken');

// // Register Admin with Validation Middleware
// router.post('/register', validateRegisterAdmin, registerAdmin);

// // Login Admin with Validation Middleware
// router.post('/login', validateLoginAdmin, loginAdmin);

// // Protected Route Example
// router.get('/protected', verifyToken, (req, res) => {
//     res.json({ message: 'This is a protected route', user: req.user });
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { 
  validateRegisterAdmin, 
  validateLogin 
} = require('../middleware/validationMiddleware');
const { 
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
} = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');



// Register Admin with Validation Middleware
router.post('/register', validateRegisterAdmin, registerAdmin);

// Login Admin with Validation Middleware
router.post('/login', validateLogin, loginUser);

// Update Admin details (excluding password)
router.put('/update/:id', verifyToken, updateAdmin);

// Update Admin password
router.put('/update-password/:id', verifyToken, updatePassword);

// Delete Admin
router.delete('/delete/:id', verifyToken, deleteAdmin);

// Get all admins (protected route)
router.get('/admins', verifyToken, getAllAdmins);

// Get admin profile
router.get('/profile', verifyToken, getAdminProfile);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Protected Route Example
router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;