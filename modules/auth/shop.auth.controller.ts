// Handles routes: create shop, get shop, etc.
import { Request, Response } from "express";
import { authService } from "./shop.auth.service";

export const authController = {
    signup: async (req: Request, res: Response) => {
        try {
            const shop = await authService.signup(req.body)
            res.status(200).json({ message: "Shop successfully created", shop })
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message })
            } else {
                res.status(400).json({ message: "An unknown error occurred" })
            }
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const token = await authService.login(email, password);
            res.status(200).json({ message: "Login successful", token })
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message })
            } else {
                res.status(400).json({ message: "An unknown error occured" })
            }
        }
    }
}