{/*const db = require("../config/db");

// Get all stylists
const getStylists = async (req, res) => {
    try {
        const query = `
            SELECT s.stylist_ID, s.firstname, s.lastname, s.email, s.username, s.password, s.role, s.profile_url, 
                   s.house_no, s.street, s.city, GROUP_CONCAT(e.phone_num) AS phone_numbers
            FROM Stylists s
            LEFT JOIN Employee_Phone_Num e ON s.stylist_ID = e.stylist_ID
            GROUP BY s.stylist_ID;
        `;
        const [rows] = await db.query(query);

        // Convert the comma-separated phone numbers into an array
        rows.forEach(stylist => {
            if (stylist.phone_numbers) {
                stylist.phone_numbers = stylist.phone_numbers.split(','); // Split into an array
            } else {
                stylist.phone_numbers = []; // In case no phone numbers
            }
        });

        res.json(rows);
    } catch (error) {
        console.error("Error fetching stylists:", error);
        res.status(500).json({ message: "Error fetching stylists", error: error.message });
    }
};

// Get a specific stylist
const getStylist = async (req, res) => {
    try {
        const { stylist_ID } = req.params;
        
        const query = `
            SELECT s.stylist_ID, s.firstname, s.lastname, s.email, s.username, s.password, s.role, s.profile_url, 
                   s.house_no, s.street, s.city, GROUP_CONCAT(e.phone_num) AS phone_numbers
            FROM Stylists s
            LEFT JOIN Employee_Phone_Num e ON s.stylist_ID = e.stylist_ID
            WHERE s.stylist_ID = ?
            GROUP BY s.stylist_ID;
        `;
        const [rows] = await db.query(query, [stylist_ID]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Stylist not found" });
        }

        // Convert the comma-separated phone numbers into an array
        if (rows[0].phone_numbers) {
            rows[0].phone_numbers = rows[0].phone_numbers.split(',');
        } else {
            rows[0].phone_numbers = [];
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching stylist:", error);
        res.status(500).json({ message: "Error fetching stylist details", error: error.message });
    }
};

const addStylist = async (req, res) => {
    try {
        console.log("Request body:", JSON.stringify(req.body, null, 2)); // Log incoming data
        
        const { firstname, lastname, email, username, role, profile_url, house_no, street, city, phone_numbers, password } = req.body;

        // Check for missing required fields
        if (!firstname || !lastname || !email || !username ||!password || !role || !house_no || !street || !city) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // Check phone number format if provided
        const phoneRegex = /^[0-9]{10}$/; // Example for 10-digit phone numbers
        if (phone_numbers && Array.isArray(phone_numbers)) {
            for (let phone of phone_numbers) {
                if (phone && phone.trim() && !phoneRegex.test(phone.trim())) {
                    return res.status(400).json({ message: `Invalid phone number format: ${phone}` });
                }
            }
        }

        // Start a transaction to ensure consistent database state
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Set a default password if none is provided
            const defaultPassword = password || username + "123";  // Default is username + "123"
            
            const query = `
                INSERT INTO Stylists (firstname, lastname, email, username, role, profile_url, house_no, street, city, password)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
            
            // Use null for empty profile_url
            const profileUrlValue = profile_url && profile_url.trim() !== "" ? profile_url : null;
            
            const [result] = await connection.query(query, [
                firstname, 
                lastname, 
                email, 
                username, 
                role, 
                profileUrlValue, 
                house_no, 
                street, 
                city,
                defaultPassword  // Add the password field
            ]);
            
            const stylist_ID = result.insertId;
            console.log("Inserted stylist with ID:", stylist_ID);

            // Insert phone numbers
            if (phone_numbers && Array.isArray(phone_numbers) && phone_numbers.length > 0) {
                for (const phone of phone_numbers) {
                    if (phone && phone.trim()) { // Skip empty phone numbers
                        console.log("Inserting phone number:", phone.trim());
                        await connection.query(
                            `INSERT INTO Employee_Phone_Num (stylist_ID, phone_num) VALUES (?, ?)`,
                            [stylist_ID, phone.trim()]
                        );
                    }
                }
            }

            // Commit the transaction
            await connection.commit();
            connection.release();

            res.status(201).json({ message: "Stylist added successfully", stylist_ID });
        } catch (error) {
            // Rollback in case of error
            await connection.rollback();
            connection.release();
            throw error; // Re-throw to be caught by outer catch
        }
    } catch (error) {
        console.error("Error adding stylist:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            message: "Error adding stylist", 
            error: error.message,
            stack: error.stack, // Include stack for debugging
            details: error.sqlMessage || "No SQL message available" // Include SQL-specific error if available
        });
    }
};

// Update a stylist
const updateStylist = async (req, res) => {
    const { stylist_ID } = req.params;
    const {
        firstname, lastname, email, username, role, profile_url,
        house_no, street, city, phone_numbers, password
    } = req.body;

    // Check for missing required fields
    if (!firstname || !lastname || !email || !username || !role || !house_no || !street || !city) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    let connection;
    try {
        // Start a transaction
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Only update password if provided
        const profileUrlValue = profile_url && profile_url.trim() !== "" ? profile_url : null;
        let query, queryParams;

        if (password) {
            query = `
                UPDATE Stylists
                SET firstname = ?, lastname = ?, email = ?, username = ?, role = ?, 
                    profile_url = ?, house_no = ?, street = ?, city = ?, password = ?
                WHERE stylist_ID = ?;
            `;
            queryParams = [
                firstname, lastname, email, username, role, profileUrlValue,
                house_no, street, city, password, stylist_ID
            ];
        } else {
            query = `
                UPDATE Stylists
                SET firstname = ?, lastname = ?, email = ?, username = ?, role = ?, 
                    profile_url = ?, house_no = ?, street = ?, city = ?
                WHERE stylist_ID = ?;
            `;
            queryParams = [
                firstname, lastname, email, username, role, profileUrlValue,
                house_no, street, city, stylist_ID
            ];
        }

        await connection.query(query, queryParams);

        // Update phone numbers: Delete old ones and insert new ones
        await connection.query(`DELETE FROM Employee_Phone_Num WHERE stylist_ID = ?`, [stylist_ID]);

        if (Array.isArray(phone_numbers) && phone_numbers.length > 0) {
            const phoneInserts = phone_numbers
                .filter(phone => phone && phone.trim() !== "")
                .map(phone => [stylist_ID, phone.trim()]);

            if (phoneInserts.length > 0) {
                await connection.query(`INSERT INTO Employee_Phone_Num (stylist_ID, phone_num) VALUES ?`, [phoneInserts]);
            }
        }

        await connection.commit();
        res.json({ message: "Stylist updated successfully" });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error updating stylist:", error);
        res.status(500).json({ 
            message: "Error updating stylist", 
            error: error.message,
            details: error.sqlMessage || "No SQL message available"
        });

    } finally {
        if (connection) connection.release();
    }
};

// Delete a stylist
const deleteStylist = async (req, res) => {
    const { stylist_ID } = req.params;

    try {
        // Start a transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query(`DELETE FROM Employee_Phone_Num WHERE stylist_ID = ?`, [stylist_ID]);
            await connection.query(`DELETE FROM Stylists WHERE stylist_ID = ?`, [stylist_ID]);

            await connection.commit();
            connection.release();

            res.json({ message: "Stylist deleted successfully" });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error("Error deleting stylist:", error);
        res.status(500).json({ 
            message: "Error deleting stylist", 
            error: error.message,
            details: error.sqlMessage || "No SQL message available"
        });
    }
};

module.exports = { 
    getStylists, 
    getStylist,
    addStylist, 
    updateStylist, 
    deleteStylist 
}; */}


