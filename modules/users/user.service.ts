import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const userService = {
    getUser: async (id: string) => {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    updateUser: async (id: string, data: any) => {
        return await prisma.user.update({ where: { id }, data });
    },

    deleteUser: async (id: string) => {
        return await prisma.user.delete({ where: { id } });
    },
};