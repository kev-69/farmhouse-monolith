// Combines controller + service into a unit
import { Router } from 'express'
import { authController } from './shop.auth.controller'

const router = Router()

// middlewares
// middlewares to validate product data
import { validate } from '../../middlewares/validation.middleware';
import { signupSchema, loginSchema } from './shop.auth.schema';

// define routes
router.post('/signup',
    validate({ body: signupSchema }),
    authController.signup
)
router.post('/login', 
    validate({ body: loginSchema }),
    authController.login
)

export const shopAuthModule = router