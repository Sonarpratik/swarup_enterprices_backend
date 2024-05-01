const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const suggestionSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  created_at: { type: Date, default: Date.now },

  category: { type: String, required: true },
  product_id:{type:String,required:true}

});

const Suggestion = mongoose.model("SUGGESTION", suggestionSchema);
module.exports = Suggestion;
