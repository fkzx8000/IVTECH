import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import questionRoutes from "./routes/questions.js";
import answerRoutes from "./routes/answers.js";
import { testConnection } from "./utils/database.js";

const app = express();
const PORT = env.PORT;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173", // לפיתוח מקומי
      "http://localhost:3000", // לפיתוח מקומי
      "https://http://discerning-energy-production.up.railway.app", // החלף עם ה-URL של הFrontend
    ],
    credentials: true,
  })
);
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/", authRoutes);
app.use("/", questionRoutes);
app.use("/", answerRoutes);

// הפעלת השרת עם בדיקת חיבור לבסיס הנתונים
const startServer = async () => {
  try {
    // בדיקת חיבור לבסיס הנתונים
    console.log("🔗 Testing database connection...");
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error("❌ Failed to connect to database. Exiting...");
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
export default app;
