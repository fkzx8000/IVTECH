import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetQuestionWithAnswersQuery,
  useCreateAnswerMutation,
} from "../store/answersApi";
import {
  createAnswerSchema,
  type CreateAnswerRequest,
} from "../schemas/answerSchema";

export default function QuestionDetailPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const questionIdNumber = parseInt(questionId || "0");

  const {
    data: questionData,
    isLoading,
    error,
  } = useGetQuestionWithAnswersQuery(questionIdNumber, {
    skip: !questionId || isNaN(questionIdNumber),
  });

  const [createAnswer, { isLoading: isCreatingAnswer, error: createError }] =
    useCreateAnswerMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ content: string }>({
    resolver: zodResolver(createAnswerSchema.omit({ question_id: true })),
  });

  const isLoggedIn = !!localStorage.getItem("token");

  // פונקציה לעיצוב תאריך
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // פונקציה לעיצוב תגיות
  const formatTags = (tags: string) => {
    if (!tags || tags.trim() === "") return null;

    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  };

  const onSubmit = async (data: { content: string }) => {
    try {
      const answerData: CreateAnswerRequest = {
        content: data.content,
        question_id: questionIdNumber,
      };
      await createAnswer(answerData).unwrap();
      reset(); // איפוס הטופס לאחר שליחה מוצלחת
    } catch (err) {
      console.error("Create answer failed:", err);
    }
  };

  if (!questionId || isNaN(questionIdNumber)) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>שגיאה</h1>
        <p>מזהה שאלה לא תקין</p>
        <Link to="/questions">חזרה לרשימת השאלות</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>טוען שאלה...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>שגיאה</h1>
        <p style={{ color: "red" }}>שגיאה בטעינת השאלה</p>
        <button onClick={() => navigate("/questions")}>
          חזרה לרשימת השאלות
        </button>
      </div>
    );
  }

  if (!questionData) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>שאלה לא נמצאה</h1>
        <Link to="/questions">חזרה לרשימת השאלות</Link>
      </div>
    );
  }

  const { question, answers } = questionData;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      {/* כותרת העמוד */}
      <div style={{ marginBottom: "2rem" }}>
        <Link to="/questions">← חזרה לרשימת השאלות</Link>
      </div>

      {/* השאלה */}
      <div
        style={{
          border: "2px solid #007bff",
          borderRadius: "8px",
          padding: "2rem",
          backgroundColor: "#f8f9fa",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ margin: "0 0 1rem 0", color: "#333" }}>
          {question.title}
        </h1>

        <div
          style={{
            marginBottom: "1rem",
            lineHeight: "1.6",
            color: "#555",
            whiteSpace: "pre-wrap",
            fontSize: "1.1rem",
          }}
        >
          {question.content}
        </div>

        {/* תגיות */}
        {formatTags(question.tags) && (
          <div style={{ marginBottom: "1rem" }}>
            {formatTags(question.tags)!.map((tag, index) => (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  backgroundColor: "#e9ecef",
                  color: "#495057",
                  padding: "0.25rem 0.5rem",
                  margin: "0.25rem 0.25rem 0.25rem 0",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  border: "1px solid #ced4da",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* מידע על המשתמש והתאריך */}
        <div
          style={{
            borderTop: "1px solid #ddd",
            paddingTop: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.9rem",
            color: "#666",
          }}
        >
          <div>
            נשאל על ידי: <strong>{question.user_name}</strong> (@
            {question.user_nickname})
          </div>
          <div>{formatDate(question.created_at)}</div>
        </div>
      </div>

      {/* כותרת התשובות */}
      <h2 style={{ borderBottom: "2px solid #ddd", paddingBottom: "0.5rem" }}>
        תשובות ({answers.length})
      </h2>

      {/* טופס הוספת תשובה */}
      {isLoggedIn ? (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1.5rem",
            backgroundColor: "#f9f9f9",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ margin: "0 0 1rem 0" }}>הוסף תשובה</h3>

          {createError && (
            <div
              style={{
                color: "red",
                marginBottom: "1rem",
                padding: "0.5rem",
                border: "1px solid red",
                borderRadius: "4px",
                backgroundColor: "#ffe6e6",
              }}
            >
              {"data" in createError
                ? (createError.data as any)?.message || "שגיאה ביצירת התשובה"
                : "שגיאה ביצירת התשובה"}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <textarea
              {...register("content")}
              placeholder="כתוב את התשובה שלך כאן..."
              rows={4}
              style={{
                width: "100%",
                padding: "0.7rem",
                fontSize: "1rem",
                resize: "vertical",
                minHeight: "100px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              disabled={isCreatingAnswer}
            />
            {errors.content && (
              <span style={{ color: "red", fontSize: "0.8rem" }}>
                {errors.content.message}
              </span>
            )}

            <button
              type="submit"
              style={{
                padding: "0.8rem",
                fontSize: "1rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                maxWidth: "200px",
              }}
              disabled={isCreatingAnswer}
            >
              {isCreatingAnswer ? "שולח תשובה..." : "שלח תשובה"}
            </button>
          </form>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "1.5rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            marginBottom: "2rem",
          }}
        >
          <p>עליך להיות מחובר כדי לענות על השאלה</p>
          <Link to="/login">
            <button
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "0.7rem 1.5rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              התחברות
            </button>
          </Link>
        </div>
      )}

      {/* רשימת התשובות */}
      {answers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>עדיין לא נענתה אף תשובה לשאלה זו</p>
          {!isLoggedIn && (
            <p>
              <Link to="/login">התחבר</Link> כדי לענות על השאלה
            </p>
          )}
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {answers.map((answer, index) => (
            <div
              key={answer.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1.5rem",
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa",
              }}
            >
              <div
                style={{
                  marginBottom: "1rem",
                  lineHeight: "1.6",
                  color: "#555",
                  whiteSpace: "pre-wrap",
                }}
              >
                {answer.content}
              </div>

              <div
                style={{
                  borderTop: "1px solid #ddd",
                  paddingTop: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.8rem",
                  color: "#666",
                }}
              >
                <div>
                  נענה על ידי: <strong>{answer.user_name}</strong> (@
                  {answer.user_nickname})
                </div>
                <div>{formatDate(answer.created_at)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
