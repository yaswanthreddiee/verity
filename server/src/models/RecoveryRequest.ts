import mongoose from "mongoose";

const recoveryRequestSchema = new mongoose.Schema(
  {
    // User who is recovering the account
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Guardian who should approve
    guardianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Recovery session ID (groups requests together)
    recoverySessionId: {
      type: String,
      required: true,
    },

    // New device information
    deviceId: {
      type: String,
      required: true,
    },

    deviceName: {
      type: String,
      required: true,
    },

    browser: String,

    os: String,

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "RecoveryRequest",
  recoveryRequestSchema
);