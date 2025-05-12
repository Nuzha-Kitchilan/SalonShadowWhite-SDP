










const db = require('../config/db');

class SpecialRequest {
    // static async create({ customer_id, first_name, last_name, email, phone_number, request_details }) {
    //     // Validate all parameters
    //     const requiredParams = { customer_id, first_name, last_name, email, phone_number, request_details };
    //     for (const [param, value] of Object.entries(requiredParams)) {
    //         if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    //             throw new Error(`Missing or invalid parameter: ${param}`);
    //         }
    //     }

    //     try {
    //         const [result] = await db.execute(
    //             'INSERT INTO special_requests (customer_id, first_name, last_name, email, phone_number, request_details, status) VALUES (?, ?, ?, ?, ?, ?, "pending")',
    //             [customer_id, first_name, last_name, email, phone_number, request_details]
    //         );
    //         return result.insertId;
    //     } catch (error) {
    //         console.error('Database error in SpecialRequest.create:', error);
    //         throw new Error('Failed to create special request');
    //     }
    // }



static async create({ 
    customer_id, 
    first_name, 
    last_name, 
    email, 
    phone_number, 
    request_details,
    service_id,
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

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferred_date)) {
        throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    // Validate time format (HH:MM:SS)
    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(preferred_time)) {
        throw new Error('Invalid time format. Use HH:MM or HH:MM:SS');
    }

    try {
        const [result] = await db.execute(
            `INSERT INTO special_requests 
            (customer_id, first_name, last_name, email, phone_number, 
             request_details, service_id, preferred_date, preferred_time, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "pending")`,
            [
                customer_id, 
                first_name, 
                last_name, 
                email, 
                phone_number, 
                request_details,
                service_id || null, // Allow NULL if service_id not provided
                preferred_date,
                preferred_time
            ]
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
    // static async getAllRequests() {
    //     const [rows] = await db.execute(
    //         'SELECT id, customer_id, first_name, last_name, email, phone_number, request_details, status, created_at FROM special_requests ORDER BY created_at DESC'
    //     );
    //     return rows;
    // }




    static async getAllRequests() {
    const [rows] = await db.execute(
        `SELECT 
            sr.id, 
            sr.customer_id, 
            sr.first_name, 
            sr.last_name, 
            sr.email, 
            sr.phone_number, 
            sr.request_details, 
            sr.service_id,
            s.service_name,
            sr.preferred_date,
            sr.preferred_time,
            sr.status, 
            sr.created_at,
            sr.updated_at 
        FROM special_requests sr
        LEFT JOIN service s ON sr.service_id = s.service_id
        ORDER BY sr.created_at DESC`
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