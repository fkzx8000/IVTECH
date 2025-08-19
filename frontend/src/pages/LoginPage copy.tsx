import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginRequest } from "../schemas/userSchema";
import { useLoginMutation } from "../store/authApi";

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
      navigate("/"); // מעבר לדף הבית לאחר התחברות מוצלחת
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <h1>התחברות</h1>

      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "1rem",
            padding: "0.5rem",
            border: "1px solid red",
            borderRadius: "4px",
            backgroundColor: "#ffe6e6",
          }}
        >
          {"data" in error
            ? (error.data as any)?.message || "שגיאה בהתחברות"
            : "שגיאה בהתחברות"}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
        }}
      >
        <div>
          <input
            {...register("email")}
            placeholder="אימייל"
            style={{ width: "100%", padding: "0.5rem" }}
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
            {...register("password")}
            type="password"
            placeholder="סיסמה"
            style={{ width: "100%", padding: "0.5rem" }}
            disabled={isLoading}
          />
          {errors.password && (
            <span style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          style={{ padding: "0.7rem" }}
          disabled={isLoading}
        >
          {isLoading ? "מתחבר..." : "התחברות"}
        </button>
      </form>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <div>
          אין לך חשבון? <Link to="/register">הירשם כאן</Link>
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <Link to="/">חזרה לדף הבית</Link>
        </div>
      </div>
    </div>
  );
}
