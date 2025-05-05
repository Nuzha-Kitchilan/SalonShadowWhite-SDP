// models/workingHoursModel.js

const db = require('../config/db'); // Assuming you have a 'db.js' file for database connection

// WorkingHours model
const WorkingHours = {
  // Create new working hours entry
  create: async (date, is_closed, open_time, close_time) => {
    const query = `
      INSERT INTO WorkingHours (date, is_closed, open_time, close_time)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [date, is_closed, open_time, close_time]);
    return result;
  },

  // Get all working hours
  getAll: async () => {
    const query = "SELECT * FROM WorkingHours";
    const [rows] = await db.query(query);
    return rows;
  },

  // Get working hours by date
  getByDate: async (date) => {
    const query = "SELECT * FROM WorkingHours WHERE date = ?";
    const [rows] = await db.query(query, [date]);
    return rows[0];
  },

  // Update working hours for a specific date
  update: async (id, date, is_closed, open_time, close_time) => {
    const query = `
      UPDATE WorkingHours
      SET date = ?, is_closed = ?, open_time = ?, close_time = ?
      WHERE id = ?
    `;
    const [result] = await db.query(query, [date, is_closed, open_time, close_time, id]);
    return result;
  },

  // Delete working hours entry
  delete: async (id) => {
    const query = "DELETE FROM WorkingHours WHERE id = ?";
    const [result] = await db.query(query, [id]);
    return result;
  }
};

module.exports = WorkingHours;
