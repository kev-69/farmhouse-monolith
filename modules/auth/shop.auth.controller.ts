// Handles routes: create shop, get shop, etc.
import { Request, Response } from "express";
import { authService } from "./shop.auth.service";
import { AppError } from "../../utils/errors";
import { successResponse, errorResponse } from "../../utils/response";

export const authController = {
    signup: async (req: Request, res: Response) => {
        try {
            const shop = await authService.signup(req.body)
            res.status(200).json(successResponse("Shop successfully created", shop ))
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message))
            } else if(error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('An unknown error occurred'));
            }
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const token = await authService.login(email, password);
            res.status(200).json(successResponse("Login successful", token))
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message))
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message))
            } else {
                res.status(400).json(errorResponse("An unknown error occured"))
            }
        }
    }
}