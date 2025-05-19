const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const customerModel = require("../models/customerModel"); // Import customer model
//const SECRET_KEY = "your-secret-key"; // Replace with a more secure secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET; // ✅ from .env



// Register Customer (Create Account)
// async function registerCustomer(req, res) {
//     try {
//       const { firstname, lastname, email, username, password, phoneNumbers = [] } = req.body;
      
//       // Validate required fields
//       if (!firstname || !lastname || !email || !username || !password) {
//         return res.status(400).json({ message: "All fields are required" });
//       }
      
//       // Validate email format
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         return res.status(400).json({ message: "Invalid email format" });
//       }
      
//       // Check if username already exists
//       const existingUser = await customerModel.getCustomerByUsername(username);
//       if (existingUser) {
//         return res.status(400).json({ message: "Username already taken" });
//       }
      
//       // Check if email already exists
//       const existingEmail = await customerModel.getCustomerByEmail(email);
//       if (existingEmail) {
//         return res.status(400).json({ message: "Email already registered" });
//       }
      
//       // Validate phone numbers if provided
//       if (phoneNumbers && !Array.isArray(phoneNumbers)) {
//         return res.status(400).json({ message: "Phone numbers must be an array" });
//       }
      
//       // Hash password
//       const hashedPassword = await bcrypt.hash(password, 10);
      
//       // Create new customer and insert phone numbers
//       const result = await customerModel.createCustomer(
//         firstname,
//         lastname,
//         email,
//         username,
//         hashedPassword,
//         phoneNumbers
//       );
      
//       res.status(201).json({ message: "Customer registered successfully", customerId: result.customerId });
//     } catch (err) {
//       console.error("Registration error:", {
//         message: err.message,
//         stack: err.stack
//       });
//       res.status(500).json({ error: "Registration failed. Please try again later." });
//     }
//   }
  


