import { Request, Response } from "express";
import crypto from "crypto";
import { db } from "../utils/database.js";
import { signToken } from "../utils/jwt.js";
import { registerSchema, loginSchema } from "../schemas/userSchema.js";

const hashPassword = (password: string): string => {
  return crypto.createHash("sha512").update(password).digest("hex");
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const hash = crypto.createHash("sha512").update(password).digest("hex");
  return hash === hashedPassword;
};

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, password, name, nickname } = validatedData;

    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if ((existingUser as any[]).length > 0) {
      return res.status(400).json({ message: "משתמש עם אימייל זה כבר קיים" });
    }
    const [existingUserNickname] = await db.execute(
      "SELECT id FROM users WHERE nickname = ?",
      [nickname]
    );

    if ((existingUserNickname as any[]).length > 0) {
      return res
        .status(400)
        .json({ message: "משתמש עם כינוי כזה זה כבר קיים" });
    }

    const hashedPassword = hashPassword(password);

    const [result] = await db.execute(
      "INSERT INTO users (email, password, name, nickname, created_at) VALUES (?, ?, ?, ?, NOW())",
      [email, hashedPassword, name, nickname]
    );

    const userId = (result as any).insertId;
    const token = signToken({ userId, email });
    res.status(201).json({
      message: "משתמש נוצר בהצלחה",
      token,
      user: {
        id: userId,
        email,
        name,
        nickname,
      },
    });
  } catch (error: unknown) {
    console.error(" Register error:", error);

    const errorDetails =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : {
            name: "Unknown",
            message: String(error),
            stack: undefined,
          };

    console.error("Error details:", errorDetails);

    if (error instanceof Error && error.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "נתונים לא תקינים", errors: error });
    }

    res.status(500).json({
      message: "שגיאת שרת פנימית",
      error:
        process.env.NODE_ENV === "development"
          ? errorDetails.message
          : undefined,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;
    const [users] = await db.execute(
      "SELECT id, email, password, name, nickname FROM users WHERE email = ?",
      [email]
    );

    const userArray = users as any[];
    if (userArray.length === 0) {
      return res.status(401).json({ message: "אימייל או סיסמה לא נכונים" });
    }

    const user = userArray[0];

    const isValidPassword = verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "אימייל או סיסמה לא נכונים" });
    }

    const token = signToken({ userId: user.id, email: user.email });
    res.json({
      message: "התחברות בוצעה בהצלחה",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
      },
    });
  } catch (error: unknown) {
    console.error(" Login error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "נתונים לא תקינים", errors: error });
    }
    res.status(500).json({ message: "שגיאת שרת פנימית" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const [users] = await db.execute(
      "SELECT id, email, name, nickname, created_at FROM users WHERE id = ?",
      [userId]
    );

    const userArray = users as any[];
    if (userArray.length === 0) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }

    const user = userArray[0];
    res.json({ user });
  } catch (error: unknown) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "שגיאת שרת פנימית" });
  }
};
