// [SECTION] Dependencies and Modules
const express = require("express");
const cartController = require("../controllers/cart.js");
const auth = require("../authentication/auth.js");
const { verify, verifyAdmin } = auth;

// [SECTION] Routing Component
const router = express.Router();

// [SECTION] Routes

// GET /cart - Get user's cart
router.get("/", verify, cartController.getUserCart);

// POST /cart/addToCart - Add item(s) to cart
router.post("/addToCart", verify, cartController.addToCart);
  
// PATCH /cart/updateQuantity - Update item quantity in cart
router.patch("/updateQuantity", cartController.updateQuantity);

// DELETE /cart/:productId/removeFromCart - Remove item from cart
router.delete("/:productId/removeFromCart", verify, cartController.removeFromCart);

// DELETE /cart/clearCart - Clear user's cart
router.delete("/clearCart",verify, cartController.clearCart);

module.exports = router;
