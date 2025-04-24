import { z } from 'zod';

// Login and signup validation schemas

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

export const signupSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    name: z.string().min(1, { message: 'Name is required' }),
});

export const refreshTokenSchema = z.object({
    token: z.string().min(1, { message: 'Token is required' }),
});