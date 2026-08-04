import { z } from "zod";

export const checkoutRequestSchema = z.object({
  planId: z.string().uuid("Select a valid plan."),
});
export type CheckoutRequestInput = z.infer<typeof checkoutRequestSchema>;
