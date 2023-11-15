const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const {
  Authenticate,
  IsAdmin,
  IsAdminAndUser,
  IsAdmin_Product_Create,
  IsAdmin_Product_Update,
  IsAdmin_Product_Delete,
} = require("../middleware/authenticate.js");
const Review = require("../models/reviewSchema");

//Create Review
router.post("/review", async (req, res) => {
  try {
    const review = new Review(req.body);

    const created = await review.save();
    res.status(201).json(created);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);

  }
});

//Get All Review For Given Id
router.get("/review", async (req, res) => {
  try {
const { page, limit, ...resa } = req.query;

const startIndex = (page - 1) * limit;
const endIndex = page * limit;
const totalCount = await Review.countDocuments(resa);

let query = Review.find(resa);



const data = await query.skip(startIndex).limit(limit);
// Calculate total pages for pagination
const totalPages = Math.ceil(totalCount / limit);
// const product = await Product.find();
const user = await User.find({ _id: { $in: data.map(item=>item.user_id) } });
const cleanUsers = user.map(user => {
  const { tokens,user_id, __v, ...userData } = user._doc;
  return userData;
})

// Create a mapping of user IDs to user objects
const userMap = {};
cleanUsers.forEach(user => {
  userMap[user._id] = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
});


// Replace user_id with corresponding user object
const modifiedReviews = data.map(review => ({
  _id: review._id,
  user: userMap[review.user_id],
  product_id: review.product_id,
  rating: review.rating,
  description: review.description,
  __v: review.__v
}));

const response = {
  currentPage: page,
  totalPages: totalPages,
  totalItems: totalCount,
  data: modifiedReviews,
};

res.status(200).json(response);

  } catch (err) {
    console.log(err);
    res.status(401).json(err);

  }
});


router.delete("/review/:id",async(req,res)=>{
  try {
    const id = req.params.id;

    const review = await Review.findByIdAndDelete({ _id: id });

    res.status(200).json(review);
  } catch (err) {
    res.status(404).json({ data: "product not found" });

    console.log(err);
  }
})

module.exports = router;
