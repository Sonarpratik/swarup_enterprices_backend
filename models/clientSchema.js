const mongoose = require("mongoose");


const clientSchema = new mongoose.Schema({
    client_name: { type: String },
    client_email: { type: String },
    client_phone: { type: String },
    client_company: { type: String },
    client_shipping_address: { type: String },
    client_billing_address: { type: String },
    client_shipping_state: { type: String },
    client_billing_state: { type: String },
    client_gst_no: { type: String },
   
  
  });
  

  const Client = mongoose.model("Client", clientSchema);
  module.exports = Client;
  