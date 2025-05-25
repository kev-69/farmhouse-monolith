// Handles CRUD routes for orders
import { Request, Response } from 'express';
import { orderService } from './order.service';
import { AppError } from "../../utils/errors";
import { successResponse, errorResponse } from "../../utils/response";
import logger from '../../utils/logger';
import emailService from '../../utils/send.email';

// Extend Request to include the user for authentication
interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        shopId?: string;
    };
}

export const orderController = {
    getAllOrders: async (req: AuthRequest, res: Response) => {
        try {
            // For regular users, only return their orders
            // For shops, return orders containing their products
            // For admins, return all orders
            let orders;
            
            if (req.user?.role === 'ADMIN') {
                orders = await orderService.getAllOrders();
            } else if (req.user?.shopId) {
                // For shops, get orders that contain their products
                orders = await orderService.getOrdersByShopId(req.user.shopId);
            } else if (req.user?.id) {
                // For regular users, get their own orders
                orders = await orderService.getOrdersByUserId(req.user.id);
            } else {
                res.status(401).json(successResponse('Authentication required'));
                return;
            }
            
            res.status(200).json(successResponse('Orders retrieved successfully', orders));
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

    getOrder: async (req: AuthRequest, res: Response) => {
        try {
            const orderId = req.params.orderId;
            
            // Get the order
            const order = await orderService.getOrder(orderId);
            
            // Check permissions
            if (req.user?.role !== 'ADMIN') {
                if (req.user?.shopId) {
                    // Shops can only view orders with their products
                    const hasPermission = await orderService.checkOrderContainsShopProducts(orderId, req.user.shopId);
                    if (!hasPermission) {
                        res.status(403).json(errorResponse('You do not have permission to view this order'));
                        return;
                    }
                } else if (order.userId !== req.user?.id) {
                    // Regular users can only view their own orders
                    res.status(403).json(errorResponse('You do not have permission to view this order'));
                    return;
                }
            }
            
            res.status(200).json((order) ? successResponse('Order retrieved successfully', order) : errorResponse('Order not found'));
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

    shipOrder: async (req: AuthRequest, res: Response) => {
        try {
            const { orderId } = req.params;
            const shopId = req.user?.shopId;
            
            if (!shopId) {
                res.status(403).json(errorResponse('Only shops can ship orders'));
                return;
            }
            
            // Validate shop owns products in this order
            const hasPermission = await orderService.checkOrderContainsShopProducts(orderId, shopId);
            if (!hasPermission) {
                res.status(403).json(errorResponse('You do not have permission to ship this order'));
                return;
            }
            
            const { trackingNumber, carrier } = req.body;
            
            // Ship the order
            const updatedOrder = await orderService.shipOrder(orderId, shopId, {
                trackingNumber,
                carrier
            });
            
            // Send shipping notification email
            try {
                if (updatedOrder.user?.email) {
                    await emailService.sendOrderShippedEmail(updatedOrder.user.email, updatedOrder);
                }
            } catch (emailError) {
                logger.error(`Failed to send shipping notification: ${emailError}`);
                // Continue anyway - don't fail the order update if email fails
            }
            
            res.status(200).json(successResponse('Order shipped successfully', updatedOrder));
        } catch (error) {
            logger.error(`Error shipping order: ${error}`);
            if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json(errorResponse('An unknown error occurred'));
            }
        }
    },

    deliverOrder: async (req: AuthRequest, res: Response) => {
        try {
            const { orderId } = req.params;
            const shopId = req.user?.shopId;
            
            if (!shopId) {
                res.status(403).json(errorResponse('Only shops can mark orders as delivered'));
                return;
            }
            
            // Validate shop owns products in this order
            const hasPermission = await orderService.checkOrderContainsShopProducts(orderId, shopId);
            if (!hasPermission) {
                res.status(403).json(errorResponse('You do not have permission to update this order'));
                return;
            }
            
            // Mark as delivered
            const updatedOrder = await orderService.deliverOrder(orderId, shopId);
            
            // Send delivery notification email
            try {
                if (updatedOrder.user?.email) {
                    await emailService.sendOrderDeliveredEmail(updatedOrder.user.email, updatedOrder);
                }
            } catch (emailError) {
                logger.error(`Failed to send delivery notification: ${emailError}`);
                // Continue anyway
            }
            
            res.status(200).json(successResponse('Order marked as delivered', updatedOrder));
        } catch (error) {
            logger.error(`Error marking order as delivered: ${error}`);
            if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json(errorResponse('An unknown error occurred'));
            }
        }
    },

    cancelOrder: async (req: AuthRequest, res: Response) => {
        try {
            const { orderId } = req.params;
            const shopId = req.user?.shopId;
            const { reason } = req.body;
            
            if (!shopId && req.user?.role !== 'ADMIN') {
                res.status(403).json(errorResponse('Only shops and admins can cancel orders'));
                return;
            }
            
            // For shops, validate they own products in this order
            if (shopId && req.user?.role !== 'ADMIN') {
                const hasPermission = await orderService.checkOrderContainsShopProducts(orderId, shopId);
                if (!hasPermission) {
                    res.status(403).json(errorResponse('You do not have permission to cancel this order'));
                    return;
                }
            }
            
            // Cancel the order
            const updatedOrder = await orderService.cancelOrder(orderId, shopId || 'admin', reason);
            
            // Send cancellation notification email
            try {
                if (updatedOrder.user?.email) {
                    await emailService.sendOrderCancelledEmail(updatedOrder.user.email, updatedOrder, reason);
                }
            } catch (emailError) {
                logger.error(`Failed to send cancellation notification: ${emailError}`);
            }
            
            res.status(200).json(successResponse('Order cancelled successfully', updatedOrder));
        } catch (error) {
            logger.error(`Error cancelling order: ${error}`);
            if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json(errorResponse('An unknown error occurred'));
            }
        }
    },

    deleteOrder: async (req: AuthRequest, res: Response) => {
        try {
            // Only allow admin to delete orders
            if (req.user?.role !== 'ADMIN') {
                res.status(403).json(errorResponse('You do not have permission to delete orders'));
                return;
            }
            
            await orderService.deleteOrder(req.params.id);
            res.status(204).json(successResponse('Order deleted successfully'));
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
};