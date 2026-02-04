import { z } from 'zod';

export const editProfileSchema = z.object({
    firstName: z.string().trim().min(2, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    phoneNumber: z.string().trim().min(10, "Phone number is required"),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
