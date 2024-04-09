const express = require("express");
const app = express();
const mongoose = require("mongoose");
var fs = require("fs")
const https=require('https')

// const key=fs.readFileSync('private.key')
// const cert=fs.readFileSync('certificate.crt')

// const cred={
//   key,cert
// }





const port = process.env.PORT || 8000;
const dotenv = require("dotenv");
dotenv.config();

// const PORT = process.env.PORT;

const cors = require("cors")
app.use(cors());


http = require('http').Server(app),
io = require('socket.io')(http);
    fs = require('fs'),
    ccav = require('./ccavutil.js'),
    qs = require('querystring'),
    ccavReqHandler = require('./ccavRequestHandler.js'),
    ccavResHandler = require('./ccavResponseHandler.js');



app.get('/payment', function(req, res){
    res.sendFile(__dirname + '/dataFrom.html');
});



http = require('http').Server(app),
io = require('socket.io')(http);
    fs = require('fs'),
    qs = require('querystring'),

app.get('/.well-known/pki-validation/B7CAE7C113F05C2DC0F594CBA3D489E8.txt',(req,res)=>{
  res.sendFile(__dirname + `/B7CAE7C113F05C2DC0F594CBA3D489E8.txt`);

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
// var requestRoute=require('./router/auth')
app.use(require('./router/auth'))
app.use(require('./router/product'))
app.use(require('./router/cart'))
app.use(require('./router/payment'))
app.use(require('./router/order'))
app.use(require('./router/shiprocket.js'))
app.use('/aws',require('./router/aws'))
app.use('/api',require('./router/review'))

// app.use(require('./router/auth'))
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



// const httpsServer=https.createServer(cred,app)
// httpsServer.listen(443)

