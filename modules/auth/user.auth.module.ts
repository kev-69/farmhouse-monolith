import { Router } from 'express';
import { authController } from './user.auth.controller';
import { authLimiter, authMiddlewares } from '../../middlewares/auth.middleware';

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
import { 
    loginSchema, 
    signupSchema, 
    refreshTokenSchema, 
    passwordResetRequestSchema,
    verifyResetCodeSchema,
    setNewPasswordSchema,
    resendVerificationSchema
} from './user.auth.schema';

// Define routes
router.post('/signup', 
    signupMiddlewares,
    validate({ body: signupSchema }), 
    authLimiter,
    authController.signup
);

router.post('/login', 
    loginMiddlewares, 
    validate({ body:loginSchema }),
    authLimiter,
    authController.login
);

router.post('/refresh-token', 
    validate({ body: refreshTokenSchema }),
    authController.refreshToken
);

// Email verification routes
router.get('/verify-email/:token',
    authController.verifyEmail
);

router.post('/resend-verification',
    validate({ body: resendVerificationSchema }),
    authLimiter,
    authController.resendVerificationEmail
);

// Password reset routes
router.post('/request-password-reset',
    validate({ body: passwordResetRequestSchema }),
    authLimiter,
    authController.requestPasswordReset
);

router.post('/verify-reset-code',
    validate({ body: verifyResetCodeSchema }),
    authLimiter,
    authController.verifyResetCode
);

router.post('/reset-password',
    validate({ body: setNewPasswordSchema }),
    authLimiter,
    authController.setNewPassword
);

export const authModule = router;