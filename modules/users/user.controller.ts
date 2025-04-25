import { Request, Response } from 'express';
import { userService } from './user.service';

export const userController = {
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