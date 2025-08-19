import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (!token) {
      return res.status(401).json({ message: "אין טוקן אימות" });
    }

    const payload = await verifyToken(token);
    req.user = {
      userId: payload.userId as number,
      email: payload.email as string,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ message: "טוקן לא תקין" });
  }
};
