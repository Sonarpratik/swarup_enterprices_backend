const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Pending Success Failed
const orderSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  order_id: { type: String, required: true },
  payment:{type:String,default:"Pending"},

  product_id: { type: String, required: true },
  active: { type: Boolean, default: true },

  price: { type: Number, required: true ,set: v => Math.ceil(v),},
  discount: { type: Number, default: 0,set: v => Math.ceil(v), },
  quantity: { type: Number, default: 1 },
  color: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  billing: {
    name: { type: String },
    address: { type: String },
    phone: { type: Number },
    city: { type: String },
    state: { type: String },
    landMark: { type: String },
    pincode: { type: Number },
  },
  shipping: {
    name: { type: String },
    address: { type: String },
    phone: { type: Number },
    city: { type: String },
    state: { type: String },
    landMark: { type: String },
    pincode: { type: Number },
  },

});

const order = mongoose.model("ORDER", orderSchema);
module.exports = order;
