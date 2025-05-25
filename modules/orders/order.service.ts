import { prisma } from '../../shared/prisma';

export const orderService = {
    getOrdersByUserId: async (userId: string) => {
        return await prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                shop: true
                            }
                        } 
                        
                    }
                },
                payments: true,
            }
        });
    },

    getOrdersByShopId: async (shopId: string) => {
        // Get orders that contain products from this shop
        return await prisma.order.findMany({
            where: {
                orderItems: {
                    some: {
                        product: {
                            shopId
                        }
                    }
                }
            },
            include: {
                orderItems: {
                    include: {
                        product: true
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
            }
        });
    },
    
    checkOrderContainsShopProducts: async (orderId: string, shopId: string) => {
        const count = await prisma.orderItem.count({
            where: {
                orderId,
                product: {
                    shopId
                }
            }
        });
        
        return count > 0;
    },

    getAllOrders: async () => {
        return await prisma.order.findMany({
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                payments: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                },
            }
        });
    },

    getOrder: async (id: string) => {
        const order = await prisma.order.findUnique({ 
            where: { id },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                payments: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
        
        if (!order) {
            throw new Error('Order not found');
        }
        
        return order;
    },

    // Add these methods to your orderService object
    shipOrder: async (orderId: string, shopId: string, details: { trackingNumber?: string; carrier?: string }) => {
        const order = await prisma.order.findUnique({ 
            where: { id: orderId },
            include: { orderItems: true }
        });
        
        if (!order) {
            throw new Error('Order not found');
        }
        
        if (order.orderStatus !== 'PROCESSING') {
            throw new Error('Order must be in PROCESSING status to ship');
        }
        
        // Update order status and record shipping details
        const updatedOrder = await prisma.$transaction(async (prismaClient) => {
            // Update order
            const updated = await prismaClient.order.update({
                where: { id: orderId },
                data: {
                    orderStatus: 'SHIPPED',
                    shippedAt: new Date(),
                    shippedBy: shopId,
                    trackingNumber: details.trackingNumber,
                    carrier: details.carrier,
                },
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            });
            
            // Create order history entry
            await prismaClient.orderHistory.create({
                data: {
                    orderId,
                    status: 'SHIPPED',
                    note: `Shipped via ${details.carrier || 'standard delivery'}${details.trackingNumber ? ` with tracking #${details.trackingNumber}` : ''}`,
                    createdBy: shopId
                }
            });
            
            return updated;
        });
        
        return updatedOrder;
    },

    deliverOrder: async (orderId: string, shopId: string) => {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        
        if (!order) {
            throw new Error('Order not found');
        }
        
        if (order.orderStatus !== 'SHIPPED') {
            throw new Error('Order must be in SHIPPED status to mark as delivered');
        }
        
        // Update order status and record delivery timestamp
        const updatedOrder = await prisma.$transaction(async (prismaClient) => {
            // Update order
            const updated = await prismaClient.order.update({
                where: { id: orderId },
                data: {
                    orderStatus: 'DELIVERED',
                    deliveredAt: new Date(),
                },
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            });
            
            // Create order history entry
            await prismaClient.orderHistory.create({
                data: {
                    orderId,
                    status: 'DELIVERED',
                    note: 'Order marked as delivered',
                    createdBy: shopId
                }
            });
            
            return updated;
        });
        
        return updatedOrder;
    },

    cancelOrder: async (orderId: string, shopId: string, reason: string) => {
        const order = await prisma.order.findUnique({ 
            where: { id: orderId },
            include: { orderItems: true }
        });
        
        if (!order) {
            throw new Error('Order not found');
        }
        
        if (order.orderStatus !== 'PROCESSING') {
            throw new Error('Only orders in PROCESSING status can be cancelled');
        }
        
        // Update order status and record cancellation details
        const updatedOrder = await prisma.$transaction(async (prismaClient) => {
            // Update order
            const updated = await prismaClient.order.update({
                where: { id: orderId },
                data: {
                    orderStatus: 'CANCELLED',
                    cancelledAt: new Date(),
                    cancellationReason: reason
                },
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            });
            
            // Create order history entry
            await prismaClient.orderHistory.create({
                data: {
                    orderId,
                    status: 'CANCELLED',
                    note: `Cancelled: ${reason}`,
                    createdBy: shopId
                }
            });
            
            // Restore product stock quantities
            for (const item of order.orderItems) {
                await prismaClient.product.update({
                    where: { id: item.productId },
                    data: {
                        stockQuantity: {
                            increment: item.quantity
                        }
                    }
                });
            }
            
            return updated;
        });
        
        return updatedOrder;
    },

    deleteOrder: async (id: string) => {
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw new Error('Order not found');
        }
        
        // Delete related order items and payments first
        await prisma.$transaction([
            prisma.orderItem.deleteMany({ where: { orderId: id } }),
            prisma.payment.deleteMany({ where: { orderId: id } }),
            prisma.order.delete({ where: { id } })
        ]);
        
        return { success: true };
    },
};