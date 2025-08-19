import { Link } from "react-router-dom";
import { useGetQuestionsQuery } from "../store/questionsApi";
import Layout from "../components/Layout";

export default function QuestionsPage() {
  const { data: questionsData, isLoading, error } = useGetQuestionsQuery();

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">טוען שאלות...</h1>
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
            <h1 className="page-title">שגיאה בטעינת השאלות</h1>
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => window.location.reload()}
                className="styled-button"
              >
                נסה שוב
              </button>
            </div>
          </div>
        </div>
      </Layout>
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

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.color = "#0056b3";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.color = "#007bff";
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">כל השאלות ({questions.length})</h1>
          <p className="page-subtitle">גלו מה הקהילה שואלת ובואו לעזור!</p>

          <div style={{ marginTop: "1.5rem" }}>
            <Link to="/create-question" className="styled-button green">
              שאל שאלה חדשה
            </Link>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="card">
            <div className="card-title">עדיין לא נשאלו שאלות</div>
            <div className="card-content">
              <p>תהיו הראשונים לשאול שאלה!</p>
            </div>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Link to="/create-question" className="styled-button green">
                שאל את השאלה הראשונה!
              </Link>
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
            {questions.map((question) => (
              <div key={question.id} className="card">
                {/* כותרת השאלה עם קישור */}
                <Link
                  to={`/question/${question.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="card-title"
                    style={{
                      color: "#007bff",
                      cursor: "pointer",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {question.title}
                  </div>
                </Link>

                {/* תוכן השאלה */}
                <div className="card-content">
                  {question.content.length > 200
                    ? question.content.substring(0, 200) + "..."
                    : question.content}
                </div>

                {/* תגיות */}
                {formatTags(question.tags) && (
                  <div style={{ marginBottom: "1rem" }}>
                    {formatTags(question.tags)!.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* מידע על המשתמש והתאריך + כפתור לצפייה */}
                <div className="card-footer">
                  <div>
                    נשאל על ידי: <strong>{question.user_name}</strong> (@
                    {question.user_nickname})
                    <br />
                    <small>{formatDate(question.created_at)}</small>
                  </div>
                  <Link to={`/question/${question.id}`}>
                    <button className="styled-button2">צפה בתשובות</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
