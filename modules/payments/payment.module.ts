// Combines payment controller/services into a single module
import { Router } from 'express';
import { paymentController } from './payment.controller';

const router = Router();

// Define routes
router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPayment);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

export const paymentModule = router;