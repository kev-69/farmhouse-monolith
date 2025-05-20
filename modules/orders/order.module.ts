// Combines order controller methods into a module
import { Router } from 'express';
import { orderController } from './order.controller';
import { validate } from '../../middlewares/validation.middleware';
import { updateOrderSchema } from './order.schema';
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

router.put('/:orderId', 
    validateToken, 
    validate({ body: updateOrderSchema }), 
    orderController.updateOrder
);

router.delete('/:orderId', 
    validateToken, 
    orderController.deleteOrder
);

export const orderModule = router;