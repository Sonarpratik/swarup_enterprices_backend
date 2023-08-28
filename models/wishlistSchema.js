const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const wishlistSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  products: [
    { 
      product_id:{ type: String },
     
    }
  ]
});

const wishlist = mongoose.model("WISHLIST", wishlistSchema);
module.exports = wishlist;
