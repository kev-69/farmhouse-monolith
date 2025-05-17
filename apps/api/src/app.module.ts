// Root module to combine all modules (users, auth, etc.)
import { Router } from 'express';
import { adminModule } from '../../../modules/admin/admin.module';
import { userModule } from '../../../modules/users/user.module';
import { authModule } from '../../../modules/auth/user.auth.module';
import { productModule } from '../../../modules/products/product.module';
import { categoryModule } from '../../../modules/categories/category.module';
import { orderModule } from '../../../modules/orders/order.module';
import { paymentModule } from '../../../modules/payments/payment.module';
import { shopAuthModule } from '../../../modules/auth/shop.auth.module';
import { shopModule } from '../../../modules/shops/shop.module';
import { cartModule } from '../../../modules/cart/cart.module';
import { wishlistModule } from '../../../modules/wishlist/wishlist.module';

const appRouter = Router();

// Combine all modules
appRouter.use('/admin', adminModule);
appRouter.use('/users', userModule);
appRouter.use('/auth', authModule);
appRouter.use('/shop/auth', shopAuthModule)
appRouter.use('/shops', shopModule)
appRouter.use('/products', productModule);
appRouter.use('/categories', categoryModule);
appRouter.use('/cart', cartModule);
appRouter.use('/wishlist', wishlistModule);
appRouter.use('/orders', orderModule);
appRouter.use('/payments', paymentModule);

export { appRouter as appModule };