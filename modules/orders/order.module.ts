// Combines order controller methods into a module
import { Router } from 'express';
import { orderController } from './order.controller';
import { validate } from '../../middlewares/validation.middleware';
import { updateOrderSchema } from './order.schema';
import { validateToken } from '../../middlewares/shop.middleware';

const router = Router();

// Order management routes
router.get('/', validateToken, orderController.getAllOrders);
router.get('/:id', validateToken, orderController.getOrder);
router.put('/:id', validateToken, validate({ body: updateOrderSchema }), orderController.updateOrder);
router.delete('/:id', validateToken, orderController.deleteOrder);

export const orderModule = router;