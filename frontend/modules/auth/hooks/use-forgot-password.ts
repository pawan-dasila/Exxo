import { useMutation } from "@tanstack/react-query";
import { useAxios } from "@/hooks/use-axios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "../types";

export const useForgotPassword = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await axios.post("/auth/forgot-password", { email });
      return data;
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error("Request Failed", {
        description:
          error.response?.data?.message || "Failed to send reset link.",
      });
    },
  });
};

