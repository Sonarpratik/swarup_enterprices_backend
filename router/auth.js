const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
const jst_decode=require('jwt-decode')
dotenv.config()

const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");
const {
  Authenticate,
  IsAdmin,
  IsAdminAndUser,
  IsAdminAndStaff,
  IsSuper,
  IsAdmin_Product_Delete,
  IsAdminAndUserAnd_staff_patch_true,

} = require("../middleware/authenticate.js");

router.get("/", (req, res) => {
  res.send("hello world in auth");
});


//User Register
router.post("/auth/register", async (req, res) => {
  try {
    const { name, email,  password } = req.body;
    const { cpassword, ...data } = req.body;
    if (!name || !email  || !password || !cpassword ) {
      return res.status(500).json({ message: "Fill all data" });
    }
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(500).json({ message: "email already exist" });
    } else if (password !== cpassword) {
      return res.status(500).json({ message: "Passwords are different" });
    }

    const user = new User(data);

    await user.save();
    res.status(201).json(data);
  } catch (err) {
    console.log(err);
  }
});

//Admin Register
router.post("/auth/admin/register",IsSuper, async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const { cpassword, ...data } = req.body;
    if (!name || !email || !phone || !password || !cpassword) {
      return res.status(500).json({ message: "Fill all data" });
    }
    const userExist = await Admin.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(500).json({ message: "email already exist" });
    } else if (password !== cpassword) {
      return res.status(500).json({ message: "Passwords are different" });
    }

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

    if (!email || !password) {
      return res.status(401).json({ message: "Plz fill all data" });
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
      userLogin.tokens[0]=({ token, expiresAt: tokenExpirationDateTime });
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
router.post("/auth/google/login", async (req, res) => {
  try {
    let token;
    const { Gtoken } = req.body;
    if(!Gtoken){
      res.status(404).send("Token Error")
    }
    const userobj=jst_decode(Gtoken)
    if(!userobj){
      res.status(404).send("Token Error")
    }else{


  

    const userLogin = await User.findOne({ email: userobj.email });
    if (userLogin) {
      //if it is match then it stores inside the inMatch
      // const inMatch = await bcrypt.compare(password, userLogin.password);
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
      // console.log(tokenExpirationDateTime)
      // userLogin.tokens.push({ token, expiresAt: tokenExpirationDateTime });
      userLogin.tokens[0]=({ token, expiresAt: tokenExpirationDateTime });

      await userLogin.save();
    
        const userToken = {
          userToken: token,
        };
        console.log("LOGIN")
        res.status(200).json(userToken);
      
    } else {

                const user = new User({name:userobj.name,email:userobj.email,user_id:userobj.sub});
            await user.save();
            const userLogin = await User.findOne({
                email: userobj.email,
                user_id: userobj.sub,
              });
            if(userLogin){
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
                // userLogin.tokens.push({ token, expiresAt: tokenExpirationDateTime });
                userLogin.tokens[0]=({ token, expiresAt: tokenExpirationDateTime });
                await userLogin.save();
            }  



            const userToken = {
                userToken: token,
              };
              console.log("CRETAED")
              res.status(200).json(userToken);
    }
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

    if (!email || !password) {
      return res.status(401).json({ message: "Plz fill all data" });
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
      // userLogin.tokens.push({ token, expiresAt: tokenExpirationDateTime });
      userLogin.tokens[0]=({ token, expiresAt: tokenExpirationDateTime });

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
  const { _id, name, email,  billing_address,shipping_address,billing_zip,shipping_zip,billing_phone,shipping_phone,billing_state,billing_city,shipping_state,shipping_city, ...data } = req.rootUser;
  res.status(200).send({ _id, name, email , billing_address,shipping_address,billing_zip,shipping_zip,billing_phone,shipping_phone,billing_state,billing_city,shipping_state,shipping_city});
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
router.patch("/auth/user/:id", IsAdminAndUserAnd_staff_patch_true, async (req, res) => {
  try {
    const userId = req.params.id;
    const { password, tokens, _id, ...data } = req.body;
    console.log(req.body);
    const did = await User.findByIdAndUpdate({ _id: userId }, data, {
      new: true,
    });

    const {name,email,billing_address,shipping_address,active,...extra}=did
    res.status(200).send({_id,name,email,billing_address,shipping_address,active});
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
//User Delete
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

//get all staff
router.get("/auth/staff", IsSuper, async (req, res) => {
  try {
    
    const data = await Admin.find();

    // Calculate total pages for pagination
 

    // Response object to include pagination info

    // const data = await User.find();
console.log(data)
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
        user_view,
        user_edit,
        user_delete,
      
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
        user_view,
        user_edit,
        user_delete,
      
      })
    );
  

    res.status(200).send(newArray);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});
//Get Staff By admin ANd Own User
router.get("/auth/staff/:id",IsAdminAndStaff, async (req, res) => {
  try {
    const Id = req.params.id;
    const data = await Admin.findById(Id);
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
  user_view,
  user_edit,
  user_delete,

  ...rest
}=data
  
    const newArray = {
      _id,
      name,
      email,
      phone,
      role,
      saree_create,
      saree_edit,
      saree_delete,
      saree_view,
      user_view,
      user_edit,
      user_delete,
    
    
    }
    res.status(200).send(newArray);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});
//Delete staff by admin
router.delete("/auth/staff/:id",IsSuper, async (req, res) => {
  try {
    const Id = req.params.id;
    const data = await Admin.findByIdAndDelete(Id);


    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});

//update staff by admin
router.patch("/auth/staff/:id", IsSuper, async (req, res) => {
  try {
    const userId = req.params.id;
    const { password, tokens, _id, ...data } = req.body;
    console.log(req.body);
    const did = await Admin.findByIdAndUpdate({ _id: userId }, data, {
      new: true,
    });

    const {name,email,phone,role,saree_create,saree_edit,saree_delete,saree_view,user_view,
      user_edit,
      user_delete,
    ...p}=did
    res.status(200).send({_id,name,email,phone,role,saree_create,saree_edit,saree_delete,saree_view,user_view,
      user_edit,
      user_delete,
    });
  } catch (e) {
    console.log(e);
    res.status(404).send("You Dont Hvae the clearnce");
  }
});
//get all user
router.get("/auth/user", async (req, res) => {
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
        billing_address,
        shipping_address,
        active,

        ...rest
      }) => ({
        _id,
        name,
        email,
        phone,
        billing_address,
        shipping_address,
        active,
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






