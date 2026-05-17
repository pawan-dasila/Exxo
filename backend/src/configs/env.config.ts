import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "PRODUCTION", "test"])
    .default("development"),
  PORT: z.string().default("8000"),
  BASE_PATH: z.string().default("/api"),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(10).default("secret_jwt_key_default"),
  JWT_EXPIRES_IN: z.string().default("1m"),
  JWT_REFRESH_SECRET: z.string().min(10).default("secret_refresh_key_default"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  EMAIL_VERIFY_SECRET: z
    .string()
    .min(10)
    .default("email_verify_secret_key_default"),
  EMAIL_VERIFY_EXPIRES_IN: z.string().default("24h"),
  GEMINI_API_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_MAILER_SENDER: z.string().min(1),
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),
  FRONTEND_ORIGIN: z.url().default("http://localhost:3000"),
});

const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:");
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

export const Env = validateEnv();
