const mongoose = require("mongoose");

const trendingSchema = new mongoose.Schema({
  product_id: { type: String, required: true },


});


const Trending = mongoose.model("TRENDING", trendingSchema);
module.exports = Trending;