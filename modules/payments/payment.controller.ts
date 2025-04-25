// Handles CRUD routes for payments
import { Request, Response } from 'express';
import { paymentService } from './payment.service';

export const paymentController = {
    createPayment: async (req: Request, res: Response) => {
        try {
            const payment = await paymentService.createPayment(req.body);
            res.status(201).json(payment);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getAllPayments: async (req: Request, res: Response) => {
        try {
            const payments = await paymentService.getAllPayments();
            res.status(200).json(payments);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getPayment: async (req: Request, res: Response) => {
        try {
            const payment = await paymentService.getPayment(req.params.id);
            res.status(200).json(payment);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    updatePayment: async (req: Request, res: Response) => {
        try {
            const payment = await paymentService.updatePayment(req.params.id, req.body);
            res.status(200).json(payment);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    deletePayment: async (req: Request, res: Response) => {
        try {
            await paymentService.deletePayment(req.params.id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },
};