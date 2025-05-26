import { prisma } from '../../shared/prisma';
import { uploadImage } from '../../config/cloudinary-config';
import fs from 'fs';
import path from 'path';

export const shopService = {
    getShop: async (id: string) => {
        const shop = await prisma.shop.findUnique({ where: { id } })

        if (!shop) {
            throw new Error('Shop not found')
        }

        return shop;
    },

    updateShop: async (shopId: string, data: any, file?: Express.Multer.File) => {
        // Check if shop exists
        const shop = await prisma.shop.findUnique({ where: { id: shopId } });
        if (!shop) {
            throw new Error('Shop not found');
        }
        
        let profileImageUrl = shop.profileImage;
        
        // Handle file upload if there's a profile image
        if (file) {
            try {
                // Upload to your storage service (Cloudinary, S3, etc.)
                const tempFilePath = path.join(__dirname, '../../uploads', file.filename);
                // upload the image to Cloudinary
                profileImageUrl = await uploadImage(tempFilePath);
            } catch (error) {
                console.error('Failed to upload shop logo:', error);
                throw new Error('Failed to upload shop logo');
            }
        }
        
        // Update shop with new data
        const updatedShop = await prisma.shop.update({
            where: { id: shopId },
            data: {
            name: data.name,
            ownerName: data.ownerName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            location: data.location,
            description: data.description,
            profileImage: profileImageUrl, // Set the URL from upload
            },
        });
        
        return updatedShop;
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

    getShopProducts: async (shopId: string, includeDeleted = false) => {
        console.log(`Service: Getting products for shop ${shopId} with includeDeleted=${includeDeleted}`);
  
        const whereClause = {
            shopId,
            ...(includeDeleted ? {} : { isDeleted: false })
        };
        
        console.log('Where clause:', whereClause);
        const products = await prisma.product.findMany({ 
            where: whereClause,
            include: {
                shop: true,
                category: true,
            },
            orderBy: {
                createdAt: 'desc', // Order by creation date
            }, 
        })
        console.log(`Found ${products.length} products`);
        return products;
    },

    getShopById: async (id: string) => {
        const shop = await prisma.shop.findUnique({ where: { id } })
        return shop;
    },
}