const db = require("../config/db");

// Get all stylists
const getStylists = async (req, res) => {
    try {
        const query = `
            SELECT s.stylist_ID, s.firstname, s.lastname, s.email, s.username, s.password, s.role, s.profile_url, 
                   s.house_no, s.street, s.city, GROUP_CONCAT(e.phone_num) AS phone_numbers
            FROM Stylists s
            LEFT JOIN Employee_Phone_Num e ON s.stylist_ID = e.stylist_ID
            GROUP BY s.stylist_ID;
        `;
        const [rows] = await db.execute(query);

        // Convert the comma-separated phone numbers into an array
        rows.forEach(stylist => {
            if (stylist.phone_numbers) {
                stylist.phone_numbers = stylist.phone_numbers.split(','); // Split into an array
            } else {
                stylist.phone_numbers = []; // In case no phone numbers
            }
        });

        res.json(rows);
    } catch (error) {
        console.error("Error fetching stylists:", error);
        res.status(500).json({ message: "Error fetching stylists", error: error.message });
    }
};

// Get a specific stylist
const getStylist = async (req, res) => {
    try {
        const { stylist_ID } = req.params;
        
        const query = `
            SELECT s.stylist_ID, s.firstname, s.lastname, s.email, s.username, s.password, s.role, s.profile_url, 
                   s.house_no, s.street, s.city, GROUP_CONCAT(e.phone_num) AS phone_numbers
            FROM Stylists s
            LEFT JOIN Employee_Phone_Num e ON s.stylist_ID = e.stylist_ID
            WHERE s.stylist_ID = ?
            GROUP BY s.stylist_ID;
        `;
        const [rows] = await db.execute(query, [stylist_ID]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Stylist not found" });
        }

        // Convert the comma-separated phone numbers into an array
        if (rows[0].phone_numbers) {
            rows[0].phone_numbers = rows[0].phone_numbers.split(',');
        } else {
            rows[0].phone_numbers = [];
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching stylist:", error);
        res.status(500).json({ message: "Error fetching stylist details", error: error.message });
    }
};

const addStylist = async (req, res) => {
    try {
        console.log("Request body:", JSON.stringify(req.body, null, 2)); // Log incoming data
        
        const { firstname, lastname, email, username, role, profile_url, house_no, street, city, phone_numbers, password } = req.body;

        // Check for missing required fields
        if (!firstname || !lastname || !email || !username ||!password || !role || !house_no || !street || !city) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // Check phone number format if provided
        const phoneRegex = /^[0-9]{10}$/; // Example for 10-digit phone numbers
        if (phone_numbers && Array.isArray(phone_numbers)) {
            for (let phone of phone_numbers) {
                if (phone && phone.trim() && !phoneRegex.test(phone.trim())) {
                    return res.status(400).json({ message: `Invalid phone number format: ${phone}` });
                }
            }
        }

        // Start a transaction to ensure consistent database state
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Set a default password if none is provided
            const defaultPassword = password || username + "123";  // Default is username + "123"
            
            const query = `
                INSERT INTO Stylists (firstname, lastname, email, username, role, profile_url, house_no, street, city, password)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
            
            // Use null for empty profile_url
            const profileUrlValue = profile_url && profile_url.trim() !== "" ? profile_url : null;
            
            const [result] = await connection.query(query, [
                firstname, 
                lastname, 
                email, 
                username, 
                role, 
                profileUrlValue, 
                house_no, 
                street, 
                city,
                defaultPassword  // Add the password field
            ]);
            
            const stylist_ID = result.insertId;
            console.log("Inserted stylist with ID:", stylist_ID);

            // Insert phone numbers
            if (phone_numbers && Array.isArray(phone_numbers) && phone_numbers.length > 0) {
                for (const phone of phone_numbers) {
                    if (phone && phone.trim()) { // Skip empty phone numbers
                        console.log("Inserting phone number:", phone.trim());
                        await connection.query(
                            `INSERT INTO Employee_Phone_Num (stylist_ID, phone_num) VALUES (?, ?);`,
                            [stylist_ID, phone.trim()]
                        );
                    }
                }
            }

            // Commit the transaction
            await connection.commit();
            connection.release();

            res.status(201).json({ message: "Stylist added successfully", stylist_ID });
        } catch (error) {
            // Rollback in case of error
            await connection.rollback();
            connection.release();
            throw error; // Re-throw to be caught by outer catch
        }
    } catch (error) {
        console.error("Error adding stylist:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            message: "Error adding stylist", 
            error: error.message,
            stack: error.stack, // Include stack for debugging
            details: error.sqlMessage || "No SQL message available" // Include SQL-specific error if available
        });
    }
};

// Update a stylist
const updateStylist = async (req, res) => {
    const { stylist_ID } = req.params;
    const {
        firstname, lastname, email, username, role, profile_url,
        house_no, street, city, phone_numbers, password
    } = req.body;

    // Check for missing required fields
    if (!firstname || !lastname || !email || !username || !role || !house_no || !street || !city) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    let connection;
    try {
        // Start a transaction
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Only update password if provided
        const profileUrlValue = profile_url && profile_url.trim() !== "" ? profile_url : null;
        let query, queryParams;

        if (password) {
            query = `
                UPDATE Stylists
                SET firstname = ?, lastname = ?, email = ?, username = ?, role = ?, 
                    profile_url = ?, house_no = ?, street = ?, city = ?, password = ?
                WHERE stylist_ID = ?;
            `;
            queryParams = [
                firstname, lastname, email, username, role, profileUrlValue,
                house_no, street, city, password, stylist_ID
            ];
        } else {
            query = `
                UPDATE Stylists
                SET firstname = ?, lastname = ?, email = ?, username = ?, role = ?, 
                    profile_url = ?, house_no = ?, street = ?, city = ?
                WHERE stylist_ID = ?;
            `;
            queryParams = [
                firstname, lastname, email, username, role, profileUrlValue,
                house_no, street, city, stylist_ID
            ];
        }

        await connection.query(query, queryParams);

        // Update phone numbers: Delete old ones and insert new ones
        await connection.query(`DELETE FROM Employee_Phone_Num WHERE stylist_ID = ?`, [stylist_ID]);

        if (Array.isArray(phone_numbers) && phone_numbers.length > 0) {
            const phoneInserts = phone_numbers
                .filter(phone => phone && phone.trim() !== "")
                .map(phone => [stylist_ID, phone.trim()]);

            if (phoneInserts.length > 0) {
                await connection.query(`INSERT INTO Employee_Phone_Num (stylist_ID, phone_num) VALUES ?`, [phoneInserts]);
            }
        }

        await connection.commit();
        res.json({ message: "Stylist updated successfully" });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error updating stylist:", error);
        res.status(500).json({ 
            message: "Error updating stylist", 
            error: error.message,
            details: error.sqlMessage || "No SQL message available"
        });

    } finally {
        if (connection) connection.release();
    }
};

// Delete a stylist
const deleteStylist = async (req, res) => {
    const { stylist_ID } = req.params;

    try {
        // Start a transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query(`DELETE FROM Employee_Phone_Num WHERE stylist_ID = ?`, [stylist_ID]);
            await connection.query(`DELETE FROM Stylists WHERE stylist_ID = ?`, [stylist_ID]);

            await connection.commit();
            connection.release();

            res.json({ message: "Stylist deleted successfully" });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error("Error deleting stylist:", error);
        res.status(500).json({ 
            message: "Error deleting stylist", 
            error: error.message,
            details: error.sqlMessage || "No SQL message available"
        });
    }
};

module.exports = { 
    getStylists, 
    getStylist,
    addStylist, 
    updateStylist, 
    deleteStylist 
};

