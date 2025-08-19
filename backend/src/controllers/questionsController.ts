import { Request, Response } from "express";
import { db } from "../utils/database.js";
import { createQuestionSchema } from "../schemas/questionSchema.js";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export const createQuestion = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // ולידציה של הנתונים
    const validatedData = createQuestionSchema.parse(req.body);
    const { title, content, tags } = validatedData;
    const userId = req.user!.userId;

    // יצירת השאלה במסד הנתונים
    const [result] = await db.execute(
      "INSERT INTO questions (title, content, tags, user_id, created_at) VALUES (?, ?, ?, ?, NOW())",
      [title, content, tags, userId]
    );

    const questionId = (result as any).insertId;

    // החזרת השאלה שנוצרה
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

    const question = (questionData as any[])[0];

    res.status(201).json({
      message: "שאלה נוצרה בהצלחה",
      question,
    });
  } catch (error) {
    console.error("Create question error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "נתונים לא תקינים", errors: error });
    }
    res.status(500).json({ message: "שגיאת שרת פנימית" });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    // קבלת כל השאלות עם פרטי המשתמש
    const [questions] = await db.execute(`
      SELECT 
        q.id, q.title, q.content, q.tags, q.user_id, q.created_at, q.updated_at,
        u.name as user_name, u.nickname as user_nickname
      FROM questions q
      JOIN users u ON q.user_id = u.id
      ORDER BY q.created_at DESC
    `);

    res.json({
      questions: questions as any[],
    });
  } catch (error) {
    console.error("Get questions error:", error);
    res.status(500).json({ message: "שגיאת שרת פנימית" });
  }
};
