import { prisma } from '../../shared/prisma';
import { uploadImage } from '../../config/cloudinary-config';

export const productService = {
    createProduct: async (data: any, files: Express.Multer.File[]) => {
        try {
            // Upload images to Cloudinary and get URLs
            const imageUrls = await Promise.all(
                files.map(file => uploadImage(file.path))
            );
            
            // Add image URLs to product data
            const productData = {
                ...data,
                productImages: imageUrls
            };
            
            // Create product with image URLs
            return await prisma.product.create({ data: productData });
        } catch (error) {
            // console.error('Error uploading images:', error);
            throw new Error('Failed to upload product images');
        }
    },

    getAllProducts: async () => {
        return await prisma.product.findMany({
            where: {
                isDeleted: false, // Only fetch non-deleted products
                inStock: true, // Only fetch products that are in stock
            },
            include: {
                shop: true,
                category: true,
            },
        });
    },

    getProduct: async (id: string) => {
        const product = await prisma.product.findUnique({ 
            where: { id },
            include: {
                shop: true,
                category: true,
            } 
        });
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    },

    updateProduct: async (id: string, data: any, shopId: string, files?: Express.Multer.File[]) => {
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
        
        // If new images are provided, upload them
        if (files && files.length > 0) {
            const imageUrls = await Promise.all(
                files.map(file => uploadImage(file.path))
            );
            data.productImages = imageUrls;
        }

        return await prisma.product.update({ 
            where: { id }, 
            data 
        });
    },

    deleteProduct: async (productId: string, shopId: string) => {
        // Only the shop that created the product can delete it
        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product) {
            throw new Error('Product not found');
        }

        // Verify ownership
        if (product.shopId !== shopId) {
            throw new Error('You don\'t have permission to delete this product');
        }

        return await prisma.product.update({ 
            where: { id: productId } ,
            data: {
                isDeleted: true, // Soft delete
                // set stock quantity to 0
                // stockQuantity: 0,
                inStock: false,
            }
        });
    },

    restoreProduct: async (productId: string, shopId: string) => {
        // Check if product exists and belongs to shop
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new Error('Product not found');
        }

        if (product.shopId !== shopId) {
            throw new Error('You don\'t have permission to restore this product');
        }

        // Restore the product
        return await prisma.product.update({
            where: { id: productId },
            data: { 
            isDeleted: false 
            },
            include: {
            category: true
            }
        });
    }
};