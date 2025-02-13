const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "staff" },//staff and admin /user==customer
  active:{type:Boolean,default:true},

  tokens: [
    {
      token: {
        type: String,
        required: true
      },
      expiresAt: {
        type: Date,
        // required: true
      },
    },
  ],
});

//we are hashing the password
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log("hi i am insdie")

    this.password = await bcrypt.hash(this.password, 12);
    // this.cpassword = await bcrypt.hash(this.cpassword, 12);

  }
  next();
});




//We are generating 
// module.exports = mongoose.model("Main", userSchema);

const Admin = mongoose.model("ADMIN", adminSchema);
module.exports = Admin;
