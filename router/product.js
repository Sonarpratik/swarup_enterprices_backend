const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const jst_decode = require("jwt-decode");
dotenv.config();

const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");
const Product = require("../models/productSchema.js");
const {
  Authenticate,
  IsAdmin,
  IsSuper,
} = require("../middleware/authenticate.js");

router.get("/api/product", async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalCount = await Product.countDocuments();

    // Fetch data with pagination using skip() and limit()
    const data = await Product.find().skip(startIndex).limit(limit);

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalCount / limit);

    // Response object to include pagination info

    // const data = await User.find();

    const response = {
      currentPage: parseInt(page),
      totalPages: totalPages,
      totalItems: totalCount,
      data: data,
    };

    res.status(200).send(response);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});
router.get("/api/product/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const data = await Product.findById(userId);

    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});
router.delete("/api/product/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const data = await Product.findByIdAndDelete(userId);

    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});
router.patch("/api/product/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { _id, ...data } = req.body;
    const did = await Product.findByIdAndUpdate({ _id: userId }, data, {
      new: true,
    });

    res.status(200).send(did);
  } catch (e) {
    console.log(e);
    res.status(404).send("You Dont Hvae the clearnce");
  }
});
router.post("/api/product", async (req, res) => {
  try {
    const product = new Product(req.body);

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.log(err);
    res.status(404).send("You Dont Hvae the clearnce");

  }
});

module.exports = router;
