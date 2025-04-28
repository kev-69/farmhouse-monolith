// Combines controller + service into a unit
import { Router } from 'express';
import { userController } from './user.controller';

// middlewares
import validateToken from '../../middlewares/user.middleware';

const router = Router();

// Define routes
router.get('/profile', validateToken, userController.getUser);
router.put('/update-profile', validateToken, userController.updateUser);
router.delete('/delete-profile', validateToken, userController.deleteUser);
router.post('/profile/add-address', validateToken, userController.addAddress);
router.put('/profile/update-address/:addressId', validateToken, userController.updateAddress);
router.get('/addresses', validateToken, userController.getAddresses);
router.delete('/profile/delete-address/:addressId', validateToken, userController.deleteAddress);

export const userModule = router;