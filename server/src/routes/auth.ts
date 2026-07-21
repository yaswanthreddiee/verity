import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import OTP from "../models/OTP";
import User from "../models/User";
import { auth, AuthRequest } from "../middleware/auth";
import Device from "../models/Device";
import TrustCircle from "../models/TrustCircle";
// if you already have an OTP model
import ResetSession from "../models/ResetSession";
import { io } from "../server";

const router = Router();

/*
REGISTER
*/

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hash,
    });

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

/*
LOGIN
*/

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(400).json({
        success: false,
        message: "Wrong Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
router.get("/me", auth, async (req: AuthRequest, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      res.json({
        success: true,
        user,
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
VERIFY PASSWORD
*/

router.post("/verify-password", auth, async (req: AuthRequest, res) => {
    try {
      const { password } = req.body;
  
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      const match = await bcrypt.compare(password, user.password);
  
      if (!match) {
        return res.status(400).json({
          success: false,
          message: "Incorrect password",
        });
      }
  
      res.json({
        success: true,
        message: "Password verified",
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
DELETE ACCOUNT
*/

router.post("/delete-account", auth, async (req: AuthRequest, res) => {
    try {
      const { password, otp } = req.body;
  
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      console.log("Logged in user:", user?.email);
      console.log("Entered Password:", password);
      console.log("Stored Hash:", user.password);
      
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      console.log("Password Match:", passwordMatch);
      
      if (!passwordMatch) {
        return res.status(400).json({
          success: false,
          message: "Incorrect password",
        });
      }
  
      const otpRecord = await OTP.findOne({
        email: user.email,
      });
  
      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: "OTP not found",
        });
      }
  
      if (otpRecord.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }
  
      if (new Date() > otpRecord.expiresAt) {
        await OTP.deleteOne({ _id: otpRecord._id });
  
        return res.status(400).json({
          success: false,
          message: "OTP expired",
        });
      }
  
      await OTP.deleteOne({ _id: otpRecord._id });

      // Notify all logged-in sessions
      io.to(user._id.toString()).emit("ACCOUNT_DELETED");
      
      // Delete the user
      await User.findByIdAndDelete(user._id);
      
      res.json({
        success: true,
        message: "Account deleted successfully",
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
CHANGE PASSWORD
*/

router.post("/change-password", auth, async (req: AuthRequest, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
  
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      const match = await bcrypt.compare(currentPassword, user.password);
  
      if (!match) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      user.password = hashedPassword;
  
      await user.save();
  
      res.json({
        success: true,
        message: "Password changed successfully",
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
CHECK RECOVERY METHOD
*/
/*
CHECK RECOVERY METHOD
*/

router.post("/check-recovery", async (req, res) => {
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

    const trustedDevice = await Device.findOne({
      userId: user._id,
      trusted: true,
    });

    return res.json({
      success: true,
      recoveryType: trustedDevice
        ? "TRUSTED_DEVICE"
        : "EMAIL_OTP",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

/*
RESET PASSWORD
*/

/*
RESET PASSWORD
*/

router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;

    if (!email || !newPassword || !resetToken) {
      return res.status(400).json({
        success: false,
        message: "Email, new password and reset token are required",
      });
    }

    // Check reset session
    const session = await ResetSession.findOne({
      email,
      token: resetToken,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid reset session",
      });
    }

    // Check expiry
    if (new Date() > session.expiresAt) {
      await ResetSession.deleteOne({ _id: session._id });

      return res.status(401).json({
        success: false,
        message: "Reset session expired",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    // Cleanup
    await OTP.deleteMany({ email });
    await ResetSession.deleteMany({ email });

    res.json({
      success: true,
      message: "Password reset successfully",
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