import { api } from "./store";
import type { CreateQuestionRequest } from "../schemas/questionSchema";

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

export interface CreateQuestionResponse {
  message: string;
  question: Question;
}

export interface GetQuestionsResponse {
  questions: Question[];
}

export const questionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createQuestion: builder.mutation<
      CreateQuestionResponse,
      CreateQuestionRequest
    >({
      query: (questionData) => ({
        url: "/createQuestion",
        method: "POST",
        body: questionData,
      }),
      invalidatesTags: ["Questions"],
    }),
    getQuestions: builder.query<GetQuestionsResponse, void>({
      query: () => "/getQuestions",
      providesTags: ["Questions"],
    }),
  }),
});

export const { useCreateQuestionMutation, useGetQuestionsQuery } = questionsApi;
