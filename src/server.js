import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const requiredEnv = ["DATABASE_URL", "JWT_SECRET"];
for (const key of requiredEnv) {
  if (!process.env[key]?.trim()) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

await connectDB();

const app = express();
const PORT = Number(process.env.PORT) || 8080;
const isProduction = process.env.NODE_ENV?.trim() === "production";

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL?.trim() || false,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: "fail", message: "Too many requests, try again later" },
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", message: "OK" });
});

app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  shutdown("uncaughtException");
});
