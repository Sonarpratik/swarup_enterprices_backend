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
  IsAdmin_Product_Update,
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
router.patch("/api/product/:id", IsAdmin_Product_Update,async (req, res) => {
    try {  
      const id = req.params.id;
      const {  _id, ...data } = req.body;
      console.log(req.body);
      const did = await Product.findByIdAndUpdate({ _id: id }, data, {
        new: true,
      });
      res.status(200).send(did);
    
    // await product.save();
      // res.status(201).json(req.body);
    } catch (err) {
      res.status(404).json(req.body);

      console.log(err);
    }
  });

//Get All Products
router.get("/api/product",async (req, res) => {
    try {  








const {page,limit,product_name,...resa}=req.query
if(product_name){
  resa.product_name={$regex:product_name}
}
      // const page = req.query.page;
      // const limit = req.query.limit;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const totalCount = await Product.countDocuments(resa);
  
      // Fetch data with pagination using skip() and limit()
      const data = await Product.find(resa).skip(startIndex).limit(limit);
      // Calculate total pages for pagination
      const totalPages = Math.ceil(totalCount / limit);
        // const product = await Product.find();

        const response = {
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalCount,
          data: data,
        };
    
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
    }
  });


router.get("/api/product/:id",async (req, res) => {
    try {  
      const id = req.params.id;

        const product = await Product.findById({_id:id});

    
    
      res.status(200).json(product);
    } catch (err) {
      res.status(404).json({"data":"product not found"});

      console.log(err);
    }
  });











module.exports = router;
