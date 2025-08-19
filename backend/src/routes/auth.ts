import { Router } from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
// router.get("/profile", authenticateToken, getProfile);
router.get("/userInfo", authenticateToken, getProfile);

export default router;
