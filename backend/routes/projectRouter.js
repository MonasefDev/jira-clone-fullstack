import express from "express";
import { protectMiddleware } from "../middleware/protectMiddleware.js";
import {
  createProject,
  getAllProjectsOfWorkspace,
  updateProject,
  deleteProject,
  getProjectById,
  getProjectAnalytics,
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
  .get(getProjectById)
  .patch(upload.single("image"), updateProject)
  .delete(deleteProject);

router.route("/:projectId/analytics").get(getProjectAnalytics);

export default router;
