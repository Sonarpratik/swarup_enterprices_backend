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
} = require("./helperFunctions/helper.js");

router.get("/api/order", async (req, res) => {
  try {
    // const userId = req.params.id;

    const order = await Order.find();
    console.log("order", order);
    // Fetch products based on product IDs

    const transformedArray = [];

    order.forEach((item) => {
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
          product: [
            {
              product_id: item.product_id,
              color: item.color,
              quantity: item.quantity,
              //   product:item.product
              price: item?.price,
              discount: item?.discount,
              billing: item?.billing,
              shipping: item?.shipping,
            },
          ],
        });
      } else {
        transformedArray[existingOrderIndex].count_of_products++;
        transformedArray[existingOrderIndex].product.push({
          product_id: item.product_id,
          color: item.color,
          quantity: item.quantity,
          // product:item.product
          price: item?.price,
          discount: item?.discount,
          billing: item?.billing,
          shipping: item?.shipping,
        });
      }
    });
    res.status(200).send(transformedArray);
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Something Went Wrong" });
  }
});
router.get("/api/order/:id", IsAdminAndUser, async (req, res) => {
  try {
    const userId = req.params.id;

    const order = await Order.find({ user_id: userId });
    console.log("order", order);
    // Fetch products based on product IDs

    const transformedArray = [];

    order.forEach((item) => {
      const existingOrderIndex = transformedArray.findIndex(
        (order) => order.order_id === item.order_id
      );

      if (existingOrderIndex === -1) {
        transformedArray.push({
          order_id: item.order_id,
          count_of_products: 1,
          created_at: item.created_at,
          payment: item.payment,
          product: [
            {
              product_id: item.product_id,
              color: item.color,
              quantity: item.quantity,
              //   product:item.product
              price: item?.price,
              discount: item?.discount,
              billing: item?.billing,
              shipping: item?.shipping,
            },
          ],
        });
      } else {
        transformedArray[existingOrderIndex].count_of_products++;
        transformedArray[existingOrderIndex].product.push({
          product_id: item.product_id,
          color: item.color,
          quantity: item.quantity,
          // product:item.product
          price: item?.price,
          discount: item?.discount,
          billing: item?.billing,
          shipping: item?.shipping,
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
