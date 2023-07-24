const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const Authenticate = require("../middleware/authenticate");

const User = require("../models/userSchema");
const Invoice = require("../models/invoiceSchema");
const Client = require("../models/clientSchema");
const clientSchema = require("../models/clientSchema");


//Invoice Create
router.post("/api/invoice",async (req, res) => {

    try {
      
        const user = new Invoice(req.body);
    
      
        await user.save();
        res.status(201).json(user);
      } catch (err) {
        console.log("we are here");
      }

});

//Get All Invoice 
router.get("/api/invoice",async(req,res)=>{
  try{
    const data = await Invoice.find();
    res.status(200).json(data);


  }catch(e){
    console.log(e)
    res.status(500).json(e);

  }
})

//Get Particular Invoice
router.get("/api/invoice/:id",async(req,res)=>{
  try{
    const userId = req.params.id;

    const data = await Invoice.findById({ _id: userId });

    res.status(200).json(data);


  }catch(e){
    console.log(e)
    res.status(500).json(e);

  }
})

//Upadate Particular Invoice
router.put("/api/invoice/:id",async(req,res)=>{
  try{
    const userId = req.params.id;

    const data = await Invoice.findByIdAndUpdate({ _id: userId }, req.body, {
      new: true,
    });
    res.status(200).json(data);


  }catch(e){
    console.log(e)
    res.status(500).json(e);

  }
})

//Delete Particular Invoice
router.delete("/api/invoice/:id",async(req,res)=>{
  try{
    const userId = req.params.id;
    const data = await Invoice.findByIdAndDelete({ _id: userId });
    res.status(200).json(data);


  }catch(e){
    console.log(e)
    res.status(500).json(e);

  }
})




















//Invoice Create
router.post("/api/client",async (req, res) => {

    try {
        const user = new Client(req.body);
    
        await user.save();
        res.status(201).json(user);
      } catch (err) {
        console.log("we are here");
      }

});

//Get All Invoice 
router.get("/api/client",async(req,res)=>{
  try{
    const data = await Client.find();
    res.status(200).json(data);


  }catch(e){
    console.log(e)
    res.status(500).json(e);

  }
})

//Get Particular Invoice
router.get("/api/client/:id",async(req,res)=>{
  try{
    const userId = req.params.id;

    const data = await Client.findById({ _id: userId });

    res.status(200).json(data);


  }catch(e){
    console.log(e)
    res.status(500).json(e);

  }
})

//Upadate Particular Invoice
router.put("/api/client/:id",async(req,res)=>{
  try{
    const userId = req.params.id;

    const data = await Client.findByIdAndUpdate({ _id: userId }, req.body, {
      new: true,
    });
    res.status(200).json(data);


  }catch(e){
    console.log(e)
    res.status(500).json(e);

  }
})

//Delete Particular Invoice
router.delete("/api/client/:id",async(req,res)=>{
  try{
    const userId = req.params.id;
    const data = await Client.findByIdAndDelete({ _id: userId });
    res.status(200).json(data);


  }catch(e){
    console.log(e)
    res.status(500).json(e);

  }
})



module.exports = router;
