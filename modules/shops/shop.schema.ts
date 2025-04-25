import { z } from 'zod';

export const updateShopSchema = z.object({
    name: z.string().optional(),
    ownerName: z.string().optional(),
    email: z.string().email({ message: 'Invalid email address' }).optional(),
    phoneNumber: z.string().optional(),
    location: z.string().optional(),
})