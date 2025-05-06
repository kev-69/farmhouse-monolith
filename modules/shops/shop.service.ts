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

    deleteShop: async (id: string) => {
        return await prisma.shop.delete({ where: { id } })
    },

    getAllShops: async () => {
        const shops = await prisma.shop.findMany()
        return shops;
    },

    getShopProducts: async (shopId: string) => {
        const products = await prisma.product.findMany({ where: { shopId } })
        return products;
    },

    getShopById: async (id: string) => {
        const shop = await prisma.shop.findUnique({ where: { id } })
        return shop;
    },
}