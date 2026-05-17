import { useMutation } from "@tanstack/react-query";
import { useAxios } from "@/hooks/use-axios";
import { ApiResponse, RegisterValues, ApiError } from "../types";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useRegister = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async (credentials: RegisterValues) => {
      const { data } = await axios.post<ApiResponse<null>>(
        "/auth/register",
        credentials,
      );
      return data.data;
    },
    onSuccess: () => {
      toast.success("Account Created Successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error("Registration Failed", {
        description: error.response?.data?.message || "Something went wrong.",
      });
    },
  });
};

