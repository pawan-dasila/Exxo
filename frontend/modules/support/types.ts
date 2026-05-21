import { z } from "zod";

export const contactSubmissionSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().optional().nullable(),
  subject: z.string().min(1, "Subject is required"),
  order_id: z.string().optional().nullable(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactSubmissionFormValues = z.infer<typeof contactSubmissionSchema>;
