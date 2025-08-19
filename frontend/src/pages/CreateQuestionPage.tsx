import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
  createQuestionSchema,
  type CreateQuestionRequest,
} from "../schemas/questionSchema";
import { useCreateQuestionMutation } from "../store/questionsApi";

export default function CreateQuestionPage() {
  const navigate = useNavigate();
  const [createQuestion, { isLoading, error }] = useCreateQuestionMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateQuestionRequest>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
  });

  const onSubmit = async (data: CreateQuestionRequest) => {
    try {
      // וודא שתגיות לא ריקות
      const questionData = {
        ...data,
        tags: data.tags?.trim() || "",
      };
      await createQuestion(questionData).unwrap();
      navigate("/questions"); // מעבר לדף השאלות לאחר יצירה מוצלחת
    } catch (err) {
      console.error("Create question failed:", err);
    }
  };

  // בדיקה אם המשתמש מחובר
  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>שאלה חדשה</h1>
        <p>עליך להיות מחובר כדי לשאול שאלה</p>
        <Link to="/login">
          <button>התחברות</button>
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1>שאלה חדשה</h1>

      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "1rem",
            padding: "0.5rem",
            border: "1px solid red",
            borderRadius: "4px",
            backgroundColor: "#ffe6e6",
            width: "100%",
          }}
        >
          {"data" in error
            ? (error.data as any)?.message || "שגיאה ביצירת השאלה"
            : "שגיאה ביצירת השאלה"}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            כותרת השאלה:
          </label>
          <input
            {...register("title")}
            placeholder="הכנס כותרת לשאלה..."
            style={{ width: "100%", padding: "0.7rem", fontSize: "1rem" }}
            disabled={isLoading}
          />
          {errors.title && (
            <span style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.title.message}
            </span>
          )}
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            תוכן השאלה:
          </label>
          <textarea
            {...register("content")}
            placeholder="הכנס את תוכן השאלה..."
            rows={6}
            style={{
              width: "100%",
              padding: "0.7rem",
              fontSize: "1rem",
              resize: "vertical",
              minHeight: "120px",
            }}
            disabled={isLoading}
          />
          {errors.content && (
            <span style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.content.message}
            </span>
          )}
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            תגיות (אופציונלי):
          </label>
          <input
            {...register("tags")}
            placeholder="תגיות מופרדות בפסיקים (למשל: JavaScript, React, TypeScript)"
            style={{ width: "100%", padding: "0.7rem", fontSize: "1rem" }}
            disabled={isLoading}
          />
          {errors.tags && (
            <span style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.tags.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: "0.8rem",
            fontSize: "1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          disabled={isLoading}
        >
          {isLoading ? "שולח שאלה..." : "שלח שאלה"}
        </button>
      </form>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link to="/questions">צפייה בכל השאלות</Link>
        {" | "}
        <Link to="/">חזרה לדף הבית</Link>
      </div>
    </div>
  );
}
