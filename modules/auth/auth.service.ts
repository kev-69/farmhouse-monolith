// JWT signing/verification, credential checks, and user creation
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
        return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: parseInt(process.env.JWT_EXPIRATION!, 10) });
    },

    signup: async (data: any) => {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role: data.role || 'USER', // Default role is 'USER'
            },
        });
        return user;
    },

    refreshToken: async (token: string) => {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!);
            if (typeof payload === 'object' && payload !== null && 'id' in payload && 'role' in payload) {
                return jwt.sign({ id: payload.id, role: payload.role }, process.env.JWT_SECRET!, { expiresIn: parseInt(process.env.JWT_EXPIRATION!, 10) });
            }
            throw new Error('Invalid token payload');
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    },
};