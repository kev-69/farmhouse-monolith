import { prisma } from '../../shared/prisma';

export const wishlistService = {
  addToWishlist: async (userId: string, productId: string) => {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Add to wishlist (or do nothing if it already exists)
    return await prisma.wishlist.upsert({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      update: {}, // No updates needed
      create: {
        userId,
        productId
      }
    });
  },

  removeFromWishlist: async (userId: string, productId: string) => {
    // Check if wishlist item exists
    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (!wishlistItem) {
      throw new Error('Item not found in wishlist');
    }

    // Remove from wishlist
    return await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });
  },

  getWishlist: async (userId: string) => {
    // Get wishlist with product details
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            productImages: true,
            stockQuantity: true,
            shopId: true,
            // include shop and category if needed
            shop: {
              select: {
                id: true,
                name: true
              }
            },
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return wishlistItems;
  }
};