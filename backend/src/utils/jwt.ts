import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(payload: any): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "1h",
    algorithm: "HS256",
  });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}
