// Combines category controller/services into a single module
import { Router } from 'express';
import { categoryController } from './category.controller';

// middlewares to authorize shops to add categories, update categories they own, and delele categories they own
import { validateToken, verifyShop, verifyCategoryOwnership } from '../../middlewares/shop.middleware';

const router = Router();

// Define routes
router.post('/add-category', validateToken, verifyShop, categoryController.createCategory);
router.get('/all-categories', categoryController.getAllCategories);
router.get('/category/:id', categoryController.getCategory);
router.put('/update-category/:id', validateToken, verifyCategoryOwnership, categoryController.updateCategory);
router.delete('/delete-category/:id', validateToken, verifyCategoryOwnership, categoryController.deleteCategory);

export const categoryModule = router;