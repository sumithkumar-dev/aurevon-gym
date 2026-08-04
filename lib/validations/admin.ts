import { z } from "zod";

export const memberStatusSchema = z.object({
  status: z.enum(["active", "inactive"]),
});
export type MemberStatusInput = z.infer<typeof memberStatusSchema>;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => value ?? "");

export const planSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  name: z.string().trim().min(1, "Name is required").max(80),
  description: optionalText(500),
  price_rupees: z.coerce
    .number()
    .int("Price must be a whole number of rupees")
    .positive("Price must be greater than 0"),
  duration_days: z.coerce
    .number()
    .int("Duration must be a whole number of days")
    .positive("Duration must be at least 1 day"),
  features: optionalText(2000),
  is_active: z.coerce.boolean(),
  is_featured: z.coerce.boolean(),
  sort_order: z.coerce.number().int("Sort order must be a whole number"),
});
export type PlanInput = z.infer<typeof planSchema>;

export const recordPaymentSchema = z.object({
  memberId: z.string().uuid("Select a member"),
  planId: z.string().uuid("Select a plan"),
  notes: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
});
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
