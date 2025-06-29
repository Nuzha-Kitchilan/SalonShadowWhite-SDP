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

    // Prepare update data
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