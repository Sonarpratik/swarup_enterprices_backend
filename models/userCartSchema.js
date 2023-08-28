const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userCartSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  products: [
    { 
      product_id:{ type: String },
      
    }
  ]
});

const userCart = mongoose.model("CART", userCartSchema);
module.exports = userCart;
