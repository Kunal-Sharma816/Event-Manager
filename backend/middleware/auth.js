import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { extractToken, verifyToken } from "../utils/jwt.js";

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  try {
    // Get token from request
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token using the utility function
    const decoded = verifyToken(token);

    // Get user from MongoDB
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is valid but user no longer exists.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated.",
      });
    }

    // Add user to request object with consistent format
    req.user = {
      id: user._id.toString(),
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.message === "Invalid token" || error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during authentication.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);

      if (user && user.isActive) {
        req.user = {
          id: user._id.toString(),
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    console.log('Optional auth failed, continuing without auth:', error.message);
    next();
  }
};