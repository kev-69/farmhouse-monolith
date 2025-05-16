import { prisma } from '../../shared/prisma';
import bcrytp from 'bcrypt';
import jwt from 'jsonwebtoken';
import emailService from '../../utils/send.email';

export const AdminService = {
    // login
    async loginAdmin (email: string, password: string) {
        const admin = await prisma.user.findUnique({ where: { email } });
        if (!admin) {
            throw new Error('Invalid credentials');
        }

        // check password
        const isPasswordValid = await bcrytp.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const payload = {
            id: admin.id,
            email: admin.email,
            role: admin.role,
            type: 'ADMIN',
        };

        return jwt.sign(
            payload, 
            process.env.JWT_SECRET as jwt.Secret, 
            { expiresIn: '1h' }
        );
    },

    async getUnapprovedShops() {
        const unapprovedShops = await prisma.shop.findMany({
            where: {
                isApproved: false,
            },
        });
        return unapprovedShops;
    },

    async approveShop(shopId: string) {
        const shop = await prisma.shop.update({
            where: { id: shopId },
            data: { isApproved: true },
        });

        // send approval email to shop
        await emailService.sendShopApprovalEmail(
            shop.email,
            shop.id,
            shop.name,
            shop.ownerName
        )

        return shop;
    },

    async rejectShop(shopId: string) {
        const shop = await prisma.shop.delete({
            where: { id: shopId },
        });

        // send rejected email
        // await emailServices ...
        return shop;
    },

    async getAllUsers() {
        const users = await prisma.user.findMany({
            where: {
                role: 'USER',
            },
        });
        return users;
    },

    async banShop(shopId: string) {
        const shop = await prisma.shop.update({
            where: { id: shopId },
            data: { isBanned: true },
        });
        return shop;
    },

    async unbanShop(shopId: string) {
        const shop = await prisma.shop.update({
            where: { id: shopId },
            data: { isBanned: false },
        });
        return shop;
    },
}