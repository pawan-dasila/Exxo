import Razorpay from "razorpay";
import { Env } from './env.config.js';

export const razorpay = new Razorpay({
  key_id: Env.RAZORPAY_KEY_ID,
  key_secret: Env.RAZORPAY_KEY_SECRET,
});

export const RAZORPAY_CONFIG = {
  CURRENCY: "INR",
  PLATFORM_FEE_PERCENTAGE: 10, // 10% platform fee
} as const;
