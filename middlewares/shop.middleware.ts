import { Request, Response, NextFunction } from 'express';
import { prisma } from '../modules/categories/category.service'; // Reusing Prisma client
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]; 
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
      return
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
      return
    }
    res.status(500).json({ message: 'Internal server error' });
    return
  }
};

// Middleware to verify you are a shop owner
export const verifyShop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== 'SHOP') {
      res.status(403).json({ message: 'Only shops are allowed to perform this operation.' });
      return
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to verify ownership of a category
export const verifyCategoryOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.params.id;
    const shopId = req.user.shopId; // Assuming shop ID is added to the request after authentication

    const category = await prisma.category.findUnique({ where: { id: categoryId } });

    if (!category || category.shopId !== shopId) {
      res.status(403).json({ message: 'You do not have permission to modify this category.' });
      return
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to verify ownership of a product
export const verifyProductOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;
    const shopId = req.user.shopId; // Assuming shop ID is added to the request after authentication

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product || product.shopId !== shopId) {
      res.status(403).json({ message: 'You do not have permission to modify this product.' });
      return
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};