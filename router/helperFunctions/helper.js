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

    const cartWithProductDetails = cart.map((cartItem) => {
      // Find the corresponding product details for the current cart item
      const productDetail = products.find(
        (product) => product._id.toString() === cartItem.product_id.toString()
      );
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

    const newOrder = await Order.updateMany(
      { order_id: order_id },
      { payment: "Failed" }
    );
    return newOrder;
  } catch (err) {
    return null;
  }
};
const successOrder = async (order_id) => {
  try {
    console.log("order_id", order_id);
    const data = await razorpayInstance.orders.fetchPayments(order_id);
    if (data?.items[0]?.status === "captured") {
      await Order.updateMany({ order_id: order_id }, { payment: "Success" });
    } else {
      await Order.updateMany({ order_id: order_id }, { payment: "Pending" });
    }
    return data;
  } catch (err) {
    return null;
  }
};
const getProductFromOrderId = async (order_id) => {
  try {
    const order = await Order.find({ order_id: order_id });
    // const order = await Order.find();

    // Calculate total pages for pagination

    // Fetch products based on product IDs
    const productIds = order.map((item) => item.product_id);

    // Fetch products based on product IDs
    const products = await Product.find({ _id: { $in: productIds } });

    const cartWithProductDetails = order.map((cartItem) => {
      // Find the corresponding product details for the current cart item
      const productDetail = products.find(
        (product) => product._id.toString() === cartItem.product_id.toString()
      );
      return {
        ...cartItem.toObject(), // Convert Mongoose document to plain JavaScript object
        product: productDetail, // Nest product details inside the cart item
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
          payment: item?.payment,
          stage: item?.stage,
          length: item?.length,
          breadth: item?.breadth,
          height: item?.height,
          weight: item?.weight,
          active: item?.active,

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
    return transformedArray;
  } catch (error) {
    console.log(error);
  }
};

const createShipRocketOrder = async (our_order) => {
  try {
    var axios = require("axios");

    if (our_order?.order_id) {
      const isSameAddress =
        our_order?.billing?.name === our_order?.shipping?.name &&
        our_order?.billing?.address === our_order?.shipping?.address &&
        our_order?.billing?.city === our_order?.shipping?.city &&
        our_order?.billing?.pincode === our_order?.shipping?.pincode &&
        our_order?.billing?.state === our_order?.shipping?.state;
        const inputDate = "2024-03-09T09:30:47.920Z";

// Parse the input date string

// Adjust the time zone offset for IST (UTC+5:30)
const indianDate = new Date(new Date(our_order?.created_at).getTime() + (5.5 * 60 * 60 * 1000));

// Format the date as desired
const formattedDate = `${indianDate.getFullYear()}-${String(indianDate.getMonth() + 1).padStart(2, '0')}-${String(indianDate.getDate()).padStart(2, '0')} ${String(indianDate.getHours()).padStart(2, '0')}:${String(indianDate.getMinutes()).padStart(2, '0')}`;
      
const convertedOrder = {
        order_id: our_order?.order_id,
        order_date: formattedDate,
        pickup_location: "Prateek",
        channel_id: "",
        comment: "",
        billing_customer_name: our_order?.billing?.name,
        billing_last_name: "",
        billing_address: our_order?.billing?.address,
        billing_address_2: "",
        billing_city: our_order?.billing?.city,
        billing_pincode: our_order?.billing?.pincode.toString(),
        billing_state: our_order?.billing?.state,
        billing_country: "India",
        billing_email: "",
        billing_phone: our_order?.billing?.phone.toString(),
        shipping_is_billing: isSameAddress,
        shipping_customer_name: our_order?.shipping?.name,
        shipping_last_name: "",
        shipping_address: our_order?.shipping?.address,
        shipping_address_2: "",
        shipping_city: our_order?.shipping?.city,
        shipping_pincode: our_order?.shipping?.pincode.toString(),
        shipping_country: "India",
        shipping_state: our_order?.shipping?.state,
        shipping_email: "",
        shipping_phone: our_order?.shipping?.phone.toString(),
        order_items: our_order?.product?.map((item) => ({
          name: item.product.name,
          sku: item.product.name + our_order?.color,
          units: item.quantity,
          selling_price: item.price.toString(),
          discount: item.discount.toString(),
          tax: "",
          hsn: "",
        })),
        payment_method: our_order?.payment,
        shipping_charges: 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: 0,
        sub_total: our_order?.product?.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        ),
        length: our_order?.length,
        breadth: our_order?.breadth,
        height: our_order?.height,
        weight: our_order?.weight,
      };

      console.log("convertedOrder", convertedOrder);
      const data2 = JSON.stringify(convertedOrder);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaXYyLnNoaXByb2NrZXQuaW4vdjEvZXh0ZXJuYWwvYXV0aC9sb2dpbiIsImlhdCI6MTcxMTUxNzk2NywiZXhwIjoxNzEyMzgxOTY3LCJuYmYiOjE3MTE1MTc5NjcsImp0aSI6IkZMQnZ2dzZxcmpFODJNUTMiLCJzdWIiOjQ1MDM2NzYsInBydiI6IjA1YmI2NjBmNjdjYWM3NDVmN2IzZGExZWVmMTk3MTk1YTIxMWU2ZDkiLCJjaWQiOjQyNTk0NTh9.ftPqf1YMiSQJuAJfEmfQq38CNCtrJXPPkhJwbUPKMX4`, // Ensure correct formatting of the authorization header
      };

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: data2,
        redirect: "follow",
      };

      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
        data2,
        { headers }
      );
      const data = response.data;
      console.log(data);
      return data;
    } else {
      console.log(our_order.product);
    }
  } catch (error) {
    console.log("try failed", error);
    return error;
  }
};
const updateState = async (order_id, body) => {
  try {
    const data = await Order.updateMany(
      { order_id: order_id },
      {
        $set: {
          stage: body.stage,
          length: body.length,
          breadth: body.breadth,
          height: body.height,
          weight: body.weight,
        },
      }
    );

    if (body?.go_to_shiprocket) {
      const newOrder = await getProductFromOrderId(order_id);
      const ShipRocket = await createShipRocketOrder(newOrder[0]);
      return ShipRocket;
    } else {
      console.log("just stage update");
      return data;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};
const updateStateFromWebHook = async (order_id, body) => {
  try {
    const data = await Order.updateMany(
      { order_id: order_id },
      {
        $set: {
          stage: body.current_status,
        },
      }
    );

    return data
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  getCart,
  createOrder,
  emptyCart,
  cancelOrder,
  failOrder,
  successOrder,
  updateState,
  getProductFromOrderId,
  updateStateFromWebHook,
};
