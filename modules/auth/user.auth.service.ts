import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const authService = {
    login: async (email: string, password: string) => {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }
        
        const payload = {
            id: user.id,
            userId: user.id, // For backward compatibility
            role: user.role,
            isVerified: user.isVerified,
            type: 'USER'
        };
        
        return jwt.sign(
            payload, 
            process.env.JWT_SECRET as jwt.Secret, 
            { expiresIn: process.env.JWT_EXPIRATION || '24h' }
        );
    },

    signup: async (data: any) => {
        // Rest of code unchanged
    },

    refreshToken: async (token: string) => {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!);
            if (typeof payload === 'object' && payload !== null) {
                // Preserve all fields from the original payload
                return jwt.sign(
                    payload, 
                    process.env.JWT_SECRET as jwt.Secret, 
                    { expiresIn: process.env.JWT_EXPIRATION || '24h' }
                );
            }
            throw new Error('Invalid token payload');
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    },
};