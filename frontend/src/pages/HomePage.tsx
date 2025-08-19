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
      <h1>ברוכים הבאים לאתר</h1>

      {isLoggedIn && profileData ? (
        <div>
          <p>שלום {profileData.user.name}!</p>
          <p>אימייל: {profileData.user.email}</p>
          <div style={{ marginTop: "2rem" }}>
            <button onClick={handleLogout} style={{ marginRight: "1rem" }}>
              התנתקות
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p>זהו דף הבית של האפליקציה</p>
          <div style={{ marginTop: "2rem" }}>
            <Link to="/login">
              <button style={{ marginRight: "1rem" }}>התחברות</button>
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
