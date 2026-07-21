import { Router } from "express";
import crypto from "crypto";

import { auth, AuthRequest } from "../middleware/auth";
import ResetSession from "../models/ResetSession";
import RecoveryRequest from "../models/RecoveryRequest";
import TrustCircle from "../models/TrustCircle";
import Device from "../models/Device";
import User from "../models/User";
import PasswordRecoveryChallenge from "../models/PasswordRecoveryChallenge";
const router = Router();

/* ==========================================
   Request Recovery
========================================== */

router.post("/request", auth, async (req: AuthRequest, res) => {
  try {
    const { deviceId, deviceName, browser, os } = req.body;

    const guardians = await TrustCircle.find({
      userId: req.user.id,
    });

    if (guardians.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No guardians found.",
      });
    }

    const recoverySessionId = crypto.randomUUID();

    for (const guardian of guardians) {
      await RecoveryRequest.create({
        recoverySessionId,
        userId: req.user.id,
        guardianId: guardian.guardianId,
        deviceId,
        deviceName,
        browser,
        os,
      });
    }

    res.json({
      success: true,
      recoverySessionId,
      message: "Recovery request created.",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

/* ==========================================
   Pending Recovery Requests
========================================== */

router.get("/pending", auth, async (req: AuthRequest, res) => {
  try {
    const requests = await RecoveryRequest.find({
      guardianId: req.user.id,
      status: "PENDING",
    }).populate("userId", "fullName email");

    res.json({
      success: true,
      requests,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

/* ==========================================
   Recovery Status
========================================== */

router.get("/status/:sessionId", auth, async (req: AuthRequest, res) => {
  try {
    const { sessionId } = req.params;

    const approved = await RecoveryRequest.findOne({
      recoverySessionId: sessionId,
      userId: req.user.id,
      status: "APPROVED",
    });

    if (approved) {
      return res.json({
        success: true,
        status: "APPROVED",
      });
    }

    const rejected = await RecoveryRequest.findOne({
      recoverySessionId: sessionId,
      userId: req.user.id,
      status: "REJECTED",
    });

    if (rejected) {
      return res.json({
        success: true,
        status: "REJECTED",
      });
    }

    res.json({
      success: true,
      status: "PENDING",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

/* ==========================================
   Approve Recovery
========================================== */

router.post("/approve", auth, async (req: AuthRequest, res) => {
  try {
    const { requestId } = req.body;

    const request = await RecoveryRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Recovery request not found",
      });
    }

    if (request.guardianId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    request.status = "APPROVED";
    await request.save();

    await Device.findOneAndUpdate(
      {
        userId: request.userId,
        deviceId: request.deviceId,
      },
      {
        userId: request.userId,
        deviceId: request.deviceId,
        deviceName: request.deviceName,
        browser: request.browser,
        os: request.os,
        trusted: true,
      },
      {
        upsert: true,
        new: true,
      }
    );

    await RecoveryRequest.updateMany(
      {
        recoverySessionId: request.recoverySessionId,
        _id: { $ne: request._id },
      },
      {
        status: "REJECTED",
      }
    );

    res.json({
      success: true,
      message: "Recovery Approved",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

/* ==========================================
   Reject Recovery
========================================== */

router.post("/reject", auth, async (req: AuthRequest, res) => {
  try {
    const { requestId } = req.body;

    const request = await RecoveryRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Recovery request not found",
      });
    }

    if (request.guardianId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    request.status = "REJECTED";
    await request.save();

    res.json({
      success: true,
      message: "Recovery Rejected",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

/* ==========================================
   Password Recovery Request
========================================== */


router.post("/password/request", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await PasswordRecoveryChallenge.deleteMany({
      email,
    });

    const challengeId = crypto.randomUUID();

    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await PasswordRecoveryChallenge.create({
      challengeId,
      email,
      expiresAt,
    });

    return res.json({
      success: true,
      challengeId,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
});
/* ==========================================
   Password Recovery Status
========================================== */

router.get("/password/status/:challengeId", async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await PasswordRecoveryChallenge.findOne({
      challengeId,
    });
    

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    if (challenge.status === "APPROVED") {
      return res.json({
        success: true,
        status: "APPROVED",
        resetToken: challenge.resetToken,
      });
    }

    res.json({
      success: true,
      status: "PENDING",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
/* ==========================================
   Password Recovery Approve
========================================== */

/* ==========================================
   Password Recovery Approve
========================================== */

router.post("/password/approve", auth, async (req: AuthRequest, res) => {
  try {

    const { challengeId } = req.body;

    const challenge =
      await PasswordRecoveryChallenge.findOne({
        challengeId,
      });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    await ResetSession.deleteMany({
      email: challenge.email,
    });

    await ResetSession.create({
      email: challenge.email,
      token: resetToken,
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    });

    challenge.status = "APPROVED";
    challenge.resetToken = resetToken;

    await challenge.save();

    return res.json({
      success: true,
      message: "Password Recovery Approved",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
});
export default router; 