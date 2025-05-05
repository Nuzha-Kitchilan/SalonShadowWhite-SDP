const db = require("../config/db");

// Add item to cart
const addToCart = async (customer_id, service_id, stylist_id = null, selected_date, selected_time) => {
  
  if (stylist_id && !Number.isInteger(stylist_id)) {
    throw new Error("Invalid stylist ID provided.");
  }

  
  const [result] = await db.query(
    `INSERT INTO Appointment_Cart (customer_id, service_id, stylist_id, selected_date, selected_time)
     VALUES (?, ?, ?, ?, ?)`,
    [customer_id, service_id, stylist_id, selected_date, selected_time]
  );
  return result;
};

// ✅ Fixed: Get cart items with service_id included
const getCartByCustomerId = async (customer_id) => {
  const [rows] = await db.query(
    `SELECT c.cart_id,
            c.service_id,                         
            s.price,
             s.service_name,
            c.stylist_id,
            s.time_duration,
            st.firstname AS stylist_name,
            c.selected_date,
            c.selected_time
     FROM Appointment_Cart c
     JOIN Service s ON c.service_id = s.service_id
     LEFT JOIN Stylists st ON c.stylist_id = st.stylist_ID
     WHERE c.customer_id = ?`,
    [customer_id]
  );
  return rows;
};

// Delete single cart item
const deleteCartItem = async (cart_id) => {
  const [result] = await db.query(
    `DELETE FROM Appointment_Cart WHERE cart_id = ?`,
    [cart_id]
  );
  return result;
};

// Clear all cart items for a customer
const clearCartByCustomerId = async (customer_id) => {
  const [result] = await db.query(
    `DELETE FROM Appointment_Cart WHERE customer_id = ?`,
    [customer_id]
  );
  return result;
};

module.exports = {
  addToCart,
  getCartByCustomerId,
  deleteCartItem,
  clearCartByCustomerId,
};
