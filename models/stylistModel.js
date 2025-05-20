
const db = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get all stylists
const getAllStylists = async () => {
    try {
        const query = `
            SELECT s.stylist_ID, s.firstname, s.lastname, s.email, s.username, s.role, s.profile_url, 
                   s.house_no, s.street, s.city, s.bio, GROUP_CONCAT(e.phone_num) AS phone_numbers
            FROM Stylists s
            LEFT JOIN Employee_Phone_Num e ON s.stylist_ID = e.stylist_ID
            GROUP BY s.stylist_ID;
        `;
        const [rows] = await db.execute(query);

        // Convert the comma-separated phone numbers into an array
        rows.forEach(stylist => {
            if (stylist.phone_numbers) {
                stylist.phone_numbers = stylist.phone_numbers.split(',');
            } else {
                stylist.phone_numbers = [];
            }
        });

        return rows;
    } catch (error) {
        console.error("Error fetching stylists:", error);
        throw error;
    }
};

// Get a specific stylist
const getStylistById = async (stylist_ID) => {
    try {
        const query = `
            SELECT s.stylist_ID, s.firstname, s.lastname, s.email, s.username, s.role, s.profile_url, 
                   s.house_no, s.street, s.city, s.bio, GROUP_CONCAT(e.phone_num) AS phone_numbers
            FROM Stylists s
            LEFT JOIN Employee_Phone_Num e ON s.stylist_ID = e.stylist_ID
            WHERE s.stylist_ID = ?
            GROUP BY s.stylist_ID;
        `;
        const [rows] = await db.execute(query, [stylist_ID]);

        if (rows.length === 0) {
            return null;
        }

        // Convert the comma-separated phone numbers into an array
        if (rows[0].phone_numbers) {
            rows[0].phone_numbers = rows[0].phone_numbers.split(',');
        } else {
            rows[0].phone_numbers = [];
        }

        return rows[0];
    } catch (error) {
        console.error("Error fetching stylist:", error);
        throw error;
    }
};

// Find stylist by username
const findStylistByUsername = async (username) => {
    try {
        const query = 'SELECT * FROM Stylists WHERE username = ?';
        const [rows] = await db.execute(query, [username]);
        
        if (!rows.length) return null;
        
        return {
            ...rows[0],
            id: rows[0].stylist_ID,        // Map stylist_ID to id
            first_name: rows[0].firstname, // Map firstname to first_name
            last_name: rows[0].lastname     // Map lastname to last_name
        };
    } catch (error) {
        console.error("Error finding stylist by username:", error);
        throw error;
    }
};

// Create a new stylist
// const createStylist = async (stylistData) => {
//     const { 
//         firstname, lastname, email, username, role, profile_url, 
//         house_no, street, city, phone_numbers, password, bio 
//     } = stylistData;

//     const connection = await db.getConnection();
//     await connection.beginTransaction();

//     try {
//         // Hash the password
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
        
//         const query = `
//             INSERT INTO Stylists (firstname, lastname, email, username, role, profile_url, house_no, street, city, password, bio)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
//         `;
        
//         // Use null for empty profile_url and bio
//         const profileUrlValue = profile_url && profile_url.trim() !== "" ? profile_url : null;
//         const bioValue = bio && bio.trim() !== "" ? bio : null;
        
//         const [result] = await connection.query(query, [
//             firstname, 
//             lastname, 
//             email, 
//             username, 
//             role, 
//             profileUrlValue, 
//             house_no, 
//             street, 
//             city,
//             hashedPassword,
//             bioValue
//         ]);
        
//         const stylist_ID = result.insertId;

//         // Insert phone numbers
//         if (phone_numbers && Array.isArray(phone_numbers) && phone_numbers.length > 0) {
//             for (const phone of phone_numbers) {
//                 if (phone && phone.trim()) { // Skip empty phone numbers
//                     await connection.query(
//                         `INSERT INTO Employee_Phone_Num (stylist_ID, phone_num) VALUES (?, ?);`,
//                         [stylist_ID, phone.trim()]
//                     );
//                 }
//             }
//         }

//         // Commit the transaction
//         await connection.commit();
//         connection.release();

//         return stylist_ID;
//     } catch (error) {
//         // Rollback in case of error
//         await connection.rollback();
//         connection.release();
//         throw error;
//     }
// };




// Password validation function
const validatePassword = (password) => {
    // Check if password exists
    if (!password) {
        return { isValid: false, message: "Password is required." };
    }

    // Check minimum length
    if (password.length < 6) {
        return { isValid: false, message: "Password must be at least 6 characters long." };
    }

    // Check maximum length (optional - prevents extremely long passwords)
    if (password.length > 128) {
        return { isValid: false, message: "Password must be no more than 128 characters long." };
    }

    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one letter." };
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
        return { isValid: false, message: "Password must contain at least one number." };
    }

    // Optional: Check for at least one special character
    // if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    //     return { isValid: false, message: "Password must contain at least one special character." };
    // }

    // Optional: Check for no common passwords (you can expand this list)
    const commonPasswords = ['123456', 'password', '123456789', '12345678', '12345', 'qwerty', 'abc123'];
    if (commonPasswords.includes(password.toLowerCase())) {
        return { isValid: false, message: "Password is too common. Please choose a stronger password." };
    }

    return { isValid: true, message: "Password is valid." };
};





