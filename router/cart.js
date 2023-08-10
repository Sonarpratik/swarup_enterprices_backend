const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const Cart = require("../models/userCartSchema");
const User = require("../models/userSchema");
const {
   Authenticate, IsAdminAndUser,
} = require("../middleware/authenticate.js");
const wishlist = require("../models/wishlistSchema");





router.post("/api/cart", Authenticate,async (req, res) => {
    try {  
  const { _id} = req.rootUser;
  const User = await Cart.findOne({user_id: _id});
console.log()
  if (!User) {
    // throw new Error('User not found');
    const product = new Cart(req.body);
    await product.save();
    res.status(201).send(req.body);


  }else{
    const did = await Cart.findByIdAndUpdate({ _id: User._id }, req.body, {
        new: true,
      });
      console.log("did",did)
    res.status(200).send(did);

  }


    
    
    } catch (err) {
      console.log(err);
    res.status(400).send("Cart Not Created");

    }
  });

  router.get("/api/cart/:id", IsAdminAndUser,async (req, res) => {
    try {  
      const userId = req.params.id;

 
        const cart = await Cart.findOne({user_id: userId});
if(!cart){
    res.status(401).send("no data");

}
    res.status(200).send(cart);
        
    
    } catch (err) {
      console.log(err);
    res.status(400).send("Cart Not Found");

    }
  });




router.post("/api/wishlist", Authenticate,async (req, res) => {
    try {  
  const { _id} = req.rootUser;
  const User = await wishlist.findOne({user_id: _id});
console.log()
  if (!User) {
    // throw new Error('User not found');
    const product = new wishlist(req.body);
    await product.save();
    res.status(201).send(req.body);


  }else{
    const did = await wishlist.findByIdAndUpdate({ _id: User._id }, req.body, {
        new: true,
      });
      console.log("did",did)
    res.status(200).send(did);

  }


    
    
    } catch (err) {
      console.log(err);
    res.status(400).send("Cart Not Created");

    }
  });

  router.get("/api/wishlist/:id", IsAdminAndUser,async (req, res) => {
    try {  
      const userId = req.params.id;

 
        const cart = await wishlist.findOne({user_id: userId});
if(!cart){
    res.status(401).send("no data");

}
    res.status(200).send(cart);
        
    
    } catch (err) {
      console.log(err);
    res.status(400).send("Cart Not Found");

    }
  });









module.exports = router;
