import { z } from 'zod';

export const updateUserSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }).optional(),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }).optional(),
    name: z.string().min(1, { message: 'Name is required' }).optional(),
});