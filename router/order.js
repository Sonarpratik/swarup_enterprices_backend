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

    
const convertedData = req.body.map(item => {
  return {
      ...item,
      product_id: item.product_id.replace('new ObjectId("', '').replace('")', '')
  };
});

    const value=await Order.insertMany(convertedData)
    const Carts = await Cart.findOne({ user_id: req.body[0].user_id });
    // const structure={
    //   _id:Carts._id,
    //   user_id:Carts.user_id,
    //   products:[]
    // }
Carts.products=[]
await Carts.save();
console.log(Carts)
    res.status(201).json("done")
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Createds");
  }
});
router.get("/api/order", async (req, res) => {
  try {
    const { page, limit, sort, ...resa } = req.query;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalCount = await Order.countDocuments(resa);

    let query = Order.find(resa);

    if (sort) {
      query = query.sort({ date_of_order: sort });
    }

    const data = await query.skip(startIndex).limit(limit);
    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalCount,
      data: data,
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Created");
  }
});


module.exports = router;
