import { PrismaClient } from '@prisma/client';
import { get } from 'http';

export const prisma = new PrismaClient();

export const userService = {
    addAddress: async (userId: string, address: any) => {
        return await prisma.userAddress.create({
            data: {
                ...address,
                userId
            }
        });
    },


    updateAddress: async (userId: string, addressId: string, address: any) => {
        const existingAddress = await prisma.userAddress.findUnique({ where: { id: addressId } });
        if (!existingAddress) {
            throw new Error('Address not found');
        }
        if (existingAddress.userId !== userId) {
            throw new Error('You do not have permission to update this address');
        }
        return await prisma.userAddress.update({
            where: { id: addressId },
            data: address
        });
    },

    getAddresses: async (userId: string) => {
        return await prisma.userAddress.findMany({ where: { userId } });
    },

    deleteAddress: async (userId: string, addressId: string) => {
        const existingAddress = await prisma.userAddress.findUnique({ where: { id: addressId } });
        if (!existingAddress) {
            throw new Error('Address not found');
        }
        if (existingAddress.userId !== userId) {
            throw new Error('You do not have permission to delete this address');
        }
        return await prisma.userAddress.delete({ where: { id: addressId } });
    },
    
    getUser: async (id: string) => {
        const user = await prisma.user.findUnique({ 
            where: { id },
            include: {
                addresses: true // Include the user's addresses
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    updateUser: async (id: string, data: any) => {
        return await prisma.user.update({ 
            where: { id }, 
            data,
            include: {
                addresses: true // Include addresses when returning updated user
            }
        });
    },

    deleteUser: async (id: string) => {
        return await prisma.user.delete({ where: { id } });
    },
};