async function registerCustomer(req, res) {
    try {
      const { firstname, lastname, email, username, password, phoneNumbers = [] } = req.body;
      
      // Validate required fields
      if (!firstname || !lastname || !email || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      // Username validation
      if (username.length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters long" });
      }
      
      // Additional username validation - alphanumeric with underscores only
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: "Username can only contain letters, numbers, and underscores" });
      }
      
      
      
      // Check if username already exists
      const existingUser = await customerModel.getCustomerByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Check if email already exists
      const existingEmail = await customerModel.getCustomerByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Validate phone numbers if provided
      if (phoneNumbers && !Array.isArray(phoneNumbers)) {
        return res.status(400).json({ message: "Phone numbers must be an array" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new customer and insert phone numbers
      const result = await customerModel.createCustomer(
        firstname,
        lastname,
        email,
        username,
        hashedPassword,
        phoneNumbers
      );
      
      res.status(201).json({ message: "Customer registered successfully", customerId: result.customerId });
    } catch (err) {
      console.error("Registration error:", {
        message: err.message,
        stack: err.stack
      });
      res.status(500).json({ error: "Registration failed. Please try again later." });
    }
  }


// Login Customer (Generate JWT)
async function loginCustomer(req, res) {
  const { username, password } = req.body;

  try {
    // Check if customer exists
    const customer = await customerModel.getCustomerByUsername(username);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ customer_ID: customer.customer_ID, role: 'customer', username: customer.username }, SECRET_KEY, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Logout Customer (Invalidate token)
async function logoutCustomer(req, res) {
  // In a stateless JWT implementation, logout is handled on the client side (by deleting the token)
  // However, here we can implement token invalidation on server side by maintaining a blacklist (optional)

  res.json({ message: "Logout successful" });
}

// Get Customer Profile (Requires authentication)
async function getCustomerProfile(req, res) {
  try {
    const customer = await customerModel.getCustomerById(req.customer_ID);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Ensure phoneNumbers is always an array
    const responseData = {
      ...customer,
      phoneNumbers: customer.phoneNumbers || []
    };

    res.json(responseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const token = req.header("Authorization") && req.header("Authorization").split(" ")[1]; // Get token from Authorization header

  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.customer_ID = decoded.customer_ID; // Add customer ID to request object for further use
    next();
  });
}


const createWalkInCustomer = async (req, res) => {
  try {
    const { firstname, lastname, email, phoneNumbers, isWalkIn } = req.body;

    const username = `walkin_${Math.random().toString(36).substring(2, 10)}`;
    const password = Math.random().toString(36).substring(2, 12);

    const customer = await customerModel.createCustomer(
      firstname,
      lastname,
      email,
      username,
      password,
      phoneNumbers,
      isWalkIn
    );

    res.json({ success: true, customer });
  } catch (error) {
    console.error('Error creating walk-in customer:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update Customer Profile (Requires authentication)
// async function updateProfile(req, res) {
//   try {
//     const customer_ID = req.customer_ID; // From authenticateToken middleware
//     const { firstname, lastname, email, username, phoneNumbers = [] } = req.body;
    
//     // Debug log
//     console.log("Updating profile for customer:", customer_ID);
//     console.log("Request data:", { firstname, lastname, email, username, phoneNumbersLength: phoneNumbers?.length });
    
//     // Validate required fields
//     if (!firstname || !lastname || !email || !username) {
//       return res.status(400).json({ message: "Name, email, and username are required" });
//     }
    
//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }
    
//     // Check if username is taken by another user
//     const existingUser = await customerModel.getCustomerByUsername(username);
    
//     console.log("Username uniqueness check:", {
//       existingUser: existingUser ? {
//         id: existingUser.customer_ID,
//         username: existingUser.username,
//         type: typeof existingUser.customer_ID
//       } : null,
//       currentUser: {
//         id: customer_ID,
//         type: typeof customer_ID
//       }
//     });
    
//     // Fixed comparison - ensure both are numbers
//     if (existingUser && Number(existingUser.customer_ID) !== Number(customer_ID)) {
//       return res.status(400).json({ 
//         message: "Username already taken by another user",
//         debug: {
//           existingId: existingUser.customer_ID,
//           currentId: customer_ID
//         }
//       });
//     }
    
//     // Check if email is taken by another user
//     const existingEmail = await customerModel.getCustomerByEmail(email);
    
//     if (existingEmail && Number(existingEmail.customer_ID) !== Number(customer_ID)) {
//       return res.status(400).json({ message: "Email already registered to another account" });
//     }
    
//     // Update customer profile
//     await customerModel.updateCustomerProfile(customer_ID, {
//       firstname,
//       lastname,
//       email,
//       username,
//       phoneNumbers
//     });
    
//     res.json({ 
//       message: "Profile updated successfully",
//       updatedFields: { firstname, lastname, email, username }
//     });
    
//   } catch (err) {
//     console.error("Profile update error:", {
//       message: err.message,
//       stack: err.stack
//     });
//     res.status(500).json({ 
//       error: "Profile update failed. Please try again later.",
//       details: err.message
//     });
//   }
// }


async function updateProfile (req, res) {
  try {
    // Log request body to debug
    console.log('Updating profile for customer:', req.customer_ID);
    console.log('Raw request body:', req.body);
    
    // Fix phoneNumbersLength issue by ensuring we have the actual phoneNumbers array
    if (req.body.phoneNumbersLength !== undefined && !req.body.phoneNumbers) {
      req.body.phoneNumbers = [];
      delete req.body.phoneNumbersLength;
    }
    
    // Ensure phoneNumbers is an array
    if (!Array.isArray(req.body.phoneNumbers)) {
      req.body.phoneNumbers = req.body.phoneNumbers ? [req.body.phoneNumbers] : [];
    }
    
    console.log('Processed request data:', req.body);
    console.log('Phone numbers array:', req.body.phoneNumbers);
    
    // Check username uniqueness except for current user
    if (req.body.username) {
      const existingUser = await customerModel.getCustomerByUsername(req.body.username);
      if (existingUser && existingUser.customer_ID !== req.customer_ID) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      console.log('Username uniqueness check:', {
        existingUser: existingUser ? { id: existingUser.customer_ID, username: existingUser.username, type: typeof existingUser.customer_ID } : null,
        currentUser: { id: req.customer_ID, type: typeof req.customer_ID }
      });
    }
    
    // We need to ensure the customer_ID from auth is passed to the model function
    await customerModel.updateCustomerProfile(req.customer_ID, req.body);
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.log('Profile update error:', error);
    res.status(500).json({ message: error.message });
  }
};






// Change Customer Password (Requires authentication)
async function changePassword(req, res) {
  try {
    console.log("Attempting password change for customer:", {
  customer_ID: req.customer_ID,
  type: typeof req.customer_ID
});

      if (!req.customer_ID) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }
    const customer_ID = req.customer_ID; // From authenticateToken middleware
    const { currentPassword, newPassword } = req.body;
    
    // Validate password fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }
    
    // Password strength validation
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters long" });
    }
    
    // Get customer to verify current password
    const customer = await customerModel.getCustomerById(customer_ID);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await customerModel.updateCustomerPassword(customer_ID, hashedPassword);
    
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Password change error:", {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ error: "Password change failed. Please try again later." });
  }
}



async function getCustomers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    const result = await customerModel.getAllCustomers(page, limit, search);
    
    res.json(result);
  } catch (err) {
    console.error("Error in getCustomers controller:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to retrieve customers", 
      error: err.message 
    });
  }
}


