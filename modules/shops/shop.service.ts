import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

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
    }
}