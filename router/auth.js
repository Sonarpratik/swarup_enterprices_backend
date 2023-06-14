const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const Authenticate = require("../middleware/Authenticate");

const User = require("../models/userSchema");
const Mainaa = require("../models/timeSchema");
// const { findById } = require("../models/userSchema");

//Get
router.get("/", (req, res) => {
  res.send("hello world in auth");
});

//Register
router.post("/register", async (req, res) => {
  const { name, email, phone, password, cpassword } = req.body;

  if (!name || !email || !phone || !password || !cpassword) {
    return res.status(402).json({ error: "Fill all data" });
  }
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(422).json({ error: "email already exist" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "Passwords are different" });
    }

    const user = new User({ name, email, phone, password, cpassword });

    //Here we are making data or password bcrypt
    //Writen innside Schema
    await user.save();
    res.status(200).json({ message: "Successfull Saved" });
  } catch (err) {
    console.log("we are here");
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    console.log(req.body)

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
         secure:true
      });
      // localStorage.setItem("jwtoken",token);

      if (!inMatch) {
        return res.status(401).send("invalid credentials");
      } else {

        const userToken={
          userToken:token
        }
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

router.get("/verify", Authenticate, (req, res) => {


  const {name,email,phone,role,...data}=req.rootUser
  if(role==="admin"){

    res.status(200).send({name,email,phone,role});
  }else{
    res.status(200).send({name,email,phone});

  }
});


router.get("/isadmin", Authenticate, (req, res) => {


  const {name,email,phone,role,...data}=req.rootUser
  if(role==="admin"){

    res.status(200).send({name,email,phone,role});
  }else{
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

router.patch("/about", Authenticate, async (req, res) => {
  try {
  const {_id,...data}=req.rootUser

    const did = await User.findByIdAndUpdate({ _id: _id }, req.body, {
      new: true,
    });
    res.status(200).send(did);
  } catch (e) {
    console.log(e);
    res.status(409).send(e);
  }
});

//get all users
router.get("/allusers",Authenticate, async (req, res) => {
  try {
    const data = await User.find();


    const {name,email,phone,role,...other}=req.rootUser
    if(role==="admin"){
  
      res.status(200).send(data);
    }else{
      res.status(404).send("You dont have access");
  
    }




  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});



router.delete("/scam/:id", async (req, res) => {
  try {
    // const tmain = new Mainaa({ req.body._id});
    const found = await Mainaa.findByIdAndDelete(req.params.id);

    if (found === null) {
      res.status(404).json({ message: "not found" });
    } else {
      res.status(200).json({ message: "deleted" });
    }
  } catch (e) {
    console.log(e);
    res.status(402).send(e);
  }
});



router.post("/find", async (req, res) => {
  try {
    const foundit = await User.findOne({ _id: req.body._id });
    res.status(200).json(foundit);
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "not found" });
  }
});


router.get("/logout", async (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logout");
});


module.exports = router;
