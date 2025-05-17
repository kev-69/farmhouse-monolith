import { Router } from 'express';
import { productController } from './product.controller';

// middlewares to validate product data
import { validate } from '../../middlewares/validation.middleware';
import { createProductSchema, updateProductSchema } from './product.schema';

// middlewares to authorize shops to add products, update products they own, and delete products they own
import { validateToken, verifyShop, verifyProductOwnership } from '../../middlewares/shop.middleware';
import { upload } from '../../middlewares/upload';

const router = Router();

// Define routes
router.post('/', 
    validateToken, 
    verifyShop,
    upload.array('productImages', 10),
    validate({ body: createProductSchema }),
    productController.createProduct
);

router.get('/', 
    productController.getAllProducts
);

router.get('/:productId', 
    productController.getProduct
);

router.put('/:productId', 
    validateToken,
    verifyShop,
    verifyProductOwnership, // Verify ownership of the product
    upload.array('productImages', 10),
    validate({ body: updateProductSchema }), // Validate product data
    productController.updateProduct
);

router.delete('/:productId',
    validateToken,
    verifyShop,
    verifyProductOwnership, // Verify ownership of the product 
    productController.deleteProduct
);

export const productModule = router;