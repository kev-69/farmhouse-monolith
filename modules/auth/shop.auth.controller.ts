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
    },

    requestPasswordReset: async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            await authService.resetPassword(email)
            res.status(200).json(successResponse("If the email exists, a password reset link has been sent", null))
        } catch (error) {
            res.status(200).json(successResponse('If the email exists, a password reset link has been sent', null));
        }
    },

    resendVerificationEmail: async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            const result = await authService.resendVerificationEmail(email)
            res.status(200).json(successResponse("Verification email resent successfully", result))
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message))
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message))
            } else {
                res.status(400).json({ message: "An unknown error occurred" })
            }
        }
    },

    verifyResetCode: async (req: Request, res: Response) => {
        try {
            const { email, code } = req.body
            const result = await authService.verifyCode(email, code)
            res.status(200).json(successResponse("Verification code verified successfully", result))
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message))
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message))
            } else {
                res.status(400).json({ message: "An unknown error occurred" })
            }
        }
    },

    setNewPassword: async (req: Request, res: Response) => {
        try {
            const { email, code, password } = req.body
            await authService.setNewPassword(email, code, password)
            res.status(200).json(successResponse("Password reset successfully", null))
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message))
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message))
            } else {
                res.status(400).json({ message: "An unknown error occurred" })
            }
        }
    },

    verifyEmail: async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const result = await authService.verifyEmail(token)
            res.status(200).json(successResponse("Email verified successfully", result))
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message))
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message))
            } else {
                res.status(400).json({ message: "An unknown error occurred" })
            }
        }
    }
}