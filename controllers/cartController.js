// const CartModel = require("../models/cartModel");

// const addCartItem = async (req, res) => {
//   const { customer_id, service_id, stylist_id } = req.body;

//   if (!customer_id || !service_id) {
//     return res.status(400).json({ message: "Missing customer or service ID" });
//   }

//   try {
//     await CartModel.addToCart(customer_id, service_id, stylist_id || null);
//     res.status(200).json({ message: "Service added to cart" });
//   } catch (error) {
//     console.error("Add to cart failed:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const getCartItems = async (req, res) => {
//   const { customer_id } = req.params;

//   try {
//     const cartItems = await CartModel.getCartByCustomerId(customer_id);
//     res.status(200).json(cartItems);
//   } catch (error) {
//     console.error("Fetch cart failed:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const removeCartItem = async (req, res) => {
//   const { cart_id } = req.params;

//   try {
//     await CartModel.deleteCartItem(cart_id);
//     res.status(200).json({ message: "Item removed from cart" });
//   } catch (error) {
//     console.error("Delete cart item failed:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   addCartItem,
//   getCartItems,
//   removeCartItem,
// };






const CartModel = require("../models/cartModel");

// cartController.js


// Define the addCartItem function
const addCartItem = async (req, res) => {
  const { customer_id, service_id, stylist_id, selected_date, selected_time } = req.body;

  if (!customer_id || !service_id || !selected_date || !selected_time) {
    return res.status(400).json({ message: "Missing customer, service ID, selected date, or selected time" });
  }

  try {
    await CartModel.addToCart(customer_id, service_id, stylist_id || null, selected_date, selected_time);
    res.status(200).json({ message: "Service added to cart" });
  } catch (error) {
    console.error("Add to cart failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getCartItems = async (req, res) => {
  const { customer_id } = req.params;

  console.log("Fetching cart items for customer ID:", customer_id);

  try {
    const cartItems = await CartModel.getCartByCustomerId(customer_id);
    console.log("Cart items fetched:", cartItems); // Log fetched items
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Fetch cart failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const removeCartItem = async (req, res) => {
  const { cart_id } = req.params;

  console.log("Removing item with cart_id:", cart_id);

  try {
    await CartModel.deleteCartItem(cart_id);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Delete cart item failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addCartItem,
  getCartItems,
  removeCartItem,
};
