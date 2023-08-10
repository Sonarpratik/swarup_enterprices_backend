const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
  user_id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number },
  address: { type: String },
  address_shipping_address: { type: String },
  password: { type: String },
  tokens: [
    {
      token: {
        type: String,
        required:true
      },
      expiresAt: {
        type: Date,
        // required: true
      },
    },
  ],
});

//we are hashing the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log("hi i am insdie")

    this.password = await bcrypt.hash(this.password, 12);
    // this.cpassword = await bcrypt.hash(this.cpassword, 12);

  }
  next();
});



const User = mongoose.model("USER", userSchema);
module.exports = User;
