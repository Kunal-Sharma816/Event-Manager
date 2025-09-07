// Role-Based Access Control middleware

// Check if user has required role
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

// Check if user is admin
export const requireAdmin = (req, res, next) => {
  return requireRole("admin")(req, res, next);
};

// Check if user is organizer or admin
export const requireOrganizer = (req, res, next) => {
  return requireRole("organizer", "admin")(req, res, next);
};

// Check if user is student or higher
export const requireStudent = (req, res, next) => {
  return requireRole("student", "organizer", "admin")(req, res, next);
};

// Check if user can access event (owner or admin)
export const requireEventAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  // Admin can access all events
  if (req.user.role === "admin") {
    return next();
  }

  // Check if user is the event organizer
  if (
    req.event &&
    req.event.organizerId.toString() === req.user._id.toString()
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. You can only access your own events.",
  });
};

// Check if user can modify event (owner or admin)
export const requireEventModification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  // Admin can modify all events
  if (req.user.role === "admin") {
    return next();
  }

  // Check if user is the event organizer
  if (
    req.event &&
    req.event.organizerId.toString() === req.user._id.toString()
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. You can only modify your own events.",
  });
};
