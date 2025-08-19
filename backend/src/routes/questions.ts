import { Router } from "express";
import {
  createQuestion,
  getQuestions,
} from "../controllers/questionsController.js";

import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/getQuestions", getQuestions);

// Protected routes - דורש אימות
router.post("/createQuestion", authenticateToken, createQuestion);

export default router;
