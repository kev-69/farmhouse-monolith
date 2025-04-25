import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const productService = {
    createProduct: async (data: any) => {
        return await prisma.product.create({ data });
    },

    getAllProducts: async () => {
        return await prisma.product.findMany();
    },

    getProduct: async (id: string) => {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    },

    updateProduct: async (id: string, data: any, shopId: string) => {
        // Only the shop that created the product can update it
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            throw new Error('Product not found');
        }

        // Verify ownership
        if (product.shopId !== shopId) {
            throw new Error('You don\'t have permission to update this product');
        }
        // Don't allow changing the shopId
        delete data.shopId;

        return await prisma.product.update({ 
            where: { id }, 
            data 
        });
    },

    deleteProduct: async (id: string, shopId: string) => {
        // Only the shop that created the product can delete it
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            throw new Error('Product not found');
        }

        // Verify ownership
        if (product.shopId !== shopId) {
            throw new Error('You don\'t have permission to delete this product');
        }

        return await prisma.product.delete({ where: { id } });
    },
};