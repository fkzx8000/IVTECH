import { z } from "zod";

export const createQuestionSchema = z.object({
  title: z
    .string()
    .min(5, "כותרת חייבת להכיל לפחות 5 תווים")
    .max(255, "כותרת ארוכה מדי"),
  content: z.string().min(10, "תוכן השאלה חייב להכיל לפחות 10 תווים"),
  tags: z.string().default(""),
});

export type CreateQuestionRequest = z.infer<typeof createQuestionSchema>;

export interface Question {
  id: number;
  title: string;
  content: string;
  tags: string;
  user_id: number;
  user_name: string;
  user_nickname: string;
  created_at: string;
  updated_at: string;
}
