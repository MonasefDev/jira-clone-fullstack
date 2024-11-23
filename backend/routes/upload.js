const express = require("express");
const upload = require("../uploadMiddleware");

const router = express.Router();
// Image Upload Endpoint
router.post("/upload", upload.single("image"), (req, res) => {
  const imageUrl = req.file.path; // The URL of the uploaded image from Cloudinary
  console.log(imageUrl);
  res.json({ success: true, imageUrl });
});

module.exports = router;
