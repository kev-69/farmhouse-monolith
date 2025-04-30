import { prisma } from '../../shared/prisma';

export const orderService = {
    getOrdersByUserId: async (userId: string) => {
        return await prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                payments: true
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
                payments: true
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
                payments: true
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

    updateOrder: async (id: string, data: any) => {
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw new Error('Order not found');
        }
        
        return await prisma.order.update({ 
            where: { id }, 
            data,
            include: {
                orderItems: true,
                payments: true
            }
        });
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