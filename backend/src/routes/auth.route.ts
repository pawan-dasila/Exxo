import { Router } from "express";
import {
  registerController,
  loginController,
  refreshTokenController,
  verifyEmailController,
  resendVerificationController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controller";
import { Protect } from "../middleware/auth.middleware";

const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/refresh", refreshTokenController);
authRoutes.get("/verify-email", verifyEmailController);
authRoutes.post("/resend-verification", resendVerificationController);
authRoutes.post("/logout", Protect, logoutController);
authRoutes.post("/forgot-password", forgotPasswordController);
authRoutes.post("/reset-password", resetPasswordController);

export default authRoutes;
