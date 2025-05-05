// const db = require('../config/db');

// const savePaymentDetails = async (paymentData) => {
//   try {
//     const {
//       appointment_ID = null,
//       customer_ID,
//       payment_amount,
//       payment_status,
//       payment_type,
//       is_first_time,
//       stripe_payment_intent_id = null
//     } = paymentData;

//     const [result] = await db.query(
//       `INSERT INTO Payment (
//         appointment_ID,
//         customer_ID,
//         payment_amount,
//         payment_status,
//         payment_type,
//         is_first_time,
//         stripe_payment_intent_id,
//         payment_date
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, IF(? = 'Paid', NOW(), NULL))`,
//       [
//         appointment_ID,
//         customer_ID,
//         payment_amount,
//         payment_status,
//         payment_type,
//         is_first_time,
//         stripe_payment_intent_id,
//         payment_status
//       ]
//     );

//     return result.insertId;
//   } catch (error) {
//     console.error('Database Error in savePaymentDetails:', error);
//     throw new Error('Failed to save payment details to database');
//   }
// };

// module.exports = {
//   savePaymentDetails
// };



//BELOW IS THE LAST WORKING CODE 

// const db = require('../config/db');

// const savePaymentDetails = async (paymentData) => {
//   try {
//     const {
//       appointment_ID = null,
//       customer_ID,
//       payment_amount,
//       amount_paid = null, // New field
//       payment_status,
//       payment_type,
//       is_first_time,
//       stripe_payment_intent_id = null
//     } = paymentData;

//     const [result] = await db.query(
//       `INSERT INTO Payment (
//         appointment_ID,
//         customer_ID,
//         payment_amount,
//         amount_paid,
//         payment_status,
//         payment_type,
//         is_first_time,
//         stripe_payment_intent_id,
//         payment_date
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, IF(? = 'Paid', NOW(), NULL))`,
//       [
//         appointment_ID,
//         customer_ID,
//         payment_amount,
//         amount_paid,
//         payment_status,
//         payment_type,
//         is_first_time,
//         stripe_payment_intent_id,
//         payment_status
//       ]
//     );

//     return result.insertId;
//   } catch (error) {
//     console.error('Database Error in savePaymentDetails:', error);
//     throw new Error('Failed to save payment details to database');
//   }
// };

// module.exports = {
//   savePaymentDetails
// };







const db = require('../config/db');

const savePaymentDetails = async (paymentData) => {
  try {
    const {
      appointment_ID = null,
      customer_ID,
      payment_amount,
      amount_paid = null,
      payment_status,
      payment_type,
      is_first_time,
      stripe_payment_intent_id = null
    } = paymentData;

    // For first-time customers paying online, ensure amount_paid is 50%
    const finalAmountPaid = is_first_time && payment_type === 'Online' && payment_status === 'Partially Paid'
      ? payment_amount * 0.5
      : amount_paid;

    // Add debugging information
    console.log('Payment data to be inserted:', {
      appointment_ID,
      customer_ID,
      payment_amount,
      finalAmountPaid,
      payment_status,
      payment_type,
      is_first_time,
      stripe_payment_intent_id
    });

    // Convert boolean to integer for MySQL
    const isFirstTimeInt = is_first_time ? 1 : 0;

    // Simpler query structure without conditional date logic
    const [result] = await db.query(
      `INSERT INTO Payment (
        appointment_ID,
        customer_ID,
        payment_amount,
        amount_paid,
        payment_status,
        payment_type,
        is_first_time,
        stripe_payment_intent_id,
        payment_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        appointment_ID,
        customer_ID,
        payment_amount,
        finalAmountPaid,
        payment_status,
        payment_type,
        isFirstTimeInt, // Convert boolean to int
        stripe_payment_intent_id
      ]
    );

    console.log('Payment record created with ID:', result.insertId);
    return result.insertId;
  } catch (error) {
    console.error('Database Error in savePaymentDetails:', error);
    // More detailed error logging
    if (error.code) {
      console.error('SQL Error Code:', error.code);
      console.error('SQL Error Number:', error.errno);
      console.error('SQL Error Message:', error.sqlMessage);
    }
    throw new Error('Failed to save payment details to database');
  }
};


// Function to fetch payment details by appointment ID
const getPaymentDetailsByAppointment = async (appointment_ID) => {
  try {
    const [paymentDetails] = await db.query(
      `SELECT * FROM Payment WHERE appointment_ID = ?`,
      [appointment_ID]
    );
    return paymentDetails;
  } catch (error) {
    console.error('Error fetching payment details by appointment:', error);
    throw new Error('Failed to fetch payment details by appointment');
  }
};



const getPaymentDetailsByIntentId = async (paymentIntentId) => {
  const connection = await db.getConnection();
  try {
    const [payments] = await connection.query(
      `SELECT * FROM Payment WHERE stripe_payment_intent_id = ?`,
      [paymentIntentId]
    );
    return payments[0] || null;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};


module.exports = {
  savePaymentDetails,
  getPaymentDetailsByAppointment, // Add this new function to exports
  getPaymentDetailsByIntentId
};
