import { api } from "./store";
import type { LoginRequest, RegisterRequest } from "../schemas/userSchema";

export interface User {
  id: number;
  email: string;
  name: string;
  nickname: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          // הניווט יטופל ברכיב עצמו
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          // הניווט יטופל ברכיב עצמו
        } catch (error) {
          console.error("Registration failed:", error);
        }
      },
    }),
    getProfile: builder.query<{ user: User }, void>({
      query: () => "/userInfo",
      providesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      queryFn: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return { data: undefined };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useLogoutMutation,
} = authApi;
