import { Router } from "express";
import authRoutes from "./auth";
import deviceRoutes from "./device";
import trustRoutes from "./trust";
import contextRoutes from "./context";
import qrRoutes from "./qr";

const router = Router();

router.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "Verity API Running",
  });
});
router.use("/context", contextRoutes);

router.use("/auth", authRoutes);
router.use("/device", deviceRoutes);
router.use("/trust", trustRoutes);
router.use("/qr", qrRoutes);

export default router;