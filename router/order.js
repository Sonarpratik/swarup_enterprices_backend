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

router.post("/api/order", Authenticate, async (req, res) => {
  try {
    const get_product=req.body
    const new_updatedObject = {
      ...get_product,
      product_id: get_product._id// Optional, to remove the original _id field if needed
  };
  delete new_updatedObject._id;


    const { _id } = req.rootUser;
    const User = await Cart.findOne({ user_id: _id });
    if (!User) {
      // throw new Error('User not found');
      const structure = {
        user_id: _id,
        products: [new_updatedObject],
      };
      const product = new Cart(structure);
      console.log("new cart");

      await product.save();
      res.status(201).send(structure);
    } else {

      const check=User.products.find((item)=>item.product_id===new_updatedObject.product_id)
if(!check){


  console.log("hello",check)

  User?.products.push(new_updatedObject);
  console.log("update cart");
  const did = await User.save();
  res.status(200).send(did);

}else{

  console.log("hello",check)
  console.log("hello",new_updatedObject.product_id)

  res.status(200).send(User);
}
}
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Created");
  }
});


module.exports = router;
