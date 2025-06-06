import { Request, Response } from 'express';
import { userService } from './user.service';
import { AppError } from "../../utils/errors";
import { successResponse, errorResponse } from "../../utils/response";

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
            res.status(200).json(successResponse("Address added successfully", address));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    updateAddress: async (req: Request, res: Response) => {
        try {
            const address = await userService.updateAddress(req.user.userId, req.params.addressId, req.body);
            res.status(200).json(successResponse('Address updated successfully', address));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getUserAddresses: async (req: Request, res: Response) => {
        try {
            const addresses = await userService.getUserAddress(req.user.userId);
            res.status(200).json(successResponse("Addresses retrieved successfully", addresses));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    deleteAddress: async (req: Request, res: Response) => {
        try {
            await userService.deleteAddress(req.user.userId, req.params.addressId);
            res.status(200).json(successResponse("Address deleted successfully"));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getUser: async (req: Request, res: Response) => {
        try {
            const user = await userService.getUser(req.user.userId);
            res.status(200).json(successResponse('User profile retrieved successfully', user));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    updateUser: async (req: Request, res: Response) => {
        try {
            const user = await userService.updateUser(req.user.userId, req.body);
            res.status(200).json(successResponse('User profile updated successfully', {data: user}));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    deleteUser: async (req: Request, res: Response) => {
        try {
            await userService.deleteUser(req.user.userId);
            res.status(200).json(successResponse("Profile deleted successfully"));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },
};