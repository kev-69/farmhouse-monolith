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
  // Get orders based on user role
  getOrders: async (req: AuthRequest, res: Response) => {
    try {
      // For regular users, only return their orders
      // For shops, return order items containing their products
      // For admins, return all orders
      let orders;
      
      if (req.user?.role === 'ADMIN') {
        orders = await orderService.getAllOrders();
      } else if (req.user?.role === 'USER') {
        // For regular users, get their own orders
        orders = await orderService.getUserOrders(req.user.id);
      } else {
        res.status(401).json(errorResponse('Authentication required'));
        return;
      }
      
      res.status(200).json(successResponse('Orders retrieved successfully', orders));
    } catch (error) {
      logger.error('Error retrieving orders:', error);
      if (error instanceof Error) {
        res.status(400).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse('An unknown error occurred'));
      }
    }
  },

  // Get a specific order
  getOrder: async (req: AuthRequest, res: Response) => {
    try {
      const orderId = req.params.orderId;
      
      // Get the order
      const order = await orderService.getOrder(orderId);
      
      // Check permissions
      if (req.user?.role !== 'ADMIN') {
        if (req.user?.role === 'SHOP') {
          // Shops can only view orders with their products
          if (!req.user.shopId) {
            res.status(403).json(errorResponse('Shop ID is required'));
            return;
          }
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
      
      res.status(200).json(successResponse('Order retrieved successfully', order));
    } catch (error) {
      logger.error('Error retrieving order:', error);
      if (error instanceof Error) {
        res.status(400).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse('An unknown error occurred'));
      }
    }
  },

  // Get all order items for a shop
  getShopOrderItems: async (req: AuthRequest, res: Response) => {
    try {
      const shopId = req.user?.shopId;
      
      if (!shopId) {
        res.status(401).json(errorResponse('Authentication required'));
        return;
      }
      
      const orderItems = await orderService.getShopOrderItems(shopId);
      
      // Group items by order for easier frontend handling
      const groupedItems = orderItems.reduce((acc: any, item) => {
        if (!acc[item.orderId]) {
          acc[item.orderId] = {
            orderId: item.orderId,
            orderDate: item.order.createdAt,
            customer: item.order.user,
            order: item.order,
            items: []
          };
        }
        
        acc[item.orderId].items.push(item);
        return acc;
      }, {});
      
      res.status(200).json(successResponse(
        'Shop order items retrieved successfully', 
        Object.values(groupedItems)
      ));
    } catch (error) {
      logger.error('Error retrieving shop order items:', error);
      if (error instanceof Error) {
        res.status(400).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse('An unknown error occurred'));
      }
    }
  },

  // Update the status of a specific order item
  updateOrderItemStatus: async (req: AuthRequest, res: Response) => {
    try {
      const { orderItemId } = req.params;
      const { status, trackingNumber, carrierName, notes } = req.body;
      const shopId = req.user?.shopId;
      
      if (!shopId) {
        res.status(401).json(errorResponse('Authentication required'));
        return;
      }
      
      const updatedOrderItem = await orderService.updateOrderItemStatus(
        orderItemId,
        shopId,
        {
          status,
          trackingNumber,
          carrierName,
          notes
        }
      );
      
      // Send notification to customer
      try {
        const customer = updatedOrderItem.order.user;
        const productName = updatedOrderItem.product.name;
        const shopName = updatedOrderItem.shop.name;
        
        if (customer.email) {
          // Status message mapping
          const statusMessages = {
            'PENDING': 'is being processed',
            'SHIPPED': 'has been shipped',
            'DELIVERED': 'has been delivered',
            'CANCELLED': 'has been cancelled'
          };
          
        //   await emailService.sendEmail({
        //     to: customer.email,
        //     subject: `Update on your order from ${shopName}`,
        //     html: `
        //       <h1>Order Status Update</h1>
        //       <p>Hello ${customer.firstName},</p>
        //       <p>Your item "${productName}" from ${shopName} ${statusMessages[status] || 'has been updated'}.</p>
        //       <p>Current status: <strong>${status}</strong></p>
        //       ${trackingNumber ? `<p>Tracking Number: ${trackingNumber}</p>` : ''}
        //       ${carrierName ? `<p>Carrier: ${carrierName}</p>` : ''}
        //       <p>You can view your complete order details in your account dashboard.</p>
        //     `
        //   });
        }
      } catch (emailError) {
        logger.error('Failed to send status update notification:', emailError);
        // Continue processing even if notification fails
      }
      
      res.status(200).json(successResponse('Order item status updated successfully', updatedOrderItem));
    } catch (error) {
      logger.error('Error updating order item status:', error);
      if (error instanceof Error) {
        res.status(400).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse('An unknown error occurred'));
      }
    }
  },

  // Delete an order (admin only)
  deleteOrder: async (req: AuthRequest, res: Response) => {
    try {
      // Only allow admin to delete orders
      if (req.user?.role !== 'ADMIN') {
        res.status(403).json(errorResponse('You do not have permission to delete orders'));
        return;
      }
      
      await orderService.deleteOrder(req.params.orderId);
      res.status(200).json(successResponse('Order deleted successfully'));
    } catch (error) {
      logger.error('Error deleting order:', error);
      if (error instanceof Error) {
        res.status(400).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse('An unknown error occurred'));
      }
    }
  },
};