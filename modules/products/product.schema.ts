import { z } from 'zod';

// Validation rules

export const createProductSchema = z.object({
    name: z.string().min(1, { message: 'Product name is required' }),
    price: z.number().positive({ message: 'Price must be a positive number' }),
    description: z.string().min(1, { message: 'Description is required' }),
    categoryId: z.string().min(1, { message: 'Category ID is required' }),
    productImages: z.array(z.string()).min(1, { message: 'At least one image is required' }).optional(),
});

export const updateProductSchema = z.object({
    name: z.string().min(1, { message: 'Product name is required' }).optional(),
    price: z.number().positive({ message: 'Price must be a positive number' }).optional(),
    description: z.string().optional(),
    categoryId: z.string().min(1, { message: 'Category ID is required' }).optional(),
    productImages: z.array(z.string()).optional(),
});