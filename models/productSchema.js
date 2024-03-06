const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { table } = require("console");

// 1)Office chairs with wheels
// 2)Office chairs without wheels

// 3)cabin table (single image with lots of description)
// 4)workstations modular furniture
// 5) storage partitions

// 6) cafe chairs
// 7) cafe table

// 8) lounge chairs

// 9) Sofa Series

const material = ["Wooden", "Fiber", "Metal"];
const unit = ["Inch", "Cm", "Foot"];
const stage = ["Trending", "Featured", "New Items", "Normal"];
// order should have only one color and quantity should be defined

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  wheels: { type: Boolean, default: false },
  special: { type: Boolean, default: false },

  instock: { type: Boolean, default: true },
  active: { type: Boolean, default: true },
  
  color: [{ type: String }],

  image: { type: String,default:"https://imgs.search.brave.com/IoOvviQ4di6rWn-a5_3PxljCQRXg5AQco4id07WyC3o/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9waG90by1tb2Rl/cm4tbHV4dXJ5LWFy/bS1jaGFpci1mdXJu/aXR1cmUtZGVzaWdu/Xzc2MzExMS0yMjEx/Ni5qcGc_c2l6ZT02/MjYmZXh0PWpwZw" },
  multi_img: [{ type: String }],
  seoArray: [{ type: String }],
  suitableFor: { type: String },
  rating: { type: Number },
  

  chair: {
    material: { type: String },
    cover: { type: String },
    backCushion: { type: String },
    armRest: { type: String },
    base: { type: String },
    mech: { type: String },
    gaslift: { type: String },
    maxLoad: { type: String },
  centerBeam: { type: String },

  },
  size: {
    totalHeight: { type: Number },
    seatHeight: { type: Number },
    length: { type: Number },
    width: { type: Number },
    unit: { type: String },
  },
  description: { type: String },

  stage: { type: String },
  price: { type: Number, required: true ,set: v => Math.ceil(v),},
  discount: { type: Number, default: 0,set: v => Math.ceil(v), },
  moreFeatures: [
    {
      title: { type: String },
      description: { type: String },
    },
  ],
});

const Product = mongoose.model("PRODUCT", productSchema);
module.exports = Product;
