import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .max(100),
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().trim().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().min(1, "Refresh token is required"),
});

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50)
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50)
    .optional(),
  email: z.string().trim().email("Invalid email address").max(255).optional(),
  profileImageUrl: z.string().trim().url("Invalid URL").optional(),
  phoneNumber: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(15)
    .optional(),
  bio: z.string().trim().max(500).optional(),
});

export const addressSchema = z.object({
  street: z.string().trim().min(1, "Street is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  zipCode: z.string().trim().min(1, "Zip code is required"),
  country: z.string().trim().min(1, "Country is required"),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  label: z.enum(["HOME", "WORK", "OTHER"]).default("HOME"),
  isDefault: z.boolean().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, "Reset token is required"),
  newPassword: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .max(100),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().trim().min(1, "Current password is required"),
  newPassword: z
    .string()
    .trim()
    .min(8, "New password must be at least 8 characters long")
    .max(100),
});

export type RegisterType = z.infer<typeof registerSchema>;
export type LoginType = z.infer<typeof loginSchema>;
export type RefreshTokenType = z.infer<typeof refreshTokenSchema>;
export type UpdateProfileType = z.infer<typeof updateProfileSchema>;
export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordType = z.infer<typeof changePasswordSchema>;
