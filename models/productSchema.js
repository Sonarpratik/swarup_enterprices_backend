const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dummy_pic="https://imgs.search.brave.com/neBrELOnsfK49yJraJ6s05kKhr38cFT0UIFls9VbHr4/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzM0LzgzLzIy/LzM2MF9GXzMzNDgz/MjI1NV9JTXh2ellS/eWdqZDIwVmxTYUlB/RlpyUVdqb3pRSDZC/US5qcGc"

const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  product_sku: { type: String, required: true },
  product_img: { type: String, required: true },
  product_shipping_details: { type: String, required: true },
  product_description: { type: String },
//not array
  product_size: { type: String },
  product_img: { type: String,default:dummy_pic },
//suo
//serach engine optimisation
//
//keyword search by multipal keyword 

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

  product_occasion:{type: String,default:"All Occasions"},
  product_style:{type: String,default:"All Styles"},
  product_Fabric:{type: String,default:"All Fabrics"},
  
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
  product_discount:{type: Number,default:0},
  product_price:{type: Number}



});


const Product = mongoose.model("PRODUCT", productSchema);
module.exports = Product;