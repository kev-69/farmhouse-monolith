import { Router } from 'express'
import { shopController } from './shop.controller'

// middlewares
import validateToken from '../../middlewares/user.middleware'

const router = Router()

// define routes
router.get('/profile', validateToken, shopController.getShop)
router.put('/update-profile', validateToken, shopController.updateShop)
router.delete('/delete-profile', validateToken, shopController.deleteShop)

export const shopModule = router