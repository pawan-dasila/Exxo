import { useMutation } from "@tanstack/react-query";
import { useAxios } from "@/hooks/use-axios";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api-utils";
import { type ContactSubmissionFormValues } from "./types";

export const useSubmitContactForm = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async (values: ContactSubmissionFormValues) => {
      // Post to the backend contact/support endpoint
      const { data } = await axios.post("/support/contact", values);
      return data;
    },
    onSuccess: () => {
      toast.success("Message submitted successfully!", {
        description: "We will get back to you within 48 business hours.",
      });
    },
    onError: (error) => {
      handleApiError(error, "Failed to submit your message. Please try again.");
    },
  });
};
