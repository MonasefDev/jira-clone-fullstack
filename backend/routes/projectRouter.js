import express from "express";
import { protectMiddleware } from "../middleware/protectMiddleware.js";
import {
  createProject,
  getAllProjectsOfWorkspace,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Protected all routes below
router.use(protectMiddleware);

router
  .route("/")
  .get(getAllProjectsOfWorkspace)
  .post(upload.single("image"), createProject);

router
  .route("/:projectId")
  .patch(upload.single("image"), updateProject)
  .delete(deleteProject);

export default router;
