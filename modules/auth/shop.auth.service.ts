import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { prisma } from '../../shared/prisma'

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
                isApproved: false
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
            verified: shop.isVerified,
            type: 'SHOP'
        };

        return jwt.sign(
            payload, 
            process.env.JWT_SECRET as jwt.Secret, 
            { expiresIn: '24h' }
        );
    }
}