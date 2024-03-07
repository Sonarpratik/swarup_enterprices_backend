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
const { restoreCartAndCancel } = require("./helperFunctions/helper.js");

router.get("/api/cart/:id", IsAdminAndUser, async (req, res) => {
  try {
    const userId = req.params.id;

    const cart = await Cart.find({ user_id: userId });
    const productIds = cart.map((item) => item.product_id);

    // Fetch products based on product IDs
    const products = await Product.find({ _id: { $in: productIds } });

    const cartWithProductDetails = cart.map(cartItem => {
        // Find the corresponding product details for the current cart item
        const productDetail = products.find(product => product._id.toString() === cartItem.product_id.toString());
        return {
          ...cartItem.toObject(), // Convert Mongoose document to plain JavaScript object
          product: productDetail // Nest product details inside the cart item
        };
      });
    res.status(200).send(cartWithProductDetails);
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Something Went Wrong" });
  }
});
router.delete("/api/cart/:id", IsAdminAndUser, async (req, res) => {
  try {
const _id =req.body._id
    const cart = await Cart.findByIdAndDelete(_id);

    // Fetch products based on product IDs

    res.status(200).send(cart);
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Something Went Wrong" });
  }
});
router.patch("/api/cart/:id", IsAdminAndUser, async (req, res) => {
    try {
        const cartId = req.params.id;
        const { _id, quantity,...data } = req.body;
        const did = await Cart.findByIdAndUpdate({ _id: cartId }, {quantity:quantity}, {
          new: true,
        });
    
        res.status(200).send(did);
      } catch (e) {
        console.log(e);
        res.status(404).send("You Dont Have the clearnce");
      }
});
router.get("/api/cart", async (req, res) => {
  try {
    const cart = await Cart.find();
    res.status(200).send(cart);
  } catch (err) {
    res.status(404).send({ message: "Something Went Wrong" });
  }
});
router.post("/api/cart", Authenticate, async (req, res) => {
  try {
    const { _id } = req.rootUser;
    const checkCart = await Cart.findOne({
      user_id: _id,
      color: req.body.color,
    });
    if (checkCart) {
      res.status(200).send(checkCart);
    } else {
      const structure = {
        user_id: _id,
        product_id: req.body.product_id,
        quantity: req.body.quantity,
        color: req.body.color,
      };
      const cart = new Cart(structure);

      await cart.save();
      res.status(201).send(cart);
    }
  } catch (err) {
    res.status(404).send({ message: "Something Went Wrong" });
  }
});



module.exports = router;
