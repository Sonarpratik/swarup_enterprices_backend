const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const User = require("../models/userSchema");
const Mainaa = require("../models/timeSchema");
const {
  Authenticate,
  IsAdmin,
  IsAdminAndUser,
} = require("../middleware/authenticate.js");

router.get("/", (req, res) => {
  res.send("hello world in auth");
});

//Register
router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
const {cpassword,...data}=req.body
    if (!name || !email || !phone || !password || !cpassword) {
      return res.status(500).json({ error: "Fill all data" });
    }
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(500).json({ error: "email already exist" });
    } else if (password !== cpassword) {
      return res.status(500).json({ error: "Passwords are different" });
    }
console.log(data)
    const user = new User(data);
    
    await user.save();
    res.status(201).json({ message: "Successfull Saved" });
  } catch (err) {
    console.log(err);
  }
});

//Login
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

      token = await userLogin.generateAuthToken();
      // console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000), //30 days
        httpOnly: true,
        secure: true,
      });
      // localStorage.setItem("jwtoken",token);

      if (!inMatch) {
        return res.status(401).send("invalid credentials");
      } else {
        const userToken = {
          userToken: token,
        };
        res.status(200).json(userToken);
      }
    } else {
      console.log("caught in login.js");
      return res.status(401).send("invalid credentials");
    }
  } catch (err) {
    return res.status(404).send(err);
  }
});

//universal verify
router.get("/auth/verify", Authenticate, (req, res) => {
  const { _id, name, email, phone, role, ...data } = req.rootUser;
  if (role === "admin") {
    res.status(200).send({ _id, name, email, phone, role });
  } else {
    res.status(200).send({ _id, name, email, phone });
  }
});
//universal verify

router.get("/auth/user/me", Authenticate, (req, res) => {
  const { _id, name, email, phone,role ,invoice_create,
    invoice_edit,
    invoice_delete,
    invoice_view,
    client_create,
    client_edit,
    client_delete,
    client_view, ...data } = req.rootUser;

    res.status(200).send({ _id, name, email, phone,role ,invoice_create,
      invoice_edit,
      invoice_delete,
      invoice_view,
      client_create,
      client_edit,
      client_delete,
      client_view});

});

//Only Admin Verify
router.get("/auth/admin", IsAdmin, (req, res) => {
  const { _id, name, email, phone, role, ...data } = req.rootUser;

  res.status(200).send({ _id, name, email, phone, role });
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

//ONly Admin And user can get
router.get("/auth/user/:id", IsAdminAndUser, async (req, res) => {
  try {
    const userId = req.params.id;
    const did = await User.findById({ _id: userId });
    console.log(did);
    const { _id, name, email, phone, role, ...data } = did;

    // res.status(200).send(_id,name,email,phone,role);
    res.status(200).send({ _id, name, email, phone, role });
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
    const data = await User.find();

    const newArray = data.map(
      ({
        _id,
        name,
        email,
        phone,
        role,
        invoice_create,
        invoice_edit,
        invoice_delete,
        invoice_view,
        client_create,
        client_edit,
        client_delete,
        client_view,
        ...rest
      }) => ({
        _id,
        name,
        email,
        phone,
        role,
        invoice_create,
        invoice_edit,
        invoice_delete,
        invoice_view,
        client_create,
        client_edit,
        client_delete,
        client_view,
      })
    );

    res.status(200).send(newArray);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});

module.exports = router;
