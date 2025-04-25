import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const paymentService = {
    createPayment: async (data: any) => {
        return await prisma.payment.create({ data });
    },

    getAllPayments: async () => {
        return await prisma.payment.findMany();
    },

    getPayment: async (id: string) => {
        const payment = await prisma.payment.findUnique({ where: { id } });
        if (!payment) {
            throw new Error('Payment not found');
        }
        return payment;
    },

    updatePayment: async (id: string, data: any) => {
        return await prisma.payment.update({ where: { id }, data });
    },

    deletePayment: async (id: string) => {
        return await prisma.payment.delete({ where: { id } });
    },
};