const db = require('../config/db');

const Gallery = {
  /**
   * Create a new gallery image
   * @param {string} image_url 
   * @param {string} title 
   * @param {string} description 
   * @returns {Promise} Database operation result
   */
  create: async (image_url, title, description) => {
    const sql = 'INSERT INTO Gallery (image_url, title, description) VALUES (?, ?, ?)';
    return db.execute(sql, [image_url, title || null, description || null]);
  },
  
  /**
   * Get all gallery images
   * @returns {Promise} Database operation result
   */
  getAll: async () => {
    const sql = 'SELECT * FROM Gallery ORDER BY image_id DESC';
    return db.execute(sql);
  },
  
  /**
   * Get image by ID
   * @param {number} image_id 
   * @returns {Promise} Database operation result
   */
  getById: async (image_id) => {
    if (!image_id) throw new Error('Image ID is required');
    const sql = 'SELECT * FROM Gallery WHERE image_id = ?';
    return db.execute(sql, [image_id]);
  },
  
  /**
   * Update image metadata
   * @param {number} image_id 
   * @param {string} title 
   * @param {string} description 
   * @returns {Promise} Database operation result
   */
  update: async (image_id, title, description) => {
    if (!image_id) throw new Error('Image ID is required');
    const sql = 'UPDATE Gallery SET title = ?, description = ? WHERE image_id = ?';
    return db.execute(sql, [title || null, description || null, image_id]);
  },
  
  /**
   * Delete an image
   * @param {number} image_id 
   * @returns {Promise} Database operation result
   */
  delete: async (image_id) => {
    if (!image_id) throw new Error('Image ID is required');
    const sql = 'DELETE FROM Gallery WHERE image_id = ?';
    return db.execute(sql, [image_id]);
  }
};

module.exports = Gallery;