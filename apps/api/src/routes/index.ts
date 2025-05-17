import { Router } from 'express';
import { adminModule } from '../../../../modules/admin/admin.module';
import { authModule } from '../../../../modules/auth/user.auth.module';
import { userModule } from '../../../../modules/users/user.module';
import { shopAuthModule } from '../../../../modules/auth/shop.auth.module';
import { shopModule } from '../../../../modules/shops/shop.module';
import { productModule } from '../../../../modules/products/product.module';
import { categoryModule } from '../../../../modules/categories/category.module';
import { orderModule } from '../../../../modules/orders/order.module';
import { cartModule } from '../../../../modules/cart/cart.module';
import { paymentModule } from '../../../../modules/payments/payment.module';
import { wishlistModule } from '../../../../modules/wishlist/wishlist.module';

const router = Router();

// Register all route modules
router.use('/admin', adminModule);
router.use('/auth', authModule);
router.use('/users', userModule);
router.use('/shop/auth', shopAuthModule);
router.use('/shops', shopModule);
router.use('/products', productModule);
router.use('/categories', categoryModule);
router.use('/orders', orderModule);
router.use('/cart', cartModule);
router.use('/payments', paymentModule);
router.use('/wishlist', wishlistModule)

export { router as routes };