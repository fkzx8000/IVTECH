import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import questionRoutes from "./routes/questions.js";
import answerRoutes from "./routes/answers.js";
import { testConnection } from "./utils/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = env.PORT;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://discerning-energy-production.up.railway.app",
      // הסר את הwildcard ופרט דומיינים ספציפיים
      /^https:\/\/.*\.up\.railway\.app$/,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "authorization"],
  })
);
app.use(express.json());

// הגשת קבצים סטטיים של Frontend
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// API routes
app.use("/", authRoutes);
app.use("/", questionRoutes);
app.use("/", answerRoutes);

// Serve Frontend for all other routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const startServer = async () => {
  try {
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error("❌ Failed to connect to database. Exiting...");
      process.exit(1);
    }

    // הוסף את השורות הבאות להתחלת השרת
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
export default app;
