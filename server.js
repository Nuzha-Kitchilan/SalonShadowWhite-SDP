 // server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});


const authRoutes = require('./routes/auth');  // Ensure this import is correct
//const { loginAdmin } = require('../controllers/authController');
const serviceRoutes = require("./routes/services");
const inventoryRoutes = require('./routes/inventory');
const stylistRoutes = require('./routes/stylist');
const galleryRoutes = require('./routes/gallery');
const candidateRoutes = require('./routes/candidate');
//console.log(inventoryRoutes);
const app = express();

app.use(cors({
  origin: ['http://localhost:5173',
            'http://localhost:5174'
   ], 
  credentials: true, // Important for cookies/auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);  // Ensure you're passing the router here

app.use('/api', serviceRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', stylistRoutes);
app.use('/api', galleryRoutes);
app.use('/api/candidates', candidateRoutes);


app.get('/', (req, res) => {
    res.send('Server is working!');
});


const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  



// server.js
{/*const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const serviceRoutes = require("./routes/services");
const inventoryRoutes = require('./routes/inventory');
const stylistRoutes = require('./routes/stylist');

const app = express();

// Improved CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your React frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', serviceRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', stylistRoutes);

app.get('/', (req, res) => {
    res.send('Server is working!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); */}