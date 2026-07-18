import mongoose from "mongoose";

const trustCircleSchema = new mongoose.Schema(
  {
    // Account owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Guardian (registered Verity user)
    guardianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    trustedName: {
      type: String,
      required: true,
    },

    trustedEmail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
  
);


export default mongoose.model("TrustCircle", trustCircleSchema);