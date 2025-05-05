import { z } from 'zod';

// Validation rules

export const createProductSchema = z.object({
    name: z.string().min(1, { message: 'Product name is required' }),
    // Transform string to number for price
    price: z.preprocess(
        (val) => val === '' ? undefined : Number(val),
        z.number().positive({ message: 'Price must be a positive number' })
    ),
    description: z.string().min(1, { message: 'Description is required' }),
    // Transform string to number for stockQuantity
    stockQuantity: z.preprocess(
        (val) => val === '' ? undefined : Number(val),
        z.number().int().positive({ message: 'Stock quantity must be a positive integer' })
    ),
    inStock: z.boolean().default(true),
    categoryId: z.string().min(1, { message: 'Category ID is required' }),
    // Make productImages optional here since we'll add them after file upload
    productImages: z.array(z.string()).min(1).optional(),
});

export const updateProductSchema = z.object({
    name: z.string().min(1, { message: 'Product name is required' }).optional(),
    // Transform string to number for price
    price: z.preprocess(
        (val) => val === '' ? undefined : Number(val),
        z.number().positive({ message: 'Price must be a positive number' }).optional()
    ),
    description: z.string().optional(),
    // Transform string to number for stockQuantity
    stockQuantity: z.preprocess(
        (val) => val === '' ? undefined : Number(val),
        z.number().int().positive({ message: 'Stock quantity must be a positive integer' }).optional()
    ),
    categoryId: z.string().min(1, { message: 'Category ID is required' }).optional(),
    productImages: z.array(z.string()).optional(),
});