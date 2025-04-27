import { Request, Response } from 'express';
import { authService } from './user.auth.service';

export const authController = {
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const token = await authService.login(email, password);
            res.status(200).json({ token });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    signup: async (req: Request, res: Response) => {
        try {
            const user = await authService.signup(req.body);
            res.status(201).json({
                message: 'User successfully created',
                user
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
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
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },
};