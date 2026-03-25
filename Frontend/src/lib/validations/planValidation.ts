import { z } from "zod";

export const planSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Plan name must be at least 2 characters")
    .max(50, "Plan name too long"),

  price: z
    .number()
    .min(0, "Price must be positive")
    .max(100000, "Price too large"),

  maxMembers: z
    .number()
    .int("Must be whole number")
    .min(1, "Must be at least 1"),

  maxProjects: z
    .number()
    .int("Must be whole number")
    .min(1, "Must be at least 1"),

  storage: z
    .number()
    .min(1, "Storage must be at least 1GB")
    .optional(),

  features: z
    .array(z.string().min(1, "Feature cannot be empty"))
    .min(1, "At least one feature required")
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "Duplicate features not allowed",
    }),

  isActive: z.boolean(),
});