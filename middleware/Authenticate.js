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
//is admin create
const IsAdmin_Product_Create = async (req, res, next) => {
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

    const { name, email, phone, role, saree_create, ...data } = rootUser;

    if (role === "admin") {
      //   res.status(200).send({name, email, phone, role});

      next();
    } else {
      if (saree_create === true) {
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
//is admin update

const IsAdmin_Product_Update = async (req, res, next) => {
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

    const { name, email, phone, role, saree_create,saree_edit, ...data } = rootUser;

    if (role === "admin") {
      //   res.status(200).send({name, email, phone, role});

      next();
    } else {
      if (saree_edit === true) {
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
//admin product delete
const IsAdmin_Product_Delete = async (req, res, next) => {
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

    const { name, email, phone, role, saree_create,saree_edit,saree_delete, ...data } = rootUser;

    if (role === "admin") {
      //   res.status(200).send({name, email, phone, role});

      next();
    } else {
      if (saree_delete === true) {
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

//user delete 
const IsAdmin_User_Delete = async (req, res, next) => {
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

    const { name, email, phone, role, user_view,user_edit,user_delete, ...data } = rootUser;

    if (role === "admin") {
      //   res.status(200).send({name, email, phone, role});

      next();
    } else {
      if (user_delete === true) {
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
//user view
const IsAdmin_User_View = async (req, res, next) => {
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

    const { name, email, phone, role, user_view,user_edit,user_delete, ...data } = rootUser;

    if (role === "admin") {
      //   res.status(200).send({name, email, phone, role});

      next();
    } else {
      if (user_view === true) {
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
//user edit
const IsAdmin_User_Edit = async (req, res, next) => {
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

    const { name, email, phone, role, user_view,user_edit,user_delete, ...data } = rootUser;

    if (role === "admin") {
      //   res.status(200).send({name, email, phone, role});

      next();
    } else {
      if (user_edit === true) {
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
//admin and its user
const IsAdminAndUser = async (req, res, next) => {
  try {
    const { verfiyToken, token } = VerifyToken(req, res);

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
        } else {
          res.status(401).json({message:"Unauthorized"});
        }
      } else {
        // res.status(401).json({message:"Unauthorized"});
        throw new Error("User not found");
      }
    } else {
      req.token = token;
      const { _id, ...data } = rootUser;
      const getid = rootUser._id.toString();
      if (userId === getid) {
        next();
      } else {
        res.status(401).json({message:"Unauthorized"});
      }
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Wrong Token" });
  }
};
const IsAdminAndUserAnd_staff_patch_true = async (req, res, next) => {
  try {
    const { verfiyToken, token } = VerifyToken(req, res);

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
        const { _id, role,user_edit, ...data } = admin;
        if (role === "admin") {
          next();
        } else {
          if(user_edit===true){
            next()
          }else{

            res.status(401).json({message:"Unauthorized"});
          }
          
        }
      } else {
        // res.status(401).json({message:"Unauthorized"});
        throw new Error("User not found");
      }
    } else {
      req.token = token;
      const { _id, ...data } = rootUser;
      const getid = rootUser._id.toString();
      if (userId === getid) {
        next();
      } else {
        res.status(401).json({message:"Unauthorized"});
      }
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Wrong Token" });
  }
};
//admin and its staff
const IsAdminAndStaff = async (req, res, next) => {
  try {
    const { verfiyToken, token } = VerifyToken(req, res);

    const userId = req.params.id;
    const rootUser = await Admin.findOne({
      _id: verfiyToken.userId,
      "tokens.token": token,
    });

    if (rootUser) {
      const { _id, role, ...data } = rootUser;
      if (role === "admin") {
        next();
      } else {
        req.token = token;
        const getid = rootUser._id.toString();
        console.log(getid, userId);
        if (userId === getid) {
          next();
        } else {
          res.status(401).json({message:"Unauthorized"});
        }
      }
    } else {
      res.status(401).json({message:"Unauthorized"});
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Wrong Token" });
  }
};
module.exports = {
  Authenticate,
  IsAdmin,
  IsAdminAndUser,
  IsAdmin_Product_Create,
  IsAdmin_Product_Update,
  IsAdminAndStaff,
  IsSuper,
  IsAdmin_Product_Delete,
  IsAdmin_User_Delete,
  IsAdmin_User_Edit,
  IsAdmin_User_View,
  IsAdminAndUserAnd_staff_patch_true,
};
