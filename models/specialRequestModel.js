// const db = require('../config/db');

// class SpecialRequest {
//     static async create({ customer_id, first_name, last_name, email, phone_number, request_details }) {
//         const [result] = await db.execute(
//             'INSERT INTO special_requests (customer_id, first_name, last_name, email, phone_number, request_details, status) VALUES (?, ?, ?, ?, ?, ?, "pending")',
//             [customer_id, first_name, last_name, email, phone_number, request_details]
//         );
//         return result.insertId;
//     }

//     static async getCustomerInfo(customerId) {
//         const [rows] = await db.execute(
//             'SELECT first_name, last_name, email, phone_number FROM customer WHERE customer_ID = ?',
//             [customerId]
//         );
//         return rows[0] || null;
//     }

//     static async getByCustomerId(customerId) {
//         const [rows] = await db.execute(
//             'SELECT id, request_details, status, created_at FROM special_requests WHERE customer_id = ? ORDER BY created_at DESC',
//             [customerId]
//         );
//         return rows;
//     }
// }

// module.exports = SpecialRequest;










const db = require('../config/db');

class SpecialRequest {
    static async create({ customer_id, first_name, last_name, email, phone_number, request_details }) {
        const [result] = await db.execute(
            'INSERT INTO special_requests (customer_id, first_name, last_name, email, phone_number, request_details, status) VALUES (?, ?, ?, ?, ?, ?, "pending")',
            [customer_id, first_name, last_name, email, phone_number, request_details]
        );
        return result.insertId;
    }

    static async getCustomerInfo(customerId) {
        const [rows] = await db.execute(
            'SELECT first_name, last_name, email, phone_number FROM customer WHERE customer_ID = ?',
            [customerId]
        );
        return rows[0] || null;
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