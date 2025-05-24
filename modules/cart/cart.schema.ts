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
  shippingAddress: z.object({
    fullName: z.string().min(1, "Full name is required"),
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State/Region is required"),
    zipCode: z.string().optional(),
    country: z.string().optional().default("Ghana"),
    phone: z.string().min(10, "Valid phone number is required")
  })
});