const db = require('../config/db');

class SpecialRequest {

    static async create({ 
        customer_id, 
        first_name, 
        last_name, 
        email, 
        phone_number, 
        request_details,
        service_ids, // Changed from service_id to service_ids (array)
        preferred_date,
        preferred_time
    }) {
        // Validate all parameters
        const requiredParams = { 
            first_name, 
            last_name, 
            email, 
            phone_number, 
            request_details,
            preferred_date,
            preferred_time
        };
        
        for (const [param, value] of Object.entries(requiredParams)) {
            if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
                throw new Error(`Missing or invalid parameter: ${param}`);
            }
        }

        // Validate service_ids
        if (!service_ids || !Array.isArray(service_ids) || service_ids.length === 0) {
            throw new Error('At least one service must be selected');
        }

        // Validate date format (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(preferred_date)) {
            throw new Error('Invalid date format. Use YYYY-MM-DD');
        }

        // Validate time format (HH:MM:SS)
        if (!/^\d{2}:\d{2}(:\d{2})?$/.test(preferred_time)) {
            throw new Error('Invalid time format. Use HH:MM or HH:MM:SS');
        }

        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // Insert into special_requests table (without service_id)
            const [result] = await connection.execute(
                `INSERT INTO special_requests 
                (customer_id, first_name, last_name, email, phone_number, 
                 request_details, preferred_date, preferred_time, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, "pending")`,
                [
                    customer_id, 
                    first_name, 
                    last_name, 
                    email, 
                    phone_number, 
                    request_details,
                    preferred_date,
                    preferred_time
                ]
            );

            const specialRequestId = result.insertId;

            // Insert services into special_request_service table
            for (const serviceId of service_ids) {
                await connection.execute(
                    'INSERT INTO special_request_service (special_request_id, service_id) VALUES (?, ?)',
                    [specialRequestId, serviceId]
                );
            }

            await connection.commit();
            return specialRequestId;
        } catch (error) {
            await connection.rollback();
            console.error('Database error in SpecialRequest.create:', error);
            throw new Error('Failed to create special request');
        } finally {
            connection.release();
        }
    }

    static async getCustomerInfo(customerId) {
        // Get basic customer info
        const [customerRows] = await db.execute(
            'SELECT firstname, lastname, email FROM customer WHERE customer_ID = ?',
            [customerId]
        );
        
        if (!customerRows[0]) return null;
        
        // Get phone numbers from Customer_Phone_Num table
        const [phoneRows] = await db.execute(
            'SELECT phone_num FROM Customer_Phone_Num WHERE customer_ID = ?',
            [customerId]
        );
        
        return {
            first_name: customerRows[0].firstname,
            last_name: customerRows[0].lastname,
            email: customerRows[0].email,
            phone_numbers: phoneRows.map(row => row.phone_num) // Array of phone numbers
        };
    }

    static async getByCustomerId(customerId) {
        // Get special requests with their associated services
        const [rows] = await db.execute(
            `SELECT 
                sr.id, 
                sr.request_details, 
                sr.status, 
                sr.created_at,
                sr.preferred_date,
                sr.preferred_time,
                GROUP_CONCAT(s.service_name SEPARATOR ', ') as services
            FROM special_requests sr
            LEFT JOIN special_request_service srs ON sr.id = srs.special_request_id
            LEFT JOIN service s ON srs.service_id = s.service_id
            WHERE sr.customer_id = ? 
            GROUP BY sr.id
            ORDER BY sr.created_at DESC`,
            [customerId]
        );
        return rows;
    }

    static async getAllRequests() {
        // Get all special requests with their associated services
        const [rows] = await db.execute(
            `SELECT 
                sr.id, 
                sr.customer_id, 
                sr.first_name, 
                sr.last_name, 
                sr.email, 
                sr.phone_number, 
                sr.request_details, 
                sr.preferred_date,
                sr.preferred_time,
                sr.status, 
                sr.created_at,
                sr.updated_at,
                GROUP_CONCAT(s.service_name SEPARATOR ', ') as services,
                GROUP_CONCAT(s.service_id SEPARATOR ',') as service_ids
            FROM special_requests sr
            LEFT JOIN special_request_service srs ON sr.id = srs.special_request_id
            LEFT JOIN service s ON srs.service_id = s.service_id
            GROUP BY sr.id
            ORDER BY sr.created_at DESC`
        );
        return rows;
    }

    static async updateStatus(requestId, status) {
        await db.execute(
            'UPDATE special_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, requestId]
        );
        return true;
    }

    // New method to delete special request and its services
    static async deleteRequest(requestId) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // Delete from special_request_service table first (foreign key constraint)
            await connection.execute(
                'DELETE FROM special_request_service WHERE special_request_id = ?',
                [requestId]
            );

            // Delete from special_requests table
            await connection.execute(
                'DELETE FROM special_requests WHERE id = ?',
                [requestId]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            console.error('Database error in SpecialRequest.deleteRequest:', error);
            throw new Error('Failed to delete special request');
        } finally {
            connection.release();
        }
    }

    // Method to get services for a specific request
    static async getRequestServices(requestId) {
        const [rows] = await db.execute(
            `SELECT s.service_id, s.service_name, s.price
            FROM special_request_service srs
            JOIN service s ON srs.service_id = s.service_id
            WHERE srs.special_request_id = ?`,
            [requestId]
        );
        return rows;
    }

    // Method to update services for a request
    static async updateRequestServices(requestId, serviceIds) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // Delete existing services
            await connection.execute(
                'DELETE FROM special_request_service WHERE special_request_id = ?',
                [requestId]
            );

            // Insert new services
            for (const serviceId of serviceIds) {
                await connection.execute(
                    'INSERT INTO special_request_service (special_request_id, service_id) VALUES (?, ?)',
                    [requestId, serviceId]
                );
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            console.error('Database error in SpecialRequest.updateRequestServices:', error);
            throw new Error('Failed to update request services');
        } finally {
            connection.release();
        }
    }
}

module.exports = SpecialRequest;