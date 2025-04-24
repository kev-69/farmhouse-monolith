import { Router } from 'express';
import { authModule } from '../../../../modules/auth/auth.module';
import { userModule } from '../../../../modules/users/user.module';
import { productModule } from '../../../../modules/products/product.module';
import { categoryModule } from '../../../../modules/categories/category.module';
import { orderModule } from '../../../../modules/orders/order.module';
import { paymentModule } from '../../../../modules/payments/payment,module';

const router = Router();

// Register all route modules
router.use('/auth', authModule);
router.use('/users', userModule);
router.use('/products', productModule);
router.use('/categories', categoryModule);
router.use('/orders', orderModule);
router.use('/payments', paymentModule);

export { router as routes };