
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().trim().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
