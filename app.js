const express = require("express");
const app = express();
const mongoose = require("mongoose");



const port = process.env.PORT || 8000;
const dotenv = require("dotenv");
dotenv.config();

// const PORT = process.env.PORT;

const cors = require("cors")
app.use(cors());




var ccavReqHandler = require('./ccavRequestHandler.js'),
    ccavResHandler = require('./ccavResponseHandler.js');
    ccCus=require("./custonRes.js")

app.use(express.static('public'));
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);


app.get('/about', function (req, res){
    	res.render('dataFrom.html');
});

app.post('/ccavRequestHandler', function (request, response){
    console.log("hello")
	ccavReqHandler.postReq(request, response);
});


app.post('/ccavResponseHandler', function (request, response){
        ccavResHandler.postRes(request, response);
});
app.post('/abort', function (request, response){
    //    response.send("Abort")
    ccCus.postCus(request, response);

    //    response.redirect('http://localhost:3000');
});




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
// app.use(require('./router/auth'))
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
