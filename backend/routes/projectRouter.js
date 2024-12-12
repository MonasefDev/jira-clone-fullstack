import express from "express";
import { protectMiddleware } from "../middleware/protectMiddleware.js";

const router = express.Router();

// Protected all routes below
router.use(protectMiddleware);

router.post("/", createProject);

export default router;
