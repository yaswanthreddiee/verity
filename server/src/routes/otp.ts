import { Router } from "express";
import OTP from "../models/OTP";
import User from "../models/User";
import { sendEmail } from "../utils/email";
import crypto from "crypto";
import ResetSession from "../models/ResetSession";
const router = Router();

/*
    Send OTP
*/

router.post("/send", async (req, res) => {
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

    await OTP.deleteMany({ email });

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({
      email,
      otp,
      expiresAt,
    });
    console.log("Sending OTP to:", email);
    await sendEmail(
      email,
      "Verity Security OTP",
      `Your OTP is ${otp}

This OTP is valid for 5 minutes.

If you didn't request this, please ignore this email.`
    );

    res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

/*
    Verify OTP
*/

router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    const token = crypto.randomBytes(32).toString("hex");

    // Remove old reset sessions
    await ResetSession.deleteMany({ email });
    
    // Create new reset session
    await ResetSession.create({
      email,
      token,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    
    // OTP is valid, so delete it
    await OTP.deleteOne({ _id: otpRecord._id });
    
    // Return reset token
    return res.json({
      success: true,
      message: "OTP verified successfully",
      resetToken: token,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;