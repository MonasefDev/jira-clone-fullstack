const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinaryConfig");

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "my-project", // Name of the folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed image formats
  },
});

const upload = multer({ storage });

module.exports = upload;
