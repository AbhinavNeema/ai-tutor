import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";

import { connectDatabases } from "./config/db.js";
import { startScheduler } from "./services/scheduler.js";

import chatRoutes from "./routes/chatRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js"
import examRoutes from "./routes/examRoutes.js";


if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY missing in .env");
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
  res.send("AI Tutor Backend Running");
});

app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/exam", examRoutes);
const PORT = process.env.PORT || 5000;

async function start() {

  await connectDatabases();

  startScheduler();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

}

start();