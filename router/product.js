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
const {
  Authenticate,
  IsAdmin,
  IsSuper,
  GetUser,
} = require("../middleware/authenticate.js");
const {
  getProduct,
  extractNumbers,
  mostUsedCategory,
} = require("./helperFunctions/productHelper.js");
const { a } = require("./helperFunctions/test.js");
const Suggestion = require("../models/suggestionSchema.js");

router.get("/api/product", async (req, res) => {
  try {
    const {
      page,
      limit,
      product_name,
      sort,
      max_price,
      min_price,
      min_discount,
      max_discount,
      other,
      price,
      discount,
      ...resa
    } = req.query;
    if (other) {
    }
    if (product_name) {
      const regexPattern = new RegExp(product_name, 'i'); // Case-insensitive regex
      resa.name = { $regex: regexPattern };
      // resa.category = { $regex: regexPattern };
      // resa.name = { $regex: product_name };
      // resa.category = { $regex: product_name };
    }
    if (discount) {
      const newDiscount = discount.replace(/%$/, "");
      resa.discount = {
        $gte: parseInt(newDiscount),
      };
    }
    if (price) {
      const { min, max } = extractNumbers(price);
      if (max === null) {
        resa.price = {
          $gte: parseInt(min),
        };
      } else {
        resa.price = {
          $gte: parseInt(min),
          $lte: parseInt(max),
        };
      }
      // resa.discount = {
      //   $gte: parseInt(newDiscount),
      // }
    }
    if (min_price && max_price) {
      resa.product_price = {
        $gte: parseInt(min_price),
        $lte: parseInt(max_price),
      };
    }
    if (min_discount && max_discount) {
      resa.product_discount = {
        $gte: parseInt(min_discount),
        $lte: parseInt(max_discount),
      };
    }

    resa.active = true;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalCount = await Product.countDocuments(resa);
    // db.foo.aggregate({ $group: { _id: '$age', name: { $max: '$name' } } }).result
    // Fetch data with pagination using skip() and limit()
    const data = await Product.find(resa).skip(startIndex).limit(limit);

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalCount / limit);

    // Response object to include pagination info

    // const data = await User.find();

    const response = {
      currentPage: parseInt(page),
      totalPages: totalPages,
      totalItems: totalCount,
      data: data,
    };

    res.status(200).send(response);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});
router.get("/api/product/trending", async (req, res) => {
  try {
    const {
      page,
      limit,
      product_name,
      sort,
      max_price,
      min_price,
      min_discount,
      max_discount,
      other,
      ...resa
    } = req.query;
    if (other) {
    }
    if (product_name) {
      resa.product_name = { $regex: product_name };
    }
    if (min_price && max_price) {
      resa.product_price = {
        $gte: parseInt(min_price),
        $lte: parseInt(max_price),
      };
    }
    if (min_discount && max_discount) {
      resa.product_discount = {
        $gte: parseInt(min_discount),
        $lte: parseInt(max_discount),
      };
    }

    resa.active = true;
    resa.trending = true;

    // db.foo.aggregate({ $group: { _id: '$age', name: { $max: '$name' } } }).result
    // Fetch data with pagination using skip() and limit()
    const data = await Product.find(resa);

    // Calculate total pages for pagination

    // Response object to include pagination info

    // const data = await User.find();

    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});
router.get("/api/admin-product", async (req, res) => {
  try {
    const {
      product_name,

      ...resa
    } = req.query;
    if (product_name) {
      const regexPattern = new RegExp(product_name, 'i'); // Case-insensitive regex
      resa.name = { $regex: regexPattern };
      // resa.category = { $regex: regexPattern };
      // resa.name = { $regex: product_name };
      // resa.category = { $regex: product_name };
    }
    const page = req.query.page;
    const limit = req.query.limit;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalCount = await Product.countDocuments(resa);

    // Fetch data with pagination using skip() and limit()
    const data = await Product.find(resa).skip(startIndex).limit(limit);

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalCount / limit);

    // Response object to include pagination info

    // const data = await User.find();

    const response = {
      currentPage: parseInt(page),
      totalPages: totalPages,
      totalItems: totalCount,
      data: data,
    };

    res.status(200).send(response);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});
router.get("/api/product/:id", GetUser, async (req, res) => {
  try {
    const userId = req.params.id;

    const data = await Product.findById(userId);
    const products = await Product.find({ name: data.name });
    const result = getProduct(data, products);
    if (req?.rootUser) {
      console.log("id found", req?.rootUser?._id?.toString());
      const suggestionProducts = await Suggestion.find({
        user_id: req?.rootUser?._id?.toString(),
        product_id: data?._id,
      });
      if (suggestionProducts.length > 0) {
        console.log("suggestionProducts", suggestionProducts);
      } else {
        const structure = {
          user_id: req?.rootUser?._id?.toString(),
          category: data?.category,
          product_id: data?._id,
        };
        const userSuggestions = await Suggestion.find({
          user_id: req?.rootUser?._id?.toString(),
        });
        console.log("userSuggestions", userSuggestions);
        if (userSuggestions.length >= 6) {
          await Suggestion.findByIdAndDelete(userSuggestions[0]?._id);
        }
        const suggestion = new Suggestion(structure);

        await suggestion.save();
      }
    } else {
      console.log("id not found");
    }
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});
router.get("/api/admin-product/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const data = await Product.findById(userId);

    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});
router.get("/api/related-product/:name", async (req, res) => {
  try {
    const userId = req.params.name;
    const originalProduct = await Product.findOne({ _id: userId });
    const data = await Product.find({
      name: originalProduct.name,
      active: true,
    });
    const newData = data.filter(
      (item) => item._id.toString() !== originalProduct._id.toString()
    );
    res.status(200).send(newData);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});
router.get("/api/suggestions-product", GetUser, async (req, res) => {
  try {
    if (req?.rootUser) {
      const data = await Suggestion.find({
        user_id: req?.rootUser?._id?.toString(),
      });
      if (data?.length > 0) {
        const category = mostUsedCategory(data);

        const products = await Product.find({
          category: category,
          active: true,
        });
        // console.log(category)
        // console.log(products)
        // const filteredProducts=products?.filter((item)=>item?._id!==data?.)
        const idsToExclude = data?.map((item) => item.product_id);
        console.log(idsToExclude);
        const filteredData = products?.filter(
          (item) => !idsToExclude.includes(item?._id?.toString())
        );
        console.log("filteredData", filteredData);
        res.status(200).send(filteredData);
      } else {
        const data = await Product.find({ trending: true });
        res.status(200).send(data);
      }
    } else {
      const data = await Product.find({ trending: true, active: true });
      res.status(200).send(data);
    }
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});
router.delete("/api/product/:id", IsAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    const data = await Product.findByIdAndDelete(userId);

    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});
router.patch("/api/product/:id", IsAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { _id, ...data } = req.body;
    const did = await Product.findByIdAndUpdate({ _id: userId }, data, {
      new: true,
    });

    res.status(200).send(did);
  } catch (e) {
    console.log(e);
    res.status(404).send("You Dont Hvae the clearnce");
  }
});
router.post("/api/product", async (req, res) => {
  try {
    const product = new Product(req.body);

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.log(err);
    res.status(404).send("You Dont Hvae the clearnce");
  }
});

module.exports = router;
