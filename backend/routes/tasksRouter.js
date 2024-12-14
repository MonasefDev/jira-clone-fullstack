import express from "express";
import { protectMiddleware } from "../middleware/protectMiddleware.js";
import {
  getAllTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
  updateBulkTasks,
} from "../controllers/taskController.js";

const router = express.Router();

// Protected all routes below
router.use(protectMiddleware);

router.route("/").post(createTask).get(getAllTasks);

router.route("/:taskId").patch(updateTask).delete(deleteTask).get(getTask);

router.patch("/bulk-update", updateBulkTasks);

export default router;
