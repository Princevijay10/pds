import dns from "node:dns";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import pushRoutes from "./routes/pushRoutes.js";
import siteSettingsRoutes from "./routes/siteSettingsRoutes.js";
import { ensurePortfolioProjects } from "./seedPortfolio.js";

dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET"];
const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variable(s): ${missingEnvVars.join(", ")}`
  );
  console.error(
    "Set them in Render Environment Variables (see server/.env.example)."
  );
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "Prince Digital Studio API",
    time: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Prince Digital Studio API is running",
    time: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/site-settings", siteSettingsRoutes);

app.use("/api", notFound);

if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Prince Digital Studio API listening on 0.0.0.0:${PORT} [${process.env.NODE_ENV || "development"}]`
  );
});

connectDB()
  .then(() => ensurePortfolioProjects())
  .catch((err) => {
    console.error("Initial MongoDB connection/portfolio seed failed:", err.message);
  });
