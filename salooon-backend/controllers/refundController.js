const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const refundModel = require('../models/refundModel');
const paymentModel = require('../models/paymentModel');
const db = require('../config/db');

const processStripeRefund = async (req, res) => {
    const { payment_intent_id, amount, reason = 'requested_by_customer' } = req.body;
    
    if (!payment_intent_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment_intent_id in request body'
      });
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid refund amount is required'
      });
    }
    
    try {
      // Validate reason is one of Stripe's accepted values
      const validReasons = ['duplicate', 'fraudulent', 'requested_by_customer'];
      const stripeReason = validReasons.includes(reason) ? reason : 'requested_by_customer';
      
      // Get payment details
      const paymentDetails = await paymentModel.getPaymentDetailsByIntentId(payment_intent_id);
      
      if (!paymentDetails) {
        return res.status(404).json({ 
          success: false,
          error: 'Original payment not found in database',
          details: { payment_intent_id }
        });
      }

      // Check if this payment has already been refunded in our database
      const connection = await db.getConnection();
      try {
        const [existingRefunds] = await connection.query(
          `SELECT * FROM Refund WHERE payment_ID = ?`,
          [paymentDetails.payment_ID]
        );
        
        if (existingRefunds.length > 0) {
          return res.status(409).json({ 
            success: false,
            error: 'This payment has already been refunded in our system',
            existingRefund: existingRefunds[0]
          });
        }
        
        // Get refunds from Stripe to double check
        const stripeRefunds = await stripe.refunds.list({
          payment_intent: payment_intent_id,
          limit: 5
        });
        
        if (stripeRefunds.data.length > 0) {
          const refundData = {
            payment_ID: paymentDetails.payment_ID,
            appointment_ID: paymentDetails.appointment_ID,
            admin_ID: req.user.id,
            refund_amount: amount,
            refund_status: 'Processed',
            stripe_refund_id: stripeRefunds.data[0].id
          };
          
          const refundId = await refundModel.createRefund(refundData);
          
          return res.status(200).json({
            success: true,
            message: 'Payment was already refunded in Stripe. Record created in our database.',
            refundId,
            stripeRefundId: stripeRefunds.data[0].id,
            status: 'succeeded'
          });
        }
        
        // Create refund in Stripe 
        const refund = await stripe.refunds.create({
          payment_intent: payment_intent_id,
          amount: Math.round(amount * 100), 
          reason: stripeReason
        });
    
        // Record the refund in our database
        const refundData = {
          payment_ID: paymentDetails.payment_ID,
          appointment_ID: paymentDetails.appointment_ID,
          admin_ID: req.user.id,
          refund_amount: amount,
          refund_status: 'Processed',
          stripe_refund_id: refund.id
        };
    
        const refundId = await refundModel.createRefund(refundData);
    
        res.status(200).json({
          success: true,
          message: 'Refund processed successfully',
          refundId,
          stripeRefundId: refund.id,
          status: refund.status
        });
      } finally {
        connection.release(); 
      }
    } catch (error) {
      console.error('Stripe or DB Error:', error);
      
      // Special handling for Stripe errors
      if (error.type === 'StripeInvalidRequestError') {
        if (error.raw.code === 'charge_already_refunded') {
          try {
            const refundData = {
              payment_ID: paymentDetails?.payment_ID,
              appointment_ID: paymentDetails?.appointment_ID,
              admin_ID: req.user.id,
              refund_amount: amount,
              refund_status: 'Processed',
              stripe_refund_id: 'already_refunded_in_stripe'
            };
            
            const refundId = await refundModel.createRefund(refundData);
            
            return res.status(200).json({
              success: true,
              message: 'Charge has already been refunded in Stripe. Record created in database.',
              refundId,
              stripeRefundId: 'already_refunded_in_stripe',
              status: 'succeeded'
            });
          } catch (dbError) {
            console.error('Failed to create refund record after stripe error:', dbError);
            return res.status(500).json({
              success: false,
              error: 'Charge already refunded in Stripe, but failed to record in database',
              details: dbError.message
            });
          }
        }
        
        // Handle other Stripe errors
        return res.status(400).json({
          success: false,
          error: 'Stripe error',
          details: error.message,
          code: error.raw?.code
        });
      }
      
      // Handle other errors
      res.status(500).json({ 
        success: false,
        error: 'Failed to process refund',
        details: error.message 
      });
    }
};

const getRefundsByAppointment = async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await db.getConnection();
      
      const [refunds] = await connection.query(
        `SELECT * FROM Refund WHERE appointment_ID = ?`,
        [id]
      );
      
      connection.release();
      
      res.status(200).json({
        success: true,
        refunds
      });
    } catch (error) {
      console.error('Error fetching refunds:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch refunds',
        details: error.message
      });
    }
};

module.exports = {
  processStripeRefund,
  getRefundsByAppointment
};