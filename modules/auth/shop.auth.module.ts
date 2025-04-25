// Combines controller + service into a unit
import { Router } from 'express'
import { authController } from './shop.auth.controller'
// import { authMiddlewares } from '../../middlewares/shop.middleware'

const router = Router()

// middlewares

// define routes
router.post('/signup', authController.signup)
router.post('/login', authController.login)

export const shopAuthModule = router