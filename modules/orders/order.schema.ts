import { z } from 'zod';

export const createOrderSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required' }),
  productIds: z.array(z.string().min(1, { message: 'Product ID is required' })),
  totalAmount: z.number().positive({ message: 'Total amount must be a positive number' }),
  shippingAddress: z.record(z.any()).optional(),
});

export const updateOrderItemStatusSchema = z.object({
  status: z.enum(['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  trackingNumber: z.string().optional(),
  carrierName: z.string().optional(),
  notes: z.string().optional(),
});

export const cancelOrderItemSchema = z.object({
  reason: z.string().min(1, { message: 'Cancellation reason is required' }),
});