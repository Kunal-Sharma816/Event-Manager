import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  status: {
    type: String,
    enum: ["registered", "cancelled"],
    default: "registered",
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [200, "Notes cannot be more than 200 characters"],
  },
});

// Compound index to ensure unique registration per user per event
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

// Index for better query performance
registrationSchema.index({ userId: 1 });
registrationSchema.index({ eventId: 1 });
registrationSchema.index({ status: 1 });

export default mongoose.model("Registration", registrationSchema);
