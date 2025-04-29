// Handles CRUD routes for orders
import { Request, Response } from 'express';
import { orderService } from './order.service';
import { AppError } from "../../utils/errors";
import { successResponse, errorResponse } from "../../utils/response";

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
            const orderId = req.params.id;
            
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

    updateOrder: async (req: AuthRequest, res: Response) => {
        try {
            const orderId = req.params.id;
            const { status } = req.body;
            
            // Check permissions
            if (req.user?.role !== 'ADMIN') {
                if (req.user?.shopId) {
                    // Shops can only update orders with their products
                    const hasPermission = await orderService.checkOrderContainsShopProducts(orderId, req.user.shopId);
                    if (!hasPermission) {
                        res.status(403).json(errorResponse('You do not have permission to update this order'));
                        return;
                    }
                } else {
                    // Regular users cannot update orders
                    res.status(403).json(errorResponse('You do not have permission to update orders'));
                    return;
                }
            }
            
            const order = await orderService.updateOrder(orderId, { orderStatus: status });
            res.status(200).json(successResponse('Order updated successfully', order));
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