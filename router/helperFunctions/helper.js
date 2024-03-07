const Product = require("../../models/productSchema.js");
const Cart = require("../../models/userCartSchema.js");
const Order = require("../../models/orderSchema.js");
const Razorpay = require("razorpay");


const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});
const getCart = async (userId) => {
  try {
    const cart = await Cart.find({ user_id: userId });
    const productIds = cart.map((item) => item.product_id);

    // Fetch products based on product IDs
    const products = await Product.find({ _id: { $in: productIds } });

    const cartWithProductDetails = cart.map(cartItem => {
        // Find the corresponding product details for the current cart item
        const productDetail = products.find(product => product._id.toString() === cartItem.product_id.toString());
        return {
          ...cartItem.toObject(), // Convert Mongoose document to plain JavaScript object
          price: productDetail?.price, // Nest product details inside the cart item
          discount: productDetail?.discount, // Nest product details inside the cart item
        };
      });

    return cartWithProductDetails;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

const createOrder = async (orderData) => {
  try {
    const ordersWithoutId = orderData.map((order) => {
      const { _id, __v, ...rest } = order;
      return rest;
    });
    const orders = await Order.insertMany(ordersWithoutId);
    console.log("lion", orders);
    return orders;
  } catch (err) {
    console.log(err);
    return "error";
  }
};
const emptyCart = async (userId) => {
  try {
    const carts = await Cart.deleteMany({ user_id: userId });
    return carts;
  } catch (err) {
    console.log(err);
    return "error";
  }
};

const cancelOrder = async (order_id) => {
  try {
    console.log("order_id", order_id);
    const check = await Order.find({ order_id: order_id });
    if (check[0].payment === "Failed") {
      return check;
    } else {
      const makeItCanceled = await Order.updateMany(
        { order_id: order_id },
        { payment: "Cancelled" }
      );
      return makeItCanceled;
    }
  } catch (err) {
    return null;
  }
};
const failOrder = async (order_id) => {
  try {
    console.log("order_id", order_id);
  

   const newOrder= await Order.updateMany({ order_id: order_id }, { payment: "Failed" });
    return newOrder;
  } catch (err) {
    return null;
  }
};
const successOrder = async (order_id) => {
  try {
    console.log("order_id", order_id);
const data=await razorpayInstance.orders.fetchPayments(order_id)
if(data?.items[0]?.status==="captured"){
  await Order.updateMany({ order_id: order_id }, { payment: "Success" });

}else{
  await Order.updateMany({ order_id: order_id }, { payment: "Pending" });

}
return data;
  } catch (err) {
    return null;
  }
};

module.exports = { getCart, createOrder, emptyCart, cancelOrder, failOrder,successOrder };
