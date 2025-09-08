import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Event title is required"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Event description is required"],
    trim: true,
    maxlength: [1000, "Description cannot be more than 1000 characters"],
  },
  date: {
    type: Date,
    required: [true, "Event date is required"],
    validate: {
      validator: function (value) {
        return value > new Date();
      },
      message: "Event date must be in the future",
    },
  },
  time: {
    type: String,
    required: [true, "Event time is required"],
    match: [
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Please provide a valid time format (HH:MM)",
    ],
  },
  location: {
    type: String,
    required: [true, "Event location is required"],
    trim: true,
    maxlength: [200, "Location cannot be more than 200 characters"],
  },
  capacity: {
    type: Number,
    required: [true, "Event capacity is required"],
    min: [1, "Capacity must be at least 1"],
    max: [10000, "Capacity cannot exceed 10000"],
  },
  registeredCount: {
    type: Number,
    default: 0,
    min: [0, "Registered count cannot be negative"],
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  organizerName: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  imageUrl: {
    type: String,
    default: "",
  },
  requirements: {
    type: String,
    trim: true,
    maxlength: [500, "Requirements cannot be more than 500 characters"],
  },
  contactInfo: {
    email: {
      type: String,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Please provide a valid phone number"],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt field before saving
eventSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for checking if event is full
eventSchema.virtual("isFull").get(function () {
  return this.registeredCount >= this.capacity;
});

// ------------------Virtual for checking if registration is open
eventSchema.virtual("isRegistrationOpen").get(function () {
  return this.status === "approved" && this.date > new Date();
});

// Ensure virtual fields are serialized
eventSchema.set("toJSON", { virtuals: true });

// Index for better query performance
eventSchema.index({ status: 1, isPublic: 1 });
eventSchema.index({ organizerId: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ createdAt: -1 });

export default mongoose.model("Event", eventSchema);
