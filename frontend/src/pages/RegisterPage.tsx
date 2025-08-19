import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema, type RegisterRequest } from "../schemas/userSchema";
import { useRegisterMutation } from "../store/authApi";

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
      navigate("/"); // מעבר לדף הבית לאחר רשמה מוצלחת
    } catch (err) {
      console.error("Registration failed:", err);
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
      <h1>הרשמה</h1>

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
            ? (error.data as any)?.message || "שגיאה בהרשמה"
            : "שגיאה בהרשמה"}
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
            {...registerField("name")}
            placeholder="שם מלא"
            style={{ width: "100%", padding: "0.5rem" }}
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
            {...registerField("email")}
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
            {...registerField("password")}
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
          {isLoading ? "נרשם..." : "הרשמה"}
        </button>
      </form>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <div>
          כבר רשום? <Link to="/login">התחבר כאן</Link>
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <Link to="/">חזרה לדף הבית</Link>
        </div>
      </div>
    </div>
  );
}
