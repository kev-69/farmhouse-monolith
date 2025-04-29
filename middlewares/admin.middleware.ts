import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    throw new AppError('Unauthorized: Admin access required', 403);
  }
  next();
};