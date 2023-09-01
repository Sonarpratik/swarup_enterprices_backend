const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dummy_pic="https://imgs.search.brave.com/neBrELOnsfK49yJraJ6s05kKhr38cFT0UIFls9VbHr4/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzM0LzgzLzIy/LzM2MF9GXzMzNDgz/MjI1NV9JTXh2ellS/eWdqZDIwVmxTYUlB/RlpyUVdqb3pRSDZC/US5qcGc"

const trendingSchema = new mongoose.Schema({
  product_id: { type: String, required: true },


});


const Trending = mongoose.model("TRENDING", trendingSchema);
module.exports = Trending;