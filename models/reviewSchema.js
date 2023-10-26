const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user_id: { type: String },
  product_id: { type: String },
  rating: { type: Number },
  description: { type: String },
});

const Review = mongoose.model("REVIEW", reviewSchema);
module.exports = Review;
