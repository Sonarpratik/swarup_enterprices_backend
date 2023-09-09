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
        const productId = product?.product_id?.toString();
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
        const productId = product?.product_id?.toString();
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



//GET CART BY USER ID AND ADMIN OR USER TOKEN
router.get("/api/cart/:id", IsAdminAndUser, async (req, res) => {
  try {
    const userId = req.params.id;

    const cart = await Cart.findOne({ user_id: userId });
    

    if (!cart) {
      res.status(200).send("no data");
    } else {
      const productIds = cart?.products?.map((item) => item.product_id);
const productx=await Product.find({_id:{ $in: productIds } })

const new_cart={
  _id:cart._id,
  user_id:cart.user_id,
  products:productx
}
new_cart.products=productx
      res.status(200).send(new_cart);
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
    if (!User) {
      // throw new Error('User not found');
      const structure = {
        user_id: _id,
        products: [new_updatedObject],
      };
      const product = new wishlist(structure);
      console.log("new wishlist");

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


//Get Wishlist 
router.get("/api/wishlist/:id", IsAdminAndUser, async (req, res) => {
  try {
    const userId = req.params.id;

    const cart = await wishlist.findOne({ user_id: userId });
    

    if (!cart) {
      res.status(200).send("no data");
    } else {
      const productIds = cart?.products?.map((item) => item.product_id);
const productx=await Product.find({_id:{ $in: productIds } })
console.log("prod",productx)

const new_cart={
  _id:cart._id,
  user_id:cart.user_id,
  products:productx
}
new_cart.products=productx
console.log(new_cart)
      res.status(200).send(new_cart);
    }
  }catch (err) {
    console.log(err);
    res.status(400).send("Wishlist Not Found");
  }
});

module.exports = router;
