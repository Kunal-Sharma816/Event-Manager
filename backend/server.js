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

app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

// CORS configuration - FIXED
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "http://localhost:5174", // optional second dev port
  "http://localhost:3000", // alternative local dev port
  // Fixed Vercel URLs (removed trailing slashes and added all variants)
  "https://event-manager-gules-omega.vercel.app",
  "https://event-manager-git-main-kunal-sharma816s-projects.vercel.app",
  "https://event-manager-qo30vjmai-kunal-sharma816s-projects.vercel.app",
  // Add any other Vercel deployment URLs you might have
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Add preflight handling for all routes
app.options("*", cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
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
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: "mongodb",
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Campus Event Management API is running 🚀" });
});

app.get("/favicon.ico", (req, res) => res.status(204));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log("Allowed CORS origins:", allowedOrigins);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

export default app;
