import { prisma } from '../../shared/prisma';

export const shopService = {
    getShop: async (id: string) => {
        const shop = await prisma.shop.findUnique({ where: { id } })

        if (!shop) {
            throw new Error('Shop not found')
        }

        return shop;
    },

    updateShop: async (id: string, data: any) => {
        return await prisma.shop.update({ where: { id }, data })
    },

    getAllShops: async () => {
        const shops = await prisma.shop.findMany({
            where: {
                isVerified: true,
                isBanned: false,
                isApproved: true
            },
            include: {
                products: true,
            },
    })
    return shops;
    },

    getShopProducts: async (shopId: string) => {
        const products = await prisma.product.findMany({ 
            where: { shopId },
            include: {
                shop: true,
                category: true,
            } 
        })
        return products;
    },

    getShopById: async (id: string) => {
        const shop = await prisma.shop.findUnique({ where: { id } })
        return shop;
    },
}