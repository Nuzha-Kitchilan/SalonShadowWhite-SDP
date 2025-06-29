const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const upload = require('../config/multer'); 

// Route for fetching all gallery images
router.get('/gallery', galleryController.getAllImages);

// Route for uploading a new image
router.post('/gallery', upload.single('image'), galleryController.uploadImage);

// Route for updating image metadata 
router.put('/gallery/:id', galleryController.updateImage);

// Route for deleting an image
router.delete('/gallery/:id', galleryController.deleteImage);

module.exports = router;
