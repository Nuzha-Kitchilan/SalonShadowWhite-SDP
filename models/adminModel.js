{/* const db = require('../config/db');
  // Use .js extension with import

const Admin = {
  // 🔍 Find admin by username
//   findByUsername: async (username) => {
//     const sql = 'SELECT * FROM admins WHERE username = ?';
//     const [results] = await db.execute(sql, [username]);
//     return results[0];  // Return the first result
//   },

// Refactored findByUsername to use async/await
findByUsername: async (username) => {
    const sql = 'SELECT * FROM admins WHERE username = ?';
    try {
        const [results] = await db.execute(sql, [username]);
        return results[0];  // Return the first result if it exists
    } catch (err) {
        console.error('Error in findByUsername:', err);
        throw err;  // Re-throw the error so it can be handled at the controller level
    }
},




  // 🔍 Find admin by email
  findByEmail: async (email) => {
    const sql = 'SELECT * FROM admins WHERE email = ?';
    const [results] = await db.execute(sql, [email]);
    return results[0];  // Return the first result
  },

  // 🔍 Find admin by ID
  findById: async (adminId) => {
    const sql = 'SELECT * FROM admins WHERE id = ?';
    const [results] = await db.execute(sql, [adminId]);
    return results[0];  // Return the first result
  },

  // // ✅ Create a new admin (without hashing password)
  // createAdmin: async (first_name, last_name, email, username, password, role, profile_url) => {
  //   const sql = 'INSERT INTO admins (first_name, last_name, email, username, password, role, profile_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
  //   const [result] = await db.execute(sql, [first_name, last_name, email, username, password, role, profile_url]);
  //   return result;
  // },

  // ✅ Create a new admin (without hashing password)
createAdmin: async (first_name, last_name, email, username, password, role, profile_url) => {
  // Set default value for profile_url if it's undefined
  const safeProfileUrl = profile_url || null;
  
  const sql = 'INSERT INTO admins (first_name, last_name, email, username, password, role, profile_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const [result] = await db.execute(sql, [
    first_name, 
    last_name, 
    email, 
    username, 
    password, 
    role, 
    safeProfileUrl
  ]);
  return result;
},

  // ✏️ Update admin details (excluding password)
  updateAdmin: async (adminId, first_name, last_name, email, role, profile_url) => {
    const sql = 'UPDATE admins SET first_name = ?, last_name = ?, email = ?, role = ?, profile_url = ? WHERE id = ?';
    const [result] = await db.execute(sql, [first_name, last_name, email, role, profile_url, adminId]);
    return result;
  },

  // 🔑 Update password (no hashing)
  updatePassword: async (adminId, newPassword) => {
    const sql = 'UPDATE admins SET password = ? WHERE id = ?';
    const [result] = await db.execute(sql, [newPassword, adminId]);
    return result;
  },

  // ❌ Delete admin
  deleteAdmin: async (adminId) => {
    const sql = 'DELETE FROM admins WHERE id = ?';
    const [result] = await db.execute(sql, [adminId]);
    return result;
  },

  // 📜 Get all admins
  getAllAdmins: async () => {
    const sql = 'SELECT id, first_name, last_name, email, username, role, profile_url, created_at FROM admins';
    const [results] = await db.execute(sql);
    return results;
  },
};

module.exports = Admin; */}

const db = require('../config/db');

const Admin = {
  // 🔍 Find admin by username
  findByUsername: async (username) => {
    const sql = 'SELECT * FROM admins WHERE username = ?';
    try {
      const [results] = await db.execute(sql, [username]);
      return results[0] || null; // Return the first result if it exists
    } catch (err) {
      console.error('Error in findByUsername:', err);
      throw err;  // Re-throw the error so it can be handled at the controller level
    }
  },

  // 🔍 Find admin by email
  findByEmail: async (email) => {
    const sql = 'SELECT * FROM admins WHERE email = ?';
    const [results] = await db.execute(sql, [email]);
    return results[0];  // Return the first result
  },

  // 🔍 Find admin by ID
  findById: async (adminId) => {
    const sql = 'SELECT * FROM admins WHERE id = ?';
    const [results] = await db.execute(sql, [adminId]);
    return results[0];  // Return the first result
  },

  // ✅ Create a new admin (expects password to be pre-hashed)
  createAdmin: async (first_name, last_name, email, username, password, role, profile_url) => {
    // Set default value for profile_url if it's undefined
    const safeProfileUrl = profile_url || null;
    
    // IMPORTANT: Password should already be hashed by the controller before reaching this point
    const sql = 'INSERT INTO admins (first_name, last_name, email, username, password, role, profile_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(sql, [
      first_name, 
      last_name, 
      email, 
      username, 
      password, // This should be a bcrypt hashed password
      role, 
      safeProfileUrl
    ]);
    return result;
  },

  // ✏️ Update admin details (excluding password)
  updateAdmin: async (adminId, first_name, last_name, email, role, profile_url) => {
    const sql = 'UPDATE admins SET first_name = ?, last_name = ?, email = ?, role = ?, profile_url = ? WHERE id = ?';
    const [result] = await db.execute(sql, [first_name, last_name, email, role, profile_url, adminId]);
    return result;
  },

  // 🔑 Update password (expects password to be pre-hashed)
  updatePassword: async (adminId, newPassword) => {
    // IMPORTANT: newPassword should already be hashed by the controller before reaching this point
    const sql = 'UPDATE admins SET password = ? WHERE id = ?';
    const [result] = await db.execute(sql, [newPassword, adminId]);
    return result;
  },

  // ❌ Delete admin
  deleteAdmin: async (adminId) => {
    const sql = 'DELETE FROM admins WHERE id = ?';
    const [result] = await db.execute(sql, [adminId]);
    return result;
  },

  // 📜 Get all admins (excludes password field for security)
  getAllAdmins: async () => {
    const sql = 'SELECT id, first_name, last_name, email, username, role, profile_url, created_at FROM admins';
    const [results] = await db.execute(sql);
    return results;
  },

  // 🔍 Get admin profile by ID (with default profile picture fallback)
  getAdminProfile: async (adminId) => {
    const sql = 'SELECT first_name, last_name, profile_url FROM admins WHERE id = ?';
    const [results] = await db.execute(sql, [adminId]);

    if (results.length > 0) {
      const { first_name, last_name, profile_url } = results[0];

      // If profile_url is null or empty, use a default profile picture
      const profilePicture = profile_url || "path_to_default_profile_picture.jpg";

      return {
        first_name,
        last_name,
        profile_url: profilePicture,
      };
    } else {
      throw new Error('Admin not found');
    }
  },




findUserByEmail: async (email) => {
  const [admin] = await db.query('SELECT * FROM Admins WHERE email = ?', [email]);
  const [customer] = await db.query('SELECT * FROM Customer WHERE email = ?', [email]);

  return admin.length > 0 || customer.length > 0;
},

updateAdminPassword: async (email, newPassword) => {
  const [result] = await db.query('UPDATE Admins SET password = ? WHERE email = ?', [newPassword, email]);
  return result.affectedRows > 0;
},

updateCustomerPassword: async (email, newPassword) => {
  const [result] = await db.query('UPDATE Customer SET password = ? WHERE email = ?', [newPassword, email]);
  return result.affectedRows > 0;
}

};
module.exports = Admin;
