// const jwt = require('jsonwebtoken');
// const SpecialRequest = require('../models/SpecialRequestModel');

// // Use decode instead of verify
// exports.getCustomerRequests = async (req, res) => {
//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Authentication required' 
//             });
//         }

//         const token = authHeader.split(' ')[1];
        
//         try {
//             // Decode token without verification
//             const decoded = jwt.decode(token);
            
//             if (!decoded || !decoded.customer_ID) {
//                 return res.status(401).json({
//                     success: false,
//                     message: 'Invalid token format'
//                 });
//             }
            
//             const customerId = decoded.customer_ID;
//             const requests = await SpecialRequest.getByCustomerId(customerId);

//             return res.status(200).json({
//                 success: true,
//                 requests
//             });
//         } catch (jwtError) {
//             console.error('JWT decoding error:', jwtError);
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid token'
//             });
//         }
//     } catch (error) {
//         console.error('Error fetching customer requests:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch customer requests'
//         });
//     }
// };

// exports.getCustomerInfo = async (req, res) => {
//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(200).json({ 
//                 success: false, 
//                 isAuthenticated: false,
//                 message: 'No token provided' 
//             });
//         }

//         const token = authHeader.split(' ')[1];
        
//         try {
//             // Decode token without verification
//             const decoded = jwt.decode(token);
            
//             if (!decoded || !decoded.customer_ID) {
//                 return res.status(200).json({
//                     success: false,
//                     isAuthenticated: false,
//                     message: 'Invalid token format'
//                 });
//             }
            
//             const customerId = decoded.customer_ID;
            
//             // Since your token doesn't contain user info, we need to fetch from DB
//             const customerInfo = await SpecialRequest.getCustomerInfo(customerId);

//             if (!customerInfo) {
//                 return res.status(200).json({ 
//                     success: false, 
//                     isAuthenticated: true,
//                     message: 'Customer not found' 
//                 });
//             }

//             return res.status(200).json({
//                 success: true,
//                 isAuthenticated: true,
//                 data: customerInfo
//             });
//         } catch (jwtError) {
//             console.error('JWT decoding error:', jwtError);
//             return res.status(200).json({ 
//                 success: false, 
//                 isAuthenticated: false,
//                 message: 'Invalid token' 
//             });
//         }
//     } catch (error) {
//         console.error('Error fetching customer info:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch customer information'
//         });
//     }
// };

// exports.submitRequest = async (req, res) => {
//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Authentication required' 
//             });
//         }

//         const token = authHeader.split(' ')[1];
        
//         try {
//             // Decode token without verification
//             const decoded = jwt.decode(token);
            
//             if (!decoded || !decoded.customer_ID) {
//                 return res.status(401).json({
//                     success: false,
//                     message: 'Invalid token format'
//                 });
//             }
            
//             const customerId = decoded.customer_ID;
            
//             // Get request details from request body
//             const { request_details } = req.body;
            
//             if (!request_details) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Request details are required'
//                 });
//             }
            
//             // Get customer info for the special request
//             const customerInfo = await SpecialRequest.getCustomerInfo(customerId);
            
//             if (!customerInfo) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Customer not found'
//                 });
//             }
            
//             // Create the special request
//             const requestId = await SpecialRequest.create({
//                 customer_id: customerId,
//                 first_name: customerInfo.first_name,
//                 last_name: customerInfo.last_name,
//                 email: customerInfo.email,
//                 phone_number: customerInfo.phone_number,
//                 request_details
//             });
            
//             return res.status(201).json({
//                 success: true,
//                 message: 'Special request submitted successfully',
//                 request_id: requestId
//             });
            
//         } catch (jwtError) {
//             console.error('JWT decoding error:', jwtError);
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid token'
//             });
//         }
//     } catch (error) {
//         console.error('Error submitting special request:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to submit special request'
//         });
//     }
// };













const jwt = require('jsonwebtoken');
const SpecialRequest = require('../models/SpecialRequestModel');

