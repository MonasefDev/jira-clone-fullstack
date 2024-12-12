import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryConfig.js";
import AppError from "../utils/appError.js";

// Define Cloudinary storage
const multerStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "jira-clone-images", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed file formats
    public_id: () => `workspace-${Date.now()}`, // Customize file name
  },
});

// File filter to allow only images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export default upload;
