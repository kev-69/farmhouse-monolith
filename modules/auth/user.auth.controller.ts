import { Request, Response } from 'express';
import { authService } from './user.auth.service';
import { AppError } from "../../utils/errors";
import { successResponse, errorResponse } from "../../utils/response";

export const authController = {
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const token = await authService.login(email, password);
            res.status(200).json(successResponse('User login successful', token));
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

    signup: async (req: Request, res: Response) => {
        try {
            const user = await authService.signup(req.body);
            res.status(201).json(successResponse('User successfully created', user));
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

    refreshToken: async (req: Request, res: Response) => {
        try {
            const { token } = req.body;
            const newToken = await authService.refreshToken(token);
            res.status(200).json({ token: newToken });
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