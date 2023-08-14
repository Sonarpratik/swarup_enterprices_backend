const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const axios = require("axios"); // Import the axios library
const { OAuth2Client } = require("google-auth-library");
const User = require("../../models/userSchema");

dotenv.config();

async function getUserData(access_token) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        params: { access_token }, // Pass access_token as a query parameter
      }
    );

    console.log("data", response.data);
    // res.status(200).send(response.data);
    return response.data;
  } catch (error) {
    console.error("Error retrieving user data:", error.response.data);
  }
}

router.get("/verify", async (req, res) => {
  try {
    const tokem =
      "ya29.a0AfB_byB8iV4c648aQHd9rOj6aWh4iQ8mW_sFkYHwSyxYQ6CWQ_ZHoUyu0i1T5a3v8GeGRLwjdvYlkIgFsd6zNw1qGogA3ZVwtO0A-4ywmbrhBjpvfbaa8-HGCNG9evOtVqMstrbNzihG8krOSMuNewi7mBO0aCgYKAW0SARESFQHsvYls_zbry8iausUZBve7YiXYSg0163";
    const resv = await getUserData(tokem);
    res.status(200).json(resv);
  } catch (error) {
  console.log(error)
    res.status(400).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const code = req.query.code;
    const redirectUrl = "http://localhost:8000/oauth";
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.SECRET_AUTH_KEY,
      redirectUrl
    );

    const tokenResponse = await oAuth2Client.getToken(code); // Get token response
    const expiresIn = tokenResponse.tokens.expiry_date - Date.now() / 1000;

    if (expiresIn < 300) {
      // If token expires in less than 5 minutes (300 seconds)
      // Use the refresh_token to obtain a new access token
      const refreshTokenResponse = await oAuth2Client.refreshToken(
        tokenResponse.tokens.refresh_token
      );
      await oAuth2Client.setCredentials(refreshTokenResponse.tokens);
    } else {
      await oAuth2Client.setCredentials(tokenResponse.tokens);
    } // Use a different variable name
    await oAuth2Client.setCredentials(tokenResponse.tokens);

    console.log("Token Acquired");
    const user = oAuth2Client.credentials;
    console.log("Credentials", user);
    if (!user) {
      res.send("not found");
    } else {
      const got_user = await getUserData(user.access_token);

      const { name, sub, email } = got_user;
      try {
        const userLogin = await User.findOne({
            email: got_user.email,
            user_id: got_user.sub,
          });
          if(userLogin){
               console.log(userLogin) 
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
               const userToken = {
                userToken: token,
              };
              console.log("Login")
              res.status(200).json(userToken);
          }else{

          
            const user = new User({name:name,email:email,user_id:sub});
            await user.save();
            const userLogin = await User.findOne({
                email: got_user.email,
                user_id: got_user.sub,
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
                userLogin.tokens.push({ token, expiresAt: tokenExpirationDateTime });
                await userLogin.save();
            }  



            const userToken = {
                userToken: token,
              };
              console.log("CRETAED")
              res.status(200).json(userToken);
          }

      } catch (error) {
        console.log(error)
        res.status(400).send("Error While Creating User")

      }
     



    //   res.send("User data retrieved.");
    }
    // Send a response to the client
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal server errors"); // Handle errors gracefully
  }
});

module.exports = router;
