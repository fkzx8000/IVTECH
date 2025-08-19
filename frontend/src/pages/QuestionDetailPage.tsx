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
import Layout from "../components/Layout";

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
      reset();
    } catch (err) {
      console.error("Create answer failed:", err);
    }
  };

  if (!questionId || isNaN(questionIdNumber)) {
    return (
      <Layout>
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">שגיאה</h1>
            <p className="page-subtitle">מזהה שאלה לא תקין</p>
            <div style={{ marginTop: "1.5rem" }}>
              <Link to="/questions" className="styled-button">
                חזרה לרשימת השאלות
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">טוען שאלה...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">שגיאה בטעינת השאלה</h1>
            <div style={{ marginTop: "1.5rem" }}>
              <button
                onClick={() => navigate("/questions")}
                className="styled-button"
              >
                חזרה לרשימת השאלות
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!questionData) {
    return (
      <Layout>
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">שאלה לא נמצאה</h1>
            <div style={{ marginTop: "1.5rem" }}>
              <Link to="/questions" className="styled-button">
                חזרה לרשימת השאלות
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const { question, answers } = questionData;

  return (
    <Layout>
      <div className="page-container">
        {/* השאלה */}
        <div className="card" style={{ border: "3px solid #007bff" }}>
          <h1
            className="card-title"
            style={{ fontSize: "24px", marginBottom: "1.5rem" }}
          >
            {question.title}
          </h1>

          <div
            className="card-content"
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "16px",
              lineHeight: "1.8",
            }}
          >
            {question.content}
          </div>

          {/* תגיות */}
          {formatTags(question.tags) && (
            <div style={{ margin: "1rem 0" }}>
              {formatTags(question.tags)!.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* מידע על המשתמש והתאריך */}
          <div className="card-footer">
            <div>
              נשאל על ידי: <strong>{question.user_name}</strong> (@
              {question.user_nickname})
            </div>
            <div>{formatDate(question.created_at)}</div>
          </div>
        </div>

        {/* כותרת התשובות */}
        <div className="page-header" style={{ marginTop: "2rem" }}>
          <h2 className="page-title">תשובות ({answers.length})</h2>
        </div>

        {/* טופס הוספת תשובה */}
        {isLoggedIn ? (
          <div className="content-form">
            <h3 style={{ margin: "0 0 0 0", color: "var(--font-color)" }}>
              הוסף תשובה
            </h3>

            {createError && (
              <div className="error-message">
                {"data" in createError
                  ? (createError.data as any)?.message || "שגיאה ביצירת התשובה"
                  : "שגיאה ביצירת התשובה"}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <textarea
                  {...register("content")}
                  placeholder="כתוב את התשובה שלך כאן..."
                  rows={4}
                  className="form-textarea"
                  disabled={isCreatingAnswer}
                />
                {errors.content && (
                  <span
                    className="error-message"
                    style={{ fontSize: "0.8rem", padding: "0.3rem" }}
                  >
                    {errors.content.message}
                  </span>
                )}

                <button
                  type="submit"
                  className="styled-button green"
                  disabled={isCreatingAnswer}
                  style={{ alignSelf: "flex-start" }}
                >
                  {isCreatingAnswer ? "שולח תשובה..." : "שלח תשובה"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="card">
            <div className="card-content" style={{ textAlign: "center" }}>
              <p>עליך להיות מחובר כדי לענות על השאלה</p>
            </div>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Link to="/login" className="styled-button">
                התחברות
              </Link>
            </div>
          </div>
        )}

        {/* רשימת התשובות */}
        {answers.length === 0 ? (
          <div className="card">
            <div className="card-content" style={{ textAlign: "center" }}>
              <p>
                <strong>עדיין לא נענתה אף תשובה לשאלה זו</strong>
              </p>
              {!isLoggedIn && (
                <p>
                  <Link to="/login" style={{ color: "#007bff" }}>
                    התחבר
                  </Link>{" "}
                  כדי לענות על השאלה
                </p>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              width: "100%",
            }}
          >
            {answers.map((answer) => (
              <div key={answer.id} className="card">
                <div
                  className="card-content"
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.6",
                  }}
                >
                  {answer.content}
                </div>

                <div className="card-footer">
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
    </Layout>
  );
}