const createStylist = async (stylistData) => {
    const { 
        firstname, lastname, email, username, role, profile_url, 
        house_no, street, city, phone_numbers, password, bio 
    } = stylistData;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // Validate password again at model level for extra security
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            throw new Error(passwordValidation.message);
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const query = `
            INSERT INTO Stylists (firstname, lastname, email, username, role, profile_url, house_no, street, city, password, bio)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        
        // Use null for empty profile_url and bio
        const profileUrlValue = profile_url && profile_url.trim() !== "" ? profile_url : null;
        const bioValue = bio && bio.trim() !== "" ? bio : null;
        
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
            hashedPassword,
            bioValue
        ]);
        
        const stylist_ID = result.insertId;

        // Insert phone numbers
        if (phone_numbers && Array.isArray(phone_numbers) && phone_numbers.length > 0) {
            for (const phone of phone_numbers) {
                if (phone && phone.trim()) { // Skip empty phone numbers
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

        return stylist_ID;
    } catch (error) {
        // Rollback in case of error
        await connection.rollback();
        connection.release();
        throw error;
    }
};






// Update an existing stylist
const updateStylist = async (stylist_ID, stylistData) => {
    const {
        firstname, lastname, email, username, role, profile_url,
        house_no, street, city, phone_numbers, password, bio
    } = stylistData;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const profileUrlValue = profile_url && profile_url.trim() !== "" ? profile_url : null;
        const bioValue = bio && bio.trim() !== "" ? bio : null;
        let query, queryParams;

        if (password) {
            // Hash the password if provided
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            query = `
                UPDATE Stylists
                SET firstname = ?, lastname = ?, email = ?, username = ?, role = ?, 
                    profile_url = ?, house_no = ?, street = ?, city = ?, password = ?, bio = ?
                WHERE stylist_ID = ?;
            `;
            queryParams = [
                firstname, lastname, email, username, role, profileUrlValue,
                house_no, street, city, hashedPassword, bioValue, stylist_ID
            ];
        } else {
            query = `
                UPDATE Stylists
                SET firstname = ?, lastname = ?, email = ?, username = ?, role = ?, 
                    profile_url = ?, house_no = ?, street = ?, city = ?, bio = ?
                WHERE stylist_ID = ?;
            `;
            queryParams = [
                firstname, lastname, email, username, role, profileUrlValue,
                house_no, street, city, bioValue, stylist_ID
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
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// Delete a stylist
const deleteStylist = async (stylist_ID) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        await connection.query(`DELETE FROM Employee_Phone_Num WHERE stylist_ID = ?`, [stylist_ID]);
        await connection.query(`DELETE FROM Stylists WHERE stylist_ID = ?`, [stylist_ID]);

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// Updated authenticateStylist function in stylistModel.js
// This addresses potential role casing issues during token generation

const authenticateStylist = async (username, password) => {
  try {
      // Get stylist with password
      const query = `
          SELECT s.stylist_ID, s.firstname, s.lastname, s.email, s.username, s.password, s.role, s.profile_url
          FROM Stylists s
          WHERE s.username = ?;
      `;
      const [rows] = await db.execute(query, [username]);
      
      if (rows.length === 0) {
          return { success: false, message: "Invalid username or password" };
      }
      
      const stylist = rows[0];
      
      // Compare password
      const passwordMatch = await bcrypt.compare(password, stylist.password);
      
      if (!passwordMatch) {
          return { success: false, message: "Invalid username or password" };
      }
      
      // Normalize role to lowercase for consistency
      const normalizedRole = stylist.role ? stylist.role.toLowerCase() : '';
      
      // Generate JWT token with normalized role
      const token = jwt.sign(
          {
              id: stylist.stylist_ID,
              username: stylist.username,
              role: normalizedRole, // Use normalized role
              name: `${stylist.firstname} ${stylist.lastname}`,
              profile_url: stylist.profile_url
          },
          process.env.JWT_SECRET || 'fallback_secret_key',
          { expiresIn: '24h' }
      );
      
      // Return success with token and user data (without password)
      delete stylist.password;
      
      return {
          success: true,
          token,
          user: stylist
      };
  } catch (error) {
      console.error("Error authenticating stylist:", error);
      throw error;
  }
};

module.exports = {
    getAllStylists,
    getStylistById,
    findStylistByUsername,
    createStylist,
    updateStylist,
    deleteStylist,
    authenticateStylist
};