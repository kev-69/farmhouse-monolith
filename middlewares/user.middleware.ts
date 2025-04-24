import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Extend Express Request interface to include 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const validateToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.error('No token provided');
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    try {
        console.log('Token:', token);
        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export default validateToken;