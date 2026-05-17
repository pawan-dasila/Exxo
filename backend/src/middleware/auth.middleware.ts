import { Request, Response, NextFunction } from "express";
import { Env } from "../configs/env.config";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";
import { HTTPSTATUS } from "../configs/Https.config";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import { AccessTokenPayload } from "../utils/jwt";

export const Protect = (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.access_token) {
    token = req.cookies.access_token;
  }

  if (!token) {
    return next(
      new AppError(
        "You are not logged in! Please log in to get access.",
        HTTPSTATUS.UNAUTHORIZED,
        ErrorCodeEnum.AUTH_TOKEN_NOT_FOUND,
      ),
    );
  }

  try {
    const decoded = jwt.verify(token, Env.JWT_SECRET) as AccessTokenPayload;

    req.user = decoded;

    next();
  } catch (error) {
    return next(
      new AppError(
        "Invalid or expired access token. Please login again.",
        HTTPSTATUS.UNAUTHORIZED,
        ErrorCodeEnum.AUTH_INVALID_TOKEN,
      ),
    );
  }
};

export const RestrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          HTTPSTATUS.FORBIDDEN,
          ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS,
        ),
      );
    }
    next();
  };
};

export const VerifiedOnly = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user || req.user.verificationStatus !== "VERIFIED") {
    return next(
      new AppError(
        "Account verification required to perform this action",
        HTTPSTATUS.FORBIDDEN,
        ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS,
      ),
    );
  }
  next();
};
