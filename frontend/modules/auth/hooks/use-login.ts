import { useMutation } from "@tanstack/react-query";
import { useAxios } from "@/hooks/use-axios";
import { useAuth } from "@/components/context/auth.context";
import { AuthResponse, LoginValues, ApiResponse } from "../types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/lib/api-utils";

export const useLogin = () => {
  const axios = useAxios();
  const { setAuth } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginValues) => {
      const { data } = await axios.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        credentials,
      );
      return data.data;
    },
    onSuccess: (data) => {
      setAuth(data);
      toast.success("Welcome back!", {
        description: "Successfully signed in to your account.",
      });
      router.push("/");
    },
    onError: (error) => {
      handleApiError(error, "Invalid login credentials.");
    },
  });
};