// Use decode instead of verify
exports.getCustomerRequests = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        const token = authHeader.split(' ')[1];
        
        try {
            // Decode token without verification
            const decoded = jwt.decode(token);
            
            if (!decoded || !decoded.customer_ID) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token format'
                });
            }
            
            const customerId = decoded.customer_ID;
            const requests = await SpecialRequest.getByCustomerId(customerId);

            return res.status(200).json({
                success: true,
                requests
            });
        } catch (jwtError) {
            console.error('JWT decoding error:', jwtError);
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    } catch (error) {
        console.error('Error fetching customer requests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer requests'
        });
    }
};

exports.getCustomerInfo = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(200).json({ 
                success: false, 
                isAuthenticated: false,
                message: 'No token provided' 
            });
        }

        const token = authHeader.split(' ')[1];
        
        try {
            // Decode token without verification
            const decoded = jwt.decode(token);
            
            if (!decoded || !decoded.customer_ID) {
                return res.status(200).json({
                    success: false,
                    isAuthenticated: false,
                    message: 'Invalid token format'
                });
            }
            
            const customerId = decoded.customer_ID;
            
            // Since your token doesn't contain user info, we need to fetch from DB
            const customerInfo = await SpecialRequest.getCustomerInfo(customerId);

            if (!customerInfo) {
                return res.status(200).json({ 
                    success: false, 
                    isAuthenticated: true,
                    message: 'Customer not found' 
                });
            }

            return res.status(200).json({
                success: true,
                isAuthenticated: true,
                data: customerInfo
            });
        } catch (jwtError) {
            console.error('JWT decoding error:', jwtError);
            return res.status(200).json({ 
                success: false, 
                isAuthenticated: false,
                message: 'Invalid token' 
            });
        }
    } catch (error) {
        console.error('Error fetching customer info:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer information'
        });
    }
};

exports.submitRequest = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        const token = authHeader.split(' ')[1];
        
        try {
            // Decode token without verification
            const decoded = jwt.decode(token);
            
            if (!decoded || !decoded.customer_ID) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token format'
                });
            }
            
            const customerId = decoded.customer_ID;
            
            // Get request details from request body
            const { request_details } = req.body;
            
            if (!request_details) {
                return res.status(400).json({
                    success: false,
                    message: 'Request details are required'
                });
            }
            
            // Get customer info for the special request
            const customerInfo = await SpecialRequest.getCustomerInfo(customerId);
            
            if (!customerInfo) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }
            
            // Create the special request
            const requestId = await SpecialRequest.create({
                customer_id: customerId,
                first_name: customerInfo.first_name,
                last_name: customerInfo.last_name,
                email: customerInfo.email,
                phone_number: customerInfo.phone_number,
                request_details
            });
            
            return res.status(201).json({
                success: true,
                message: 'Special request submitted successfully',
                request_id: requestId
            });
            
        } catch (jwtError) {
            console.error('JWT decoding error:', jwtError);
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    } catch (error) {
        console.error('Error submitting special request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit special request'
        });
    }
};

// NEW CODE FOR ADMIN FUNCTIONALITY
exports.getAllRequests = async (req, res) => {
    try {
        // Check for admin authentication
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        const token = authHeader.split(' ')[1];
        
        try {
            // Decode token without verification
            const decoded = jwt.decode(token);
            
            if (!decoded || decoded.role.toLowerCase() !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
            }
            
            // Fetch all special requests
            const requests = await SpecialRequest.getAllRequests();

            return res.status(200).json({
                success: true,
                requests
            });
        } catch (jwtError) {
            console.error('JWT decoding error:', jwtError);
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    } catch (error) {
        console.error('Error fetching all special requests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch special requests'
        });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        // Check for admin authentication
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        const token = authHeader.split(' ')[1];
        
        try {
            // Decode token without verification
            const decoded = jwt.decode(token);
            
            if (!decoded || decoded.role.toLowerCase() !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
            }
            
            const { requestId, status } = req.body;
            
            if (!requestId || !status) {
                return res.status(400).json({
                    success: false,
                    message: 'Request ID and status are required'
                });
            }

            // Validate status
            const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be one of: pending, approved, rejected, completed'
                });
            }
            
            // Update the status
            await SpecialRequest.updateStatus(requestId, status);
            
            return res.status(200).json({
                success: true,
                message: `Request status updated to ${status}`
            });
            
        } catch (jwtError) {
            console.error('JWT decoding error:', jwtError);
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update request status'
        });
    }
};