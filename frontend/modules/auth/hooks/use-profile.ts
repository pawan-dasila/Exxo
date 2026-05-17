import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/hooks/use-axios";
import { User, ApiResponse } from "@/modules/auth/types";
import { getCookie, logger } from "@/lib/utils";

export const useProfile = () => {
  return useQuery<User | null>({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const hasSessionHint = getCookie("has_session");
      if (!hasSessionHint) {
        return null;
      }

      try {
        const response = await axiosInstance.get<ApiResponse<User>>("/user/profile");
        return response.data.data;
      } catch (error) {
        logger.error("Failed to fetch user profile", error, { module: "useProfile" });
        return null; // Return null instead of throwing to keep the UI stable
      }
    },
    initialData: () => {
      if (typeof window === "undefined") return null;
      const saved = localStorage.getItem("auth_user");
      try {
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

