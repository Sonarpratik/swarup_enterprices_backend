const express = require("express");
const app = express();
const mongoose = require("mongoose");
var fs = require("fs")

// const file=fs.readFileSync('./')



const port = process.env.PORT || 8000;
const dotenv = require("dotenv");
dotenv.config();

// const PORT = process.env.PORT;

const cors = require("cors")
app.use(cors());
http = require('http').Server(app),
io = require('socket.io')(http);

//var express = require('express');
//var app = express();
//var http = require('http'),
    fs = require('fs'),
    ccav = require('./ccavutil.js'),
    qs = require('querystring'),
    ccavReqHandler = require('./ccavRequestHandler.js'),
    ccavResHandler = require('./ccavResponseHandler.js');



app.get('/payment', function(req, res){
    res.sendFile(__dirname + '/dataFrom.html');
});
app.get('/.well-known/pki-validation/117B8B17A66CCF2BE4A552E04D8EBBFC.txt',(req,res)=>{
  res.sendFile(`D:/AAA-KARMACTS/Saree Ecom/server/userBackend/117B8B17A66CCF2BE4A552E04D8EBBFC.txt`);

})

io.on('connection', function(socket){
    console.log('a user connected');
});

app.get('/about', function (req, res){
        res.render('dataFrom.html');
});

app.post('/ccavRequestHandler', function (request, response){
    ccavReqHandler.postReq(request, response);
});


app.post('/ccavResponseHandler', function (request, response){
        ccavResHandler.postRes(request, response);
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
app.use('/aws',require('./router/aws'))
// app.use(require('./router/auth'))
app.use(require('./router/product'))
app.use(require('./router/cart'))
app.use(require('./router/order'))
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
