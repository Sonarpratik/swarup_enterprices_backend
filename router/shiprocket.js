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
const Review = require("../models/reviewSchema");
const { updateStateFromWebHook } = require("./helperFunctions/helper.js");

//Create Review
router.post("/api/v1/delivery-notifications", async (req, res) => {
    try {
      console.log(req.body); // Log request body
      // Process request and send response
      const data=await updateStateFromWebHook(req.body.channel_order_id,req.body)
      res.sendStatus(200);
    } catch (err) {
      console.error(err); // Log error
      res.status(500).json({ error: "Internal Server Error" }); // Send generic error response
    }
  });
  
router.post("/api/notification-webhook", async (req, res) => {
  try {
    console.log("req.body?.payload?.payment",req)
    console.log("req.body?.payload?.payment",req?.body)
    console.log("req.body?.payload?.payment",req?.Fields)

    res.status(200).json(req);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);

  }
});
router.get("/api/notification-webhook", async (req, res) => {
  try {
    console.log("req.body?.payload?.payment",req.body)

    res.status(200).json("done");
    // res.status(200).json(req.body?.payload?.payment);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);

  }
});


module.exports = router;
