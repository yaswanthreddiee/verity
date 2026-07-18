import { Router } from "express";
import { sendEmail } from "../utils/email";

const router = Router();

router.post("/test", async (req, res) => {
  try {
    const { email } = req.body;

    await sendEmail(
      email,
      "Verity Test Email",
      "🎉 Congratulations! Your email integration with Verity is working successfully."
    );

    res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

export default router;