async function getCustomerDetails(req, res) {
  try {
    const customerId = req.params.id;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required"
      });
    }

    const customer = await customerModel.getCustomerDetailById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    // Ensure appointmentCount exists, default to 0 if missing
    customer.appointmentCount = customer.appointmentCount !== undefined 
      ? Number(customer.appointmentCount) 
      : 0;

    console.log("Customer being sent to frontend:", JSON.stringify(customer, null, 2));

    delete customer.password;

    res.json({
      success: true,
      customer
    });

  } catch (err) {
    console.error("Error in getCustomerDetails controller:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve customer details",
      error: err.message
    });
  }
}


// Update customer
async function updateCustomer(req, res) {
  try {
    const customerId = req.params.id;
    const { firstname, lastname, email, username, phoneNumbers } = req.body;
    
    // Validate required fields
    if (!firstname || !lastname || !email || !username) {
      return res.status(400).json({ 
        success: false, 
        message: "First name, last name, email and username are required" 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format" 
      });
    }
    
    await customerModel.updateCustomer(customerId, {
      firstname,
      lastname,
      email,
      username,
      phoneNumbers: Array.isArray(phoneNumbers) ? phoneNumbers : []
    });
    
    res.json({
      success: true,
      message: "Customer updated successfully"
    });
  } catch (err) {
    console.error("Error in updateCustomer controller:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update customer", 
      error: err.message 
    });
  }
}

// Reset customer password
async function resetCustomerPassword(req, res) {
  try {
    const customerId = req.params.id;
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: "New password must be at least 8 characters long" 
      });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await customerModel.resetCustomerPassword(customerId, hashedPassword);
    
    res.json({
      success: true,
      message: "Customer password reset successfully"
    });
  } catch (err) {
    console.error("Error in resetCustomerPassword controller:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to reset customer password", 
      error: err.message 
    });
  }
}

// Delete customer
async function deleteCustomer(req, res) {
  try {
    const customerId = req.params.id;
    
    await customerModel.deleteCustomer(customerId);
    
    res.json({
      success: true,
      message: "Customer deleted successfully"
    });
  } catch (err) {
    console.error("Error in deleteCustomer controller:", err);
    
    // Check for specific error message about appointments
    if (err.message.includes("appointments")) {
      return res.status(400).json({ 
        success: false, 
        message: err.message
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete customer", 
      error: err.message 
    });
  }
}

// Get customer's appointment history
async function getCustomerAppointments(req, res) {
  try {
    const customerId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!customerId) {
      return res.status(400).json({ 
        success: false, 
        message: "Customer ID is required" 
      });
    }
    
    const result = await customerModel.getCustomerAppointments(customerId, page, limit);
    
    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error("Error in getCustomerAppointments controller:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to retrieve customer appointments", 
      error: err.message 
    });
  }
}


module.exports = {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  getCustomerProfile,
  authenticateToken,
  createWalkInCustomer,
  updateProfile,
  changePassword,
  getCustomers,
  getCustomerDetails,
  updateCustomer,
  resetCustomerPassword,
  deleteCustomer,
  getCustomerAppointments
};
