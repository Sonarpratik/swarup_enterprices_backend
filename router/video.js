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
  IsAdmin_Product_Delete,
} = require("../middleware/authenticate.js");
const Trending = require("../models/trendingSchema");
const SubCategory = require("../models/subcategorySchema.js");
const Video = require("../models/videoModelSchema.js");

router.post("/api/video", async (req, res) => {
    try {
      const product = new Video(req.body);
  
      const created = await product.save();
      res.status(201).json(created);
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
  
    }
  });
router.get("/api/video", async (req, res) => {
    try {
        const { page, limit, video_name,sort, ...resa } = req.query;
    if (video_name) {
      resa.video_name = { $regex: video_name };
    }
  

    console.log(resa);
 
    resa.active=true
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalCount = await Video.countDocuments(resa);
    // const sortedProductSizes = resa.product_size.slice().sort();
    // console.log(sortedProductSizes)
    // Fetch data with pagination using skip() and limit()
    let query = Video.find(resa);

    if (sort) {
      query = query.sort({ video_price: sort });
    }

    const data = await query.skip(startIndex).limit(limit);
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
      res.status(401).json(err);
  
    }
  });
router.patch("/api/video/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { _id, ...data } = req.body;
        const did = await Video.findByIdAndUpdate({ _id: id }, data, {
          new: true,
        });
        res.status(200).send(did);
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
  
    }
  });
router.delete("/api/video/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { _id, ...data } = req.body;
        const did = await Video.findByIdAndDelete({ _id: id });
        res.status(200).send(did);
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
  
    }
  });
router.get("/api/video/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { _id, ...data } = req.body;
        const did = await Video.findById({ _id: id });
        res.status(200).send(did);
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
  
    }
  });
module.exports = router;
