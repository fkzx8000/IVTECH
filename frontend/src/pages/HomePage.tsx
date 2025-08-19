import { Link } from "react-router-dom";
import { useGetProfileQuery, useLogoutMutation } from "../store/authApi";
import Layout from "../components/Layout";
import QuestionsPage from "./QuestionsPage";

export default function HomePage() {
  const { data: profileData, isLoading } = useGetProfileQuery(undefined, {
    skip: !localStorage.getItem("token"),
  });
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isLoggedIn = !!localStorage.getItem("token");

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">טוען...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showNavigation={isLoggedIn}>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">ברוכים הבאים לאתר השאלות</h1>
          <p className="page-subtitle">
            המקום שלכם לשאול שאלות, לקבל תשובות ולהיות חלק מקהילה
          </p>
          {isLoggedIn && profileData ? (
            <>שלום {profileData.user.name}!</>
          ) : (
            <></>
          )}
        </div>

        {isLoggedIn && profileData ? (
          <div className="flex-container">
            <QuestionsPage />
          </div>
        ) : (
          <>
            <div className="card">
              <div className="card-title">הצטרפו אלינו!</div>
              <div className="card-content">
                <p>
                  על מנת לשאול שאלות ולענות על שאלות, עליכם להירשם או להתחבר
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  marginTop: "1rem",
                }}
              >
                <Link to="/login" className="styled-button">
                  התחברות
                </Link>
                <Link to="/register" className="styled-button green">
                  הרשמה
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
