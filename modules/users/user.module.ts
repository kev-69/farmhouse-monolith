// Combines controller + service into a unit
import { Router } from 'express';
import { userController } from './user.controller';

// middlewares
import validateToken from '../../middlewares/user.middleware';

const router = Router();

// Define routes
router.get('/profile', 
    validateToken, 
    userController.getUser
);

router.put('/update', 
    validateToken, 
    userController.updateUser
);

router.delete('/delete', 
    validateToken, 
    userController.deleteUser
);

router.post('/profile/address/add', 
    validateToken, 
    userController.addAddress
);

router.put('/profile/update/:addressId', 
    validateToken, 
    userController.updateAddress
);

router.get('/profile/addresses', 
    validateToken, 
    userController.getUserAddresses
);

router.delete('/profile/delete/:addressId', 
    validateToken, 
    userController.deleteAddress
);

export const userModule = router;