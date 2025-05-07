import { prisma } from '../../shared/prisma';
import { v4 as uuidv4 } from 'uuid';

export const cartService = {
  getOrCreateCart: async (userId?: string, sessionId?: string) => {
    if (!userId && !sessionId) {
      // Generate a new session ID if neither user nor session exists
      sessionId = uuidv4();
      
      // Create a new cart
      const newCart = await prisma.cart.create({
        data: {
          sessionId
        }
      });
      
      return { cart: newCart, sessionId, isNew: true };
    }
    
    // Find existing cart
    let cart;
    if (userId) {
      cart = await prisma.cart.findFirst({
        where: { userId }
      });
    } else if (sessionId) {
      cart = await prisma.cart.findUnique({
        where: { sessionId }
      });
    }
    
    // If cart exists, return it
    if (cart) {
      return { cart, sessionId, isNew: false };
    }
    
    // Create a new cart
    const newCart = await prisma.cart.create({
      data: {
        userId,
        sessionId
      }
    });
    
    return { cart: newCart, sessionId, isNew: true };
  },
  
  addToCart: async (cartId: string, productId: string, quantity: number) => {
    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    if (product.stockQuantity < quantity) {
      throw new Error('Not enough stock available');
    }
    
    // Check if item is already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId
        }
      }
    });
    
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      // Check if new quantity exceeds stock
      if (newQuantity > product.stockQuantity) {
        throw new Error('Cannot add more of this item (exceeds available stock)');
      }
      
      // Update cart item
      return await prisma.cartItem.update({
        where: {
          cartId_productId: {
            cartId,
            productId
          }
        },
        data: {
          quantity: newQuantity
        }
      });
    }
    
    // Add new item to cart
    return await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity
      }
    });
  },
  
  updateCartItem: async (cartId: string, productId: string, quantity: number) => {
    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    if (product.stockQuantity < quantity) {
      throw new Error('Not enough stock available');
    }
    
    // Check if item is in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId
        }
      }
    });
    
    if (!existingItem) {
      throw new Error('Product not found in cart');
    }
    
    // Update cart item
    return await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId,
          productId
        }
      },
      data: {
        quantity
      }
    });
  },
  
  removeFromCart: async (cartId: string, productId: string) => {
    // Check if item is in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId
        }
      }
    });
    
    if (!existingItem) {
      throw new Error('Product not found in cart');
    }
    
    // Remove item from cart
    return await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId,
          productId
        }
      }
    });
  },
  
  getCart: async (cartId: string) => {
    // Get cart with items
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                productImages: true,
                stockQuantity: true,
                shopId: false,
                shop: {
                  select: {
                    id: true,
                    name: true
                  }
                },
              }
            }
          }
        }
      }
    });
    
    if (!cart) {
      throw new Error('Cart not found');
    }
    
    // Calculate total amount
    const totalAmount = cart.items.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0);
    
    // Format cart items with subtotal
    const formattedItems = cart.items.map(item => ({
      ...item,
      product: item.product,
      subtotal: item.product.price * item.quantity
    }));
    
    return {
      id: cart.id,
      items: formattedItems,
      totalAmount
    };
  },
  
  clearCart: async (cartId: string) => {
    // Delete all cart items
    await prisma.cartItem.deleteMany({
      where: { cartId }
    });
    
    return { success: true };
  },

  // Clean up old carts (to be called by a scheduled job)
  cleanupOldCarts: async (daysOld: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    // Find old carts
    const oldCarts = await prisma.cart.findMany({
      where: {
        updatedAt: {
          lt: cutoffDate
        }
      },
      select: {
        id: true
      }
    });
    
    // Delete all cart items and carts
    const cartIds = oldCarts.map(cart => cart.id);
    
    if (cartIds.length > 0) {
      // Delete in a transaction
      await prisma.$transaction([
        prisma.cartItem.deleteMany({
          where: { 
            cartId: { 
              in: cartIds 
            } 
          }
        }),
        prisma.cart.deleteMany({
          where: { 
            id: { 
              in: cartIds 
            } 
          }
        })
      ]);
      
      return { 
        success: true, 
        deleted: cartIds.length 
      };
    }
    
    return { 
      success: true, 
      deleted: 0 
    };
  }
};