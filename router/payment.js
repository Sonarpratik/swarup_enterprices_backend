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
const Cart = require("../models/userCartSchema.js");
const {
  Authenticate,
  IsAdmin,
  IsSuper,
  IsAdminAndUser,
} = require("../middleware/authenticate.js");
const Razorpay = require("razorpay");
const { getCart, createOrder,emptyCart } = require("./helperFunctions/helper.js");

const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});
router.post("/v1/payment", Authenticate, async (req, res) => {
  try {
    const { _id, tokens, password, active,billing,shipping, ...data } = req.rootUser._doc;
    const amount = 10000;
    const options = {
      amount: amount,
      currency: "INR",
      receipt: "razorUser@gmail.com",
    };

    razorpayInstance.orders.create(options, async (err, order) => {
      if (!err) {
        res.status(200).send({
          success: true,
          msg: "Order Created",
          order_id: order.id,
          amount: amount,
          key_id: RAZORPAY_ID_KEY,
          product_name: "prateek",
          description: "des",
          contact: "8567345632",
          name: "Sandeep Sharma",
          email: "sandeep@gmail.com",
        });

        const cart = await getCart(_id);
        const orders = cart.map((cartItem) => {
          return {
            ...cartItem, // Convert Mongoose document to plain JavaScript object
            order_id: order.id, // Nest product details inside the cart item
            billing:billing,
            shipping:shipping,
            
          };
        });
        console.log("tiger",orders)
        const OrderDone = await createOrder(orders);
        // if (OrderDone !== "error") {
        //     await emptyCart(_id)
        // }
      } else {
        res.status(400).send({ success: false, msg: "Something went wrong!" });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/v1/payment/check", async (req, res) => {
  try {
    
    res.status(200).send("OK");
  } catch (error) {
    console.error("Error handling webhook event:", error);
    // Respond with error status
    res.status(500).send("Error handling webhook event");
  }
});

module.exports = router;
