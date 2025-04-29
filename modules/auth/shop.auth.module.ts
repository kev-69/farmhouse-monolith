// Combines controller + service into a unit
import { Router } from 'express'
import { authController } from './shop.auth.controller'

const router = Router()

// middlewares
// middlewares to validate product data
import { validate } from '../../middlewares/validation.middleware';
import { signupSchema, loginSchema } from './shop.auth.schema';
import { authLimiter } from '../../middlewares/auth.middleware';

// define routes
router.post('/signup',
    validate({ body: signupSchema }),
    authLimiter,
    authController.signup
)
router.post('/login', 
    validate({ body: loginSchema }),
    authLimiter,
    authController.login
)

export const shopAuthModule = router