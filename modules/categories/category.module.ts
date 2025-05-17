// Combines category controller/services into a single module
import { Router } from 'express';
import { categoryController } from './category.controller';

// middlewares to validate product data
import { validate } from '../../middlewares/validation.middleware';
import { createCategorySchema, updateCategorySchema } from './category.schema';

// middlewares to authorize shops to add categories, update categories they own, and delele categories they own
import { validateToken, verifyShop, verifyCategoryOwnership } from '../../middlewares/shop.middleware';

const router = Router();

// Define routes
router.post('/', 
    validateToken, 
    verifyShop, 
    validate({ body: createCategorySchema }),
    categoryController.createCategory
);

router.get('/', 
    categoryController.getAllCategories
);

router.get('/:id', 
    categoryController.getCategory
);

router.put('/:categoryId', 
    validateToken, 
    verifyShop,
    verifyCategoryOwnership, 
    validate({ body: updateCategorySchema }),
    categoryController.updateCategory
);

router.delete('/:categoryId', 
    validateToken, 
    verifyShop,
    verifyCategoryOwnership,
    categoryController.deleteCategory
);

export const categoryModule = router;