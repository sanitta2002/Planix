
import {z} from 'zod'
export const signupSchema =z.object({
    firstName: z.string().trim().min(2, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    phone: z.string().trim().min(10, "Phone number is required"),
    email: z.string().trim().email("Invalid email address"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string().trim().min(8, "Confirm password must be at least 8 characters"),
}).refine((data)=>data.password===data.confirmPassword,{
    path:['confirmPassword'],
    message:"Passwords do not match",
})

export type SignupFormData = z.infer<typeof signupSchema>;