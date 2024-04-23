const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },

  billing: {
    name: { type: String },
    address: { type: String },
    phone: { type: Number },
    city: { type: String },
    state: { type: String },
    landMark: { type: String },
    email: { type: String },
    pincode: { type: Number },
  },
  shipping: {
    name: { type: String },
    address: { type: String },
    phone: { type: Number },
    city: { type: String },
    state: { type: String },
    landMark: { type: String },
    email: { type: String },

    pincode: { type: Number },
  },

  password: { type: String },
  active: { type: Boolean, default: true },
  tokens: [
    {
      token: {
        type: String,
        required: true,
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
    this.password = await bcrypt.hash(this.password, 12);
    // this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

const User = mongoose.model("USER", userSchema);
module.exports = User;
