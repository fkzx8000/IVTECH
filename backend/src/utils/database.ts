import mysql from "mysql2/promise";
import { env } from "../config/env.js";

console.log("🔧 Database config:", {
  host: env.DB_HOST,
  user: env.DB_USER,
  database: env.DB_NAME,
  // לא מדפיסים את הסיסמה
});

// יצירת connection pool (לא connection יחיד)
export const db = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// פונקציה לבדיקת חיבור
export const testConnection = async () => {
  try {
    console.log("🧪 Attempting database connection...");
    const connection = await db.getConnection();
    console.log("🔗 Got connection from pool");
    await connection.execute("SELECT 1");
    console.log("✅ Database query successful");
    connection.release();
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
};
