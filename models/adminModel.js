const db = require('../config/db');
const cloudinary = require('cloudinary').v2; 

const Admin = {
  // Find admin by username
  findByUsername: async (username) => {
    const sql = 'SELECT * FROM admins WHERE username = ?';
    try {
      const [results] = await db.execute(sql, [username]);
      return results[0] || null;
    } catch (err) {
      console.error('Error in findByUsername:', err);
      throw err; 
    }
  },

  // Find admin by email
  findByEmail: async (email) => {
    const sql = 'SELECT * FROM admins WHERE email = ?';
    const [results] = await db.execute(sql, [email]);
    return results[0];  
  },

  //  Find admin by ID
  findById: async (adminId) => {
    const sql = 'SELECT * FROM admins WHERE id = ?';
    const [results] = await db.execute(sql, [adminId]);
    return results[0]; 
  },



createAdmin: async (first_name, last_name, email, username, password, role, profile_pic_file) => {
  try {
    let profileUrl = null;
   
    if (profile_pic_file) {
      const uploadResult = await cloudinary.uploader.upload(profile_pic_file.path, {
        folder: 'admin_profiles',
        transformation: [
          { width: 200, height: 200, crop: 'thumb', gravity: 'face' }
        ]
      });
      profileUrl = uploadResult.secure_url;
    }

    const sql = 'INSERT INTO admins (first_name, last_name, email, username, password, role, profile_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(sql, [
      first_name, 
      last_name, 
      email, 
      username, 
      password,
      role, 
      profileUrl
    ]);
    
    return result;
  } catch (err) {
    console.error('Error creating admin with Cloudinary:', err);
    throw err;
  }
},



 
updateAdmin: async (adminId, first_name, last_name, email, role, profile_url, profile_pic_file) => {
  try {
    let finalProfileUrl = profile_url || null;
    
    // Process image if file was uploaded
    if (profile_pic_file) {
      try {
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(profile_pic_file.path, {
          folder: 'admin_profiles',
          transformation: [
            { width: 200, height: 200, crop: 'thumb', gravity: 'face' }
          ]
        });
        
        finalProfileUrl = uploadResult.secure_url;
        
        // Delete old image if it exists and is from Cloudinary
        if (profile_url && profile_url.includes('res.cloudinary.com')) {
          try {
            const publicId = profile_url.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (deleteErr) {
            console.warn('Failed to delete old image:', deleteErr);
          }
        }
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr);
        throw new Error('Failed to upload image to Cloudinary');
      }
    }

    // Update database
    const sql = 'UPDATE admins SET first_name = ?, last_name = ?, email = ?, role = ?, profile_url = ? WHERE id = ?';
    const [result] = await db.execute(sql, [
      first_name, 
      last_name, 
      email, 
      role, 
      finalProfileUrl,
      adminId
    ]);
    
    // Return updated admin data
    const [updatedAdmin] = await db.execute(
      'SELECT id, first_name, last_name, email, role, profile_url FROM admins WHERE id = ?',
      [adminId]
    );
    
    return updatedAdmin[0];
  } catch (err) {
    console.error('Error updating admin:', err);
    throw err;
  }
},


  // password (expects password to be pre-hashed)
  updatePassword: async (adminId, newPassword) => {
    const sql = 'UPDATE admins SET password = ? WHERE id = ?';
    const [result] = await db.execute(sql, [newPassword, adminId]);
    return result;
  },

  // Delete admin
  deleteAdmin: async (adminId) => {
    const sql = 'DELETE FROM admins WHERE id = ?';
    const [result] = await db.execute(sql, [adminId]);
    return result;
  },

  // Get all admins 
  getAllAdmins: async () => {
    const sql = 'SELECT id, first_name, last_name, email, username, role, profile_url, created_at FROM admins';
    const [results] = await db.execute(sql);
    return results;
  },

  // Get admin profile by ID
  getAdminProfile: async (adminId) => {
    const sql = 'SELECT first_name, last_name, profile_url FROM admins WHERE id = ?';
    const [results] = await db.execute(sql, [adminId]);

    if (results.length > 0) {
      const { first_name, last_name, profile_url } = results[0];

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
