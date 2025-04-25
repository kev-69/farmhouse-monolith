// Combines order controller/services into a single module

import { Router } from 'express';
import { orderController } from './order.controller';

const router = Router();

// Define routes
router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

export const orderModule = router;