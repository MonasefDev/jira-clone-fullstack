import express from "express";
import {
  signup,
  login,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/sign-up", signup);
router.post("/sign-in", login);
router.post("/sign-out", logout);
router.get("/current-user", getCurrentUser);

export default router;
