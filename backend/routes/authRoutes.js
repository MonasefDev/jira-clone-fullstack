import express from "express";
import { signup, login } from "../controllers/authController.js";
// import {
//   register,
//   login,
//   getProtectedData,
// } from "../controllers/authControllerv2.js";
// import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/sign-up", signup);
router.post("/sign-in", login);

// Protected routes
// router.get("/protected", authenticateToken, getProtectedData);

export default router;
