import { z } from "zod";

export const inspectionSchema = z.object({
  type: z.enum(["PRE_RENTAL", "POST_RENTAL"]),
  images: z.array(z.url()).min(1, "At least one inspection photo is required"),
});

export const damageReportSchema = z.object({
  description: z
    .string()
    .min(10, "Please provide a detailed description of the damage"),
  images: z.array(z.url()).min(1, "At least one photo proof is required"),
  estimatedCost: z
    .number()
    .positive("Estimated repair cost must be a positive number")
    .optional(),
});

export const disputeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  description: z
    .string()
    .min(15, "Description must be at least 15 characters long"),
});

export type InspectionInput = z.infer<typeof inspectionSchema>;
export type DamageReportInput = z.infer<typeof damageReportSchema>;
export type DisputeInput = z.infer<typeof disputeSchema>;
