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
const Order = require("../models/orderSchema.js");
const {
  Authenticate,
  IsAdmin,
  IsSuper,
  IsAdminAndUser,
} = require("../middleware/authenticate.js");
const Razorpay = require("razorpay");
const {
  getCart,
  createOrder,
  emptyCart,
  cancelOrder,
  failOrder,
  successOrder,
  updateState,
  sendMail,
} = require("./helperFunctions/helper.js");

router.get("/api/order",IsAdmin, async (req, res) => {
  try {
    // const userId = req.params.id;
    const {  sort, ...resa } = req.query;

    const page = parseInt(req.query.page);
    const limit = req.query.limit;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    console.log(startIndex)

    // Fetch data with pagination using skip() and limit()
    const order = await Order.find(resa).sort({ created_at: sort })
    // const order = await Order.find();

    // Calculate total pages for pagination

    // Fetch products based on product IDs
    const productIds = order.map((item) => item.product_id);

    // Fetch products based on product IDs
    const products = await Product.find({ _id: { $in: productIds } });

    const cartWithProductDetails = order.map(cartItem => {
        // Find the corresponding product details for the current cart item
        const productDetail = products.find(product => product._id.toString() === cartItem.product_id.toString());
        return {
          ...cartItem.toObject(), // Convert Mongoose document to plain JavaScript object
          product: productDetail // Nest product details inside the cart item
        };
      });
    const transformedArray = [];

    cartWithProductDetails.forEach((item) => {
      const existingOrderIndex = transformedArray.findIndex(
        (order) => order.order_id === item.order_id
      );

      if (existingOrderIndex === -1) {
        transformedArray.push({
          order_id: item.order_id,
          user_id: item.user_id,
          count_of_products: 1,
          created_at: item.created_at,
          payment: item.payment,
          billing: item?.billing,
          shipping: item?.shipping,
          payment:item?.payment,
          couponDiscount:item?.couponDiscount,
          stage:item?.stage,
          length:item?.length,
          breadth:item?.breadth,
          height:item?.height,
          weight:item?.weight,
          active:item?.active,

          product: [
            {
              product_id: item.product_id,
              product: item.product,
              color: item.color,
              quantity: item.quantity,
              //   product:item.product
              price: item?.price,
              discount: item?.discount,
             
            },
          ],
        });
      } else {
        transformedArray[existingOrderIndex].count_of_products++;
        transformedArray[existingOrderIndex].product.push({
          product_id: item.product_id,
          color: item.color,
          quantity: item.quantity,
          product: item.product,

          // product:item.product
          price: item?.price,
          discount: item?.discount,
    
        });
      }
    });
const a=transformedArray.slice(startIndex, parseInt(startIndex) + parseInt(limit));

const totalPages = Math.ceil(transformedArray?.length / limit);
console.log(startIndex, parseInt(startIndex) + parseInt(limit))
    const response = {
      currentPage: parseInt(page),
      totalPages: totalPages,
      totalItems: transformedArray?.length,
      data: a,
    };
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Something Went Wrong" });
  }
});
router.get("/api/order/:id", IsAdminAndUser, async (req, res) => {
  try {
    // sendMail()
    const userId = req.params.id;

    const order = await Order.find({ user_id: userId ,active:true}).sort({created_at:-1});
    // Fetch products based on product IDs
    const productIds = order.map((item) => item.product_id);

    // Fetch products based on product IDs
    const products = await Product.find({ _id: { $in: productIds } });

    const cartWithProductDetails = order.map(cartItem => {
        // Find the corresponding product details for the current cart item
        const productDetail = products.find(product => product._id.toString() === cartItem.product_id.toString());
        return {
          ...cartItem.toObject(), // Convert Mongoose document to plain JavaScript object
          product: productDetail // Nest product details inside the cart item
        };
      });
    const transformedArray = [];

    cartWithProductDetails.forEach((item) => {
      const existingOrderIndex = transformedArray.findIndex(
        (order) => order.order_id === item.order_id
      );

      if (existingOrderIndex === -1) {
        transformedArray.push({
          order_id: item.order_id,
          count_of_products: 1,
          created_at: item.created_at,
          payment: item.payment,
          billing: item?.billing,
          shipping: item?.shipping,
          payment:item?.payment,
          couponDiscount:item?.couponDiscount,
          stage:item?.stage,
          length:item?.length,
          breadth:item?.breadth,
          height:item?.height,
          weight:item?.weight,
          product: [
            {
              product_id: item.product_id,
              product: item.product,

              color: item.color,
              quantity: item.quantity,
              //   product:item.product
              price: item?.price,
              discount: item?.discount,
      
            },
          ],
        });
      } else {
        transformedArray[existingOrderIndex].count_of_products++;
        transformedArray[existingOrderIndex].product.push({
          product_id: item.product_id,
          product: item.product,

          color: item.color,
          quantity: item.quantity,
          // product:item.product
          price: item?.price,
          discount: item?.discount,

        });
      }
    });
    res.status(200).send(transformedArray);
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Something Went Wrong" });
  }
});


router.post("/api/order/cancel", Authenticate, async (req, res) => {
  try {
    const orders = await cancelOrder(req.body.order_id);

    // Fetch products based on product IDs

    res.status(200).send(orders);
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Something Went Wrong" });
  }
});
router.delete("/api/order/user/:id", Authenticate, async (req, res) => {
  try {
    const order_id = req.params.id;

    const newOrder= await Order.updateMany({ order_id: order_id }, { active: false });


    // Fetch products based on product IDs

    res.status(200).send(newOrder);
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Something Went Wrong" });
  }
});
router.post("/api/order/failed", Authenticate, async (req, res) => {
  try {
    const orders = await failOrder(req.body.order_id);

    // Fetch products based on product IDs

    res.status(200).send(orders);
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Something Went Wrong" });
  }
});
router.post("/api/order/success", Authenticate, async (req, res) => {
  try {
    const orders = await successOrder(req.body.order_id);

    // Fetch products based on product IDs
    const { _id, tokens, password, active, ...data } = req.rootUser._doc;
    if (orders?.items[0]?.status === "captured") {
      await Cart.deleteMany({ user_id: _id });
    }
    res.status(200).send(orders);
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Something Went Wrong" });
  }
});
router.patch("/api/order/stage/:id", IsAdmin, async (req, res) => {
  try {
    const orders = await updateState(req.body.order_id,req.body);

    // Fetch products based on product IDs

 console.log("orders",orders)
    res.status(200).send(orders);
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Something Went Wrong" });
  }
});
router.delete("/api/order/:id", Authenticate, async (req, res) => {
  try {
    const orders = await failOrder(req.body.order_id);

    // Fetch products based on product IDs

    res.status(200).send(orders);
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Something Went Wrong" });
  }
});

module.exports = router;
