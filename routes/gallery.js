{/* const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const multer = require('multer');

// Configure Multer (Store files temporarily before upload)
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Get all gallery images
router.get('/gallery', galleryController.getAllImages);

// Upload a new image
router.post('/gallery', upload.single('image'), galleryController.uploadImage);

// Update image metadata (title & description)
router.put('/gallery/:image_id', galleryController.updateImage);

// Delete an image
router.delete('/gallery/:image_id', galleryController.deleteImage);

module.exports = router; */}


{/*const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const multer = require('multer');

// Configure Multer (Store files temporarily before upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Get all gallery images
router.get('/gallery', galleryController.getAllImages);

// Upload a new image
router.post('/gallery', upload.single('image'), galleryController.uploadImage);

// Update image metadata (title & description)
router.put('/gallery/:image_id', galleryController.updateImage);

// Delete an image
router.delete('/gallery/:image_id', galleryController.deleteImage);

module.exports = router; */}


// const express = require('express');
// const router = express.Router();
// const galleryController = require('../controllers/galleryController');
// //const multer = require('multer');

// // Configure Multer (Store files temporarily before upload)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// // File validation: size limit (5MB) and image types (jpg, jpeg, png)
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// });

// // Get all gallery images
// router.get('/gallery', galleryController.getAllImages);

// // Upload a new image
// router.post('/gallery', upload.single('image'), galleryController.uploadImage);

// // Update image metadata (title & description)
// router.put('/gallery/:image_id', galleryController.updateImage);

// // Delete an image
// router.delete('/gallery/:image_id', galleryController.deleteImage);

// module.exports = router;

const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const upload = require('../config/multer'); // Import the Multer configuration

// Route for fetching all gallery images
router.get('/gallery', galleryController.getAllImages);

// Route for uploading a new image
router.post('/gallery', upload.single('image'), galleryController.uploadImage);

// Route for updating image metadata (title & description)
router.put('/gallery/:image_id', galleryController.updateImage);

// Route for deleting an image
router.delete('/gallery/:image_id', galleryController.deleteImage);

module.exports = router;
