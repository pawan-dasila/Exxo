import { z } from "zod";

export const extensionRequestSchema = z.object({
  newEndDate: z.iso.datetime("Invalid date format. Use ISO-8601 string."),
});

export const extensionResponseSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export type ExtensionRequestInput = z.infer<typeof extensionRequestSchema>;
export type ExtensionResponseInput = z.infer<typeof extensionResponseSchema>;
