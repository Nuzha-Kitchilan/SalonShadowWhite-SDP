// const multer = require("multer");
// const path = require("path");

// // Ensure the uploads folder exists
// const uploadDirectory = path.join(__dirname, "../uploads");
// const fs = require("fs");
// if (!fs.existsSync(uploadDirectory)) {
//   fs.mkdirSync(uploadDirectory, { recursive: true });
// }

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDirectory); // Store in "uploads" folder
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate unique filename
//   },
// });

// // File filter (Allow only images)
// const fileFilter = (req, file, cb) => {
//   const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
//   const ext = path.extname(file.originalname).toLowerCase();
  
//   if (allowedExtensions.includes(ext)) {
//     cb(null, true); // Accept file
//   } else {
//     cb(new Error("Only image files are allowed!"), false); // Reject file
//   }
// };

// // Initialize multer
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });

// module.exports = upload;



const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure upload directory
const uploadDirectory = path.join(__dirname, "../uploads");

// Create directory if not exists (with error handling)
try {
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
    console.log(`📁 Created uploads directory at ${uploadDirectory}`);
  }
} catch (err) {
  console.error("❌ Failed to create uploads directory:", err);
  process.exit(1); // Crash early if we can't create directory
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`🚫 Invalid file type! Allowed: ${allowedExtensions.join(', ')}`), false);
  }
};

// Initialize Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 // Allow only 1 file
  }
});

module.exports = upload;