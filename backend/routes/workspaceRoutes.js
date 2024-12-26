import express from "express";
import {
  createWorkspace,
  getAllWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  resetInviteCodeWorkspace,
  getWorkspace,
  joinWorkspace,
  getWorkspaceAnalytics,
} from "../controllers/workspaceController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protectMiddleware } from "../middleware/protectMiddleware.js";

const router = express.Router();

// Protected all routes below
router.use(protectMiddleware);

router
  .route("/")
  .get(getAllWorkspaces)
  .post(upload.single("image"), createWorkspace);
router
  .route("/:workspaceId")
  .get(getWorkspace)
  .patch(upload.single("image"), updateWorkspace)
  .delete(deleteWorkspace);

router.post("/:workspaceId/join", joinWorkspace);

router.patch("/:workspaceId/reset-invite-code", resetInviteCodeWorkspace);

router.get("/:workspaceId/analytics", getWorkspaceAnalytics);

export default router;
