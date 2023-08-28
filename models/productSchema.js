const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  product_sku: { type: String, required: true },
  product_img: { type: String, required: true },
  product_shipping_details: { type: String, required: true },
  product_description: { type: String },
//not array
  product_size: { type: String },
  product_img: { type: String },

  product_highlight:[
    {
      title:{
        type: String,
      },
      desc:
       { type: String}
    }
  ],
//not array
  product_color:{type: String},
  product_occasion:{type: String},
  product_type:{type: String},
  product_Fabric:{type: String},
  product_Work:{type: String},
  product_country_of_origin:{type: String},
  wash_care:[
    {
      instructions:{
        type: String,
      }
     
    }
  ],
  active:{type: Boolean,default:true},
  instock:{type: Boolean,default:true},
  product_discount:{type: Number},
  product_price:{type: Number}



});


const Product = mongoose.model("PRODUCT", productSchema);
module.exports = Product;