const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/add", cartController.addCartItem);
router.get("/:customer_id", cartController.getCartItems);
router.delete("/remove/:cart_id", cartController.removeCartItem);

module.exports = router;
