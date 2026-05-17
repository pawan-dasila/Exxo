import { AxiosError } from "axios";
import { ApiError } from "./types/api";
import { toast } from "sonner";
import { logger } from "./utils";

/**
 * Standardized error handler for API requests
 */
export const handleApiError = (
  error: unknown,
  fallbackMessage: string = "An unexpected error occurred",
) => {
  logger.error(fallbackMessage, error, { module: "API_HANDLER" });

  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    const message = apiError?.message || fallbackMessage;

    // Global handling for specific error codes
    switch (apiError?.data?.errorCode) {
      case "UNAUTHORIZED":
        // Handle session expiry logic here if needed
        break;
      case "SERVER_ERROR":
        toast.error("Internal Server Error", {
          description: "Our team has been notified. Please try again later.",
        });
        return apiError;
    }

    toast.error(message);
    return apiError;
  }

  toast.error(fallbackMessage);
  return null;
};
