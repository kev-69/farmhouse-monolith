// Handles cart operations
import { Request, Response } from 'express';
import { prisma } from '../../shared/prisma';
import { redisClient } from '../../config/redis-config';
import { AppError } from "../../utils/errors";
import { successResponse, errorResponse } from "../../utils/response";

// Extend Request to include user
interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        shopId?: string;
        verified?: boolean;
    };
}

export const cartController = {
    addToCart: async (req: AuthRequest, res: Response) => {
        try {
            // Check if user is authenticated
            if (!req.user?.id) {
                res.status(401).json(errorResponse('Authentication required'));
                return;
            }

            const { productId, quantity = 1 } = req.body;
            
            // Check if product exists and has enough stock
            const product = await prisma.product.findUnique({ where: { id: productId } });
            if (!product) {
                res.status(404).json(errorResponse('Product not found'));
                return;
            }

            if (product.stockQuantity < quantity) {
                res.status(400).json(errorResponse('Not enough stock available'));
                return;
            }

            // Get user's cart key
            const cartKey = `cart:${req.user.id}`;
            
            // Check if product is already in cart
            const currentQuantity = await redisClient.hGet(cartKey, productId);
            const newQuantity = currentQuantity ? parseInt(currentQuantity) + quantity : quantity;
            
            // Check if new quantity exceeds stock
            if (newQuantity > product.stockQuantity) {
                res.status(400).json(errorResponse('Cannot add more of this item (exceeds available stock)'));
                return;
            }

            // Add product to cart with updated quantity
            await redisClient.hSet(cartKey, productId, newQuantity.toString());
            
            // Set cart expiry (24 hours)
            await redisClient.expire(cartKey, 24 * 60 * 60);
            
            res.status(200).json(successResponse('Product added to cart', {
                productId, quantity: newQuantity})) 
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    updateCart: async (req: AuthRequest, res: Response) => {
        try {
            // Check if user is authenticated
            if (!req.user?.id) {
                res.status(401).json(errorResponse('Authentication required'));
                return;
            }

            const { productId } = req.params;
            const { quantity } = req.body;
            
            // Validate product
            const product = await prisma.product.findUnique({ where: { id: productId } });
            if (!product) {
                res.status(404).json(errorResponse('Product not found'));
                return;
            }
            
            // Check if product is in cart
            const cartKey = `cart:${req.user.id}`;
            const exists = await redisClient.hExists(cartKey, productId);
            if (!exists) {
                res.status(404).json(errorResponse('Product not found in cart'));
                return;
            }
            
            // Check stock
            if (quantity > product.stockQuantity) {
                res.status(400).json(errorResponse('Not enough stock available'));
                return;
            }
            
            // Update quantity
            await redisClient.hSet(cartKey, productId, quantity.toString());
            
            res.status(200).json(successResponse('Cart updated successfully', {
                productId, quantity }));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    removeFromCart: async (req: AuthRequest, res: Response) => {
        try {
            // Check if user is authenticated
            if (!req.user?.id) {
                res.status(401).json(errorResponse('Authentication required'));
                return;
            }

            const { productId } = req.params;
            const cartKey = `cart:${req.user.id}`;
            
            // Check if product exists in cart
            const exists = await redisClient.hExists(cartKey, productId);
            if (!exists) {
                res.status(404).json(errorResponse('Product not found in cart'));
                return;
            }
            
            // Remove product from cart
            await redisClient.hDel(cartKey, productId);
            
            res.status(200).json(errorResponse('Product removed from cart'));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getCart: async (req: AuthRequest, res: Response) => {
        try {
            // Check if user is authenticated
            if (!req.user?.id) {
                res.status(401).json(errorResponse('Authentication required'));
                return;
            }

            const cartKey = `cart:${req.user.id}`;
            
            // Get all items in cart
            const cartItems = await redisClient.hGetAll(cartKey);
            
            if (!cartItems || Object.keys(cartItems).length === 0) {
                res.status(200).json(successResponse('Cart is empty', { items: [], totalAmount: 0 }));
                return;
            }
            
            // Fetch product details for items in cart
            const products = await Promise.all(
                Object.keys(cartItems).map(async (productId) => {
                    const product = await prisma.product.findUnique({ 
                        where: { id: productId },
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            productImages: true,
                            stockQuantity: true,
                            shopId: true
                        }
                    });
                    
                    if (!product) {
                        return null;
                    }
                    
                    const quantity = parseInt(cartItems[productId]);
                    return {
                        ...product,
                        quantity,
                        subtotal: product.price * quantity
                    };
                })
            );
            
            // Filter out null values (products that may have been deleted since adding to cart)
            const validProducts = products.filter(p => p !== null);
            
            // Calculate total amount
            const totalAmount = validProducts.reduce((sum, product) => 
                sum + (product?.subtotal || 0), 0);
            
            res.status(200).json(successResponse('Cart retrieved successfully', { 
                items: validProducts,
                totalAmount
            }));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },
    
    clearCart: async (req: AuthRequest, res: Response) => {
        try {
            // Check if user is authenticated
            if (!req.user?.id) {
                res.status(401).json(errorResponse('Authentication required'));
                return;
            }

            const cartKey = `cart:${req.user.id}`;
            
            // Delete the entire cart
            await redisClient.del(cartKey);
            
            res.status(200).json(successResponse('Cart cleared successfully'));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    checkout: async (req: AuthRequest, res: Response) => {
        try {
            // Check if user is authenticated
            if (!req.user?.id) {
                res.status(401).json(errorResponse('Authentication required'));
                return;
            }

            const userId = req.user.id;
            const cartKey = `cart:${userId}`;
            
            // Get cart items
            const cartItems = await redisClient.hGetAll(cartKey);
            
            if (!cartItems || Object.keys(cartItems).length === 0) {
                res.status(400).json(errorResponse('Your cart is empty'));
                return;
            }
            
            const { paymentMethod } = req.body;
            
            // Fetch product details and validate stock
            const orderItems = await Promise.all(
                Object.keys(cartItems).map(async (productId) => {
                    const quantity = parseInt(cartItems[productId]);
                    
                    const product = await prisma.product.findUnique({ 
                        where: { id: productId } 
                    });
                    
                    if (!product) {
                        throw new Error(`Product with ID ${productId} not found`);
                    }
                    
                    if (product.stockQuantity < quantity) {
                        throw new Error(`Not enough stock for ${product.name}`);
                    }
                    
                    return {
                        productId,
                        quantity,
                        price: product.price,
                        subtotal: product.price * quantity
                    };
                })
            );
            
            // Calculate total amount
            const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
            
            // Create order transaction
            const order = await prisma.$transaction(async (prismaClient) => {
                // Create the order
                const newOrder = await prismaClient.order.create({
                    data: {
                        userId,
                        totalAmount,
                        orderStatus: 'PROCESSING',
                        orderItems: {
                            create: orderItems.map(item => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                price: item.price
                            }))
                        },
                        products: {
                            connect: orderItems.map(item => ({
                                id: item.productId
                            }))
                        }
                    },
                    include: {
                        orderItems: true
                    }
                });
                
                // Create payment record
                await prismaClient.payment.create({
                    data: {
                        orderId: newOrder.id,
                        amount: totalAmount,
                        method: paymentMethod,
                        status: 'PENDING'
                    }
                });
                
                // Update product stock
                for (const item of orderItems) {
                    await prismaClient.product.update({
                        where: { id: item.productId },
                        data: {
                            stockQuantity: {
                                decrement: item.quantity
                            }
                        }
                    });
                }
                
                return newOrder;
            });
            
            // Clear the cart after successful checkout
            await redisClient.del(cartKey);
            
            res.status(201).json(successResponse('Order placed successfully', {
                order: {
                    id: order.id,
                    totalAmount: order.totalAmount,
                    orderStatus: order.orderStatus,
                    orderItems: order.orderItems
                }
            }));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    }
};