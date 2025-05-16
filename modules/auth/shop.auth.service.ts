import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { prisma } from '../../shared/prisma'
import emailService from '../../utils/send.email'

export const authService = {
    signup: async (data: any) => {
        const existingShopByName = await prisma.shop.findUnique({ where: { name: data.name } })
        const existingShopByEmail = await prisma.shop.findUnique({ where: { email: data.email } })
        const existingShop = existingShopByName || existingShopByEmail

        if(existingShop) {
            throw new Error('A shop already exist with this name or email')
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)
        const shop = await prisma.shop.create({
            data: {
                name: data.name,        
                ownerName: data.ownerName,
                email: data.email,
                password: hashedPassword,
                location: data.location,
                description: data.description,
                phoneNumber: data.phoneNumber,
                role: 'SHOP',
                isVerified: false,
                isApproved: false,
                isBanned: false,
            }
        })

        // send verification email
        await emailService.sendShopVerificationEmail(
            shop.email,
            shop.id,
            shop.name,
            shop.ownerName
        )

        return shop;
    }, 

    login: async (email: string, password: string) => {
        const shop = await prisma.shop.findUnique({ where: { email } });

        if (!shop) {
            throw new Error('Invalid credentials')
        }

        // check password
        const isPasswordValid = await bcrypt.compare(password, shop.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials')
        }

        // Check if shop is banned
        if (shop.isBanned) {
            throw new Error('Your shop account has been suspended. Please contact support for assistance.');
        }

        // Check if email is verified
        if (!shop.isVerified) {
            throw new Error('Please verify your email before logging in. Check your inbox for a verification link or request a new one.');
        }

        // Check if shop is approved
        if (!shop.isApproved) {
            throw new Error('Your shop is pending approval from our admin team. You will be notified via email once approved.');
        }

        const payload = {
            id: shop.id,
            shopId: shop.id, // For backward compatibility
            role: shop.role,
            verified: shop.isVerified,
            type: 'SHOP'
        };

        return jwt.sign(
            payload, 
            process.env.JWT_SECRET as jwt.Secret, 
            { expiresIn: '24h' }
        );
    },

    resetPassword: async (email: string) => {
        const shop = await prisma.shop.findUnique({ where: { email } });
        if (!shop) {
            throw new Error('Shop not found');
        }

        // Logic to send password reset email
        await emailService.sendShopPasswordReset(shop.email);
    },

    verifyCode: async (email: string, code: string) => {
        const success = await emailService.verifyPasswordResetCode(email, code);
        if (!success) {
            throw new Error('Invalid or expired verification code')
        }

        return { success }
    },

    setNewPassword: async (email: string, code: string, password: string) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const success = await emailService.resetShopPassword(email, code, hashedPassword);

        if (!success) {
            throw new Error('Failed to reset new password')
        }
    },

    verifyEmail: async (token: string) => {
        const success = await emailService.verifyShopAccount(token);
        if (!success) {
            throw new Error('Failed to verify email')
        }
        return { success }
    },
    
    resendVerificationEmail: async (email: string) => {
        const success = await emailService.resendShopVerificationEmail(email);
        if (!success) {
            throw new Error('Failed to resend verification email')
        }
        return { success }
    },
}