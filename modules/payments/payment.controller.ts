// Handles CRUD routes for payments
import { Request, Response } from 'express';
import { paymentService } from './payment.service';
import { AppError } from "../../utils/errors";
import { successResponse, errorResponse } from "../../utils/response";

export const paymentController = {
    createPayment: async (req: Request, res: Response) => {
        try {
            const payment = await paymentService.createPayment(req.body);
            res.status(201).json(successResponse('Payment successfully made', payment));
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

    getAllPayments: async (req: Request, res: Response) => {
        try {
            const payments = await paymentService.getAllPayments();
            res.status(200).json(successResponse('Payments retrieved successfully', payments));
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

    getPayment: async (req: Request, res: Response) => {
        try {
            const payment = await paymentService.getPayment(req.params.id);
            res.status(200).json(successResponse('Payment retrieved successfully', payment));
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

    updatePayment: async (req: Request, res: Response) => {
        try {
            const payment = await paymentService.updatePayment(req.params.id, req.body);
            res.status(200).json(successResponse('Payment updated successfully', payment));
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

    deletePayment: async (req: Request, res: Response) => {
        try {
            await paymentService.deletePayment(req.params.id);
            res.status(204).json(successResponse('Payment deleted successfully'));
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