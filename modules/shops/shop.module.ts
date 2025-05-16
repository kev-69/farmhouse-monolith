import { Router } from 'express'
import { shopController } from './shop.controller'

// middlewares
import { validateToken, verifyShop } from '../../middlewares/shop.middleware'

const router = Router()

// define routes
router.get('/profile', 
    validateToken, 
    verifyShop,
    shopController.getShop
)

router.put('/update', 
    validateToken, 
    verifyShop,
    shopController.updateShop
)

router.get('/', 
    shopController.getAllShops
)

router.get('/:id', 
    shopController.getShopById
)

router.get('/:shopId/products', 
    shopController.getShopProducts
)

export const shopModule = router