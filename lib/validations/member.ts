import { z } from "zod";

// Empty-string handling: HTML inputs left blank submit `""`, not `null` —
// these fields are optional in the DB (nullable columns), so `""` is
// normalized to `undefined` and the action layer stores `null`.
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined));

export const updateProfileSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(120),
  phone: optionalText(20),
  date_of_birth: optionalText(10),
  gender: optionalText(30),
  address: optionalText(500),
  emergency_contact_name: optionalText(120),
  emergency_contact_phone: optionalText(20),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
