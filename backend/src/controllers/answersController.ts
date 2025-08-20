import { Request, Response } from "express";
import { db } from "../utils/database.js";
import { createAnswerSchema } from "../schemas/answerSchema.js";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export const createAnswer = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const validatedData = createAnswerSchema.parse(req.body);
    const { content, question_id } = validatedData;
    const userId = req.user!.userId;

    const [questionCheck] = await db.execute(
      "SELECT id FROM questions WHERE id = ?",
      [question_id]
    );

    if ((questionCheck as any[]).length === 0) {
      return res.status(404).json({ message: "שאלה לא נמצאה" });
    }

    const [result] = await db.execute(
      "INSERT INTO answers (content, question_id, user_id, created_at) VALUES (?, ?, ?, NOW())",
      [content, question_id, userId]
    );

    const answerId = (result as any).insertId;

    const [answerData] = await db.execute(
      `
      SELECT 
        a.id, a.content, a.question_id, a.user_id, a.created_at, a.updated_at,
        u.name as user_name, u.nickname as user_nickname
      FROM answers a
      JOIN users u ON a.user_id = u.id
      WHERE a.id = ?
    `,
      [answerId]
    );

    const answer = (answerData as any[])[0];

    res.status(201).json({
      message: "תשובה נוצרה בהצלחה",
      answer,
    });
  } catch (error) {
    console.error("Create answer error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "נתונים לא תקינים", errors: error });
    }
    res.status(500).json({ message: "שגיאת שרת פנימית" });
  }
};

export const getQuestionAnswers = async (req: Request, res: Response) => {
  try {
    const questionId = parseInt(req.params.questionId);

    if (isNaN(questionId)) {
      return res.status(400).json({ message: "מזהה שאלה לא תקין" });
    }

    const [questionCheck] = await db.execute(
      "SELECT id, title FROM questions WHERE id = ?",
      [questionId]
    );

    if ((questionCheck as any[]).length === 0) {
      return res.status(404).json({ message: "שאלה לא נמצאה" });
    }

    const [answers] = await db.execute(
      `
      SELECT 
        a.id, a.content, a.question_id, a.user_id, a.created_at, a.updated_at,
        u.name as user_name, u.nickname as user_nickname
      FROM answers a
      JOIN users u ON a.user_id = u.id
      WHERE a.question_id = ?
      ORDER BY a.created_at ASC
    `,
      [questionId]
    );

    res.json({
      answers: answers as any[],
      question: (questionCheck as any[])[0],
    });
  } catch (error) {
    console.error("Get question answers error:", error);
    res.status(500).json({ message: "שגיאת שרת פנימית" });
  }
};

export const getQuestionWithAnswers = async (req: Request, res: Response) => {
  try {
    const questionId = parseInt(req.params.questionId);

    if (isNaN(questionId)) {
      return res.status(400).json({ message: "מזהה שאלה לא תקין" });
    }

    const [questionData] = await db.execute(
      `
      SELECT 
        q.id, q.title, q.content, q.tags, q.user_id, q.created_at, q.updated_at,
        u.name as user_name, u.nickname as user_nickname
      FROM questions q
      JOIN users u ON q.user_id = u.id
      WHERE q.id = ?
    `,
      [questionId]
    );

    if ((questionData as any[]).length === 0) {
      return res.status(404).json({ message: "שאלה לא נמצאה" });
    }

    const [answers] = await db.execute(
      `
      SELECT 
        a.id, a.content, a.question_id, a.user_id, a.created_at, a.updated_at,
        u.name as user_name, u.nickname as user_nickname
      FROM answers a
      JOIN users u ON a.user_id = u.id
      WHERE a.question_id = ?
      ORDER BY a.created_at ASC
    `,
      [questionId]
    );

    res.json({
      question: (questionData as any[])[0],
      answers: answers as any[],
    });
  } catch (error) {
    console.error("Get question with answers error:", error);
    res.status(500).json({ message: "שגיאת שרת פנימית" });
  }
};
