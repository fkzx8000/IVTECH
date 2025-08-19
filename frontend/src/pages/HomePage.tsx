import { Link } from "react-router-dom";
import { useGetProfileQuery, useLogoutMutation } from "../store/authApi";

export default function HomePage() {
  const { data: profileData, isLoading } = useGetProfileQuery(undefined, {
    skip: !localStorage.getItem("token"), // דילוג על הקריאה אם אין טוקן
  });
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      window.location.reload(); // ריענון הדף לאחר התנתקות
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isLoggedIn = !!localStorage.getItem("token");

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>טוען...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>ברוכים הבאים לאתר השאלות</h1>

      {isLoggedIn && profileData ? (
        <div>
          <p>שלום {profileData.user.name}!</p>
          <p>אימייל: {profileData.user.email}</p>

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <Link to="/questions">
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
                צפה בשאלות
              </button>
            </Link>
            <Link to="/create-question">
              <button
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "0.7rem 1.5rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                שאל שאלה
              </button>
            </Link>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "0.7rem 1.5rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              התנתקות
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p>זהו דף הבית של מערכת השאלות והתשובות</p>

          <div style={{ marginBottom: "2rem" }}>
            <Link to="/questions">
              <button
                style={{
                  backgroundColor: "#17a2b8",
                  color: "white",
                  border: "none",
                  padding: "0.7rem 1.5rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginBottom: "1rem",
                }}
              >
                צפה בשאלות (ללא התחברות)
              </button>
            </Link>
          </div>

          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <Link to="/login">
              <button>התחברות</button>
            </Link>
            <Link to="/register">
              <button>הרשמה</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
