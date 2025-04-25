import { z } from 'zod';

// Validation rules

export const createCategorySchema = z.object({
    name: z.string().min(1, { message: 'Category name is required' }),
    description: z.string().optional(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1, { message: 'Category name is required' }).optional(),
    description: z.string().optional(),
});