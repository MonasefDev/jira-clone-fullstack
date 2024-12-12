import express from "express";
import {
  createWorkspace,
  getAllWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  resetInviteCodeWorkspace,
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
  .patch(upload.single("image"), updateWorkspace)
  .delete(deleteWorkspace);

router.patch(":workspaceId/reset-invite-code", resetInviteCodeWorkspace);

export default router;
