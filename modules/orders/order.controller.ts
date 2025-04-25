// Handles CRUD routes for orders

import { Request, Response } from 'express';
import { orderService } from './order.service';

export const orderController = {
    createOrder: async (req: Request, res: Response) => {
        try {
            const order = await orderService.createOrder(req.body);
            res.status(201).json(order);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getAllOrders: async (req: Request, res: Response) => {
        try {
            const orders = await orderService.getAllOrders();
            res.status(200).json(orders);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getOrder: async (req: Request, res: Response) => {
        try {
            const order = await orderService.getOrder(req.params.id);
            res.status(200).json(order);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    updateOrder: async (req: Request, res: Response) => {
        try {
            const order = await orderService.updateOrder(req.params.id, req.body);
            res.status(200).json(order);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    deleteOrder: async (req: Request, res: Response) => {
        try {
            await orderService.deleteOrder(req.params.id);
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