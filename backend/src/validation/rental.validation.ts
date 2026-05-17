import { z } from "zod";

export const createRentalOrderSchema = z
  .object({
    productId: z.uuid(),
    startDate: z.coerce.date().refine((date) => date > new Date(), {
      message: "Start date must be in the future",
    }),
    endDate: z.coerce.date(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type CreateRentalOrderInput = z.infer<typeof createRentalOrderSchema>;
