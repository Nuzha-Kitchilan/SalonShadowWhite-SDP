 // server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
require('events').EventEmitter.defaultMaxListeners = 20;

// console.log('Cloudinary Config:', {
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET
// });


const authRoutes = require('./routes/auth');  // Ensure this import is correct
//const { loginAdmin } = require('../controllers/authController');
const serviceRoutes = require("./routes/services");
const inventoryRoutes = require('./routes/inventory');
const stylistRoutes = require('./routes/stylist');
const galleryRoutes = require('./routes/gallery');
const candidateRoutes = require('./routes/candidate');
const customerRoutes = require('./routes/customer'); 
const workingHoursRoutes = require('./routes/workingHours'); 
const cartRoutes = require('./routes/cart'); 
const bookingRoutes = require('./routes/booking'); 
const appointmentRoutes = require('./routes/appointment');
const paymentRoutes = require('./routes/payment');
const adminAppointmentRoutes = require('./routes/adminAppointment'); 
const refundRoutes = require('./routes/refund'); 
const specialRequestRoutes = require('./routes/specialRequest'); 
const revenueRoutes = require('./routes/dashboard/revenue');
const dashboardAppointmentRoutes = require('./routes/dashboard/appointment');
const servicePopularityRoutes = require('./routes/dashboard/services'); 
const stylistPopularityRoutes = require('./routes/dashboard/stylists');
const customerPopularityRoutes = require('./routes/dashboard/customer');
const performanceRoutes = require('./routes/dashboard/performance');
const reportRoutes = require('./routes/report');
const reviewRoutes = require('./routes/review');
const contactRoutes = require('./routes/contact')
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

app._router.stack
  .filter(r => r.route)
  .forEach(r => {
    console.log(`${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);
  });


app.use('/api/auth', authRoutes);  // Ensure you're passing the router here

app.use('/api', serviceRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', stylistRoutes);
app.use('/api', galleryRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/customers', customerRoutes); 
app.use('/api/workingHours', workingHoursRoutes); 
app.use('/api/cart', cartRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/payment', paymentRoutes); 
app.use('/api/admin', adminAppointmentRoutes);
app.use('/api/refund', refundRoutes);
app.use('/api/specialRequest', specialRequestRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/dashboard/appointments', dashboardAppointmentRoutes);
app.use('/api/dashboard/services', servicePopularityRoutes); 
app.use('/api/dashboard/stylists', stylistPopularityRoutes);
app.use('/api/dashboard/customer', customerPopularityRoutes);
app.use('/api/dashboard/performance', performanceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/contact', contactRoutes);


app.get('/', (req, res) => {
    res.send('Server is working!');
});


const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  



