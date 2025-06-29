const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Bearer token missing in Authorization header'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token structure before decoding
    if (!token || token.split('.').length !== 3) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Malformed JWT structure'
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
    // Check token expiration manually 
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return res.status(401).json({ 
        error: 'Expired token',
        message: 'Token has expired'
      });
    }

    // Attach complete user data to request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      name: decoded.name,
      profile_url: decoded.profile_url,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: error.message
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        error: 'Expired token',
        message: 'Token has expired. Please login again'
      });
    }

    // Generic error fallback
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      message: 'An unexpected error occurred during authentication'
    });
  }
};

const authenticateAdmin = (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Bearer token missing in Authorization header'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // 2. Verify token structure before decoding
    if (!token || token.split('.').length !== 3) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Malformed JWT structure'
      });
    }

    // 3. Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
    // 4. Check token expiration manually (redundant but safe)
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return res.status(401).json({ 
        error: 'Expired token',
        message: 'Token has expired'
      });
    }

    const userRole = decoded.role ? decoded.role.toLowerCase() : '';
    if (userRole !== 'admin') {
      console.log(`Admin access denied. Role in token: "${decoded.role}", lowercase: "${userRole}"`);
      return res.status(403).json({ 
        error: 'Admin access required',
        message: 'User role does not have admin privileges'
      });
    }

    // 6. Attach complete user data to request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      name: decoded.name,
      profile_url: decoded.profile_url,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp
    };
    
    next();
  } catch (error) {
    // Handle specific JWT errors differently
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: error.message
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        error: 'Expired token',
        message: 'Token has expired. Please login again'
      });
    }

    // Generic error fallback
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      message: 'An unexpected error occurred during authentication'
    });
  }
};


// Enhanced Authentication Middleware
const authenticateCustomer = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Bearer token missing in Authorization header'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify and decode the token
    const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-replace-in-production';
    
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Comprehensive token validation
    if (!decoded) {
      return res.status(403).json({ 
        error: 'Invalid token',
        message: 'Token could not be verified'
      });
    }

    // Check token expiration 
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTimestamp) {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please log in again.'
      });
    }

    // Validate customer-specific requirements
    if (!decoded.customer_ID) {
      return res.status(403).json({ 
        error: 'Customer access required',
        message: 'Invalid customer authentication'
      });
    }

    // Attach decoded user information to request
    req.user = {
      id: decoded.customer_ID,
      username: decoded.username,
      role: decoded.role || 'customer',
      email: decoded.email
    };
    
    next();
  } catch (error) {
    // Detailed error handling
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please log in again.'
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'The provided token is invalid.'
      });
    }

    // Catch-all for other unexpected errors
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      message: 'An unexpected error occurred during authentication.'
    });
  }
};

module.exports = {
  authenticateToken,
  authenticateAdmin,
  authenticateCustomer
};