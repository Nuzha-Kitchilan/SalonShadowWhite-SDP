const db = require('../config/db'); 

const Gallery = {
  create: async (image_url, title, description) => {
    const sql = 'INSERT INTO Gallery (image_url, title, description) VALUES (?, ?, ?)';
    return db.execute(sql, [image_url, title, description]);
  },
  
  getAll: async () => {
    const sql = 'SELECT * FROM Gallery';
    return db.execute(sql);
  },
  
  getById: async (image_id) => {
    const sql = 'SELECT * FROM Gallery WHERE image_id = ?';
    return db.execute(sql, [image_id]);
  },
  
  update: async (image_id, image_url, title, description) => {
    let sql;
    let values;
    
    if (image_url) {
      // If image_url is provided, update everything
      sql = 'UPDATE Gallery SET image_url = ?, title = ?, description = ? WHERE image_id = ?';
      values = [image_url, title, description, image_id];
    } else {
      // If image_url is NULL, only update title & description
      sql = 'UPDATE Gallery SET title = ?, description = ? WHERE image_id = ?';
      values = [title, description, image_id];
    }
  
    return db.execute(sql, values);
  },
  
  
  delete: async (image_id) => {
    const sql = 'DELETE FROM Gallery WHERE image_id = ?';
    return db.execute(sql, [image_id]);
  }
};

module.exports = Gallery;
