import { Router } from "express";
import TrustCircle from "../models/TrustCircle";
import { auth, AuthRequest } from "../middleware/auth";
import User from "../models/User";

const router = Router();

/*
Add Trusted Person
*/

router.post("/add", auth, async (req: AuthRequest, res) => {
    try {
      const { trustedName, trustedEmail } = req.body;
  
      // Guardian must exist
      const guardian = await User.findOne({
        email: trustedEmail,
      });
  
      if (!guardian) {
        return res.status(404).json({
          success: false,
          message: "Guardian must have a Verity account.",
        });
      }
  
      // Can't add yourself
      if (guardian._id.toString() === req.user.id) {
        return res.status(400).json({
          success: false,
          message: "You cannot add yourself.",
        });
      }
  
      // Prevent duplicates
      const existing = await TrustCircle.findOne({
        userId: req.user.id,
        guardianId: guardian._id,
      });
  
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Guardian already added.",
        });
      }
  
      const member = await TrustCircle.create({
        userId: req.user.id,
        guardianId: guardian._id,
        trustedName,
        trustedEmail,
      });
  
      res.json({
        success: true,
        member,
      });
    } catch (err) {
      console.error(err);
  
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  });

/*
Get Trust Circle
*/

router.get("/list", auth, async (req: AuthRequest, res) => {
  const members = await TrustCircle.find({
    userId: req.user.id,
  });

  res.json({
    success: true,
    members,
  });
});


router.delete("/clear", auth, async (req: AuthRequest, res) => {
    await TrustCircle.deleteMany({
      userId: req.user.id,
    });
  
    res.json({
      success: true,
      message: "Trust Circle Cleared",
    });
  });

export default router;