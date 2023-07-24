const jwt = require('jsonwebtoken');
const User = require ("../models/userSchema");

// Verify the token is real or not 
const Authenticate = async (req, res, next) => {
  try {
    let authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];
    const verfiyToken = jwt.verify(token, process.env.SECRET_KEY);

    const rootUser = await User.findOne({_id: verfiyToken._id, "tokens.token": token});

    if (!rootUser) {
      throw new Error('User not found');
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (err) {
    res.status(401).send('Unauthorized');
    console.log(err);
  }
};

// Admin Clearance
const IsAdmin = async (req, res, next) => {
  try {
    let authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verfiyToken = jwt.verify(token, process.env.SECRET_KEY);
    
    const rootUser = await User.findOne({_id: verfiyToken._id, "tokens.token": token});
    
    if (!rootUser) {
      throw new Error('User not found');
    }
    
    req.token = token;
    req.rootUser = rootUser;

    const {name, email, phone, role, ...data} = rootUser;
    
    if (role === "admin") {
    //   res.status(200).send({name, email, phone, role});
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch (err) {
    res.status(401).send('Admin Unauthorized');
    console.log(err);
  }
};


//admin and its user
const IsAdminAndUser = async (req, res, next) => {
    try {
      let authHeader = req.headers.authorization;
      const userId = req.params.id;


      const token = authHeader.split(" ")[1];
      const verfiyToken = jwt.verify(token, process.env.SECRET_KEY);
      
      //finding a user from the token
      const rootUser = await User.findOne({_id: verfiyToken._id, "tokens.token": token});
      
      if (!rootUser) {
        throw new Error('User not found');
      }
      
      req.token = token;
      const {_id,role, ...data} = rootUser;
      const getid = rootUser._id.toString()
      if (role === "admin") {
        next();
      } else {
        if(userId===getid){
            console.log("i am the user")
            next()
        }else{

            res.status(401).send('Unauthorized');
        }

      }
    } catch (err) {
      res.status(401).send('Big Unauthorized');
      console.log(err);
    }
  };
  

module.exports = { Authenticate, IsAdmin,IsAdminAndUser };