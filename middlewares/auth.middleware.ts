import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface to include 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authMiddlewares = {
    sanitizeInput: (req: Request, res: Response, next: NextFunction) => {
        const sanitize = (value: any): any => {
            if (typeof value === 'string') {
                return value
                    .replace(/<script.*?>.*?<\/script>/gi, '') // remove script tags
                    .replace(/javascript:/gi, ''); // remove javascript: protocol
            }
            return value;
        };

        const sanitizeObject = (obj: any) => {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitizeObject(obj[key]); // recursive call for nested objects
                } else {
                    obj[key] = sanitize(obj[key]);
                }
            }
        };

        if (req.body) sanitizeObject(req.body);
        if (req.query) sanitizeObject(req.query);
        if (req.params) sanitizeObject(req.params);

        next();
    },

    validateEmail: (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        next();
    },

    validatePassword: (req: Request, res: Response, next: NextFunction) => {
        const { password } = req.body;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
            });
        }
        next();
    },
};