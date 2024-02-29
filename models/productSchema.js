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
  color: [{ type: String }],
  wheels: { type: Boolean, default: false },
  special: { type: Boolean, default: false },
  base: { type: String },
  back: { type: String },
  seat: { type: String },
  mech: { type: String },
  gaslift: { type: String },
  center_beam: { type: String },

  image: { type: String },
  multi_img: [{ type: String }],

  material: { type: String },
  size: {
    total_height: { type: Number },
    seat_height: { type: Number },
    length: { type: Number },
    width: { type: Number },
    unit: { type: String },
  },
  description: { type: String },

  stage: { type: String },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  more_features: [
    {
      title: { type: String },
      description: { type: String },
    },
  ],
});

const Product = mongoose.model("PRODUCT", productSchema);
module.exports = Product;
