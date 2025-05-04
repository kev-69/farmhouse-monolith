// Combines payment controller/services into a single module
import { Router } from 'express';
import { paymentController } from './payment.controller';

const router = Router();

// Define routes
router.post('/add', 
    paymentController.createPayment
);

router.get('/', 
    paymentController.getAllPayments
);

router.get('/:id', 
    paymentController.getPayment
);

router.put('/update/:id', 
    paymentController.updatePayment
);
router.delete('/delete/:id', 
    paymentController.deletePayment
);

export const paymentModule = router;