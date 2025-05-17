import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { AppError } from "../../utils/errors";
import { successResponse, errorResponse } from "../../utils/response";

export const AdminController = {
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const token = await AdminService.loginAdmin(email, password)
            res.status(200).json(successResponse("Admin login successful", { token }))
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

    getAllShops: async (req: Request, res: Response) => {
        try {
            const shops = await AdminService.getAllShops()
            res.status(200).json(successResponse("All shops fetched successfully", shops))
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

    getShop: async (req: Request, res: Response) => {
        try {
            const { shopId } = req.params
            const shop = await AdminService.getShopById(shopId)
            res.status(200).json(successResponse("Shop fetched successfully", shop))
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

    getUnapprovedShops: async (req: Request, res: Response) => {
        try {
            const shops = await AdminService.getUnapprovedShops()
            res.status(200).json(successResponse("Unapproved shops fetched successfully", shops))
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

    approveShop: async (req: Request, res: Response) => {
        try {
            const { shopId } = req.params
            const shop = await AdminService.approveShop(shopId)
            res.status(200).json(successResponse("Shop approved successfully", shop))
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

    rejectShop: async (req: Request, res: Response) => {
        try {
            const { shopId } = req.params
            const shop = await AdminService.rejectShop(shopId)
            res.status(200).json(successResponse("Shop rejected successfully", shop))
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

    getAllUsers: async (req: Request, res: Response) => {
        try {
            const users = await AdminService.getAllUsers()
            res.status(200).json(successResponse("All users fetched successfully", users))
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

    banShop: async (req: Request, res: Response) => {
        try {
            const { shopId } = req.params
            const shop = await AdminService.banShop(shopId)
            res.status(200).json(successResponse("Shop banned successfully", shop))
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

    unbanShop: async (req: Request, res: Response) => {
        try {
            const { shopId } = req.params
            const shop = await AdminService.unbanShop(shopId)
            res.status(200).json(successResponse("Shop unbanned successfully", shop))
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    }
}