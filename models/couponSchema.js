const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Pending Success Failed Cancelled
//Shipping Soon  Shipped  Out for Delivery   Delivered
const couponSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  percentage: { type: Number, required: true },
  active: { type: Boolean, default: true },

});

const coupon = mongoose.model("COUPON", couponSchema);
module.exports = coupon;
