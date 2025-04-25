// Validation rules
import { z } from 'zod';

export const createPaymentSchema = z.object({
    orderId: z.string().min(1, { message: 'Order ID is required' }),
    amount: z.number().positive({ message: 'Amount must be a positive number' }),
    method: z.enum(['CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER']),
    status: z.enum(['PENDING', 'COMPLETED', 'FAILED']),
});

export const updatePaymentSchema = z.object({
    status: z.enum(['PENDING', 'COMPLETED', 'FAILED']).optional(),
});