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

export const userModule = router;