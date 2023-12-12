const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },

  billing_address: { type: String },
  shipping_address: { type: String },

  billing_zip:{type: Number},
  shipping_zip:{type: Number},
  billing_phone:{type: Number},
  shipping_phone:{type: Number},
  billing_state:{type: String},
  billing_city:{type: String},
  shipping_state:{type: String},
  shipping_city:{type: String},
  password: { type: String },
  active:{type:Boolean,default:true},
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

    this.password = await bcrypt.hash(this.password, 12);
    // this.cpassword = await bcrypt.hash(this.cpassword, 12);

  }
  next();
});



const User = mongoose.model("USER", userSchema);
module.exports = User;
