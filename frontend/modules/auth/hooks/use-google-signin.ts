import { useState } from "react";
import { logger } from "@/lib/utils";

/**
 * Hook to handle Google OAuth sign-in flow.
 */
export const useGoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      logger.info("Initiating Google Sign-In flow", { module: "Auth" });
      
      // Pattern: In production, redirect to your backend's Google Auth endpoint
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      window.location.href = `${API_URL}/auth/google`;
      
    } catch (error) {
      logger.error("Google Sign-In failed to initiate", error, { module: "Auth" });
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    isLoading,
  };
};
