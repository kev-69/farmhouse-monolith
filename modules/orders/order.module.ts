import { Router } from 'express';
import { orderController } from './order.controller';
import { validate } from '../../middlewares/validation.middleware';
import { createOrderSchema, updateOrderItemStatusSchema, cancelOrderItemSchema } from './order.schema';
import { validateToken } from '../../middlewares/shop.middleware';

const router = Router();

// User order routes
router.get('/', 
  validateToken, 
  orderController.getOrders
);

router.get('/:orderId', 
  validateToken, 
  orderController.getOrder
);

// Shop order routes
router.get('/shop/items', 
  validateToken, 
  orderController.getShopOrderItems
);

router.patch('/items/:orderItemId/status', 
  validateToken,
  validate({ body: updateOrderItemStatusSchema }),
  orderController.updateOrderItemStatus
);

// Admin routes
router.delete('/:orderId', 
  validateToken, 
  orderController.deleteOrder
);

export const orderModule = router;