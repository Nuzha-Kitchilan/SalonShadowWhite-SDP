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
const upload = require('../config/multer'); 



// Register Admin with Validation Middleware
router.post('/register', validateRegisterAdmin, registerAdmin);

// Login Admin with Validation Middleware
router.post('/login', validateLogin, loginUser);

router.put(
  '/update/:id',
  verifyToken,        
  upload.single('profile_picture'), 
  updateAdmin         
);

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