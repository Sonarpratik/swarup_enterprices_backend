const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const subcategorySchema = new mongoose.Schema({
  main_category: { type: String, required: true },

  sub_category: [
    {
      type: String,
    },
  ],
});


//We are generating
// module.exports = mongoose.model("Main", userSchema);

const SubCategory = mongoose.model("SUBCATEGORY", subcategorySchema);
module.exports = SubCategory;
