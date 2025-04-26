import { Router } from 'express';
import { productController } from './product.controller';

// middlewares to validate product data
import { validate } from '../../middlewares/validation.middleware';
import { createProductSchema, updateProductSchema } from './product.schema';

// middlewares to authorize shops to add products, update products they own, and delete products they own
import { validateToken, verifyShop, verifyProductOwnership } from '../../middlewares/shop.middleware';

const router = Router();

// Define routes
router.post('/add-product', 
    validateToken, 
    verifyShop,
    validate({ body: createProductSchema }), // Validate product data
    productController.createProduct
);
router.get('/all-products', productController.getAllProducts);
router.get('/product/:id', productController.getProduct);

router.put('/update-product/:id', 
    validateToken,
    verifyShop,
    verifyProductOwnership, // Verify ownership of the product
    validate({ body: updateProductSchema }), // Validate product data
    productController.updateProduct
);
router.delete('/delete-product/:id',
    validateToken,
    verifyShop,
    verifyProductOwnership, // Verify ownership of the product 
    productController.deleteProduct
);

export const productModule = router;