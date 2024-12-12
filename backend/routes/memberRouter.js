import express from "express";
import { protectMiddleware } from "../middleware/protectMiddleware.js";
import {
  getAllMembersOfWorkspace,
  deleteMember,
  updateMemberRole,
} from "../controllers/memberController.js";

const router = express.Router();

// Protected all routes below
router.use(protectMiddleware);

router.get("/", getAllMembersOfWorkspace);
// router.route("/:memberId").delete(deleteMember).patch(updateMemberRole);
router.route("/:memberId").patch(updateMemberRole).delete(deleteMember);

export default router;
