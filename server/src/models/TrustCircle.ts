import mongoose from "mongoose";

const trustCircleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    trustedEmail: {
      type: String,
      required: true,
    },

    trustedName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TrustCircle", trustCircleSchema);