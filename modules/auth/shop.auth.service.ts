import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient();

export const authService = {
    signup: async (data: any) => {
        const existingShop = await prisma.shop.findUnique({ where: { name: data.name } })

        if(existingShop) {
            throw new Error('A shop already exist with this name')
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)
        const shop = await prisma.shop.create({
            data: {
                name: data.name,        
                ownerName: data.ownerName,
                email: data.email,
                password: hashedPassword,
                location: data.location,
                phoneNumber: data.phoneNumber,
                role: 'SHOP',
                isVerified: false
            }
        })
        return shop;
    }, 

    login: async (email: string, password: string) => {
        const shop = await prisma.shop.findUnique({ where: { email } });

        if (!shop || !(await bcrypt.compare(password, shop.password))) {
            throw new Error('Invalid credentials')
        }

        const payload = {
            id: shop.id,
            shopId: shop.id, // For backward compatibility
            role: shop.role,
            isVerified: shop.isVerified,
            type: 'SHOP'
        };

        return jwt.sign(
            payload, 
            process.env.JWT_SECRET as jwt.Secret, 
            { expiresIn: '24h' }
        );
    }
}