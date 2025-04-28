import { Request, Response } from 'express';
import { userService } from './user.service';

// Define the extended request type with user property
interface AuthRequest extends Request {
    user: {
        userId: string;
        role?: string;
    };
}

export const userController = {
    addAddress: async (req: Request, res: Response) => {
        try {
            const address = await userService.addAddress(req.user.userId, req.body);
            res.status(200).json({
                message: "Address added successfully",
                data: address
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    updateAddress: async (req: Request, res: Response) => {
        try {
            const address = await userService.updateAddress(req.user.userId, req.params.addressId, req.body);
            res.status(200).json({
                message: "Address updated successfully",
                data: address
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getAddresses: async (req: Request, res: Response) => {
        try {
            const addresses = await userService.getAddresses(req.user.userId);
            res.status(200).json({
                message: "Addresses retrieved successfully",
                data: addresses
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    deleteAddress: async (req: Request, res: Response) => {
        try {
            await userService.deleteAddress(req.user.userId, req.params.addressId);
            res.status(200).json({
                message: "Address deleted successfully"
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getUser: async (req: Request, res: Response) => {
        try {
            const user = await userService.getUser(req.user.userId);
            res.status(200).json({
                message: "User profile retrieved successfully",
                data: user
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    updateUser: async (req: Request, res: Response) => {
        try {
            const user = await userService.updateUser(req.user.userId, req.body);
            res.status(200).json({
                meesage: "Profile updated successfully",
                data: user
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    deleteUser: async (req: Request, res: Response) => {
        try {
            await userService.deleteUser(req.user.userId);
            res.status(200).json({
                message: "Profile deleted successfully"
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },
};