import { Router } from "express";
import {
  createAnswer,
  getQuestionAnswers,
  getQuestionWithAnswers,
} from "../controllers/answersController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/question/:questionId/answers", getQuestionAnswers);
router.get("/question/:questionId", getQuestionWithAnswers);

router.post("/answer", authenticateToken, createAnswer);

export default router;
