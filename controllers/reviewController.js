




// const ReviewModel = require('../models/reviewModel');
// // Import the database connection
// const db = require('../config/db');


//   let cachedReviews = null;
//   let cacheExpiry = null;

// const ReviewController = {
//   submitReviewForAppointment: async (req, res) => {
//     try {
//       const { appointmentId } = req.params;
//       const { rating, comment, stylistId } = req.body;
      
//       // Authentication check
//       const customer_ID = req.user?.customer_ID || req.user?.id;
//       if (!customer_ID) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       // Basic validation
//       if (!rating || !comment) {
//         return res.status(400).json({ error: 'Rating and comment are required' });
//       }

//       // For stylist reviews, verify the stylist exists
//       if (stylistId) {
//         const [stylist] = await db.execute(
//           'SELECT 1 FROM Stylists WHERE stylist_ID = ?',
//           [stylistId]
//         );
//         if (!stylist.length) {
//           return res.status(400).json({ error: 'Invalid stylist ID' });
//         }
//       }

//       // Check for existing review
//       const reviewExists = await ReviewModel.checkAppointmentReview(
//         appointmentId, 
//         customer_ID
//       );
//       if (reviewExists) {
//         return res.status(400).json({ error: 'Review already submitted for this appointment' });
//       }

//       // Create the review
//       const reviewData = {
//         customer_ID,
//         appointment_ID: appointmentId,
//         stylist_ID: stylistId || null,
//         rating,
//         review_text: comment,
//         is_approved: false
//       };

//       const result = await ReviewModel.createReview(reviewData);
      
//       res.status(201).json({ 
//         message: 'Review submitted for approval', 
//         review_ID: result.insertId 
//       });
//     } catch (err) {
//       console.error('Review submission error:', err);
//       res.status(500).json({ 
//         error: 'Failed to submit review', 
//         details: err.message 
//       });
//     }
//   },

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
//   },

//     getAverageRatings: async (req, res) => {
//     try {
//       const averageRatings = await ReviewModel.getAverageRatings();
//       res.json(averageRatings);
//     } catch (err) {
//       console.error('Fetch average ratings error:', err);
//       res.status(500).json({ error: 'Failed to fetch average ratings' });
//     }
//     },


//   getRandomReviews: async (req, res) => {
//     try {
//       const now = new Date();
      
//       // Check if cache is expired (weekly rotation)
//       if (!cachedReviews || !cacheExpiry || now > cacheExpiry) {
//         // Refresh cache
//         cachedReviews = await ReviewModel.getRandomApprovedReviews(5);
        
//         // Set expiry to next week (7 days from now)
//         cacheExpiry = new Date();
//         cacheExpiry.setDate(cacheExpiry.getDate() + 7);
        
//         console.log('Refreshed review cache. Next refresh at:', cacheExpiry);
//       }

//       res.json(cachedReviews);
//     } catch (err) {
//       console.error('Fetch random reviews error:', err);
//       res.status(500).json({ 
//         error: 'Failed to fetch random reviews',
//         details: err.message 
//       });
//     }
//   },

//   forceRefreshCache: async (req, res) => {
//   try {
//     // Force reset cache
//     cachedReviews = null;
//     cacheExpiry = null;
    
//     // Get fresh reviews
//     const reviews = await ReviewController.getRandomReviews(req, res);
    
//     res.json({
//       message: 'Cache refreshed successfully',
//       reviews
//     });
//   } catch (err) {
//     console.error('Force refresh error:', err);
//     res.status(500).json({ error: 'Failed to refresh cache' });
//   }
// },

// getReviewsByStylist: async (req, res) => {
//   try {
//     const reviews = await ReviewModel.getReviewsByStylist(req.params.stylistId);
//     res.json(reviews);
//   } catch (err) {
//     console.error('Fetch stylist reviews error:', err);
//     res.status(500).json({ 
//       error: 'Failed to fetch stylist reviews',
//       details: err.message 
//     });
//   }
// }


// };

// module.exports = ReviewController;

















const ReviewModel = require('../models/reviewModel');
const db = require('../config/db'); // Database connection

let cachedReviews = null;
let cacheExpiry = null;

const ReviewController = {
  submitReviewForAppointment: async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const { rating, comment, stylistId } = req.body;
      
      const customer_ID = req.user?.customer_ID || req.user?.id;
      if (!customer_ID) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!rating || !comment) {
        return res.status(400).json({ error: 'Rating and comment are required' });
      }

      if (stylistId) {
        const [stylist] = await db.execute(
          'SELECT 1 FROM Stylists WHERE stylist_ID = ?',
          [stylistId]
        );
        if (!stylist.length) {
          return res.status(400).json({ error: 'Invalid stylist ID' });
        }
      }

      const reviewExists = await ReviewModel.checkAppointmentReview(
        appointmentId, 
        customer_ID
      );
      if (reviewExists) {
        return res.status(400).json({ error: 'Review already submitted for this appointment' });
      }

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
  },

  getAverageRatings: async (req, res) => {
    try {
      const averageRatings = await ReviewModel.getAverageRatings();
      res.json(averageRatings);
    } catch (err) {
      console.error('Fetch average ratings error:', err);
      res.status(500).json({ error: 'Failed to fetch average ratings' });
    }
  },

  getRandomReviews: async (req, res) => {
    try {
      const now = new Date();

      console.log('Cache state before fetch:', {
        cachedReviewsLength: cachedReviews?.length || 0,
        cacheExpiry
      });

      if (!cachedReviews || !cacheExpiry || now > cacheExpiry) {
        cachedReviews = await ReviewModel.getRandomApprovedReviews(5);
        cacheExpiry = new Date();
        cacheExpiry.setDate(cacheExpiry.getDate() + 7);

        console.log('Refreshed review cache. Next refresh at:', cacheExpiry);
      }

      res.json(cachedReviews);
    } catch (err) {
      console.error('Fetch random reviews error:', err);
      res.status(500).json({ 
        error: 'Failed to fetch random reviews',
        details: err.message 
      });
    }
  },

  forceRefreshCache: async (req, res) => {
    try {
      // Forcefully reset and refresh the cache
      cachedReviews = await ReviewModel.getRandomApprovedReviews(5);
      cacheExpiry = new Date();
      cacheExpiry.setDate(cacheExpiry.getDate() + 7);

      console.log('Forced cache refresh. New expiry:', cacheExpiry);

      res.json({
        message: 'Cache refreshed successfully',
        reviews: cachedReviews
      });
    } catch (err) {
      console.error('Force refresh error:', err);
      res.status(500).json({ error: 'Failed to refresh cache' });
    }
  },

  getReviewsByStylist: async (req, res) => {
    try {
      const reviews = await ReviewModel.getReviewsByStylist(req.params.stylistId);
      res.json(reviews);
    } catch (err) {
      console.error('Fetch stylist reviews error:', err);
      res.status(500).json({ 
        error: 'Failed to fetch stylist reviews',
        details: err.message 
      });
    }
  }
};

module.exports = ReviewController;
