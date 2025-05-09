import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../../shared/prisma';
import emailService from '../../utils/send.email';

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
            { expiresIn: '24h' }
        );
    },

    signup: async (data: any) => {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

        if (existingUser) {
            throw new Error('A user already exists with this email');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                role: 'USER',
                isVerified: false
            }
        });

        // send verification email
        const fullName = `${user.firstName} ${user.lastName}`;
        await emailService.sendVerificationEmail(
            user.email,
            user.id,
            fullName
        );

        return user;
    },

    resetPassword: async (email: string) => {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }

        // Send password reset code via email
        const success = await emailService.sendPasswordResetCode(email);
        if (!success) {
            throw new Error('Failed to send password reset code');
        }

        return { success };
    },

    verifyCode: async (email: string, code: string) => {
        const success = await emailService.verifyPasswordResetCode(email, code);
        if (!success) {
            throw new Error('Invalid or expired verification code');
        }
        return { success };
    },

    setNewPassword: async (email: string, code: string, password: string) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const success = await emailService.resetPassword(email, code, hashedPassword);

        if (!success) {
            throw new Error('Failed to reset new password');
        }

        return { success };
    },

    verifyEmail: async (token: string) => {
        const success = await emailService.verifyAccount(token);
        if (!success) {
            throw new Error('Invalid or expired verification token');
        }
        return { success };
    },
    
    resendVerificationEmail: async (email: string) => {
        const success = await emailService.resendVerificationEmail(email);
        if (!success) {
            throw new Error('Failed to resend verification email');
        }
        return { success };
    },

    refreshToken: async (token: string) => {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!);
            if (typeof payload === 'object' && payload !== null) {
                // Preserve all fields from the original payload
                return jwt.sign(
                    payload, 
                    process.env.JWT_SECRET as jwt.Secret, 
                    { expiresIn: '24h' }
                );
            }
            throw new Error('Invalid token payload');
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    },
};