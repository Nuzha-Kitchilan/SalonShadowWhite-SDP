// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const authenticateToken = (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
    
//     if (!token) {
//       return res.status(401).json({ error: 'Authentication required' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     req.user = {
//       id: decoded.id,
//       username: decoded.username,
//       role: decoded.role,
//       customer_ID: decoded.customer_ID // Adding customer ID to the request object
//     };
    
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// };


// const authenticateAdmin = (req, res, next) => {
//   try {
//     // 1. Extract token from Authorization header
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ 
//         error: 'Authentication required',
//         message: 'Bearer token missing in Authorization header'
//       });
//     }

//     const token = authHeader.split(' ')[1];
    
//     // 2. Verify token structure before decoding
//     if (!token || token.split('.').length !== 3) {
//       return res.status(401).json({ 
//         error: 'Invalid token',
//         message: 'Malformed JWT structure'
//       });
//     }

//     // 3. Verify and decode the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
//     // 4. Check token expiration manually (redundant but safe)
//     const currentTime = Math.floor(Date.now() / 1000);
//     if (decoded.exp && decoded.exp < currentTime) {
//       return res.status(401).json({ 
//         error: 'Expired token',
//         message: 'Token has expired'
//       });
//     }

//     // 5. Case-insensitive role check with additional validation
//     if (!decoded.role || decoded.role.toLowerCase() !== 'admin') {
//       return res.status(403).json({ 
//         error: 'Admin access required',
//         message: 'User role does not have admin privileges'
//       });
//     }

//     // 6. Attach complete user data to request
//     req.user = {
//       id: decoded.id,
//       username: decoded.username,
//       name: decoded.name,              // From improved JWT
//       profile_url: decoded.profile_url, // From improved JWT
//       role: decoded.role,
//       iat: decoded.iat,                // Issued at timestamp
//       exp: decoded.exp                 // Expiration timestamp
//     };
    
//     // 7. Proceed to the next middleware/route
//     next();
//   } catch (error) {
//     // Handle specific JWT errors differently
//     if (error instanceof jwt.JsonWebTokenError) {
//       return res.status(401).json({ 
//         error: 'Invalid token',
//         message: error.message
//       });
//     }
    
//     if (error instanceof jwt.TokenExpiredError) {
//       return res.status(401).json({ 
//         error: 'Expired token',
//         message: 'Token has expired. Please login again'
//       });
//     }

//     // Generic error fallback
//     console.error('Authentication error:', error);
//     return res.status(500).json({ 
//       error: 'Authentication failed',
//       message: 'An unexpected error occurred during authentication'
//     });
//   }
// };


// const authenticateCustomer = (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
    
//     if (!token) {
//       return res.status(401).json({ error: 'Authentication required' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Check if it's a customer token (either has customer_ID or role is customer)
//     if (!decoded.customer_ID && (!decoded.role || decoded.role.toLowerCase() !== 'customer')) {
//       return res.status(403).json({ error: 'Customer access required' });
//     }

//     req.user = {
//       id: decoded.id,
//       username: decoded.username,
//       role: decoded.role || 'customer', // Default to customer if role not specified
//       customer_ID: decoded.customer_ID
//     };
    
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// };

// module.exports = {
//   authenticateToken,    // General authentication (checks valid token)
//   authenticateAdmin,    // Strictly for admin users
//   authenticateCustomer, // Strictly for customer users
//   isAuthenticated: authenticateToken // Alias for backward compatibility
// };








// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
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

    // 5. Attach complete user data to request
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

// const authenticateCustomer = (req, res, next) => {
//   try {
//     // 1. Extract token from Authorization header
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ 
//         error: 'Authentication required',
//         message: 'Bearer token missing in Authorization header'
//       });
//     }

//     const token = authHeader.split(' ')[1];
    
//     // 2. Verify and decode the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
//     // 3. Check if it's a customer token
//     const role = decoded.role ? decoded.role.toLowerCase() : '';
//     if (!decoded.customer_ID && role !== 'customer') {
//       return res.status(403).json({ 
//         error: 'Customer access required',
//         message: 'User role does not have customer privileges'
//       });
//     }

//     // 4. Attach customer data to request
//     req.user = {
//       id: decoded.id,
//       username: decoded.username,
//       role: decoded.role || 'customer',
//       customer_ID: decoded.customer_ID,
//       name: decoded.name,
//       profile_url: decoded.profile_url
//     };
    
//     next();
//   } catch (error) {
//     // Handle specific JWT errors
//     if (error instanceof jwt.TokenExpiredError) {
//       return res.status(401).json({ 
//         error: 'Expired token',
//         message: 'Token has expired. Please login again'
//       });
//     }

//     return res.status(401).json({ 
//       error: 'Invalid token',
//       message: error.message
//     });
//   }
// };


// Enhanced Authentication Middleware
const authenticateCustomer = (req, res, next) => {
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
    
    // 2. Verify and decode the token
    // Use environment variable for secret key, with a fallback only for development
    const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-replace-in-production';
    
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // 3. Comprehensive token validation
    if (!decoded) {
      return res.status(403).json({ 
        error: 'Invalid token',
        message: 'Token could not be verified'
      });
    }

    // 4. Check token expiration (additional check)
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTimestamp) {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please log in again.'
      });
    }

    // 5. Validate customer-specific requirements
    if (!decoded.customer_ID) {
      return res.status(403).json({ 
        error: 'Customer access required',
        message: 'Invalid customer authentication'
      });
    }

    // 6. Attach decoded user information to request
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