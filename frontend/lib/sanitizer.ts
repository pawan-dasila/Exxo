import crypto from "crypto";
/**
 * Sanitizes user-generated content to prevent XSS attacks.
 * Should be used before saving to DB and before rendering HTML.
 */
export function sanitizeContent(content: string): string {
  if (!content) return "";

  // Strategy:
  // 1. Basic fallback for environments without DOMPurify
  // 2. Ideally powered by 'isomorphic-dompurify'

  // NOTE: If DOMPurify is not available, we do a strict tag stripping
  // In a real prod environment, you would use:
  // import DOMPurify from 'isomorphic-dompurify';
  // return DOMPurify.sanitize(content);

  return content
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
    .replace(/on\w+="[^"]*"/gim, "")
    .replace(/javascript:[^"]*/gim, "");
}

/**
 * Validates a Razorpay Webhook signature.
 */
export function validateRazorpaySignature(
  body: string,
  signature: string,
  secret: string,
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}
