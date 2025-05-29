import { prisma } from '../../shared/prisma';
import { FulfillmentStatus } from '@prisma/client';

export const orderService = {
  // Get all orders for a specific user (customer view)
  getUserOrders: async (userId: string) => {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
            shop: {
              select: {
                id: true,
                name: true,
                phoneNumber: true,
                location: true
              }
            }
          }
        },
        payments: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Get a specific order with all details
  getOrder: async (id: string) => {
    const order = await prisma.order.findUnique({ 
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
            shop: {
              select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
              }
            }
          }
        },
        payments: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        history: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return order;
  },

  // Get all order items for a specific shop
  getShopOrderItems: async (shopId: string) => {
    const orderItems = await prisma.orderItem.findMany({
      where: {
        shopId: shopId
      },
      include: {
        order: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        product: true
      },
      orderBy: {
        order: {
          createdAt: 'desc'
        }
      }
    });
    
    return orderItems;
  },

  // Check if an order contains products from a specific shop
  checkOrderContainsShopProducts: async (orderId: string, shopId: string) => {
    const count = await prisma.orderItem.count({
      where: {
        orderId,
        shopId
      }
    });
    
    return count > 0;
  },

  // Update the status of a specific order item
  updateOrderItemStatus: async (
    orderItemId: string, 
    shopId: string, 
    data: {
      status: FulfillmentStatus;
      trackingNumber?: string;
      carrierName?: string;
      notes?: string;
    }
  ) => {
    // First verify the order item exists and belongs to this shop
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { 
        order: true,
        product: true
      }
    });
    
    if (!orderItem) {
      throw new Error('Order item not found');
    }
    
    if (orderItem.shopId !== shopId) {
      throw new Error('You do not have permission to update this order item');
    }
    
    // Update the order item in a transaction
    const updatedOrderItem = await prisma.$transaction(async (tx) => {
      // Update the order item
      const updated = await tx.orderItem.update({
        where: { id: orderItemId },
        data: {
          fulfillmentStatus: data.status,
          statusUpdatedAt: new Date(),
          statusUpdatedBy: shopId,
          ...(data.trackingNumber && { trackingNumber: data.trackingNumber }),
          ...(data.carrierName && { carrierName: data.carrierName }),
          ...(data.notes && { notes: data.notes })
        },
        include: {
          order: {
            include: {
              user: true
            }
          },
          product: true,
          shop: true
        }
      });
      
      // Add entry to order history
      await tx.orderHistory.create({
        data: {
          orderId: orderItem.orderId,
          status: updated.order.orderStatus,
          note: `Shop "${updated.shop.name}" updated item "${updated.product.name}" status to ${data.status}`,
          createdBy: shopId
        }
      });
      
      // Check if all items in the order are delivered or cancelled
      const allOrderItems = await tx.orderItem.findMany({
        where: { orderId: orderItem.orderId }
      });
      
      const allCompleted = allOrderItems.every(
        item => item.fulfillmentStatus === 'DELIVERED' || item.fulfillmentStatus === 'CANCELLED'
      );
      
      // If all items are completed, update the order status to COMPLETED
      if (allCompleted) {
        await tx.order.update({
          where: { id: orderItem.orderId },
          data: { orderStatus: 'COMPLETED' }
        });
      }
      
      return updated;
    });
    
    return updatedOrderItem;
  },

  // Get all orders (admin only)
  getAllOrders: async () => {
    return await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
            shop: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        payments: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Delete an order (admin only)
  deleteOrder: async (id: string) => {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new Error('Order not found');
    }
    
    // Delete related records in a transaction
    await prisma.$transaction([
      prisma.orderHistory.deleteMany({ where: { orderId: id } }),
      prisma.orderItem.deleteMany({ where: { orderId: id } }),
      prisma.payment.deleteMany({ where: { orderId: id } }),
      prisma.order.delete({ where: { id } })
    ]);
    
    return { success: true };
  },
};