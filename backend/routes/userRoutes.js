import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/sign-up", signup);
router.post("/sign-in", login);

export default router;
