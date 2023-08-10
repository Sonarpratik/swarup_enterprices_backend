const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config()
const {OAuth2Client}=require('google-auth-library')

const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");
const {
  Authenticate,
  IsAdmin,
  IsAdminAndUser,
} = require("../middleware/authenticate.js");

router.get("/", (req, res) => {
  res.send("hello world in auth");
});

router.post('/',async (req,res,next)=>{
// res.header('Access-Contorl-Allow-Origin')
res.header('Referrer-Policy','no-referrer-when-downgrade')

const redirectUrl='http://localhost:8000/oauth'
const oAuth2Client=new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.SECRET_AUTH_KEY,
  redirectUrl
)
const authoriseUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
  prompt: 'consent'
});
res.json({url:authoriseUrl})

})

//User Register
router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;
    const { cpassword, ...data } = req.body;
    if (!name || !email || !phone || !password || !cpassword || !address) {
      return res.status(500).json({ error: "Fill all data" });
    }
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(500).json({ error: "email already exist" });
    } else if (password !== cpassword) {
      return res.status(500).json({ error: "Passwords are different" });
    }

    const user = new User(data);

    await user.save();
    res.status(201).json(data);
  } catch (err) {
    console.log(err);
  }
});

//Admin Register
router.post("/auth/admin/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const { cpassword, ...data } = req.body;
    if (!name || !email || !phone || !password || !cpassword) {
      return res.status(500).json({ error: "Fill all data" });
    }
    const userExist = await Admin.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(500).json({ error: "email already exist" });
    } else if (password !== cpassword) {
      return res.status(500).json({ error: "Passwords are different" });
    }
    console.log(data);

    const user = new Admin(data);

    await user.save();
    res.status(201).json(data);
  } catch (err) {
    console.log(err);
  }
});

//Login USER
router.post("/auth/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.status(401).json({ error: "Plz fill all data" });
    }

    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      //if it is match then it stores inside the inMatch
      const inMatch = await bcrypt.compare(password, userLogin.password);
      const tokenExpiration = 100000 * 60 ; // 10 minutes in seconds
      token = jwt.sign({ userId: userLogin._id }, "your_secret_key", {
        expiresIn: tokenExpiration,
      });
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + tokenExpiration*1000), // Set cookie expiration
        httpOnly: true,
        secure: true,
      });

      const tokenExpirationDateTime = new Date(Date.now() + tokenExpiration*1000);
      console.log(tokenExpirationDateTime)
      userLogin.tokens.push({ token, expiresAt: tokenExpirationDateTime });
      await userLogin.save();
      if (!inMatch) {
        return res.status(401).send("invalid credentials");
      } else {
        const userToken = {
          userToken: token,
        };
        res.status(200).json(userToken);
      }
    } else {
      return res.status(401).send("invalid credentials");
    }
  } catch (err) {
    console.log(err);
    return res.status(404).send(err);
  }
});

//Login Admin
router.post("/auth/admin/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.status(401).json({ error: "Plz fill all data" });
    }

    const userLogin = await Admin.findOne({ email: email });
    if (userLogin) {
      //if it is match then it stores inside the inMatch
      const inMatch = await bcrypt.compare(password, userLogin.password);
      const tokenExpiration = 100000 * 60 ; // 10 minutes in seconds
      token = jwt.sign({ userId: userLogin._id }, "your_secret_key", {
        expiresIn: tokenExpiration,
      });
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + tokenExpiration*1000), // Set cookie expiration
        httpOnly: true,
        secure: true,
      });

      const tokenExpirationDateTime = new Date(Date.now() + tokenExpiration*1000);
      console.log(tokenExpirationDateTime)
      userLogin.tokens.push({ token, expiresAt: tokenExpirationDateTime });
      await userLogin.save();
      if (!inMatch) {
        return res.status(401).send("invalid credentials");
      } else {
        const userToken = {
          userToken: token,
        };
        res.status(200).json(userToken);
      }
    } else {
      return res.status(401).send("invalid credentials");
    }
  } catch (err) {
    console.log(err);
    return res.status(404).send(err);
  }
});

//universal verify
router.get("/auth/verify", Authenticate, (req, res) => {
  const { _id, name, email, phone, address,cart,wishlist, ...data } = req.rootUser;
  res.status(200).send({ _id, name, email, address, phone ,cart,wishlist});
});

//Only ADMIN AND STAFF
router.get("/auth/verify/admin", IsAdmin, (req, res) => {
  const {
    _id,
    name,
    email,
    phone,
    role,
    saree_create,
    saree_edit,
    saree_delete,
    saree_view,
    ...data
  } = req.rootUser;

  res
    .status(200)
    .send({
      _id,
      name,
      email,
      phone,
      role,
      saree_create,
      saree_edit,
      saree_delete,
      saree_view,
    });
});

//Only Admin Can Update
router.patch("/auth/user/:id", IsAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { password, tokens, _id, ...data } = req.body;
    console.log(req.body);
    const did = await User.findByIdAndUpdate({ _id: userId }, data, {
      new: true,
    });
    res.status(200).send(did);
  } catch (e) {
    console.log(e);
    res.status(404).send("You Dont Hvae the clearnce");
  }
});

router.get("/isadmin", Authenticate, (req, res) => {
  const { name, email, phone, role, ...data } = req.rootUser;
  if (role === "admin") {
    res.status(200).send({ name, email, phone, role });
  } else {
    res.status(404).send("You Dont Hvae the clearnce");
  }
});

router.post("/delete", async (req, res) => {
  try {
    const del = await User.findOneAndDelete({ token: req.body.tokens.token });
    if (del) {
      res.status(201).send("done");
    } else {
      res.status(202).send("done");
    }
  } catch (err) {
    res.status(401).send(err);
  }
});

//get all users
router.get("/auth/user", IsAdmin, async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalCount = await User.countDocuments();

    // Fetch data with pagination using skip() and limit()
    const data = await User.find().skip(startIndex).limit(limit);

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalCount / limit);

    // Response object to include pagination info

    // const data = await User.find();

    const newArray = data.map(
      ({
        _id,
        name,
        email,
        phone,
        role,
        saree_create,
        saree_edit,
        saree_delete,
        saree_view,

        ...rest
      }) => ({
        _id,
        name,
        email,
        phone,
        role,
        saree_create,
        saree_edit,
        saree_delete,
        saree_view,
      })
    );
    const response = {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalCount,
      data: newArray,
    };

    res.status(200).send(response);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});

module.exports = router;






