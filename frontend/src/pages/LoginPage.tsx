import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginRequest } from "../schemas/userSchema";
import { useLoginMutation } from "../store/authApi";
import Layout from "../components/Layout";

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <Layout showNavigation={false}>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="error-message">
            {"data" in error
              ? (error.data as any)?.message || "שגיאה בהתחברות"
              : "שגיאה בהתחברות"}
          </div>
        )}

        <div className="title">
          דף התחברות
          <br />
          <span>בוא לשאול שאלות, לקבל תשובות והכי חשוב להיות חלק מקהילה</span>
        </div>

        <input
          {...register("email")}
          className="input"
          name="email"
          placeholder="אימייל"
          type="email"
          disabled={isLoading}
        />
        {errors.email && (
          <span style={{ color: "red", fontSize: "0.8rem" }}>
            {errors.email.message}
          </span>
        )}

        <input
          {...register("password")}
          disabled={isLoading}
          className="input"
          name="password"
          placeholder="סיסמה"
          type="password"
        />
        {errors.password && (
          <span style={{ color: "red", fontSize: "0.8rem" }}>
            {errors.password.message}
          </span>
        )}

        <button className="button-confirm" type="submit" disabled={isLoading}>
          {isLoading ? "מתחבר..." : "התחברות"}
        </button>

        <div className="form-footer">
          <button
            type="button"
            className="button-register"
            onClick={() => navigate("/register")}
          >
            הרשמה
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
