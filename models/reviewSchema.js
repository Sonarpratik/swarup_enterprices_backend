const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user_id: { type: String },
  product_id: { type: String },
  rating: { type: Number },
  description: { type: String },
  date: { type: Date, default: Date.now },

});

const Review = mongoose.model("REVIEW", reviewSchema);
module.exports = Review;
