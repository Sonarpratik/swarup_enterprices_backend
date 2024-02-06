const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");

const VerifyToken = (req, res) => {
 
    let authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];
    const verfiyToken = jwt.verify(token, "your_secret_key");
    const tokenExpirationDateInSeconds = verfiyToken.exp; // Expiration time in seconds
    const currentTimeInSeconds = Math.floor(Date.now() / 1000); // Current time in seconds

    if (tokenExpirationDateInSeconds < currentTimeInSeconds) {
      res.status(401).json({message:"Token has expired"})
    }
    return { verfiyToken, token };

};

// Verify the token is real or not
const Authenticate = async (req, res, next) => {
  try {
    const { verfiyToken, token } = VerifyToken(req, res);

    const rootUser = await User.findOne({
      _id: verfiyToken.userId,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }else{

      
      req.token = token;
      req.rootUser = rootUser;
      req.userID = rootUser._id;
      if(req.rootUser.active===true){
        next();

      }else{
      res.status(404).json({message:"Blocked"});

      }
    }
    } catch (err) {
      console.log(err);
      res.status(401).json({message:"UnAuthorised"});
  }
};

//Is Super Admin
const IsSuper = async (req, res, next) => {
  try {
    const { verfiyToken, token } = VerifyToken(req, res);

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

    if (role === "admin" ) {
      //   res.status(200).send({name, email, phone, role});
      next();
    } else {
      res.status(401).json({message:"Unauthorized"});
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Admin Unauthorized");
  }
};

// Admin Clearance
const IsAdmin = async (req, res, next) => {
  try {
    const { verfiyToken, token } = VerifyToken(req, res);

    const rootUser = await Admin.findOne({
      _id: verfiyToken.userId,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }
    else{

      
      req.token = token;
      req.rootUser = rootUser;
      
      const { name, email, phone, role, ...data } = rootUser;
      
      if (role === "admin" || role === "staff") {
        //   res.status(200).send({name, email, phone, role});
        next();
      } else {
        res.status(401).json({message:"Unauthorized"});
      }
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Admin Unauthorized");
  }
};

module.exports = {
  Authenticate,
  IsAdmin,
  IsSuper,
  
};
