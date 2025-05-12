// const ReviewModel = require('../models/reviewModel');

// const ReviewController = {
// // submitReviewForAppointment: async (req, res) => {
// //   try {
// //     const { appointmentId } = req.params;
// //     const { rating, comment, includeStylistReview } = req.body;
    
// //     const customer_ID = req.user?.customer_ID || req.user?.id;
// //     if (!customer_ID) {
// //       return res.status(401).json({ error: 'Unauthorized' });
// //     }

// //     let stylist_ID = null;
    
// //     // Only get stylist if the customer wants to include them in the review
// //     if (includeStylistReview) {
// //       const [appointment] = await db.execute(
// //         `SELECT stylist_ID FROM Appointment WHERE appointment_ID = ?`,
// //         [appointmentId]
// //       );
      
// //       if (appointment.length && appointment[0].stylist_ID) {
// //         stylist_ID = appointment[0].stylist_ID;
// //       }
// //     }
    
    
// //     // Basic validation
// //     if (!rating || !comment) {
// //       return res.status(400).json({ error: 'Rating and comment are required' });
// //     }

// //     // Validate rating
// //     if (typeof rating !== 'number' || rating < 1 || rating > 5) {
// //       return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
// //     }

// //     // Check if review already exists
// //     const reviewExists = await ReviewModel.checkAppointmentReview(
// //       appointmentId, 
// //       customer_ID
// //     );

// //     if (reviewExists) {
// //       return res.status(400).json({ error: 'Review already submitted for this appointment' });
// //     }

// //     // Submit review
// //     const reviewData = {
// //       customer_ID,
// //       appointment_ID: appointmentId,
// //       stylist_ID,
// //       rating,
// //       review_text: comment,
// //       is_approved: false
// //     };

// //     const result = await ReviewModel.createReview(reviewData);
    
// //     res.status(201).json({ 
// //       message: 'Review submitted for approval', 
// //       review_ID: result.insertId 
// //     });
// //   } catch (err) {
// //     console.error('Review submission error:', err);
// //     res.status(500).json({ 
// //       error: 'Failed to submit review', 
// //       details: err.message 
// //     });
// //   }
// // },






// submitReviewForAppointment: async (req, res) => {
//   try {
//     const { appointmentId } = req.params;
//     const { rating, comment, stylistId } = req.body;
    
//     // Authentication check
//     const customer_ID = req.user?.customer_ID || req.user?.id;
//     if (!customer_ID) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     // Basic validation
//     if (!rating || !comment) {
//       return res.status(400).json({ error: 'Rating and comment are required' });
//     }

//     // For stylist reviews, verify the stylist exists
//     if (stylistId) {
//       const [stylist] = await db.execute(
//         'SELECT 1 FROM Stylists WHERE stylist_ID = ?',
//         [stylistId]
//       );
//       if (!stylist.length) {
//         return res.status(400).json({ error: 'Invalid stylist ID' });
//       }
//     }

//     // Check for existing review
//     const reviewExists = await ReviewModel.checkAppointmentReview(
//       appointmentId, 
//       customer_ID
//     );
//     if (reviewExists) {
//       return res.status(400).json({ error: 'Review already submitted for this appointment' });
//     }

//     // Create the review
//     const reviewData = {
//       customer_ID,
//       appointment_ID: appointmentId,
//       stylist_ID: stylistId || null, // This is the key difference
//       rating,
//       review_text: comment,
//       is_approved: false
//     };

//     const result = await ReviewModel.createReview(reviewData);
    
//     res.status(201).json({ 
//       message: 'Review submitted for approval', 
//       review_ID: result.insertId 
//     });
//   } catch (err) {
//     console.error('Review submission error:', err);
//     res.status(500).json({ 
//       error: 'Failed to submit review', 
//       details: err.message 
//     });
//   }
// },





//   listApprovedReviews: async (req, res) => {
//     try {
//       const reviews = await ReviewModel.getApprovedReviews();
//       res.json(reviews);
//     } catch (err) {
//       console.error('Fetch approved reviews error:', err);
//       res.status(500).json({ error: 'Failed to fetch reviews' });
//     }
//   },

//   listPendingReviews: async (req, res) => {
//     try {
//       const reviews = await ReviewModel.getPendingReviews();
//       res.json(reviews);
//     } catch (err) {
//       console.error('Fetch pending reviews error:', err);
//       res.status(500).json({ error: 'Error fetching pending reviews' });
//     }
//   },

//   approveReview: async (req, res) => {
//     try {
//       await ReviewModel.approveReview(req.params.id);
//       res.json({ message: 'Review approved' });
//     } catch (err) {
//       console.error('Approve review error:', err);
//       res.status(500).json({ error: 'Failed to approve review' });
//     }
//   },

//   deleteReview: async (req, res) => {
//     try {
//       await ReviewModel.deleteReview(req.params.id);
//       res.json({ message: 'Review deleted' });
//     } catch (err) {
//       console.error('Delete review error:', err);
//       res.status(500).json({ error: 'Failed to delete review' });
//     }
//   }
// };

// module.exports = ReviewController;











const ReviewModel = require('../models/reviewModel');
// Import the database connection
const db = require('../config/db');

const ReviewController = {
  submitReviewForAppointment: async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const { rating, comment, stylistId } = req.body;
      
      // Authentication check
      const customer_ID = req.user?.customer_ID || req.user?.id;
      if (!customer_ID) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Basic validation
      if (!rating || !comment) {
        return res.status(400).json({ error: 'Rating and comment are required' });
      }

      // For stylist reviews, verify the stylist exists
      if (stylistId) {
        const [stylist] = await db.execute(
          'SELECT 1 FROM Stylists WHERE stylist_ID = ?',
          [stylistId]
        );
        if (!stylist.length) {
          return res.status(400).json({ error: 'Invalid stylist ID' });
        }
      }

      // Check for existing review
      const reviewExists = await ReviewModel.checkAppointmentReview(
        appointmentId, 
        customer_ID
      );
      if (reviewExists) {
        return res.status(400).json({ error: 'Review already submitted for this appointment' });
      }

      // Create the review
      const reviewData = {
        customer_ID,
        appointment_ID: appointmentId,
        stylist_ID: stylistId || null,
        rating,
        review_text: comment,
        is_approved: false
      };

      const result = await ReviewModel.createReview(reviewData);
      
      res.status(201).json({ 
        message: 'Review submitted for approval', 
        review_ID: result.insertId 
      });
    } catch (err) {
      console.error('Review submission error:', err);
      res.status(500).json({ 
        error: 'Failed to submit review', 
        details: err.message 
      });
    }
  },

  listApprovedReviews: async (req, res) => {
    try {
      const reviews = await ReviewModel.getApprovedReviews();
      res.json(reviews);
    } catch (err) {
      console.error('Fetch approved reviews error:', err);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  },

  listPendingReviews: async (req, res) => {
    try {
      const reviews = await ReviewModel.getPendingReviews();
      res.json(reviews);
    } catch (err) {
      console.error('Fetch pending reviews error:', err);
      res.status(500).json({ error: 'Error fetching pending reviews' });
    }
  },

  approveReview: async (req, res) => {
    try {
      await ReviewModel.approveReview(req.params.id);
      res.json({ message: 'Review approved' });
    } catch (err) {
      console.error('Approve review error:', err);
      res.status(500).json({ error: 'Failed to approve review' });
    }
  },

  deleteReview: async (req, res) => {
    try {
      await ReviewModel.deleteReview(req.params.id);
      res.json({ message: 'Review deleted' });
    } catch (err) {
      console.error('Delete review error:', err);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  }
};

module.exports = ReviewController;