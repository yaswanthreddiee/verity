import { Router } from "express";
import TrustCircle from "../models/TrustCircle";
import { auth, AuthRequest } from "../middleware/auth";

const router = Router();

/*
Add Trusted Person
*/

router.post("/add", auth, async (req: AuthRequest, res) => {
  try {
    const { trustedName, trustedEmail } = req.body;

    const member = await TrustCircle.create({
      userId: req.user.id,
      trustedName,
      trustedEmail,
    });

    res.json({
      success: true,
      member,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
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

export default router;