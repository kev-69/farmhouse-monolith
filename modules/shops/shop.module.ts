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

router.get('/stats', 
  validateToken, 
  shopController.getShopStats
);

router.get('/', 
    shopController.getAllShops
)

router.get('/:shopId', 
    shopController.getShopById
)

router.get('/:shopId/products', 
    shopController.getShopProducts
)

router.put('/update', 
    validateToken, 
    verifyShop,
    upload.single('profileImage'),
    shopController.updateShop
)

export const shopModule = router