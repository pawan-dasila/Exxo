import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/hooks/use-axios";
import { Address, AddressRequest, ApiResponse } from "../types";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useAddresses = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["user-addresses"],
    queryFn: async () => {
      const { data } =
        await axios.get<ApiResponse<Address[]>>("/user/addresses");
      return data.data;
    },
  });
};

export const useAddAddress = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressData: AddressRequest) => {
      const { data } = await axios.post<ApiResponse<Address>>(
        "/user/addresses",
        addressData,
      );
      return data.data;
    },
    onSuccess: () => {
      toast.success("Address Added", {
        description: "New address has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
    },

    onError: (
      error: AxiosError<ApiResponse<{ errors?: { field: string; message: string }[] }>>,
    ) => {
      let description = error.response?.data?.message || "Failed to add new address.";
      const validationErrors = error.response?.data?.data?.errors;
      
      if (validationErrors && Array.isArray(validationErrors) && validationErrors.length > 0) {
        description = validationErrors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
      }

      toast.error("Failed to Add Address", {
        description,
      });
    },
  });
};

export const useUpdateAddress = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data: addressData,
    }: {
      id: string;
      data: Partial<AddressRequest>;
    }) => {
      const { data: responseData } = await axios.patch<ApiResponse<Address>>(
        `/user/addresses/${id}`,
        addressData,
      );
      return responseData.data;
    },
    onSuccess: () => {
      toast.success("Address Updated", {
        description: "Address has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
    },

    onError: (
      error: AxiosError<ApiResponse<{ errors?: { field: string; message: string }[] }>>,
    ) => {
      let description = error.response?.data?.message || "Failed to update address.";
      const validationErrors = error.response?.data?.data?.errors;
      
      if (validationErrors && Array.isArray(validationErrors) && validationErrors.length > 0) {
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

export const useDeleteAddress = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete<ApiResponse<null>>(
        `/user/addresses/${id}`,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Address Deleted", {
        description: "Address has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
    },

    onError: (error: AxiosError<ApiResponse<null>>) => {
      toast.error("Delete Failed", {
        description:
          error.response?.data?.message || "Failed to delete address.",
      });
    },
  });
};

