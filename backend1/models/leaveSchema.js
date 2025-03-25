import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  reason: {
    type: String,
    required: [true, "Reason for leave is required"],
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
  },
  proofDocument: {
    type: String, // Cloudinary URL for the uploaded document
    required: false, // Not mandatory but recommended
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Leave = mongoose.model("Leave", leaveSchema);
