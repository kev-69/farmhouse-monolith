import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { AppError } from "../../utils/errors";
import { successResponse, errorResponse } from "../../utils/response";

export const AdminController = {
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const token = await AdminService.loginAdmin(email, password)
            res.status(200).json(successResponse("Admin login successful", token))
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
            const shops = AdminService.getAllShops()
            res.status(200).json(successResponse("Shops fetched successfully", shops))
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
}