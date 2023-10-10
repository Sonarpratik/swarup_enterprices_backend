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
const Order = require("../models/orderSchema");
function generateUniqueRandomNumber() {
  const currentTime = new Date().getTime(); // Get current time in milliseconds
  const random = Math.floor(Math.random() * 100000); // Generate a random integer between 0 and 99999

  // Combine current time and random number to create a unique value
  const uniqueNumber = currentTime.toString() + random.toString();

  return parseInt(uniqueNumber);
}


router.post("/api/order", async (req, res) => {
  try {
   
    // const user = new Order(req.body);

    
const convertedData = req.body.map(item => {
  return {
      ...item,
      product_id: item.product_id.replace('new ObjectId("', '').replace('")', '')
  };
});

    const value=await Order.insertMany(convertedData)
    const Carts = await Cart.findOne({ user_id: req.body[0].user_id });
    // const structure={
    //   _id:Carts._id,
    //   user_id:Carts.user_id,
    //   products:[]
    // }
Carts.products=[]
await Carts.save();
console.log(Carts)
    res.status(201).json("done")
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Createds");
  }
});
router.post("/api/order/cod", async (req, res) => {
  try {
   const last_obj=req.body
    // const user = new Order(req.body);
const obj={

  user_id: last_obj.merchant_param5,
  order_id: last_obj.order_id,
  billing_address:last_obj.billing_address,
		shipping_address:last_obj.delivery_address,
		billing_zip:last_obj.billing_zip,
		shipping_zip:last_obj.delivery_zip,
		billing_phone:last_obj.billing_phone,
		shipping_phone:last_obj.delivery_phone,
		billing_state:last_obj.billing_state,
		billing_city:last_obj.billing_city,
		delivery_state:last_obj.delivery_state,
		shipping_city:last_obj.delivery_city,
		shipping_name:last_obj.delivery_name,
		billing_name:last_obj.billing_name,
    
  }
    // const value=await Order.insertMany(convertedData)
    // const Carts = await Cart.findOne({ user_id: req.body[0].user_id });
    const products=await Product.find({_id:last_obj.product_ids})
    const uniqueRandomNumber = generateUniqueRandomNumber();
    
  const modifiedProducts = products.map(product => {
    const {multi_img, product_price,product_discount,wash_care,product_country_of_origin,product_Work,product_Fabric,_id,product_occasion,product_star,product_name,product_sku,product_img,product_highlight,product_style,product_color,product_size,product_shipping_details,product_description, ...rest } = product; // Destructure _id and get the rest of the fields
    return { product_id: _id,multi_img, product_price,product_discount,wash_care,product_country_of_origin,product_Work,product_Fabric,product_occasion,product_star,product_name,product_sku,product_img,product_highlight,product_style,product_color,product_size,product_shipping_details,product_description,...obj,order_id:uniqueRandomNumber}; // Create a new object with product_id and the rest of the fields
    });

    if(last_obj.type==="cart"){
      console.log("run")
      const Carts = await Cart.findOne({ user_id: last_obj.merchant_param5 });
  Carts.products=[]
  await Carts.save();
    }
    const value=await Order.insertMany(modifiedProducts)

    res.status(201).json(value)
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Createds");
  }
});
router.get("/api/order", async (req, res) => {
  try {
    const { page, limit, sort, ...resa } = req.query;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalCount = await Order.countDocuments(resa);

    let query = Order.find(resa);

    if (sort) {
      query = query.sort({ date_of_order: sort });
    }

    const data = await query.skip(startIndex).limit(limit);
    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalCount,
      data: data,
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Created");
  }
});

router.delete("/api/order/:id", async (req, res) => {
  try {    
    const orderID = req.params.id;
 
  const Data=await Order.findByIdAndDelete({_id:orderID})
    res.status(200).json(Data);
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Created");
  }
});
router.patch("/api/order/:id", async (req, res) => {
  try {    
    const orderID = req.params.id;
 const {_id,order_id,product_id,date_of_order,user_id,...data}=req.body
 console.log(data)
  const Data=await Order.findByIdAndUpdate({_id:orderID}, data, {
    new: true,
  })
    res.status(200).json(Data);
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Created");
  }
});
router.get("/api/order/:id", async (req, res) => {
  try {    
    const orderID = req.params.id;
  const Data=await Order.findById({_id:orderID})
    res.status(200).json(Data);
  } catch (err) {
    console.log(err);
    res.status(400).send("Cart Not Created");
  }
});



module.exports = router;
