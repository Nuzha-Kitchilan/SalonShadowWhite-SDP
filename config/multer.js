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
  console.error("Failed to create uploads directory:", err);
  process.exit(1);
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
    cb(new Error(`Invalid file type! Allowed: ${allowedExtensions.join(', ')}`), false);
  }
};

// Initialize Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, 
    files: 1 
  }
});

module.exports = upload;