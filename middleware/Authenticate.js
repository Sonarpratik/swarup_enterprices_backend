const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");



const VerifyToken=(req)=>{
  let authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];
    const verfiyToken = jwt.verify(token, "your_secret_key");
    const tokenExpirationDateInSeconds = verfiyToken.exp; // Expiration time in seconds
    const currentTimeInSeconds = Math.floor(Date.now() / 1000); // Current time in seconds

    if (tokenExpirationDateInSeconds < currentTimeInSeconds) {
    res.status(401).send("Token has expired"); }
return {verfiyToken,token}
}

// Verify the token is real or not
const Authenticate = async (req, res, next) => {
  try {
  
const {verfiyToken,token}= VerifyToken(req);

    const rootUser = await User.findOne({
      _id: verfiyToken.userId,
      "tokens.token": token,
    });



    if (!rootUser) {
      throw new Error("User not found");
    }
  

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).send("Unauthorized");
  }
};

// Admin Clearance
const IsAdmin = async (req, res, next) => {
  try {
    const {verfiyToken,token}= VerifyToken(req);


    const rootUser = await Admin.findOne({
      _id: verfiyToken.userId,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.rootUser = rootUser;

    const { name, email, phone, role, ...data } = rootUser;

    if (role === "admin" || role === "staff") {
      //   res.status(200).send({name, email, phone, role});
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Admin Unauthorized");
  }
};
//is admin create
const IsAdmin_Product_Create = async (req, res, next) => {
  try {
    const {verfiyToken,token}= VerifyToken(req);

    const rootUser = await Admin.findOne({
      _id: verfiyToken.userId,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }
   
    req.token = token;
    req.rootUser = rootUser;

    const { name, email, phone, role, saree_create, ...data } = rootUser;

    if (role === "admin") {
      //   res.status(200).send({name, email, phone, role});

      next();
    } else {
      if (saree_create === true) {
        next();
      } else {
        res.status(401).send("Unauthorized");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Admin Unauthorized");
  }
};
//is admin update

const IsAdmin_Product_Update = async (req, res, next) => {
  try {
    const {verfiyToken,token}= VerifyToken(req);

    const rootUser = await Admin.findOne({
      _id: verfiyToken.userId,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }
   
    req.token = token;
    req.rootUser = rootUser;

    const { name, email, phone, role, saree_create, ...data } = rootUser;

    if (role === "admin") {
      //   res.status(200).send({name, email, phone, role});

      next();
    } else {
      if (saree_update === true) {
        next();
      } else {
        res.status(401).send("Unauthorized");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Admin Unauthorized");
  }
};
//admin and its user
const IsAdminAndUser = async (req, res, next) => {
  try {
    const {verfiyToken,token}= VerifyToken(req);

    const userId = req.params.id;
    const rootUser = await User.findOne({
      _id: verfiyToken.userId,
      "tokens.token": token,
    });
    const admin = await Admin.findOne({
      _id: verfiyToken.userId,
      "tokens.token": token,
    });

    if (!rootUser) {
      if (admin) {
        const { _id, role, ...data } = admin;
        if (role === "admin") {
          next();
        }else{
    res.status(401).send("Unauthorized");

        }
      } else {
        // res.status(401).send("Unauthorized");
        throw new Error("User not found");

      }
    } else {
      req.token = token;
      const { _id, ...data } = rootUser;
      const getid = rootUser._id.toString();
      if (userId === getid) {
        next();
      }else{
        res.status(401).send("Unauthorized");

      }
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Big Unauthorized");
  }
};

module.exports = {
  Authenticate,
  IsAdmin,
  IsAdminAndUser,
  IsAdmin_Product_Create,
  IsAdmin_Product_Update,
};
