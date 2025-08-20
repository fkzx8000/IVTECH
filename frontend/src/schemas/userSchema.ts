import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(6, "הסיסמה חייבת להכיל לפחות 6 תווים"),
  name: z.string().min(2, "השם חייב להכיל לפחות 2 תווים"),
  nickname: z.string().min(3, "הכינוי חייב להכיל לפחות 3 תווים"),
});

export const loginSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(1, "נא להכניס סיסמה"),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
