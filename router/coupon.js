const express = require("express");
const router = express.Router();

const User = require("../models/userSchema");
const {
  Authenticate,
  IsAdmin,
  IsAdminAndUser,
  IsAdmin_Product_Create,
  IsAdmin_Product_Update,
  IsAdmin_Product_Delete,
} = require("../middleware/authenticate.js");
const Coupon = require("../models/couponSchema.js");

//Create Review
router.post("/coupon", async (req, res) => {
  try {
    const review = new Coupon(req.body);

    const created = await review.save();
    res.status(201).json(created);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
});

//Get All Review For Given Id
router.get("/coupon", async (req, res) => {
  try {
    const data = await Coupon.find({active:true});
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
});
router.get("/coupon/admin", async (req, res) => {
  try {
    const data = await Coupon.find();
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
});
router.patch("/coupon/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const { _id, ...data } = req.body;
      const did = await Coupon.findByIdAndUpdate({ _id: userId }, data, {
        new: true,
      });
  
      res.status(200).send(did);
    } catch (e) {
      console.log(e);
      res.status(404).send("You Dont Hvae the clearnce");
    }
  });

router.delete("/coupon/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const review = await Coupon.findByIdAndDelete({ _id: id });

    res.status(200).json(review);
  } catch (err) {
    res.status(404).json({ data: "Coupon Not Found" });

    console.log(err);
  }
});

module.exports = router;
