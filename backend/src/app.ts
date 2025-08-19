import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
