const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Cart = require("../models/userCartSchema");
const User = require("../models/userSchema");
const {
  Authenticate,
  IsAdminAndUser,
} = require("../middleware/authenticate.js");
const wishlist = require("../models/wishlistSchema");
const Product = require("../models/productSchema");
const Order = require("../models/orderSchema");

router.post("/api/order", async (req, res) => {
  try {
   
    // const user = new Order(req.body);
    console.log(req.body)

    
const convertedData = req.body.map(item => {
  return {
      ...item,
      product_id: item.product_id.replace('new ObjectId("', '').replace('")', '')
  };
});

    const value=await Order.insertMany(convertedData)
    res.status(201).json(value)
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Created");
  }
});
router.get("/api/order", async (req, res) => {
  try {
   
    // const user = new Order(req.body);
    const { page, limit, ...resa } = req.query;
  

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalCount = await Order.countDocuments(resa);
    // const sortedProductSizes = resa.product_size.slice().sort();
    // console.log(sortedProductSizes)
    // Fetch data with pagination using skip() and limit()
    const data = await Order.find(resa).skip(startIndex).limit(limit);
    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalCount / limit);
    // const product = await Product.find();

    const response = {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalCount,
      data: data,
    };
    res.status(200).json(response)
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Created");
  }
});


module.exports = router;
