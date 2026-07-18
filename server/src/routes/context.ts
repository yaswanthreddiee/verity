import { Router } from "express";
import { auth, AuthRequest } from "../middleware/auth";
import Device from "../models/Device";

const router = Router();

router.post("/evaluate", auth, async (req: AuthRequest, res) => {
  try {
    const { deviceId } = req.body;

    // Check if user has any trusted devices
    const trustedDevices = await Device.countDocuments({
      userId: req.user.id,
      trusted: true,
    });

    // First login
    if (trustedDevices === 0) {
      return res.json({
        risk: "LOW",
        action: "FIRST_LOGIN",
      });
    }

    // Check current device
    const device = await Device.findOne({
      userId: req.user.id,
      deviceId,
    });

    // Already trusted
    if (device && device.trusted) {
      return res.json({
        risk: "LOW",
        action: "LOGIN",
      });
    }

    // New device
    return res.json({
      risk: "HIGH",
      action: "TRUST_CIRCLE",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Context evaluation failed",
    });
  }
});

export default router;