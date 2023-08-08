const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const {
  Authenticate,
  IsAdmin,
  IsAdminAndUser,
  IsAdmin_Product_Create,
} = require("../middleware/authenticate.js");





router.post("/api/product", IsAdmin_Product_Create,async (req, res) => {
    try {  
      const product = new Product(req.body);
    
    
    await product.save();
      res.status(201).json(req.body);
    } catch (err) {
      console.log(err);
    }
  });


router.get("/api/product",async (req, res) => {
    try {  
        const product = await Product.find();

    
    
      res.status(200).json(product);
    } catch (err) {
      console.log(err);
    }
  });











module.exports = router;
