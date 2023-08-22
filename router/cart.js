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

router.post("/api/cart", Authenticate, async (req, res) => {
  try {
    const get_product=req.body
    const new_updatedObject = {
      ...get_product,
      product_id: get_product._id// Optional, to remove the original _id field if needed
  };
  delete new_updatedObject._id;


    const { _id } = req.rootUser;
    const User = await Cart.findOne({ user_id: _id });
    console.log();
    if (!User) {
      // throw new Error('User not found');
      console.log(_id);
      const structure = {
        user_id: _id,
        products: [new_updatedObject],
      };
      const product = new Cart(structure);
      console.log("new cart");

      await product.save();
      res.status(201).send(structure);
    } else {
      console.log(User);

      User?.products.push(new_updatedObject);
      console.log("update cart");
      const did = await User.save();
      res.status(200).send(did);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Created");
  }
});

router.post("/api/remove/cart", Authenticate, async (req, res) => {
  try {
    const { _id } = req.rootUser;
    const User = await Cart.findOne({ user_id: _id });
    console.log();
    if (!User) {
  
      res.status(404).json({"data":"Cart Not Found"});
    } else {
      console.log(User);

      User.products = User.products.filter(product => {
        const productId = product._id.toString();
        return productId !== req.body._id;
      });

await User.save();
      res.status(200).send(User);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Created");
  }
});
router.post("/api/remove/wishlist", Authenticate, async (req, res) => {
  try {
    const { _id } = req.rootUser;
    const User = await wishlist.findOne({ user_id: _id });
    console.log();
    if (!User) {
  
      res.status(404).json({"data":"Wishlist Not Found"});
    } else {
      console.log(User);

      User.products = User.products.filter(product => {
        const productId = product._id.toString();
        return productId !== req.body._id;
      });

await User.save();
      res.status(200).send(User);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Wishlist Not Created");
  }
});




router.get("/api/cart/:id", IsAdminAndUser, async (req, res) => {
  try {
    const userId = req.params.id;

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      res.status(200).send("no data");
    } else {
      res.status(200).send(cart);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Found");
  }
});

router.post("/api/wishlist", Authenticate, async (req, res) => {
  try {
    const get_product=req.body
    const new_updatedObject = {
      ...get_product,
      product_id: get_product._id// Optional, to remove the original _id field if needed
  };
  delete new_updatedObject._id;


    const { _id } = req.rootUser;
    const User = await wishlist.findOne({ user_id: _id });
    console.log();
    if (!User) {
      // throw new Error('User not found');
      console.log(_id);
      const structure = {
        user_id: _id,
        products: [new_updatedObject],
      };
      const product = new wishlist(structure);
      console.log("new cart");

      await product.save();
      res.status(201).send(structure);
    } else {
      console.log(User);

      User?.products.push(new_updatedObject);
      console.log("update cart");
      const did = await User.save();
      res.status(200).send(did);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Created");
  }
});

router.get("/api/wishlist/:id", IsAdminAndUser, async (req, res) => {
  try {
    const userId = req.params.id;

    const cart = await wishlist.findOne({ user_id: userId });
    if (!cart) {
      res.status(200).send("no data");
    } else {
      res.status(200).send(cart);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Found");
  }
});

module.exports = router;
