// Validation for Admin Registration
const validateRegisterAdmin = (req, res, next) => {
    // Ensure req exists
    if (!req) {
        return res.status(500).json({ 
            message: 'Request object is undefined'
        });
    }
    
    // Check if req.body exists
    if (!req.body) {
        return res.status(400).json({ 
            message: 'Request body is missing. Make sure you have body-parser middleware properly configured.'
        });
    }
    
    const { first_name, last_name, email, username, password, role } = req.body;
    
    // Check if all required fields are provided
    if (!first_name || !last_name || !email || !username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Additional validations can be added here (e.g., email format, password length)
    next();
};

// Validation for Admin Login
const validateLogin = (req, res, next) => {
    // Ensure req exists
    if (!req) {
        return res.status(500).json({ 
            message: 'Request object is undefined'
        });
    }
    
    // Check if req.body exists
    if (!req.body) {
        return res.status(400).json({ 
            message: 'Request body is missing. Make sure you have body-parser middleware properly configured.'
        });
    }
    
    console.log('Request body:', req.body);
    
    const { username, password } = req.body;
    
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Additional validations for username or password format can be added here
    next();
};

module.exports = { validateRegisterAdmin, validateLogin };