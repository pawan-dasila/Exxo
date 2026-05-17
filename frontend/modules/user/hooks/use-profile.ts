import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/hooks/use-axios";
import { getCookie } from "@/lib/utils";
import {
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ApiResponse,
} from "../types";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useProfile = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<User>>("/user/profile");
      return data.data;
    },
    enabled: !!getCookie("has_session"),
  });
};

export const useUpdateProfile = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: UpdateProfileRequest) => {
      let payload: UpdateProfileRequest | FormData = profileData;
      let headers = {};

      if (profileData.profileImage) {
        const formData = new FormData();
        if (profileData.firstName)
          formData.append("firstName", profileData.firstName);
        if (profileData.lastName)
          formData.append("lastName", profileData.lastName);
        if (profileData.phoneNumber)
          formData.append("phoneNumber", profileData.phoneNumber);

        formData.append("profileImage", profileData.profileImage);

        payload = formData;
        headers = { "Content-Type": "multipart/form-data" };
      }

      const { data } = await axios.patch<ApiResponse<User>>(
        "/user/profile",
        payload,
        { headers },
      );
      return data.data;
    },
    onSuccess: () => {
      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },

    onError: (
      error: AxiosError<
        ApiResponse<{ errors?: { field: string; message: string }[] }>
      >,
    ) => {
      let description =
        error.response?.data?.message || "Failed to update profile.";
      const validationErrors = error.response?.data?.data?.errors;

      if (
        validationErrors &&
        Array.isArray(validationErrors) &&
        validationErrors.length > 0
      ) {
        description = validationErrors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
      }

      toast.error("Update Failed", {
        description,
      });
    },
  });
};

export const useChangePassword = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async (passwordData: ChangePasswordRequest) => {
      const { data } = await axios.patch<ApiResponse<null>>(
        "/user/change-password",
        passwordData,
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success("Password Changed", {
        description:
          data.message || "Your password has been changed successfully.",
      });
    },

    onError: (error: AxiosError<ApiResponse<null>>) => {
      toast.error("Change Password Failed", {
        description:
          error.response?.data?.message || "Failed to change password.",
      });
    },
  });
};

