const mysql = require('mysql2');
require('dotenv').config();

// Use a pool for handling multiple queries
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.query('SELECT 1', (err, results) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Database connected successfully!');
    }
});

module.exports = db.promise();