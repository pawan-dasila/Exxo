import { z } from "zod";

export const checkAvailabilitySchema = z.object({
  startDate: z.iso.datetime("Invalid start date format. Use ISO-8601 string."),
  endDate: z.iso.datetime("Invalid end date format. Use ISO-8601 string."),
});

export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
