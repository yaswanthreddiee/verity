import { Router } from "express";
import Device from "../models/Device";
import { auth, AuthRequest } from "../middleware/auth";

const router = Router();

/*
----------------------------------------
Register Device
----------------------------------------
*/
router.post("/register", auth, async (req: AuthRequest, res) => {
  try {
    const {
      deviceId,
      deviceName,
      browser,
      os,
      trusted,
    } = req.body;

    // Check if device already exists
    const existing = await Device.findOne({
      userId: req.user.id,
      deviceId,
    });

    if (existing) {
      return res.json({
        success: true,
        device: existing,
      });
    }

    // Create new device
    const device = await Device.create({
      userId: req.user.id,
      deviceId,
      deviceName,
      browser,
      os,
      trusted: trusted ?? false,
    });

    res.json({
      success: true,
      device,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to register device",
    });
  }
});

/*
----------------------------------------
List Trusted Devices
----------------------------------------
*/
router.get("/list", auth, async (req: AuthRequest, res) => {
  try {
    const devices = await Device.find({
      userId: req.user.id,
    });

    res.json(devices);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch devices",
    });
  }
});

/*
----------------------------------------
Check Device Trust
----------------------------------------
*/
router.post("/check", auth, async (req: AuthRequest, res) => {
  try {
    const { deviceId } = req.body;

    const device = await Device.findOne({
      userId: req.user.id,
      deviceId,
      trusted: true,
    });

    if (device) {
      return res.json({
        trusted: true,
      });
    }

    return res.json({
      trusted: false,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Device check failed",
    });
  }
});

export default router;