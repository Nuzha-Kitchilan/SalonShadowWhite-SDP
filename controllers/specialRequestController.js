













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
//         const decoded = jwt.decode(token);
        
//         if (!decoded || !decoded.customer_ID) {
//             return res.status(200).json({
//                 success: false,
//                 isAuthenticated: false,
//                 message: 'Invalid token format'
//             });
//         }
        
//         const customerInfo = await SpecialRequest.getCustomerInfo(decoded.customer_ID);

//         if (!customerInfo) {
//             return res.status(200).json({ 
//                 success: false, 
//                 isAuthenticated: true,
//                 message: 'Customer not found' 
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             isAuthenticated: true,
//             data: {
//                 first_name: customerInfo.first_name,
//                 last_name: customerInfo.last_name,
//                 email: customerInfo.email,
//                 phone_numbers: customerInfo.phone_numbers
//             }
//         });
        
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
//         const decoded = jwt.decode(token);
        
//         if (!decoded || !decoded.customer_ID) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid token format'
//             });
//         }
        
//         const { 
//             firstName, 
//             lastName, 
//             email, 
//             phone_number, 
//             request_details,
//             service_id,
//             preferred_date,
//             preferred_time
//         } = req.body;
        
//         // Validate all required fields
//         const requiredFields = {
//             'First Name': firstName,
//             'Last Name': lastName,
//             'Email': email,
//             'Phone Number': phone_number,
//             'Request Details': request_details,
//             'Preferred Date': preferred_date,
//             'Preferred Time': preferred_time
//         };

//         const missingFields = Object.entries(requiredFields)
//             .filter(([_, value]) => !value)
//             .map(([field]) => field);

//         if (missingFields.length > 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: `Missing required fields: ${missingFields.join(', ')}`
//             });
//         }

//         // Create the special request
//         const requestId = await SpecialRequest.create({
//             customer_id: decoded.customer_ID,
//             first_name: firstName,
//             last_name: lastName,
//             email: email,
//             phone_number: phone_number,
//             request_details: request_details,
//             service_id: service_id,
//             preferred_date: preferred_date,
//             preferred_time: preferred_time
//         });
        
//         return res.status(201).json({
//             success: true,
//             message: 'Special request submitted successfully',
//             request_id: requestId
//         });
        
//     } catch (error) {
//         console.error('Error submitting special request:', error);
//         res.status(error.message.includes('Missing or invalid') ? 400 : 500).json({
//             success: false,
//             message: error.message || 'Failed to submit special request'
//         });
//     }
// };


// exports.getAllRequests = async (req, res) => {
//     try {
//         // Check for admin authentication
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
            
//             if (!decoded || decoded.role.toLowerCase() !== 'admin') {
//                 return res.status(403).json({
//                     success: false,
//                     message: 'Admin access required'
//                 });
//             }
            
//             // Fetch all special requests
//             const requests = await SpecialRequest.getAllRequests();

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
//         console.error('Error fetching all special requests:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch special requests'
//         });
//     }
// };




// exports.updateRequestStatus = async (req, res) => {
//     try {
//         // Check for admin authentication
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
            
//             if (!decoded || decoded.role.toLowerCase() !== 'admin') {
//                 return res.status(403).json({
//                     success: false,
//                     message: 'Admin access required'
//                 });
//             }
            
//             const { requestId, status } = req.body;
            
//             if (!requestId || !status) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Request ID and status are required'
//                 });
//             }

//             // Validate status
//             const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
//             if (!validStatuses.includes(status)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Invalid status. Must be one of: pending, approved, rejected, completed'
//                 });
//             }
            
//             // Update the status
//             await SpecialRequest.updateStatus(requestId, status);
            
//             return res.status(200).json({
//                 success: true,
//                 message: `Request status updated to ${status}`
//             });
            
//         } catch (jwtError) {
//             console.error('JWT decoding error:', jwtError);
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid token'
//             });
//         }
//     } catch (error) {
//         console.error('Error updating request status:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to update request status'
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
        const decoded = jwt.decode(token);
        
        if (!decoded || !decoded.customer_ID) {
            return res.status(200).json({
                success: false,
                isAuthenticated: false,
                message: 'Invalid token format'
            });
        }
        
        const customerInfo = await SpecialRequest.getCustomerInfo(decoded.customer_ID);

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
            data: {
                first_name: customerInfo.first_name,
                last_name: customerInfo.last_name,
                email: customerInfo.email,
                phone_numbers: customerInfo.phone_numbers
            }
        });
        
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
        const decoded = jwt.decode(token);
        
        if (!decoded || !decoded.customer_ID) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format'
            });
        }
        
        const { 
            firstName, 
            lastName, 
            email, 
            phone_number, 
            request_details,
            service_ids, // Changed from service_id to service_ids
            preferred_date,
            preferred_time
        } = req.body;
        
        // Validate all required fields
        const requiredFields = {
            'First Name': firstName,
            'Last Name': lastName,
            'Email': email,
            'Phone Number': phone_number,
            'Request Details': request_details,
            'Preferred Date': preferred_date,
            'Preferred Time': preferred_time
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([field]) => field);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate service_ids
        if (!service_ids || !Array.isArray(service_ids) || service_ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one service must be selected'
            });
        }

        // Create the special request
        const requestId = await SpecialRequest.create({
            customer_id: decoded.customer_ID,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phone_number,
            request_details: request_details,
            service_ids: service_ids, // Pass array of service IDs
            preferred_date: preferred_date,
            preferred_time: preferred_time
        });
        
        return res.status(201).json({
            success: true,
            message: 'Special request submitted successfully',
            request_id: requestId
        });
        
    } catch (error) {
        console.error('Error submitting special request:', error);
        res.status(error.message.includes('Missing or invalid') ? 400 : 500).json({
            success: false,
            message: error.message || 'Failed to submit special request'
        });
    }
};

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

// New endpoint to handle appointment creation from special request
exports.createAppointmentFromRequest = async (req, res) => {
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
        const decoded = jwt.decode(token);
        
        if (!decoded || decoded.role.toLowerCase() !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }
        
        const { requestId } = req.body;
        
        if (!requestId) {
            return res.status(400).json({
                success: false,
                message: 'Request ID is required'
            });
        }

        // Here you would integrate with your appointment creation logic
        // For now, we'll just delete the special request
        await SpecialRequest.deleteRequest(requestId);
        
        return res.status(200).json({
            success: true,
            message: 'Appointment created successfully and special request removed'
        });
        
    } catch (error) {
        console.error('Error creating appointment from request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create appointment from request'
        });
    }
};

// Get services for a specific request
exports.getRequestServices = async (req, res) => {
    try {
        const { requestId } = req.params;
        
        if (!requestId) {
            return res.status(400).json({
                success: false,
                message: 'Request ID is required'
            });
        }

        const services = await SpecialRequest.getRequestServices(requestId);
        
        return res.status(200).json({
            success: true,
            services
        });
        
    } catch (error) {
        console.error('Error fetching request services:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch request services'
        });
    }
};

// Update services for a request
exports.updateRequestServices = async (req, res) => {
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
        const decoded = jwt.decode(token);
        
        if (!decoded || decoded.role.toLowerCase() !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }
        
        const { requestId, serviceIds } = req.body;
        
        if (!requestId || !serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Request ID and service IDs are required'
            });
        }

        await SpecialRequest.updateRequestServices(requestId, serviceIds);
        
        return res.status(200).json({
            success: true,
            message: 'Request services updated successfully'
        });
        
    } catch (error) {
        console.error('Error updating request services:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update request services'
        });
    }
};