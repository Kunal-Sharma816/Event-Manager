import express from "express";
import {
  getAllEvents,
  getPublicEvents,
  getUserEvents,
  getRegisteredEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
  registerForEvent,
  unregisterFromEvent,
} from "../controllers/events/eventController.js";
import { protect, optionalAuth } from "../middleware/auth.js";
import {
  requireAdmin,
  requireOrganizer,
  requireStudent,
} from "../middleware/rbac.js";
import {
  validateEventCreation,
  validateEventUpdate,
} from "../middleware/validation.js";

const router = express.Router();

// Public routes (no auth required)
router.get("/public", getPublicEvents);

// Protected routes
router.use(protect);

// SPECIFIC ROUTES MUST COME FIRST (before any dynamic routes)
router.get("/my-events", requireOrganizer, getUserEvents);
router.get("/registered", requireStudent, getRegisteredEvents);

// Admin routes (specific route)
router.get("/", requireAdmin, getAllEvents);

// Organizer routes
router.post("/", requireOrganizer, validateEventCreation, createEvent);

// Routes with parameters that need specific handling
router.post("/:id/register", requireStudent, registerForEvent);
router.delete("/:id/register", requireStudent, unregisterFromEvent);
router.patch("/:id/approve", requireAdmin, approveEvent);
router.patch("/:id/reject", requireAdmin, rejectEvent);
router.put("/:id", requireOrganizer, validateEventUpdate, updateEvent);
router.delete("/:id", requireOrganizer, deleteEvent);

// DYNAMIC ROUTE MUST COME LAST
router.get("/:id", optionalAuth, getEvent);

export default router;
