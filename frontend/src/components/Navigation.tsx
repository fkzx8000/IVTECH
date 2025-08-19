import { Link, useNavigate } from "react-router-dom";
import { useGetProfileQuery, useLogoutMutation } from "../store/authApi";
import styled from "styled-components";

const Navigation = () => {
  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !localStorage.getItem("token"),
  });
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) return null;

  return (
    <StyledWrapper>
      <nav className="navbar">
        <div className="nav-content">
          <div className="user-info">
            <span className="welcome">
              שלום {profileData?.user.name || "משתמש"}!
            </span>
          </div>

          <div className="nav-buttons">
            <Link to="/">
              <button className="nav-btn">דף הבית</button>
            </Link>

            <Link to="/create-question">
              <button className="nav-btn">שאל שאלה</button>
            </Link>
            <button className="nav-btn logout-btn" onClick={handleLogout}>
              התנתקות
            </button>
          </div>
        </div>
      </nav>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .navbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #9ecad6, #748dae);
    border-top: 3px solid black;
    box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    padding: 15px 20px;
  }

  .nav-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
  }

  .user-info {
    display: flex;
    align-items: center;
  }

  .welcome {
    font-weight: 600;
    color: #1d1616ff;
    font-size: 16px;
  }

  .nav-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .nav-btn {
    background: #5cbdfd;
    font-family: "Heebo", Arial, sans-serif;
    padding: 0.6em 1.3em;
    font-weight: 900;
    font-size: 14px;
    border: 3px solid black;
    border-radius: 0.4em;
    box-shadow: 0.1em 0.1em;
    cursor: pointer;
    color: black;
    text-decoration: none;
    transition: all 0.1s ease;
  }

  .nav-btn:hover {
    transform: translate(-0.05em, -0.05em);
    box-shadow: 0.15em 0.15em;
  }

  .nav-btn:active {
    transform: translate(0.05em, 0.05em);
    box-shadow: 0.05em 0.05em;
  }

  .logout-btn {
    background: #ff6b6b;
  }

  /* רספונסיביות */
  @media (max-width: 768px) {
    .nav-content {
      flex-direction: column;
      gap: 10px;
    }

    .nav-buttons {
      justify-content: center;
    }

    .nav-btn {
      font-size: 12px;
      padding: 0.5em 1em;
    }
  }
`;

export default Navigation;
