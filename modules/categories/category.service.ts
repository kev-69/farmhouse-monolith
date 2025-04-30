import { prisma } from '../../shared/prisma';

export const categoryService = {
    createCategory: async (data: any) => {
        // Check if a category with the same name already exists globally
        const existingCategory = await prisma.category.findFirst({ 
            where: { name: data.name }
        });
        
        if (existingCategory) {
            throw new Error('A category with this name already exists');
        }
        
        return await prisma.category.create({ data });
    },

    getAllCategories: async () => {
        return await prisma.category.findMany();
    },

    getCategory: async (id: string) => {
        // Any shop can view any category
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    },

    updateCategory: async (id: string, data: any, shopId: string) => {
        // Only the shop that created the category can update it
        const category = await prisma.category.findUnique({
            where: { id }
        });
        
        if (!category) {
            throw new Error('Category not found');
        }
        
        // Verify ownership
        if (category.shopId !== shopId) {
            throw new Error('You don\'t have permission to update this category');
        }
        
        // Don't allow changing the shopId
        delete data.shopId;
        
        return await prisma.category.update({ 
            where: { id }, 
            data 
        });
    },

    deleteCategory: async (id: string, shopId: string) => {
        // Only the shop that created the category can delete it
        const category = await prisma.category.findUnique({
            where: { id }
        });
        
        if (!category) {
            throw new Error('Category not found');
        }
        
        // Verify ownership
        if (category.shopId !== shopId) {
            throw new Error('You don\'t have permission to delete this category');
        }
        
        // Check if any products from other shops are using this category
        const productsUsingCategory = await prisma.product.findFirst({
            where: {
                categoryId: id,
                NOT: {
                    shopId: shopId
                }
            }
        });
        
        if (productsUsingCategory) {
            throw new Error('Cannot delete this category as it\'s being used by other shops');
        }
        
        return await prisma.category.delete({ where: { id } });
    },
};