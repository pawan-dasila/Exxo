import { useMutation } from "@tanstack/react-query";
import { useAxios } from "@/hooks/use-axios";
import { ApiResponse, ApiError } from "../types";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useResendVerification = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await axios.post<ApiResponse<null>>(
        "/auth/resend-verification",
        { email },
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Verification email sent");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to resend email");
    },
  });
};

