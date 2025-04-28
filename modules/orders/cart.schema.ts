import { z } from 'zod';

export const addToCartSchema = z.object({
    productId: z.string().min(1, { message: 'Product ID is required' }),
    quantity: z.preprocess(
        (val) => val === '' ? undefined : Number(val),
        z.number().int().positive({ message: 'Quantity must be a positive integer' }).default(1)
    )
});

export const updateCartSchema = z.object({
    quantity: z.preprocess(
        (val) => val === '' ? undefined : Number(val),
        z.number().int().positive({ message: 'Quantity must be a positive integer' })
    )
});

export const checkoutSchema = z.object({
    paymentMethod: z.enum(['CREDIT_CARD', 'MOMO']),
});