import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/hooks/use-axios";
import { ApiResponse } from "../types";

export const useVerifyEmail = (token: string | null) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["verify-email", token],
    queryFn: async () => {
      if (!token) throw new Error("No token provided");
      const { data } = await axios.get<ApiResponse<null>>(
        `/auth/verify-email?token=${token}`
      );
      return data;
    },
    enabled: !!token,
    retry: false,
  });
};
