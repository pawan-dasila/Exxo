import { useMutation } from "@tanstack/react-query";
import { useAxios } from "@/hooks/use-axios";

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export const useResetPassword = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const { data: responseData } = await axios.post(
        "/auth/reset-password",
        data,
      );
      return responseData;
    },
  });
};

