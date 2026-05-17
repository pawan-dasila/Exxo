import prisma from "../lib/prisma";
import {
  SignJwtToken,
  refreshTokenSignOptions,
  SignVerificationToken,
  VerifyVerificationToken,
  AccessTokenPayload,
} from "../utils/jwt";
import { hashPassword, compareValue } from "../utils/bcrypt";
import { MailService } from "./mail.service";
import jwt from "jsonwebtoken";
import { Env } from "../configs/env.config";
import { AppError } from "../utils/AppError";
import { HTTPSTATUS } from "../configs/Https.config";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import {
  RegisterType,
  LoginType,
  RefreshTokenType,
  ForgotPasswordType,
  ResetPasswordType,
} from "../validation/user.validation";
import { USER_SAFE_SELECT } from "./user.service";

export class AuthService {
  public static async register(data: RegisterType) {
    const { email, password, firstName, lastName } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(
        "User with this email already exists",
        HTTPSTATUS.CONFLICT,
        ErrorCodeEnum.AUTH_EMAIL_ALREADY_EXISTS,
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        authProviders: {
          create: {
            provider: "EMAIL",
            passwordHash,
          },
        },
      },
      select: USER_SAFE_SELECT,
    });

    const verificationToken = SignVerificationToken({
      userId: newUser.id,
      email: newUser.email,
      purpose: "email_verification",
    });

    MailService.sendVerificationEmail(
      newUser.email,
      `${newUser.firstName || ""} ${newUser.lastName || ""}`.trim(),
      verificationToken,
    ).catch((err) => console.error("Verification email failed:", err));

    return {
      user: newUser,
    };
  }

  public static async login(data: LoginType) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { authProviders: true },
    });

    if (!user) {
      throw new AppError(
        "Invalid credentials",
        HTTPSTATUS.UNAUTHORIZED,
        ErrorCodeEnum.AUTH_INVALID_CREDS,
      );
    }

    const emailProvider = user.authProviders.find(
      (p) => p.provider === "EMAIL",
    );

    if (!emailProvider || !emailProvider.passwordHash) {
      throw new AppError(
        "Invalid credentials",
        HTTPSTATUS.UNAUTHORIZED,
        ErrorCodeEnum.AUTH_INVALID_CREDS,
      );
    }

    const isMatch = await compareValue(password, emailProvider.passwordHash);

    if (!isMatch) {
      throw new AppError(
        "Invalid credentials",
        HTTPSTATUS.UNAUTHORIZED,
        ErrorCodeEnum.AUTH_INVALID_CREDS,
      );
    }

    if (!user.isEmailVerified) {
      throw new AppError(
        "Please verify your email to login",
        HTTPSTATUS.FORBIDDEN,
        ErrorCodeEnum.AUTH_EMAIL_NOT_VERIFIED,
      );
    }

    const { token: accessToken, expiresAt } = SignJwtToken({
      userId: user.id,
      role: user.role,
      verificationStatus: user.verificationStatus,
    });

    const { token: refreshToken } = SignJwtToken(
      { userId: user.id, role: user.role, verificationStatus: user.verificationStatus },
      refreshTokenSignOptions,
    );

    // Update refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const safeUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: USER_SAFE_SELECT,
    });

    return {
      user: safeUser,
      accessToken,
      expiresAt,
      refreshToken,
    };
  }

  public static async refresh(data: RefreshTokenType) {
    const { refreshToken } = data;

    if (!refreshToken) {
      throw new AppError(
        "Refresh token is required",
        HTTPSTATUS.BAD_REQUEST,
        ErrorCodeEnum.VALIDATION_ERROR,
      );
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        Env.JWT_REFRESH_SECRET,
      ) as AccessTokenPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError(
          "Invalid refresh token",
          HTTPSTATUS.UNAUTHORIZED,
          ErrorCodeEnum.AUTH_INVALID_TOKEN,
        );
      }

      // Generate fully fresh access token
      const { token: accessToken, expiresAt } = SignJwtToken({
        userId: user.id,
        role: user.role,
        verificationStatus: user.verificationStatus,
      });

      return {
        accessToken,
        expiresAt,
      };
    } catch (error) {
      throw new AppError(
        "Invalid or expired refresh token",
        HTTPSTATUS.UNAUTHORIZED,
        ErrorCodeEnum.AUTH_INVALID_TOKEN,
      );
    }
  }

  public static async verifyEmail(token: string) {
    try {
      // Verify the token signature and expiration (24h)
      const decoded = VerifyVerificationToken(token);

      if (decoded.purpose !== "email_verification") {
        throw new AppError(
          "Invalid verification token",
          HTTPSTATUS.BAD_REQUEST,
          ErrorCodeEnum.AUTH_INVALID_TOKEN,
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new AppError(
          "User not found",
          HTTPSTATUS.NOT_FOUND,
          ErrorCodeEnum.AUTH_USER_NOT_FOUND,
        );
      }

      if (user.isEmailVerified) {
        return { message: "Email is already verified" };
      }

      // Verify the token email matches the user's current email
      if (user.email !== decoded.email) {
        throw new AppError(
          "Token does not match user email",
          HTTPSTATUS.BAD_REQUEST,
          ErrorCodeEnum.AUTH_INVALID_TOKEN,
        );
      }

      // Mark user as email verified
      await prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      });

      return { message: "Email verified successfully" };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        "Invalid or expired verification link. Please request a new one.",
        HTTPSTATUS.UNAUTHORIZED,
        ErrorCodeEnum.AUTH_INVALID_TOKEN,
      );
    }
  }

  public static async resendVerification(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(
        "User not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.AUTH_USER_NOT_FOUND,
      );
    }

    if (user.isEmailVerified) {
      throw new AppError(
        "Email is already verified",
        HTTPSTATUS.BAD_REQUEST,
        ErrorCodeEnum.VALIDATION_ERROR,
      );
    }

    const verificationToken = SignVerificationToken({
      userId: user.id,
      email: user.email,
      purpose: "email_verification",
    });

    await MailService.sendVerificationEmail(
      user.email,
      `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      verificationToken,
    );

    return { message: "Verification email resent successfully" };
  }

  public static async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: "Logged out successfully" };
  }

  public static async forgotPassword(data: ForgotPasswordType) {
    const { email } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        message:
          "If an account with that email exists, we sent a password reset link.",
      };
    }

    const resetToken = SignVerificationToken({
      userId: user.id,
      email: user.email,
      purpose: "password_reset",
    });

    await MailService.sendPasswordResetEmail(
      user.email,
      `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      resetToken,
    );

    return {
      message:
        "If an account with that email exists, we sent a password reset link.",
    };
  }

  public static async resetPassword(data: ResetPasswordType) {
    const { token, newPassword } = data;

    try {
      const decoded = VerifyVerificationToken(token);

      if (decoded.purpose !== "password_reset") {
        throw new AppError(
          "Invalid reset token",
          HTTPSTATUS.BAD_REQUEST,
          ErrorCodeEnum.AUTH_INVALID_TOKEN,
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { authProviders: true },
      });

      if (!user) {
        throw new AppError(
          "User not found",
          HTTPSTATUS.NOT_FOUND,
          ErrorCodeEnum.AUTH_USER_NOT_FOUND,
        );
      }

      const emailProvider = user.authProviders.find(
        (p) => p.provider === "EMAIL",
      );
      if (!emailProvider) {
        throw new AppError(
          "Account uses another login method",
          HTTPSTATUS.BAD_REQUEST,
          ErrorCodeEnum.VALIDATION_ERROR,
        );
      }

      const passwordHash = await hashPassword(newPassword);

      await prisma.authProvider.update({
        where: { id: emailProvider.id },
        data: { passwordHash },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null },
      });

      return {
        message:
          "Password reset successfully. Please log in with your new password.",
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Invalid or expired reset link. Please request a new one.",
        HTTPSTATUS.UNAUTHORIZED,
        ErrorCodeEnum.AUTH_INVALID_TOKEN,
      );
    }
  }
}
