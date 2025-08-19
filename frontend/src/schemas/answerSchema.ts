import { z } from "zod";

export const createAnswerSchema = z.object({
  content: z.string().min(10, "תוכן התשובה חייב להכיל לפחות 10 תווים"),
  question_id: z.number().int().positive("מזהה השאלה חייב להיות מספר חיובי"),
});

export type CreateAnswerRequest = z.infer<typeof createAnswerSchema>;

export interface Answer {
  id: number;
  content: string;
  question_id: number;
  user_id: number;
  user_name: string;
  user_nickname: string;
  created_at: string;
  updated_at: string;
}
