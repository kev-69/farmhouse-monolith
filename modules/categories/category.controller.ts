// Handles CRUD routes for categories

import { Request, Response } from 'express';
import { categoryService } from './category.service';

export const categoryController = {
    createCategory: async (req: Request, res: Response) => {
        try {
            const category = await categoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getAllCategories: async (req: Request, res: Response) => {
        try {
            const categories = await categoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getCategory: async (req: Request, res: Response) => {
        try {
            const category = await categoryService.getCategory(req.params.id);
            res.status(200).json(category);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    updateCategory: async (req: Request, res: Response) => {
        try {
            const category = await categoryService.updateCategory(req.params.id, req.body);
            res.status(200).json(category);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    deleteCategory: async (req: Request, res: Response) => {
        try {
            await categoryService.deleteCategory(req.params.id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },
};