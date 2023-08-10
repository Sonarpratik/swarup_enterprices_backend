const express = require("express");
const app = express();
const mongoose = require("mongoose");



const port = process.env.PORT || 8000;
const dotenv = require("dotenv");
dotenv.config();

// const PORT = process.env.PORT;

const cors = require("cors")
app.use(cors());






// const whitelist = ["http://localhost:4000"]
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error("Not allowed by CORS"))
//     }
//   },
//   credentials: true,
// }
// app.use(cors(corsOptions))







require('./allFiles/Allfun')

//Connection is achieved
require('./db/conn')

//to understand json file
app.use(express.json());

//We connect to the router to free the space in app js
var authRouter=require('./router/passport/oauth')
// var requestRoute=require('./router/auth')
app.use('/oauth',authRouter)
app.use(require('./router/auth'))
app.use(require('./router/auth'))
app.use(require('./router/product'))
app.use(require('./router/cart'))
// require('./router/auth')



app.get("/contact", (req, res) => {
  res.send("hello contact");
});
app.get("*", (req, res) => {
  res.status(404).send("hello hahaha ur wrong");
});

app.listen(port, () => {
  console.log(`server is running on port no ${port}`);
});
