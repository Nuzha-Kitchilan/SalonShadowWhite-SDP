const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const customerModel = require("../models/customerModel"); // Import customer model
const SECRET_KEY = "your-secret-key"; // Replace with a more secure secret key for JWT

// Register Customer (Create Account)
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
    const token = jwt.sign({ customer_ID: customer.customer_ID, username: customer.username }, SECRET_KEY, {
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

    res.json(customer);
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


module.exports = {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  getCustomerProfile,
  authenticateToken,
  createWalkInCustomer
};
