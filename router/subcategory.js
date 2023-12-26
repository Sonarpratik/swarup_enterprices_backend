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

router.post("/api/subcategory", async (req, res) => {
    try {
      const product = new SubCategory(req.body);
  
      const created = await product.save();
      res.status(201).json(created);
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
  
    }
  });
router.get("/api/subcategory", async (req, res) => {
    try {
        let query = await SubCategory.find();

      res.status(200).json(query);
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
  
    }
  });
router.patch("/api/subcategory/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { _id, ...data } = req.body;
        const did = await SubCategory.findByIdAndUpdate({ _id: id }, data, {
          new: true,
        });
        res.status(200).send(did);
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
  
    }
  });
router.delete("/api/subcategory/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { _id, ...data } = req.body;
        const did = await SubCategory.findByIdAndDelete({ _id: id });
        res.status(200).send(did);
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
  
    }
  });
router.get("/api/subcategory/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { _id, ...data } = req.body;
        const did = await SubCategory.findById({ _id: id });
        res.status(200).send(did);
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
  
    }
  });
module.exports = router;
