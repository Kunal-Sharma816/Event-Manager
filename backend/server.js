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

// Connect to database - FAIL IF NOT AVAILABLE
try {
  await connectDB();
  console.log("MongoDB connection successful");
} catch (error) {
  console.error("MongoDB connection failed:", error.message);
  console.error("MongoDB is required. Please ensure MongoDB is running.");
  process.exit(1);
}

// Create Express app
const app = express();

// Trust proxy for Render
app.set("trust proxy", 1);

// CORS configuration - COMPREHENSIVE FIX
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://event-manager-gules-omega.vercel.app",
  "https://event-manager-git-main-kunal-sharma816s-projects.vercel.app",
  "https://event-manager-qo30vjmai-kunal-sharma816s-projects.vercel.app",
  // Add pattern for any Vercel preview deployments
  /^https:\/\/event-manager-.*\.vercel\.app$/,
];

// Enhanced CORS options for production
const corsOptions = {
  origin: function (origin, callback) {
    console.log("🌐 Request Origin:", origin);

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) {
      console.log("✅ No origin - allowing request");
      return callback(null, true);
    }

    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (typeof allowedOrigin === "string") {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      console.log("✅ Origin allowed:", origin);
      callback(null, true);
    } else {
      console.log("❌ Origin blocked:", origin);
      console.log("📋 Allowed origins:", allowedOrigins);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-csrf-token",
    "x-requested-with",
    "Accept",
    "Accept-Version",
    "Content-Length",
    "Content-MD5",
    "Date",
    "X-Api-Version",
  ],
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", (req, res) => {
  console.log("🚀 Preflight request from:", req.headers.origin);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,x-csrf-token,x-requested-with,Accept,Accept-Version,Content-Length,Content-MD5,Date,X-Api-Version"
  );
  res.sendStatus(200);
});

// Security middleware (configure after CORS)
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

// Rate limiting - be more lenient for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased limit for production
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
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

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: "mongodb",
    cors: "enabled",
    origin: req.headers.origin,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Campus Event Management API is running 🚀",
    cors: "configured",
    environment: process.env.NODE_ENV || "development",
  });
});

// Favicon handler
app.get("/favicon.ico", (req, res) => res.status(204).end());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 CORS enabled for origins:`, allowedOrigins);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

export default app;
