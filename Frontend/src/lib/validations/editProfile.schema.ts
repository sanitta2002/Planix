import { z } from 'zod';

export const editProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required"),

  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
