// Combines order controller methods into a module
import { Router } from 'express';
import { orderController } from './order.controller';
import { validate } from '../../middlewares/validation.middleware';
import { shipOrderSchema, cancelOrderSchema } from './order.schema';
import { validateToken } from '../../middlewares/shop.middleware';

const router = Router();

// Order management routes
router.get('/', 
    validateToken, 
    orderController.getAllOrders
);

router.get('/:orderId', 
    validateToken, 
    orderController.getOrder
);

router.post('/:orderId/ship', 
    validateToken,
    validate({ body: shipOrderSchema }),
    orderController.shipOrder
);

router.post('/:orderId/deliver', 
    validateToken,
    orderController.deliverOrder
);

router.post('/:orderId/cancel', 
    validateToken,
    validate({ body: cancelOrderSchema }),
    orderController.cancelOrder
);

router.delete('/:orderId', 
    validateToken, 
    orderController.deleteOrder
);

export const orderModule = router;