
import {z} from 'zod'
export const signupSchema =z.object({
    firstName: z.string().trim().min(2, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    phone: z.string().trim().min(10, "Phone number is required"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().trim().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().trim().min(6, "Confirm password must be at least 8 characters"),
}).refine((data)=>data.password===data.confirmPassword,{
    path:['confirmPassword'],
    message:"Passwords do not match",
})

export type SignupFormData = z.infer<typeof signupSchema>;