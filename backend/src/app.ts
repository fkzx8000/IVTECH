import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
