// Handles CRUD routes for orders
import { Request, Response } from 'express';
import { orderService } from './order.service';

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
                return res.status(401).json({ message: 'Authentication required' });
            }
            
            return res.status(200).json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            } else {
                return res.status(500).json({ message: 'An error occurred while fetching orders' });
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
                        return res.status(403).json({ message: 'You do not have permission to view this order' });
                    }
                } else if (order.userId !== req.user?.id) {
                    // Regular users can only view their own orders
                    return res.status(403).json({ message: 'You do not have permission to view this order' });
                }
            }
            
            return res.status(200).json(order);
        } catch (error) {
            console.error('Error fetching order:', error);
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            } else {
                return res.status(500).json({ message: 'An error occurred while fetching the order' });
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
                        return res.status(403).json({ message: 'You do not have permission to update this order' });
                    }
                } else {
                    // Regular users cannot update orders
                    return res.status(403).json({ message: 'You do not have permission to update orders' });
                }
            }
            
            const order = await orderService.updateOrder(orderId, { orderStatus: status });
            return res.status(200).json({ message: 'Order updated successfully', order });
        } catch (error) {
            console.error('Error updating order:', error);
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            } else {
                return res.status(500).json({ message: 'An error occurred while updating the order' });
            }
        }
    },

    deleteOrder: async (req: AuthRequest, res: Response) => {
        try {
            // Only allow admin to delete orders
            if (req.user?.role !== 'ADMIN') {
                return res.status(403).json({ message: 'You do not have permission to delete orders' });
            }
            
            await orderService.deleteOrder(req.params.id);
            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting order:', error);
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            } else {
                return res.status(500).json({ message: 'An error occurred while deleting the order' });
            }
        }
    },
};