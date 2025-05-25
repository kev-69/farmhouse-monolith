import { Router } from 'express'
import { shopController } from './shop.controller'

// middlewares
import { validateToken, verifyShop } from '../../middlewares/shop.middleware'
import { upload } from '../../middlewares/upload'

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
    upload.single('profileImage'),
    shopController.updateShop
)

router.get('/', 
    shopController.getAllShops
)

router.get('/:shopId', 
    shopController.getShopById
)

router.get('/:shopId/products', 
    shopController.getShopProducts
)

export const shopModule = router