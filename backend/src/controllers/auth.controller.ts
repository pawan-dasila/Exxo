import { Request, Response } from "express";
import { AuthService } from '../services/auth.service.js';
import { AsyncHandler } from '../middleware/AsyncHandler.middleware.js';
import { HTTPSTATUS } from '../configs/Https.config.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validation/user.validation.js';
import { z } from "zod";
import { Env } from '../configs/env.config.js';

export const registerController = AsyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = registerSchema.parse(req.body);
    const data = await AuthService.register(validatedData);

    return ApiResponse(res, {
      status_code: HTTPSTATUS.CREATED,
      message: "User registered successfully",
      data,
    });
  },
);

export const loginController = AsyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);
    const data = await AuthService.login(validatedData);

    res.cookie("access_token", data.accessToken, {
      httpOnly: true,
      secure: Env.NODE_ENV === "PRODUCTION",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", data.refreshToken, {
      httpOnly: true,
      secure: Env.NODE_ENV === "PRODUCTION",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("has_session", "true", {
      httpOnly: false,
      secure: Env.NODE_ENV === "PRODUCTION",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return ApiResponse(res, {
      status_code: HTTPSTATUS.OK,
      message: "Login successful",
      data: { user: data.user },
    });
  },
);

export const refreshTokenController = AsyncHandler(
  async (req: Request, res: Response) => {
    const tokenStr = req.cookies?.refresh_token || req.body.refreshToken;
    const validatedData = refreshTokenSchema.parse({ refreshToken: tokenStr });
    const data = await AuthService.refresh(validatedData);

    res.cookie("access_token", data.accessToken, {
      httpOnly: true,
      secure: Env.NODE_ENV === "PRODUCTION",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("has_session", "true", {
      httpOnly: false, // Accessible by frontend
      secure: Env.NODE_ENV === "PRODUCTION",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return ApiResponse(res, {
      status_code: HTTPSTATUS.OK,
      message: "Token refreshed successfully",
      data: null,
    });
  },
);

export const verifyEmailController = AsyncHandler(
  async (req: Request, res: Response) => {
    const token = z
      .string()
      .min(1, "Verification token is required")
      .parse(req.query.token);
    const data = await AuthService.verifyEmail(token);

    return ApiResponse(res, {
      status_code: HTTPSTATUS.OK,
      message: data.message,
      data: null,
    });
  },
);

export const resendVerificationController = AsyncHandler(
  async (req: Request, res: Response) => {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const data = await AuthService.resendVerification(email);

    return ApiResponse(res, {
      status_code: HTTPSTATUS.OK,
      message: data.message,
      data: null,
    });
  },
);

export const logoutController = AsyncHandler(
  async (req: Request, res: Response) => {
    const data = await AuthService.logout(req.user!.userId);

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.clearCookie("has_session");

    return ApiResponse(res, {
      status_code: HTTPSTATUS.OK,
      message: data.message,
      data: null,
    });
  },
);

export const forgotPasswordController = AsyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = forgotPasswordSchema.parse(req.body);
    const data = await AuthService.forgotPassword(validatedData);

    return ApiResponse(res, {
      status_code: HTTPSTATUS.OK,
      message: data.message,
      data: null,
    });
  },
);

export const resetPasswordController = AsyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = resetPasswordSchema.parse(req.body);
    const data = await AuthService.resetPassword(validatedData);

    return ApiResponse(res, {
      status_code: HTTPSTATUS.OK,
      message: data.message,
      data: null,
    });
  },
);
