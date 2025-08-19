import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../utils/database.js";
import { signToken } from "../utils/jwt.js";
import { registerSchema, loginSchema } from "../schemas/userSchema.js";

export const register = async (req: Request, res: Response) => {
  try {
    // ולידציה של הנתונים
    const validatedData = registerSchema.parse(req.body);
    const { email, password, name } = validatedData;

    // בדיקה אם המשתמש כבר קיים
    const [existingUser] = await (
      await db
    ).execute("SELECT id FROM users WHERE email = ?", [email]);

    if ((existingUser as any[]).length > 0) {
      return res.status(400).json({ message: "משתמש עם אימייל זה כבר קיים" });
    }

    // הצפנת הסיסמה
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // יצירת המשתמש בבסיס הנתונים
    const [result] = await (
      await db
    ).execute(
      "INSERT INTO users (email, password, name, created_at) VALUES (?, ?, ?, NOW())",
      [email, hashedPassword, name]
    );

    const userId = (result as any).insertId;

    // יצירת JWT
    const token = await signToken({ userId, email });

    res.status(201).json({
      message: "משתמש נוצר בהצלחה",
      token,
      user: {
        id: userId,
        email,
        name,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "נתונים לא תקינים", errors: error });
    }
    res.status(500).json({ message: "שגיאת שרת פנימית" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // ולידציה של הנתונים
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // בדיקה אם המשתמש קיים
    const [users] = await (
      await db
    ).execute("SELECT id, email, password, name FROM users WHERE email = ?", [
      email,
    ]);

    const userArray = users as any[];
    if (userArray.length === 0) {
      return res.status(401).json({ message: "אימייל או סיסמה לא נכונים" });
    }

    const user = userArray[0];

    // בדיקת הסיסמה
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "אימייל או סיסמה לא נכונים" });
    }

    // יצירת JWT
    const token = await signToken({ userId: user.id, email: user.email });

    res.json({
      message: "התחברות בוצעה בהצלחה",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
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

    const [users] = await (
      await db
    ).execute("SELECT id, email, name, created_at FROM users WHERE id = ?", [
      userId,
    ]);

    const userArray = users as any[];
    if (userArray.length === 0) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }

    const user = userArray[0];
    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "שגיאת שרת פנימית" });
  }
};
