const db = require('../config/db');  

// Model for handling stylist-related queries
const Stylists = {

  // Get all stylists
  getAllStylists: async () => {
    const [rows] = await db.execute('SELECT * FROM Stylists');
    return rows;
  },

  // Get a stylist by ID
  getStylistById: async (stylistId) => {
    const [rows] = await db.execute('SELECT * FROM Stylists WHERE stylist_ID = ?', [stylistId]);
    return rows[0];  // Return the first match or undefined if no match
  },

  // Create a new stylist
  createStylist: async (stylist) => {
    const { firstname, lastname, email, username, password, role, profile_url, house_no, street, city } = stylist;
    const [result] = await db.execute(
      'INSERT INTO Stylists (firstname, lastname, email, username, password, role, profile_url, house_no, street, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [firstname, lastname, email, username, password, role, profile_url, house_no, street, city]
    );
    return result.insertId;  // Return the inserted ID of the new stylist
  },

  // Update a stylist's information
  updateStylist: async (stylistId, updatedData) => {
    const { firstname, lastname, email, username, password, role, profile_url, house_no, street, city } = updatedData;
    const [result] = await db.execute(
      'UPDATE Stylists SET firstname = ?, lastname = ?, email = ?, username = ?, password = ?, role = ?, profile_url = ?, house_no = ?, street = ?, city = ? WHERE stylist_ID = ?',
      [firstname, lastname, email, username, password, role, profile_url, house_no, street, city, stylistId]
    );
    return result.affectedRows;  // Return the number of affected rows (1 if successful)
  },

  // Delete a stylist by ID
  deleteStylist: async (stylistId) => {
    const [result] = await db.execute('DELETE FROM Stylists WHERE stylist_ID = ?', [stylistId]);
    return result.affectedRows;  // Return the number of affected rows (1 if successful)
  },
};

module.exports = Stylists;
