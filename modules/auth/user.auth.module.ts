import { Router } from 'express';
import { authController } from './user.auth.controller';
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

// middlewares to validate product data
import { validate } from '../../middlewares/validation.middleware';
import { loginSchema, signupSchema, refreshTokenSchema } from './user.auth.schema';

// Define routes
router.post('/signup', 
    signupMiddlewares,
    validate({ body: signupSchema }), 
    authController.signup
);
router.post('/login', 
    loginMiddlewares, 
    validate({ body:loginSchema }),
    authController.login
);
router.post('/refresh-token', 
    validate({ body: refreshTokenSchema }),
    authController.refreshToken
);

export const authModule = router;