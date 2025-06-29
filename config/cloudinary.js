
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const cloudinary = require('cloudinary').v2;

// Validate configuration
const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
};



if (!config.cloud_name || !config.api_key || !config.api_secret) {
  throw new Error(' Missing Cloudinary configuration in .env');
}

cloudinary.config(config);

// Test connection immediately
cloudinary.api.ping()
  .then(() => console.log('Cloudinary connection verified'))
  .catch(err => {
    console.error(' Cloudinary connection failed');
    throw err;
  });

module.exports = cloudinary;