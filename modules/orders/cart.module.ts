import { Router } from 'express';
import { cartController } from './cart.controller';
import { validate } from '../../middlewares/validation.middleware';
import { addToCartSchema, updateCartSchema, checkoutSchema } from './cart.schema';
import { validateToken } from '../../middlewares/shop.middleware';

const router = Router();

// Cart routes
router.post('/add', validateToken, validate({ body: addToCartSchema }), cartController.addToCart);
router.put('/update/:productId', validateToken, validate({ body: updateCartSchema }), cartController.updateCart);
router.delete('/remove/:productId', validateToken, cartController.removeFromCart);
router.get('/', validateToken, cartController.getCart);
router.delete('/clear', validateToken, cartController.clearCart);
router.post('/checkout', validateToken, validate({ body: checkoutSchema }), cartController.checkout);

export const cartModule = router;