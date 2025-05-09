import { z } from 'zod';

// Login and signup validation schemas

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

export const signupSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
});

export const refreshTokenSchema = z.object({
    token: z.string().min(1, { message: 'Token is required' }),
});

export const passwordResetRequestSchema = z.object({
    email: z.string().email('Invalid email format')
});

export const verifyResetCodeSchema = z.object({
    email: z.string().email('Invalid email format'),
    code: z.string().min(6).max(6, 'Code must be 6 characters')
});

export const setNewPasswordSchema = z.object({
    email: z.string().email('Invalid email format'),
    code: z.string().min(6).max(6, 'Code must be 6 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

export const resendVerificationSchema = z.object({
    email: z.string().email('Invalid email format')
});