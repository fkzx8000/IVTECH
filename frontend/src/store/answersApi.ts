import { api } from "./store";
import type { CreateAnswerRequest } from "../schemas/answerSchema";

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

export interface CreateAnswerResponse {
  message: string;
  answer: Answer;
}

export interface GetQuestionAnswersResponse {
  answers: Answer[];
  question: {
    id: number;
    title: string;
  };
}

export interface GetQuestionWithAnswersResponse {
  question: Question;
  answers: Answer[];
}

export const answersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createAnswer: builder.mutation<CreateAnswerResponse, CreateAnswerRequest>({
      query: (answerData) => ({
        url: "/answer",
        method: "POST",
        body: answerData,
      }),
      invalidatesTags: ["Answers", "Questions"],
    }),
    getQuestionAnswers: builder.query<GetQuestionAnswersResponse, number>({
      query: (questionId) => `/question/${questionId}/answers`,
      providesTags: ["Answers"],
    }),
    getQuestionWithAnswers: builder.query<
      GetQuestionWithAnswersResponse,
      number
    >({
      query: (questionId) => `/question/${questionId}`,
      providesTags: ["Answers", "Questions"],
    }),
  }),
});

export const {
  useCreateAnswerMutation,
  useGetQuestionAnswersQuery,
  useGetQuestionWithAnswersQuery,
} = answersApi;
