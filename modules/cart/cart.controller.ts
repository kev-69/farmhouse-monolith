import { Request, Response } from 'express';
import { cartService } from './cart.service';
import { AppError } from "../../utils/errors";
import { successResponse, errorResponse } from "../../utils/response";
import { prisma } from '../../shared/prisma';
import emailService from '../../utils/send.email';
import { orderService } from '../orders/order.service';
import logger from '../../utils/logger';

// Extend Request to include user
interface AuthRequest extends Request {
  user?: {
    id: string;
    userId: string;
    role: string;
    verified?: boolean;
  };
}

interface CartItem {
    productId: string;
    quantity: number;
    product: {
      price: number;
      // Add other product properties you need
    };
  }

export const cartController = {
  addToCart: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const sessionId = req.cookies?.cartSessionId as string;
      const { productId, quantity = 1 } = req.body;
      
      // Get or create cart
      const { cart, sessionId: newSessionId } = await cartService.getOrCreateCart(userId, sessionId);
      
      // Set session cookie if new
      if (!sessionId) {
        res.cookie('cartSessionId', newSessionId, { 
          httpOnly: true, 
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
      }
      
      // Add item to cart
      await cartService.addToCart(cart.id, productId, quantity);
      
      // Refresh cart data
      const updatedCart = await cartService.getCart(cart.id);
      
      res.status(200).json(successResponse('Product added to cart', updatedCart));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else if (error instanceof Error) {
        res.status(400).json(errorResponse(error.message));
      } else {
        res.status(400).json(errorResponse('An unknown error occurred'));
      }
    }
  },

  updateCart: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const sessionId = req.cookies?.cartSessionId as string;
      const { productId } = req.params;
      const { quantity } = req.body;
      
      // Get cart
      const { cart } = await cartService.getOrCreateCart(userId, sessionId);
      
      // Update cart item
      await cartService.updateCartItem(cart.id, productId, quantity);
      
      // Refresh cart data
      const updatedCart = await cartService.getCart(cart.id);
      
      res.status(200).json(successResponse('Cart updated successfully', updatedCart));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else if (error instanceof Error) {
        res.status(400).json(errorResponse(error.message));
      } else {
        res.status(400).json(errorResponse('An unknown error occurred'));
      }
    }
  },

  removeFromCart: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const sessionId = req.cookies?.cartSessionId as string;
      const { productId } = req.params;
      
      // Get cart
      const { cart } = await cartService.getOrCreateCart(userId, sessionId);
      
      // Remove item from cart
      await cartService.removeFromCart(cart.id, productId);
      
      // Refresh cart data
      const updatedCart = await cartService.getCart(cart.id);
      
      res.status(200).json(successResponse('Product removed from cart', updatedCart));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else if (error instanceof Error) {
        res.status(400).json(errorResponse(error.message));
      } else {
        res.status(400).json(errorResponse('An unknown error occurred'));
      }
    }
  },

  getCart: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const sessionId = req.cookies?.cartSessionId as string;
      
      if (!userId && !sessionId) {
        // No cart exists yet
        res.status(200).json(successResponse('Cart is empty', { items: [], totalAmount: 0 }));
        return;
      }
      
      // Get cart
      const { cart } = await cartService.getOrCreateCart(userId, sessionId);
      
      // Get cart with items
      const cartData = await cartService.getCart(cart.id);
      
      res.status(200).json(successResponse('Cart retrieved successfully', cartData));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else if (error instanceof Error) {
        res.status(400).json(errorResponse(error.message));
      } else {
        res.status(400).json(errorResponse('An unknown error occurred'));
      }
    }
  },
  
  clearCart: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const sessionId = req.cookies?.cartSessionId as string;
      
      // Get cart
      const { cart } = await cartService.getOrCreateCart(userId, sessionId);
      
      // Clear cart
      await cartService.clearCart(cart.id);
      
      res.status(200).json(successResponse('Cart cleared successfully'));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else if (error instanceof Error) {
        res.status(400).json(errorResponse(error.message));
      } else {
        res.status(400).json(errorResponse('An unknown error occurred'));
      }
    }
  },

  checkout: async (req: AuthRequest, res: Response) => {
    try {
      // console.log("Checkout request body:", req.body);
      logger.info("Checkout request body:", req.body);
      // Check if user is authenticated
      if (!req.user?.userId) {
        res.status(401).json(errorResponse('Authentication required for checkout'));
        return;
      }

      const userId = req.user.userId;
      const sessionId = req.cookies?.cartSessionId as string;
      
      // Get cart with items
      const { cart } = await cartService.getOrCreateCart(userId, sessionId);
      const cartData = await cartService.getCart(cart.id);
      
      if (cartData.items.length === 0) {
        res.status(400).json(errorResponse('Your cart is empty'));
        return;
      }
      
      const { paymentMethod } = req.body;
      
      // Begin transaction for checkout process
      const order = await prisma.$transaction(async (prismaClient) => {
        // Format shipping address for storage
        const formattedShippingAddress = {
          fullName: req.body.shippingAddress.fullName,
          street: req.body.shippingAddress.street,
          city: req.body.shippingAddress.city,
          state: req.body.shippingAddress.state,
          zipCode: req.body.shippingAddress.zipCode || '',
          country: req.body.shippingAddress.country || 'Ghana',
          phone: req.body.shippingAddress.phone
        };

        // Create the order
        const newOrder = await prismaClient.order.create({
          data: {
            userId,
            totalAmount: cartData.totalAmount,
            orderStatus: 'PROCESSING',
            shippingAddress: formattedShippingAddress,
            orderItems: {
                create: cartData.items.map((item: CartItem) => ({
                    productId: item.productId.toString(),
                    quantity: item.quantity,
                    price: item.product.price
                }))
            },
            products: {
                connect: cartData.items.map((item: CartItem) => ({ 
                  id: item.productId.toString() 
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
            amount: cartData.totalAmount,
            method: paymentMethod,
            status: 'PENDING'
          }
        });
        
        // Update product stock
        for (const item of cartData.items) {
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
      await cartService.clearCart(cart.id);
      
      // Clear session cookie
      if (sessionId) {
        res.clearCookie('cartSessionId');
      }

      const completeOrder = await orderService.getOrder(order.id);

      // Then get user email
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true }
      });

      if (user && user.email) {
        // Now send the email with complete order data
        await emailService.sendOrderConfirmationEmail(user.email, completeOrder);
      }

      console.log("Order being returned:", {
        id: order.id,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress
      });
      
      res.status(201).json(successResponse('Order placed successfully', {
        order: {
          id: order.id,
          totalAmount: order.totalAmount,
          orderStatus: order.orderStatus,
          orderItems: order.orderItems.map(item => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          })),
          shippingAddress: order.shippingAddress,
        }
      }));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else if (error instanceof Error) {
        res.status(400).json(errorResponse(error.message));
      } else {
        res.status(400).json(errorResponse('An unknown error occurred'));
      }
    }
  }
};