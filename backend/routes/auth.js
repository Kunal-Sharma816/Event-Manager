import express from "express";
import {
  register,
  login,
  getProfile,
  logout,
  updateProfile,
  changePassword,
  debugToken,
} from "../controllers/auth/authController.js";
import { protect } from "../middleware/auth.js";
import {
  validateRegistration,
  validateLogin,
} from "../middleware/validation.js";

const router = express.Router();

// Debug route (development only)
if (process.env.NODE_ENV === 'development') {
  router.get("/debug-token", debugToken);
}

// Public routes
router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);

// Protected routes
router.use(protect); 

router.get("/profile", getProfile);
router.post("/logout", logout);
router.put("/profile", updateProfile);
router.put("/change-password", changePassword);

export default router;