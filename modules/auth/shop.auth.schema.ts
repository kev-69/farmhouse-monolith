// Validation logic using Zod/Yup
import { z } from 'zod';

export const signupSchema = z.object({
    name: z.string().min(1, { message: 'Shop name is required'}),      
    ownerName: z.string().min(1, { message: 'Shop owner name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    location: z.string().min(1, { message: 'Shop location is required' }),
    description: z.string().min(1, { message: 'Shop description is required' }),
    phoneNumber: z.string().min(1, { message: 'Shop phone number is required' })
})

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
})

export const passwordResetRequestSchema = z.object({
    email: z.string().email({ message: 'Invalid email' })
})

export const verifyResetCodeSchema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    code: z.string().min(6, { message: 'Code must be 6 characters' })
})

export const setNewPasswordSchema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    code: z.string().min(6, { message: 'Code must be 6 characters' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
})

export const resendVerificationSchema = z.object({
    email: z.string().email({ message: 'Invalid email' })
})