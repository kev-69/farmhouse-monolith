import { Router } from 'express';
import { authController } from './auth.controller';
import { authMiddlewares } from '../../middlewares/auth.middleware';

const router = Router();

// Middleware arrays for better readability
const signupMiddlewares = [
    authMiddlewares.sanitizeInput,
    authMiddlewares.validateEmail,
    authMiddlewares.validatePassword
];

const loginMiddlewares = [
    authMiddlewares.sanitizeInput
];

// Define routes
router.post('/signup', signupMiddlewares, authController.signup);
router.post('/login', loginMiddlewares, authController.login);
router.post('/refresh-token', authController.refreshToken);

export const authModule = router;