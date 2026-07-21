import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { auth, AuthRequest } from "../middleware/auth";
import QRChallenge from "../models/QRChallenge";
import Device from "../models/Device";
import Audit from "../models/Audit";
import jwt from "jsonwebtoken";
const router = Router();

/*
----------------------------------------
Generate QR Challenge
----------------------------------------
*/
router.post("/generate", auth, async (req: AuthRequest, res) => {
  try {
    const { deviceId } = req.body;

    const challenge = await QRChallenge.create({
      userId: req.user.id,
      deviceId,
      challengeId: uuidv4(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    res.json({
      success: true,
      challengeId: challenge.challengeId,
      expiresAt: challenge.expiresAt,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to generate QR challenge",
    });
  }
});

/*
----------------------------------------
Approve QR Challenge
----------------------------------------
*/
router.post("/approve", auth, async (req: AuthRequest, res) => {
  try {
    const { challengeId } = req.body;

    const challenge = await QRChallenge.findOne({ challengeId });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    if (challenge.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Already processed",
      });
    }

    if (new Date() > challenge.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Challenge expired",
      });
    }

    challenge.status = "APPROVED";
    challenge.approvedBy = req.user.id;

    await challenge.save();
    const updated = await QRChallenge.findOne({ challengeId });

    console.log("Saved status:", updated?.status);
    // Register trusted device only if it doesn't already exist
    const existing = await Device.findOne({
      userId: challenge.userId,
      deviceId: challenge.deviceId,
    });

    if (!existing) {
      await Device.create({
        userId: challenge.userId,
        deviceId: challenge.deviceId,
        deviceName: "Approved Device",
        browser: "Unknown",
        os: "Unknown",
        trusted: true,
      });
    }

    await Audit.create({
      userId: challenge.userId,
      action: "DEVICE_APPROVED",
      details: `Approved by ${req.user.id}`,
    });

    res.json({
      success: true,
      message: "Device Approved",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
});

/*
----------------------------------------
Check QR Challenge Status
----------------------------------------
*/
router.get("/status/:challengeId", async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await QRChallenge.findOne({ challengeId });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }
    console.log(
      "Status request:",
      challenge.challengeId,
      challenge.status
    );
    if (challenge.status !== "APPROVED") {
      return res.json({
        success: true,
        status: challenge.status,
      });
    }

    const token = jwt.sign(
      {
        id: challenge.userId,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      success: true,
      status: "APPROVED",
      token,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch status",
    });
  }
});

/*
----------------------------------------
List Pending QR Requests
----------------------------------------
*/
router.get("/pending", auth, async (req: AuthRequest, res) => {
  try {
    const pending = await QRChallenge.find({
      userId: req.user.id,
      status: "PENDING",
    });

    res.json({
      success: true,
      requests: pending,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch pending requests",
    });
  }
});

export default router;