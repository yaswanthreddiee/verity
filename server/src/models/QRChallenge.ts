import mongoose from "mongoose";

const qrChallengeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    deviceId: String,

    challengeId: {
      type: String,
      unique: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("QRChallenge", qrChallengeSchema);