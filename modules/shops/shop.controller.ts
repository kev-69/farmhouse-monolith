import { Request, Response } from 'express'
import { shopService } from './shop.service'
import { AppError } from "../../utils/errors";
import { successResponse, errorResponse } from "../../utils/response";

export const shopController = {
    getShop: async (req: Request, res: Response) => {
        try {
            const shop = await shopService.getShop(req.user.shopId);
            res.status(200).json(successResponse('Shop profile retrieved successfully',
                {data: shop}
            ))
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

    updateShop: async (req: Request, res: Response) => {
        try {
            const shop = await shopService.updateShop(req.user.shopId, req.body)
            res.status(200).json(successResponse('Shop profile updated successfully',
                {data: shop}))
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

    deleteShop: async (req: Request, res: Response) => {
        try {
            await shopService.deleteShop(req.user.shopId)
            res.status(200).json(successResponse('Shop profile deleted successfully'))
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    }
}