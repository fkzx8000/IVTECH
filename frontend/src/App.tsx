import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateQuestionPage from "./pages/CreateQuestionPage";
import QuestionsPage from "./pages/QuestionsPage";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create-question" element={<CreateQuestionPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
