import { body, validationResult } from "express-validator";

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// User registration validation
export const validateRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["admin", "organizer", "student", "guest"])
    .withMessage("Invalid role specified"),
  handleValidationErrors,
];

// User login validation
export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Event creation validation
export const validateEventCreation = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("date")
    .isISO8601()
    .withMessage("Please provide a valid date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Event date must be in the future");
      }
      return true;
    }),
  body("time")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Please provide a valid time format (HH:MM)"),
  body("location")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Location must be between 3 and 200 characters"),
  body("capacity")
    .isInt({ min: 1, max: 10000 })
    .withMessage("Capacity must be between 1 and 10000"),
  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean value"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("requirements")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Requirements cannot exceed 500 characters"),
  body("contactInfo.email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid contact email"),
  body("contactInfo.phone")
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),
  handleValidationErrors,
];

// Event update validation
export const validateEventUpdate = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Event date must be in the future");
      }
      return true;
    }),
  body("time")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Please provide a valid time format (HH:MM)"),
  body("location")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Location must be between 3 and 200 characters"),
  body("capacity")
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage("Capacity must be between 1 and 10000"),
  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean value"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("requirements")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Requirements cannot exceed 500 characters"),
  body("contactInfo.email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid contact email"),
  body("contactInfo.phone")
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),
  handleValidationErrors,
];
