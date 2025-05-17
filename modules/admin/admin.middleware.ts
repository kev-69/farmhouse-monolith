import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/errors';
import dotenv from 'dotenv';
dotenv.config();

export const validateToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    } catch (err) {
        // console.error('Token verification failed:', err);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== 'ADMIN' || req.user?.type !== 'ADMIN') {
    console.error('Unauthorized access attempt:', req.user);
    throw new AppError('Unauthorized: Admin access required', 403);
  }
  next();
};