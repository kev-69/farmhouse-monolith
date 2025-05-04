import { Request, Response } from 'express';
import { wishlistService } from './wishlist.service';
import { AppError } from "../../utils/errors";
import { successResponse, errorResponse } from "../../utils/response";

interface AuthRequest extends Request {
  user?: {
    id: string;
    userId: string;
    role: string;
  };
}

export const wishlistController = {
  addToWishlist: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        res.status(401).json(errorResponse('Authentication required'));
        return;
      }

      const { productId } = req.body;
      await wishlistService.addToWishlist(req.user.userId, productId);
      
      res.status(200).json(successResponse('Product added to wishlist'));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else if (error instanceof Error) {
        res.status(400).json(errorResponse(error.message));
      } else {
        res.status(400).json(errorResponse('An unknown error occurred'));
      }
    }
  },

  removeFromWishlist: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        res.status(401).json(errorResponse('Authentication required'));
        return;
      }

      const { productId } = req.params;
      await wishlistService.removeFromWishlist(req.user.userId, productId);
      
      res.status(200).json(successResponse('Product removed from wishlist'));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else if (error instanceof Error) {
        res.status(400).json(errorResponse(error.message));
      } else {
        res.status(400).json(errorResponse('An unknown error occurred'));
      }
    }
  },

  getWishlist: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        res.status(401).json(errorResponse('Authentication required'));
        return;
      }

      const wishlist = await wishlistService.getWishlist(req.user.userId);
      
      res.status(200).json(successResponse('Wishlist retrieved successfully', wishlist));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else if (error instanceof Error) {
        res.status(400).json(errorResponse(error.message));
      } else {
        res.status(400).json(errorResponse('An unknown error occurred'));
      }
    }
  }
};