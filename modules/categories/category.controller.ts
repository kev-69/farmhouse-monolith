// Handles CRUD routes for categories
import { Request, Response } from 'express';
import { categoryService } from './category.service';
import { AppError } from "../../utils/errors";
import { successResponse, errorResponse } from "../../utils/response";

// Define interface to extend Express Request
interface AuthRequest extends Request {
    user?: {
        id: string;
        shopId: string;
        role: string;
        verified: boolean;
    }
}

export const categoryController = {
    createCategory: async (req: AuthRequest, res: Response) => {
        try {
            // Include shopId from authenticated shop
            const categoryData = { 
                ...req.body, 
                shopId: req.user?.shopId 
            };

            // check if shop is verified before approving to create category
            if (!req.user?.verified) {
                res.status(403).json({ message: 'Only verified shop accounts can add a category' });
            }

            const category = await categoryService.createCategory(categoryData);

            res.status(201).json(successResponse('New category created successfully', category));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getAllCategories: async (req: Request, res: Response) => {
        try {
            const categories = await categoryService.getAllCategories();

            res.status(200).json(successResponse('Categories retrieved successfully', categories));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getCategory: async (req: Request, res: Response) => {
        try {
            const category = await categoryService.getCategory(req.params.id);

            res.status(200).json(successResponse('Category retrieved successfully', category));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    updateCategory: async (req: AuthRequest, res: Response) => {
        try {
            const category = await categoryService.updateCategory(
                req.params.id, 
                req.body, 
                req.user?.shopId || ''
            );

            res.status(200).json(successResponse('Category updated successfully', category));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    deleteCategory: async (req: AuthRequest, res: Response) => {
        try {
            await categoryService.deleteCategory(
                req.params.id, 
                req.user?.shopId || ''
            );

            res.status(204).json(successResponse('Category deleted successfully'));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },
};