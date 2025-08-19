import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
  createQuestionSchema,
  type CreateQuestionRequest,
} from "../schemas/questionSchema";
import { useCreateQuestionMutation } from "../store/questionsApi";
import Layout from "../components/Layout";

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
      const questionData = {
        ...data,
        tags: data.tags?.trim() || "",
      };
      await createQuestion(questionData).unwrap();
      navigate("/questions");
    } catch (err) {
      console.error("Create question failed:", err);
    }
  };

  // בדיקה אם המשתמש מחובר
  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) {
    return (
      <Layout showNavigation={false}>
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">שאלה חדשה</h1>
            <p className="page-subtitle">עליך להיות מחובר כדי לשאול שאלה</p>
            <div style={{ marginTop: "1.5rem" }}>
              <Link to="/login" className="styled-button">
                התחברות
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">שאלה חדשה</h1>
          <p className="page-subtitle">שתפו את השאלה שלכם עם הקהילה</p>
        </div>

        {error && (
          <div className="error-message">
            {"data" in error
              ? (error.data as any)?.message || "שגיאה ביצירת השאלה"
              : "שגיאה ביצירת השאלה"}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="content-form">
          <div className="form-group">
            <label className="form-label">כותרת השאלה:</label>
            <input
              {...register("title")}
              placeholder="הכנס כותרת לשאלה..."
              className="input"
              disabled={isLoading}
            />
            {errors.title && (
              <span
                className="error-message"
                style={{ fontSize: "0.8rem", padding: "0.3rem" }}
              >
                {errors.title.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">תוכן השאלה:</label>
            <textarea
              {...register("content")}
              placeholder="הכנס את תוכן השאלה... תוכל להוסיף כל הפרטים הרלוונטיים כאן"
              className="form-textarea"
              rows={6}
              disabled={isLoading}
            />
            {errors.content && (
              <span
                className="error-message"
                style={{ fontSize: "0.8rem", padding: "0.3rem" }}
              >
                {errors.content.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">תגיות (אופציונלי):</label>
            <input
              {...register("tags")}
              placeholder="תגיות מופרדות בפסיקים (למשל: JavaScript, React, TypeScript)"
              className="input"
              disabled={isLoading}
            />
            {errors.tags && (
              <span
                className="error-message"
                style={{ fontSize: "0.8rem", padding: "0.3rem" }}
              >
                {errors.tags.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="styled-button green"
            disabled={isLoading}
            style={{ alignSelf: "center", fontSize: "18px" }}
          >
            {isLoading ? "שולח שאלה..." : "שאל שאלה"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
