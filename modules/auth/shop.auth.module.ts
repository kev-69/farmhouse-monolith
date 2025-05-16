// Combines controller + service into a unit
import { Router } from 'express'
import { authController } from './shop.auth.controller'

const router = Router()

// middlewares
// middlewares to validate product data
import { validate } from '../../middlewares/validation.middleware';
import { authLimiter, authMiddlewares } from '../../middlewares/auth.middleware';
import { 
    signupSchema, 
    loginSchema,
    passwordResetRequestSchema,
    verifyResetCodeSchema,
    setNewPasswordSchema,
    resendVerificationSchema 
} from './shop.auth.schema';


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

router.get('/verify-email/:token',
    authController.verifyEmail
)

router.post('/resend-shop-verification',
    validate({ body: resendVerificationSchema }),
    authLimiter,
    authController.resendVerificationEmail
)

router.post('/request-shop-password-reset',
    validate({ body: passwordResetRequestSchema }),
    authLimiter,
    authController.requestPasswordReset
)

router.post('/verify-shop-reset-code',
    validate({ body: verifyResetCodeSchema }),
    authLimiter,
    authController.verifyResetCode
)

router.post('/set-new-shop-password',
    validate({ body: setNewPasswordSchema }),
    authLimiter,
    authController.setNewPassword
)

export const shopAuthModule = router