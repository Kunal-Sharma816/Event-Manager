import jwt from "jsonwebtoken";

// Get JWT secret with better fallback
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET || "fallback-secret-key-for-development";
  if (secret === "fallback-secret-key-for-development") {
    console.warn("Warning: Using fallback JWT secret. Set JWT_SECRET environment variable for production.");
  }
  return secret;
};

// Generate JWT token
export const generateToken = (payload) => {
  try {
    return jwt.sign(payload, getJWTSecret(), {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    });
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error("Failed to generate token");
  }
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }
    
    return jwt.verify(token, getJWTSecret());
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expired");
    }
    if (error.name === "NotBeforeError") {
      throw new Error("Token not active");
    }
    throw error;
  }
};

// Generate refresh token
export const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, getJWTSecret(), {
      expiresIn: "30d",
    });
  } catch (error) {
    console.error('Error generating refresh token:', error);
    throw new Error("Failed to generate refresh token");
  }
};

// Extract token from request with better error handling
export const extractToken = (req) => {
  let token = null;

  // Check Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Log for debugging 
  if (process.env.NODE_ENV === 'development') {
    console.log('Token extraction:', {
      authHeader: !!authHeader,
      cookie: !!req.cookies?.token,
      extractedToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null
    });
  }

  return token;
};

// Decode token without verification 
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};