import { Link } from "react-router-dom";
import { useGetQuestionsQuery } from "../store/questionsApi";

export default function QuestionsPage() {
  const { data: questionsData, isLoading, error } = useGetQuestionsQuery();

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>טוען שאלות...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "red" }}>שגיאה בטעינת השאלות</p>
        <button onClick={() => window.location.reload()}>נסה שוב</button>
      </div>
    );
  }

  const questions = questionsData?.questions || [];

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

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1>כל השאלות ({questions.length})</h1>
        <Link to="/create-question">
          <button
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "0.7rem 1.5rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            שאל שאלה חדשה
          </button>
        </Link>
      </div>

      {questions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <p>עדיין לא נשאלו שאלות</p>
          <Link to="/create-question">
            <button>שאל את השאלה הראשונה!</button>
          </Link>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {questions.map((question) => (
            <div
              key={question.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1.5rem",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {/* כותרת השאלה עם קישור */}
              <Link
                to={`/question/${question.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <h2
                  style={{
                    margin: "0 0 1rem 0",
                    color: "#007bff",
                    fontSize: "1.4rem",
                    cursor: "pointer",
                  }}
                >
                  {question.title}
                </h2>
              </Link>

              {/* תוכן השאלה */}
              <div
                style={{
                  marginBottom: "1rem",
                  lineHeight: "1.6",
                  color: "#555",
                  whiteSpace: "pre-wrap", // שומר על שבירות שורה
                }}
              >
                {question.content.length > 200
                  ? question.content.substring(0, 200) + "..."
                  : question.content}
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

              {/* מידע על המשתמש והתאריך + כפתור לצפייה */}
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <span>{formatDate(question.created_at)}</span>
                  <Link to={`/question/${question.id}`}>
                    <button
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                      }}
                    >
                      צפה בשאלה ובתשובות
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link to="/">חזרה לדף הבית</Link>
      </div>
    </div>
  );
}
