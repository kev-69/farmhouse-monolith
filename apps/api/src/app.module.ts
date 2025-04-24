// Root module to combine all modules (users, auth, etc.)
import { Router } from 'express';
import { userModule } from '../../../modules/users/user.module';
import { authModule } from '../../../modules/auth/auth.module';
import { productModule } from '../../../modules/products/product.module';
import { categoryModule } from '../../../modules/categories/category.module';
import { orderModule } from '../../../modules/orders/order.module';
import { paymentModule } from '../../../modules/payments/payment,module';

const appRouter = Router();

// Combine all modules
appRouter.use('/users', userModule);
appRouter.use('/auth', authModule);
appRouter.use('/products', productModule);
appRouter.use('/categories', categoryModule);
appRouter.use('/orders', orderModule);
appRouter.use('/payments', paymentModule);

export { appRouter as appModule };