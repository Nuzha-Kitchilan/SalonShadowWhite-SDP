const db = require('../config/db'); // Your mysql2 pool or connection

const ReviewModel = {
  createReview: async (reviewData) => {
    const { 
      customer_ID, 
      appointment_ID, 
      stylist_ID, 
      rating, 
      review_text, 
      is_approved = false 
    } = reviewData;

    const [result] = await db.execute(
      `INSERT INTO Review (
        customer_ID, 
        appointment_ID, 
        stylist_ID, 
        rating, 
        review_text, 
        is_approved
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        customer_ID, 
        appointment_ID, 
        stylist_ID || null, 
        rating, 
        review_text, 
        is_approved
      ]
    );
    return result;
  },

  getApprovedReviews: async () => {
    const [rows] = await db.execute(
      `SELECT 
        r.*, 
        CONCAT(c.firstname, ' ', c.lastname) AS customer_name,
        CONCAT(s.firstname, ' ', s.lastname) AS stylist_name
       FROM Review r 
       JOIN Customer c ON r.customer_ID = c.customer_ID
       LEFT JOIN Stylists s ON r.stylist_ID = s.stylist_ID
       WHERE is_approved = TRUE
       ORDER BY created_at DESC`
    );
    return rows;
  },

  getPendingReviews: async () => {
    const [rows] = await db.execute(
      `SELECT 
        r.*, 
        CONCAT(c.firstname, ' ', c.lastname) AS customer_name,
        CONCAT(s.firstname, ' ', s.lastname) AS stylist_name
       FROM Review r 
       JOIN Customer c ON r.customer_ID = c.customer_ID
       LEFT JOIN Stylists s ON r.stylist_ID = s.stylist_ID
       WHERE is_approved = FALSE
       ORDER BY created_at DESC`
    );
    return rows;
  },

  approveReview: async (review_ID) => {
    const [result] = await db.execute(
      `UPDATE Review SET is_approved = TRUE WHERE review_ID = ?`,
      [review_ID]
    );
    return result;
  },

  deleteReview: async (review_ID) => {
    const [result] = await db.execute(
      `DELETE FROM Review WHERE review_ID = ?`, 
      [review_ID]
    );
    return result;
  },

  checkAppointmentReview: async (appointment_ID, customer_ID) => {
    const [rows] = await db.execute(
      `SELECT * FROM Review 
       WHERE appointment_ID = ? AND customer_ID = ?`,
      [appointment_ID, customer_ID]
    );
    return rows.length > 0;
  },

  // Added the getAverageRatings method inside the ReviewModel object
  getAverageRatings: async () => {
    const [rows] = await db.execute(
      `SELECT 
        stylist_ID, 
        AVG(rating) as averageRating,
        COUNT(*) as reviewCount
       FROM Review 
       WHERE is_approved = TRUE AND stylist_ID IS NOT NULL
       GROUP BY stylist_ID`
    );
    return rows;
  },


   getRandomApprovedReviews: async (limit = 5) => {
  // Convert limit to a number and ensure it's safe
  const limitValue = Math.max(1, Math.min(parseInt(limit, 10), 100));
  
  // Use a number directly in the SQL query instead of a parameter
  const [rows] = await db.execute(
    `SELECT 
      r.*, 
      CONCAT(c.firstname, ' ', c.lastname) AS customer_name,
      CONCAT(s.firstname, ' ', s.lastname) AS stylist_name
     FROM Review r 
     JOIN Customer c ON r.customer_ID = c.customer_ID
     LEFT JOIN Stylists s ON r.stylist_ID = s.stylist_ID
     WHERE r.is_approved = TRUE
     ORDER BY RAND() 
     LIMIT ${limitValue}`
  );
  return rows;
}
};

module.exports = ReviewModel;