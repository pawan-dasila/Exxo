import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { Env } from "../configs/env.config";

type TimeUnit = "s" | "h" | "d" | "m" | "w" | "y";
type TimeString = `${number}${TimeUnit}`;

import { Role, VerificationStatus } from "@prisma/client";

export type AccessTokenPayload = {
  userId: string;
  role: Role;
  verificationStatus: VerificationStatus;
};

export type VerificationTokenPayload = {
  userId: string;
  email: string;
  purpose: "email_verification" | "password_reset";
};

type SignOptsAndSecret = SignOptions & {
  secret: string;
  expiresIn?: TimeString | number;
};

const defaults: SignOptions = {
  audience: ["user"],
};

export const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: Env.JWT_EXPIRES_IN as TimeString,
  secret: Env.JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptsAndSecret = {
  expiresIn: Env.JWT_REFRESH_EXPIRES_IN as TimeString,
  secret: Env.JWT_REFRESH_SECRET,
};

export const SignJwtToken = (
  payload: AccessTokenPayload,
  options?: SignOptsAndSecret,
) => {
  const isAccessToken = !options || options === accessTokenSignOptions;

  const { secret, ...opts } = options || accessTokenSignOptions;

  const token = jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  });

  const decoded = jwt.decode(token) as JwtPayload;
  const expiresAt = isAccessToken && decoded?.exp
    ? decoded.exp * 1000
    : undefined;

  return {
    token,
    expiresAt,
  };
};

export const verificationTokenSignOptions: SignOptsAndSecret = {
  expiresIn: Env.EMAIL_VERIFY_EXPIRES_IN as TimeString,
  secret: Env.EMAIL_VERIFY_SECRET,
};

export const SignVerificationToken = (payload: VerificationTokenPayload) => {
  const { secret, ...opts } = verificationTokenSignOptions;
  const token = jwt.sign(payload, secret, opts);
  return token;
};

export const VerifyVerificationToken = (
  token: string,
): VerificationTokenPayload => {
  return jwt.verify(token, Env.EMAIL_VERIFY_SECRET) as VerificationTokenPayload;
};
