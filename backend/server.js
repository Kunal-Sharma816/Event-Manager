import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Import database connection
import connectDB from "./config/database.js";

// Import routes
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";

// Import middleware
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

console.log("🚀 Starting Campus Event Management API...");
console.log("📍 Environment:", process.env.NODE_ENV || "development");

// Connect to database
try {
  await connectDB();
  console.log("✅ MongoDB connection successful");
} catch (error) {
  console.error("❌ MongoDB connection failed:", error.message);
  console.error("MongoDB is required. Please ensure MongoDB is running.");
  process.exit(1);
}

// Create Express app
const app = express();

// Trust proxy for Render
app.set("trust proxy", 1);

// CORS configuration - MANUAL SETUP FOR MAXIMUM CONTROL
app.use((req, res, next) => {
  const origin = req.headers.origin;

  console.log(`🌍 Request from origin: ${origin}`);
  console.log(`📍 Request method: ${req.method}`);
  console.log(`📍 Request path: ${req.path}`);

  // List of allowed origins
  const allowedOrigins = [
    "https://event-manager-gules-omega.vercel.app",
    "https://event-manager-git-main-kunal-sharma816s-projects.vercel.app",
    "https://event-manager-qo30vjmai-kunal-sharma816s-projects.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174",
  ];

  // Set CORS headers for allowed origins
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    console.log(`✅ Allowed origin: ${origin}`);
  } else if (!origin) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    res.header("Access-Control-Allow-Origin", "*");
    console.log(`✅ No origin header - allowing`);
  } else {
    // For debugging - temporarily allow unknown origins in production
    if (process.env.NODE_ENV === "production") {
      res.header("Access-Control-Allow-Origin", origin);
      console.log(`⚠️  PRODUCTION DEBUG: Allowing unknown origin: ${origin}`);
    } else {
      console.log(`❌ Blocked origin: ${origin}`);
      console.log(`📋 Allowed origins: ${allowedOrigins.join(", ")}`);
    }
  }

  // Set other CORS headers
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-csrf-token"
  );
  res.header("Access-Control-Expose-Headers", "Set-Cookie");
  res.header("Access-Control-Max-Age", "86400"); // 24 hours

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    console.log(`🚀 Preflight OPTIONS request handled for: ${req.path}`);
    return res.status(200).end();
  }

  next();
});

// Security middleware (configure after CORS)
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 300, // Increased for production
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return (
      req.path === "/api/health" || req.path === "/health" || req.path === "/"
    );
  },
});

app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parser
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Request logging for debugging
app.use((req, res, next) => {
  if (req.path !== "/favicon.ico") {
    console.log(
      `📨 ${req.method} ${req.path} - Origin: ${req.headers.origin || "none"}`
    );
  }
  next();
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Campus Event Management API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    cors: "enabled",
  });
});

// Health check endpoints
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: "connected",
    cors: "enabled",
    origin: req.headers.origin || "none",
  });
});

// CORS debug endpoint
app.get("/api/cors-test", (req, res) => {
  res.json({
    success: true,
    message: "CORS test successful! 🎉",
    origin: req.headers.origin,
    method: req.method,
    headers: {
      origin: req.headers.origin,
      userAgent: req.headers["user-agent"],
      referer: req.headers.referer,
    },
    timestamp: new Date().toISOString(),
  });
});

// Favicon handler
app.get("/favicon.ico", (req, res) => res.status(204).end());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// Catch-all for undefined API routes
app.get("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.path} not found`,
    availableRoutes: [
      "/api/health",
      "/api/cors-test",
      "/api/auth",
      "/api/events",
    ],
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for non-API routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      "/",
      "/health",
      "/api/health",
      "/api/cors-test",
      "/api/auth",
      "/api/events",
    ],
    timestamp: new Date().toISOString(),
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error("❌ Global Error Handler:", error);

  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV !== "production";

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
    ...(isDevelopment && {
      stack: error.stack,
      details: error,
    }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0"; // Important for Render

const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on ${HOST}:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🔗 Health check: https://event-manager-kunal.onrender.com/health`
  );
  console.log(
    `🔗 API health: https://event-manager-kunal.onrender.com/api/health`
  );
  console.log(
    `🧪 CORS test: https://event-manager-kunal.onrender.com/api/cors-test`
  );
  console.log(`🌐 CORS configured for production debugging`);
});

// Graceful shutdown handlers
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close((err) => {
    if (err) {
      console.error("❌ Error during server shutdown:", err);
      process.exit(1);
    }
    console.log("✅ Server closed successfully");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  console.log("Shutting down server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

export default app;
