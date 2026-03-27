import z from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name is too long"),
  key: z
    .string()
    .min(2, "Key must be at least 2 characters")
    .max(10, "Key is too long")
    .toUpperCase(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
});
export type ProjectFormData = z.infer<typeof projectSchema>;