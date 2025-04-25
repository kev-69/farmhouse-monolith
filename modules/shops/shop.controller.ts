import { Request, Response } from 'express'
import { shopService } from './shop.service'

export const shopController = {
    getShop: async (req: Request, res: Response) => {
        try {
            const shop = await shopService.getShop(req.user.shopId);
            res.status(200).json({
                message: 'Shop profile retrieve successfully',
                data: shop
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    message: error.message
                })
            } else {
                res.status(400).json({
                    message: 'An unknown error occured'
                })
            }
        }
    },

    updateShop: async (req: Request, res: Response) => {
        try {
            const shop = await shopService.updateShop(req.user.shopId, req.body)
            res.status(200).json({
                message: 'Shop profile updated successfully',
                data: shop
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
        
    },

    deleteShop: async (req: Request, res: Response) => {
        try {
            await shopService.deleteShop(req.user.shopId)
            res.status(200).json({
                message: 'Shop deleted successfully'
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    }
}