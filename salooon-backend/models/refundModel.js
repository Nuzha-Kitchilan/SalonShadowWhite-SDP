const db = require('../config/db');

const createRefund = async (refundData) => {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.query(
      `INSERT INTO Refund SET ?`, 
      refundData
    );
    return result.insertId;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};

const updateRefundStatus = async (refundId, status, stripeRefundId = null) => {
  const connection = await db.getConnection();
  try {
    await connection.query(
      `UPDATE Refund 
       SET refund_status = ?, 
           stripe_refund_id = IFNULL(?, stripe_refund_id)
       WHERE refund_ID = ?`,
      [status, stripeRefundId, refundId]
    );
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};

module.exports = {
  createRefund,
  updateRefundStatus
};