const express = require("express");
const router = express.Router();

const User = require("../models/userSchema");
const {
  Authenticate,
  IsAdmin,
  IsAdminAndUser,
  IsAdmin_Product_Create,
  IsAdmin_Product_Update,
  IsAdmin_Product_Delete,
} = require("../middleware/authenticate.js");

const Contact = require("../models/contactSchema.js");

router.post("/contacts", async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const newContact = new Contact({ name, email, phone, message });
        const savedContact = await newContact.save();
        res.status(201).json(savedContact);
    } catch (error) {
        res.status(500).json({ error: "Error creating contact" });
    }
});


router.get("/contacts", async (req, res) => {
    try {
        const data = await Contact.find();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(401).json(err);
    }
});

router.get("/contacts/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const data = await Contact.findById(userId);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(401).json(err);
    }
});

router.put("/contacts/:id", async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, message },
            { new: true }
        );
        if (!updatedContact) return res.status(404).json({ error: "Contact not found" });
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(500).json({ error: "Error updating contact" });
    }
});

router.delete("/contacts/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const data = await Contact.findById(userId);
        const deletedContact = await Contact.findByIdAndDelete(userId);
        if (!deletedContact) return res.status(404).json({ error: "Contact not found" });
        res.status(200).json(deletedContact);
    } catch (error) {
        res.status(500).json({ error: "Error deleting contact" });
    }
});

module.exports = router;