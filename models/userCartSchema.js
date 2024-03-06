const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userCartSchema = new mongoose.Schema({
  user_id: { type: String, required: true },

  product_id: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  color: { type: String, required: true },
});

const userCart = mongoose.model("CART", userCartSchema);
module.exports = userCart;
