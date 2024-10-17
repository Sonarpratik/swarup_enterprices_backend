const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String},
    phone: { type: String, required: true  },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

const contact = mongoose.model("CONTACT", contactSchema);
module.exports = contact;