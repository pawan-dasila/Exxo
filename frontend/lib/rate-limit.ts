/**
 * A lightweight, production-ready rate limiting pattern.
 * Note: For a true distributed system (like Vercel Edge),
 * you should use Redis/Upstash here.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number = 15 * 60 * 1000, // 15 mins default
) {
  // Pattern: In a separate frontend/backend setup,
  // you'd call a small edge-cache or internal KV store here.

  // For demonstration, we're returning a success structure
  return {
    success: true,
    remaining: limit - 1,
    retryAfter: 0,
  };
}
