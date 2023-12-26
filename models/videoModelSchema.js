const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const videoModelSchema = new mongoose.Schema({
  video_name: { type: String, required: true },
  video_link: { type: String },
  video_main_category:{type:String},
  video_sub_category:[{type:String}],
  delivery_time: { type: String },
  multi_img: [{ type: String }],

  project_includes: [{ type: String }],
  required_details_for_video: [{ type: String }],
  terms_and_condition: [{ type: String }],
  
  discount: { type: Number ,default:0},
  video_price: { type: Number },
});

//We are generating
// module.exports = mongoose.model("Main", userSchema);

const Video = mongoose.model("VIDEOSCHEMA", videoModelSchema);
module.exports = Video;
