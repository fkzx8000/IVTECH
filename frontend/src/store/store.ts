import { configureStore } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.PROD
      ? "/" // בproduction ה-frontend והbackend באותו דומיין
      : "http://localhost:3001/", // בdevelopment עדיין צריך לפנות לbackend port
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Questions", "Answers"],
  endpoints: () => ({}),
});

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
