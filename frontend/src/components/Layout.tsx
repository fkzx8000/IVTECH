import React from "react";
import Navigation from "./Navigation";
import styled from "styled-components";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  return (
    <StyledWrapper>
      <main className="main-content">{children}</main>
      {showNavigation && <Navigation />}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .main-content {
    flex: 1;

    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    padding-top: 2rem;
  }

  /* וידוא שהתוכן לא יוסתר מתחת ל-navbar */
  .main-content {
    padding-bottom: 80px;
  }
`;

export default Layout;
