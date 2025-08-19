import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { registerSchema, type RegisterRequest } from "../schemas/userSchema";
import { useRegisterMutation } from "../store/authApi";
import Layout from "../components/Layout";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [register, { isLoading, error }] = useRegisterMutation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await register(data).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <Layout showNavigation={false}>
      {error && (
        <div className="error-message" style={{ marginBottom: "1rem" }}>
          {"data" in error
            ? (error.data as any)?.message || "שגיאה בהרשמה"
            : "שגיאה בהרשמה"}
        </div>
      )}

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="title">
          דף הרשמה
          <br />
          <span>בוא לשאול שאלות, לקבל תשובות והכי חשוב להיות חלק מקהילה</span>
        </div>

        <div>
          <input
            {...registerField("name")}
            placeholder="שם מלא"
            className="input"
            disabled={isLoading}
          />
          {errors.name && (
            <span style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.name.message}
            </span>
          )}
        </div>

        <div>
          <input
            {...registerField("nickname")}
            placeholder="כינוי"
            type="text"
            className="input"
            disabled={isLoading}
          />
          {errors.nickname && (
            <span style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.nickname.message}
            </span>
          )}
        </div>

        <div>
          <input
            {...registerField("email")}
            placeholder="אימייל"
            className="input"
            type="email"
            disabled={isLoading}
          />
          {errors.email && (
            <span style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <input
            {...registerField("password")}
            type="password"
            className="input"
            placeholder="סיסמה"
            disabled={isLoading}
          />
          {errors.password && (
            <span style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.password.message}
            </span>
          )}
        </div>

        <button className="button-confirm" type="submit" disabled={isLoading}>
          {isLoading ? "נרשם..." : "הרשמה"}
        </button>

        <div className="form-footer">
          <button
            type="button"
            className="button-register"
            onClick={() => navigate("/login")}
          >
            התחברות
          </button>

          <button
            type="button"
            className="button-secondary"
            onClick={() => navigate("/")}
            aria-label="חזרה לדף הבית"
          >
            חזרה לבית
          </button>
        </div>
      </form>
    </Layout>
  );
}
