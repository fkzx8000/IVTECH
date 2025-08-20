import { Router } from "express";
import {
  createQuestion,
  getQuestions,
} from "../controllers/questionsController.js";

import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/getQuestions", getQuestions);

router.post("/createQuestion", authenticateToken, createQuestion);

export default router;
