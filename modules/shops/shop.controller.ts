import { Request, Response } from 'express'
import { shopService } from './shop.service'
import { AppError } from "../../utils/errors";
import { successResponse, errorResponse } from "../../utils/response";

export const shopController = {
    getShop: async (req: Request, res: Response) => {
        try {
            const shop = await shopService.getShop(req.user.shopId);
            res.status(200).json(successResponse('Shop profile retrieved successfully',  shop))
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
            const shop = await shopService.updateShop(req.user.shopId, req.body, req.file);
            res.status(200).json(successResponse('Shop profile updated successfully', shop))
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

    getAllShops: async (req: Request, res: Response) => {
        try {
            const shops = await shopService.getAllShops()
            res.status(200).json(successResponse('Shops retrieved successfully', shops))
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

    getShopProducts: async (req: Request, res: Response) => {
        try {
            const shopId = req.params.shopId;
            const includeDeleted = req.query.includeDeleted === 'true';
            // console.log(`Getting shop products with includeDeleted=${includeDeleted}`); // Debug log
            const products = await shopService.getShopProducts(shopId, includeDeleted)
            res.status(200).json(successResponse('Shop products retrieved successfully',products))
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

    getShopById: async (req: Request, res: Response) => {
        try {
            const shopId = req.params.shopId;
            const shop = await shopService.getShopById(shopId)
            res.status(200).json(successResponse('Shop retrieved successfully', shop))
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

    getShopStats: async (req: Request, res: Response) => {
        try {
            const shopId = req.user.shopId;
            
            if (!shopId) {
                res.status(401).json(errorResponse('Authentication required'));
            return;
            }
            
            const stats = await shopService.getShopStats(shopId);
            
            res.status(200).json(successResponse('Shop statistics retrieved successfully', stats));
        } catch (error) {
            // console.error('Error retrieving shop statistics:', error);
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