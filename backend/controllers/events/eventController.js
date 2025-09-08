import Event from "../../models/Event.js";
import Registration from "../../models/Registration.js";
import User from "../../models/User.js";
import mongoose from "mongoose";

// --------------- Get all events (admin only)---------------------
export const getAllEvents = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, sort = "-createdAt" } = req.query;

    // Build filter object
    const filter = {};
    if (status) {
      filter.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get events with pagination
    const events = await Event.find(filter)
      .populate("organizerId", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      events,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------- Get public events --------------------------
export const getPublicEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

    // Build filter for public approved events
    const filter = {
      isPublic: true,
      status: "approved",
    };

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get events with pagination
    const events = await Event.find(filter)
      .populate("organizerId", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      events,
    });
  } catch (error) {
    next(error);
  }
};

// Get user's own events (organizer)
export const getUserEvents = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, sort = "-createdAt" } = req.query;

    // Build filter object
    const filter = { organizerId: req.user.id };
    if (status) {
      filter.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get events with pagination
    const events = await Event.find(filter)
      .populate("organizerId", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      events,
    });
  } catch (error) {
    next(error);
  }
};

// Get user's registered events (student)
export const getRegisteredEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "-registeredAt" } = req.query;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get registrations with events
    const registrations = await Registration.find({
      userId: req.user.id,
      status: "registered",
    })
      .populate({
        path: "eventId",
        populate: {
          path: "organizerId",
          select: "name email",
        },
      })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Extract events from registrations
    const events = registrations.map((reg) => reg.eventId).filter(Boolean);

    // Get total count
    const total = await Registration.countDocuments({
      userId: req.user.id,
      status: "registered",
    });

    res.json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      events,
    });
  } catch (error) {
    next(error);
  }
};

//----------------------Get single event
export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizerId",
      "name email"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user can view this event
    if (!event.isPublic && event.status !== "approved") {
      if (
        !req.user ||
        (req.user.role !== "admin" &&
          event.organizerId._id.toString() !== req.user.id)
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    next(error);
  }
};

// Create event
export const createEvent = async (req, res, next) => {
  try {
    const eventData = {
      ...req.body,
      organizerId: req.user.id,
      organizerName: req.user.name,
    };
    console.log("---------", eventData)
    
    const event = await Event.create(eventData);

    console.log("=-", event)
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.log("err", error)
    next(error);
  }
};

// Update event
export const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user can modify this event
    if (
      req.user.role !== "admin" &&
      event.organizerId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Update event
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("organizerId", "name email");

    res.json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    next(error);
  }
};

// Delete event
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user can delete this event
    if (
      req.user.role !== "admin" &&
      event.organizerId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Delete all registrations for this event
    await Registration.deleteMany({ eventId: req.params.id });

    // Delete event
    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve event (admin only)
export const approveEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true, runValidators: true }
    ).populate("organizerId", "name email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      message: "Event approved successfully",
      event,
    });
  } catch (error) {
    next(error);
  }
};

// Reject event (admin only)
export const rejectEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true, runValidators: true }
    ).populate("organizerId", "name email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      message: "Event rejected successfully",
      event,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------Register for event-----------------------------------
export const registerForEvent = async (req, res, next) => {
  console.log("req recieved , for events register");
  try {
    const eventId = req.params.id;
    const userId = req.user.id;
    let event = await Event.findById(eventId).populate(
      "organizerId",
      "name email"
    );
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    if (event.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Event is not approved for registration",
      });
    }

    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ success: false, message: "Event is full" });
    }

    if (event.date <= new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Event has already passed" });
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      userId,
      eventId,
      status: "registered",
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    // -----------------------------Create registration
    await Registration.create({
      userId,
      eventId,
      status: "registered",
      notes: req.body.notes,
    });

    // Update event registered count
    event.registeredCount += 1;
    await event.save();

    // Return updated event along with success message
    res.status(201).json({
      success: true,
      message: "Successfully registered for event",
      event,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------Unregister from event------------------------------------
export const unregisterFromEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Find and update registration
    const registration = await Registration.findOneAndUpdate(
      { userId, eventId, status: "registered" },
      { status: "cancelled" },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Update event registered count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { registeredCount: -1 },
    });

    res.json({
      success: true,
      message: "Successfully unregistered from event",
    });
  } catch (error) {
    next(error);
  }
};
