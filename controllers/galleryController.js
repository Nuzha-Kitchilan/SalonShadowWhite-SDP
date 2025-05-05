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
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const Gallery = require('../models/galleryModel');

/**
 * @desc    Get all gallery images
 * @route   GET /api/gallery
 * @access  Public
 */
exports.getAllImages = async (req, res) => {
  try {
    const [images] = await Gallery.getAll();
    
    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (err) {
    console.error('Failed to fetch images:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Upload new image
 * @route   POST /api/gallery
 * @access  Private
 */
exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No image file provided'
    });
  }

  const { title, description } = req.body;
  
  if (!title || !description) {
    if (req.file.path) fs.unlinkSync(req.file.path);
    return res.status(400).json({
      success: false,
      error: 'Title and description are required'
    });
  }

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'salon_gallery',
      resource_type: 'auto'
    });

    // Save to database
    const [dbResult] = await Gallery.create(
      result.secure_url,
      title,
      description
    );

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      data: {
        image_id: dbResult.insertId,
        image_url: result.secure_url,
        title,
        description
      }
    });

  } catch (err) {
    // Clean up temp file if exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Upload failed:', err);
    const statusCode = err.message.includes('Cloudinary') ? 502 : 500;

    res.status(statusCode).json({
      success: false,
      error: 'Upload failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Update image metadata
 * @route   PUT /api/gallery/:id
 * @access  Private
 */
exports.updateImage = async (req, res) => {
  try {
    const image_id = parseInt(req.params.id);
    const { title, description } = req.body;

    // Validate image ID
    if (!image_id || isNaN(image_id)) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid image ID is required' 
      });
    }

    // Validate at least one field is provided
    if (title === undefined && description === undefined) {
      return res.status(400).json({ 
        success: false,
        error: 'At least title or description must be provided' 
      });
    }

    // Get existing image first
    const [existingImage] = await Gallery.getById(image_id);
    if (!existingImage || existingImage.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    // Prepare update data (use existing values if not provided)
    const updateData = {
      title: title !== undefined ? title : existingImage[0].title,
      description: description !== undefined ? description : existingImage[0].description
    };

    // Update in database
    const [result] = await Gallery.update(
      image_id,
      updateData.title,
      updateData.description
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Image not found or no changes made'
      });
    }

    // Return updated image
    const [updatedImage] = await Gallery.getById(image_id);
    
    res.status(200).json({
      success: true,
      data: updatedImage[0]
    });

  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error during update',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Delete image
 * @route   DELETE /api/gallery/:id
 * @access  Private
 */
exports.deleteImage = async (req, res) => {
  try {
    const image_id = parseInt(req.params.id);

    // Validate image ID
    if (!image_id || isNaN(image_id)) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid image ID is required' 
      });
    }

    // Get image first
    const [image] = await Gallery.getById(image_id);
    if (!image || image.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    // Delete from Cloudinary
    const imageUrl = image[0].image_url;
    const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
    await cloudinary.uploader.destroy(`salon_gallery/${publicId}`);

    // Delete from database
    await Gallery.delete(image_id);

    res.status(200).json({
      success: true,
      data: {
        deleted_id: image_id
      }
    });

  } catch (err) {
    console.error('Delete failed:', err);
    res.status(500).json({
      success: false,
      error: 'Delete failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};