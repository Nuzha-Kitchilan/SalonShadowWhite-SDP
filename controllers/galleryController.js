{/*const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const db = require('../config/db'); // Import your database connection

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// **Upload Image**
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Cleanup: Delete file from local uploads
    fs.unlinkSync(req.file.path);

    const { title, description } = req.body;

    // Insert into Database using async/await
    const query = 'INSERT INTO Gallery (image_url, title, description) VALUES (?, ?, ?)';
    const [rows] = await db.query(query, [result.secure_url, title, description]);

    res.status(200).json({ message: 'Image uploaded successfully', image_url: result.secure_url });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Error uploading to Cloudinary', details: err.message });
  }
};

// **Get All Images**
exports.getAllImages = async (req, res) => {
  try {
    const query = 'SELECT * FROM Gallery';
    const [rows] = await db.query(query);

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ error: 'Error fetching images' });
  }
};

// **Update Image Metadata**
exports.updateImage = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image_id = req.params.image_id;

    const query = 'UPDATE Gallery SET title = ?, description = ? WHERE image_id = ?';
    const [rows] = await db.query(query, [title, description, image_id]);

    if (rows.affectedRows === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.status(200).json({ message: 'Image updated successfully' });
  } catch (err) {
    console.error('Error updating image:', err);
    res.status(500).json({ error: 'Error updating image' });
  }
};

// **Delete Image**
exports.deleteImage = async (req, res) => {
  try {
    const image_id = req.params.image_id;

    // Get image URL from database
    const query = 'SELECT image_url FROM Gallery WHERE image_id = ?';
    const [result] = await db.query(query, [image_id]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const image_url = result[0].image_url;

    // Extract public_id from the Cloudinary URL
    const public_id = image_url.split('/').slice(-1)[0].split('.')[0];

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(public_id);

    // Delete from Database
    const deleteQuery = 'DELETE FROM Gallery WHERE image_id = ?';
    const [deleteResult] = await db.query(deleteQuery, [image_id]);

    if (deleteResult.affectedRows === 0) {
      return res.status(500).json({ error: 'Error deleting image from database' });
    }

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ error: 'Error deleting image from Cloudinary', details: err.message });
  }
}; */}

const cloudinary = require('../config/cloudinary'); // Import Cloudinary config
const fs = require('fs');
const Gallery = require('../models/galleryModel');
const upload = require('../config/multer'); // Import Multer config

// **Upload Image**
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Received file:', req.file); // Debugging

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log('Cloudinary upload result:', result);
    
    // Cleanup: Delete file from local uploads
    fs.unlinkSync(req.file.path);

    const { title, description } = req.body;

    // Insert into Database using the Gallery model
    await Gallery.create(result.secure_url, title, description);

    res.status(200).json({ message: 'Image uploaded successfully', image_url: result.secure_url });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Error uploading to Cloudinary', details: err.message });
  }
};

// **Get All Images**
exports.getAllImages = async (req, res) => {
  try {
    const [rows] = await Gallery.getAll();
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ error: 'Error fetching images' });
  }
};

// **Update Image Metadata**
exports.updateImage = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image_id = req.params.image_id;

    const [rows] = await Gallery.update(image_id, null, title, description);

    if (rows.affectedRows === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.status(200).json({ message: 'Image updated successfully' });
  } catch (err) {
    console.error('Error updating image:', err);
    res.status(500).json({ error: 'Error updating image' });
  }
};

// **Delete Image**
exports.deleteImage = async (req, res) => {
  try {
    const image_id = req.params.image_id;

    // Get image URL from database
    const [result] = await Gallery.getById(image_id);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const image_url = result[0].image_url;

    // Extract public_id from the Cloudinary URL
    const public_id = image_url.split('/').slice(-1)[0].split('.')[0];

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(public_id);

    // Delete from Database
    const [deleteResult] = await Gallery.delete(image_id);

    if (deleteResult.affectedRows === 0) {
      return res.status(500).json({ error: 'Error deleting image from database' });
    }

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ error: 'Error deleting image from Cloudinary', details: err.message });
  }
};
