import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import recoveryRoutes from "./routes/recovery";
import routes from "./routes";
import emailRoutes from "./routes/email";
import otpRoutes from "./routes/otp";
import authRoutes from "./routes/auth";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/v1/recovery", recoveryRoutes);
app.use("/api/v1", routes);
app.use("/api/email", emailRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/otp", otpRoutes);
export default app;