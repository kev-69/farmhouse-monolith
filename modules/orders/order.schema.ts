// Validation rules
import { z } from 'zod';

export const createOrderSchema = z.object({
    userId: z.string().min(1, { message: 'User ID is required' }),
    productIds: z.array(z.string().min(1, { message: 'Product ID is required' })),
    totalAmount: z.number().positive({ message: 'Total amount must be a positive number' }),
    status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']),
});

export const shipOrderSchema = z.object({
    trackingNumber: z.string().optional(),
    carrier: z.string().optional(),
});

export const cancelOrderSchema = z.object({
    reason: z.string().min(1, { message: 'Cancellation reason is required' }),
});