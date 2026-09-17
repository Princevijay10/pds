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

dotenv.config();
// Use reliable public DNS for MongoDB Atlas SRV resolution
dns.setServers(["8.8.8.8", "1.1.1.1"]);
// Fail fast on missing critical config, instead of discovering it later when
// a user tries to log in (missing JWT_SECRET) or the DB connection hangs
// (missing MONGO_URI).
const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET"];
const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variable(s): ${missingEnvVars.join(", ")}`);
  console.error("Check server/.env (see server/.env.example for the full list).");
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust the first proxy in front of this app (Nginx, Render, Railway,
// Cloudflare, a load balancer, etc). Without this, req.ip resolves to the
// proxy's address for every request, which silently breaks per-visitor
// rate limiting below. Adjust the number if you have more than one proxy hop.
app.set("trust proxy", 1);

// Security & performance middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); // strips any $-prefixed or dot-containing keys from body/query/params
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Global API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// Static file serving for uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Prince Digital Studio API is running", time: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Any /api/* request that didn't match a route above is a real 404 — this
// must be registered before the SPA catch-all below, and applies in every
// environment (previously this only ran outside production, so a typo'd API
// route in production silently returned the React app's index.html instead
// of a 404).
app.use("/api", notFound);

// Serve React build in production
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Prince Digital Studio API running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
  });
});
