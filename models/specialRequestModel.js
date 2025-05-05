










const db = require('../config/db');

class SpecialRequest {
    static async create({ customer_id, first_name, last_name, email, phone_number, request_details }) {
        // Validate all parameters
        const requiredParams = { customer_id, first_name, last_name, email, phone_number, request_details };
        for (const [param, value] of Object.entries(requiredParams)) {
            if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
                throw new Error(`Missing or invalid parameter: ${param}`);
            }
        }

        try {
            const [result] = await db.execute(
                'INSERT INTO special_requests (customer_id, first_name, last_name, email, phone_number, request_details, status) VALUES (?, ?, ?, ?, ?, ?, "pending")',
                [customer_id, first_name, last_name, email, phone_number, request_details]
            );
            return result.insertId;
        } catch (error) {
            console.error('Database error in SpecialRequest.create:', error);
            throw new Error('Failed to create special request');
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
        const [rows] = await db.execute(
            'SELECT id, request_details, status, created_at FROM special_requests WHERE customer_id = ? ORDER BY created_at DESC',
            [customerId]
        );
        return rows;
    }

    // NEW CODE FOR ADMIN FUNCTIONALITY
    static async getAllRequests() {
        const [rows] = await db.execute(
            'SELECT id, customer_id, first_name, last_name, email, phone_number, request_details, status, created_at FROM special_requests ORDER BY created_at DESC'
        );
        return rows;
    }

    static async updateStatus(requestId, status) {
        await db.execute(
            'UPDATE special_requests SET status = ? WHERE id = ?',
            [status, requestId]
        );
        return true;
    }
}



module.exports = SpecialRequest;