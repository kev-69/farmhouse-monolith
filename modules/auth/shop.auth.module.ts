// Combines controller + service into a unit
import { Router } from 'express'
import { authController } from './shop.auth.controller'

const router = Router()

// middlewares
// middlewares to validate product data
import { validate } from '../../middlewares/validation.middleware';
import { signupSchema, loginSchema } from './shop.auth.schema';
import { authLimiter, authMiddlewares } from '../../middlewares/auth.middleware';

const signupMiddlewares = [
    authMiddlewares.sanitizeInput,
    authMiddlewares.validateEmail,
    authMiddlewares.validatePassword
];

// define routes
router.post('/signup',
    signupMiddlewares,
    validate({ body: signupSchema }),
    authLimiter,
    authController.signup
)
router.post('/login', 
    authMiddlewares.sanitizeInput,
    validate({ body: loginSchema }),
    authLimiter,
    authController.login
)

export const shopAuthModule = router