const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");


const s3 = new aws.S3();
// Configure multer and multer-s3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: myBucket,
    acl: "public-read",
    metadata: function (req, file, cb) {
      console.log(file);
      cb(null, { fieldName: file.originalname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
router.post("/multiple", upload.array("image", 10), (req, res, next) => {
  const fileUrl = req.files; // Access the uploaded file URL
  console.log("here", req);
  res.send(fileUrl); // Send back the file URL
});
// Define your routes
router.post("/upload", upload.single("image"), (req, res, next) => {
  const fileUrl = req.file; // Access the uploaded file URL

  res.send(fileUrl); // Send back the file URL
});

router.delete("/delete", (req, res) => {
  const params = {
    Bucket: myBucket,
    Key: "WhatsApp Image 2023-10-07 at 10.16.47 AM.jpeg",
  };
  s3.deleteObject(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send("Deleted SuccessFull");
    }
  });
});
module.exports = router;
