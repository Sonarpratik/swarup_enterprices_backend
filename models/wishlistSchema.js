const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const wishlistSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  products: [
    { 
      product_id:{ type: String },
      product_name: { type: String, required: true },
      product_sku: { type: String, required: true },
      product_img: { type: String, required: true },
      product_shipping_details: { type: String, required: true },
      product_description: { type: String },
      product_size: [{ type: String }],
      product_img: { type: String },
      product_highlight: [
        {
          title: {
            type: String,
          },
          desc: { type: String }
        }
      ],
      product_color: [{ type: String }],
      product_occasion: { type: String },
      product_type: { type: String },
      product_Fabric: { type: String },
      product_Work: { type: String },
      product_country_of_origin: { type: String },
      wash_care: [
        {
          instructions: {
            type: String
          }
        }
      ],
      product_discount: { type: Number },
      product_price: { type: Number }
    }
  ]
});

const wishlist = mongoose.model("WISHLIST", wishlistSchema);
module.exports = wishlist;
