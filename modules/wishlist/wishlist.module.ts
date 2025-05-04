import { Router } from 'express';
import { wishlistController } from './wishlist.controller';
import { validate } from '../../middlewares/validation.middleware';
import { addToWishlistSchema } from './wishlist.schema';
import validateToken from '../../middlewares/user.middleware';

const router = Router();

// Define routes
router.post('/add', 
  validateToken, 
  validate({ body: addToWishlistSchema }), 
  wishlistController.addToWishlist
);

router.delete('/remove/:productId', 
  validateToken, 
  wishlistController.removeFromWishlist
);

router.get('/', 
  validateToken, 
  wishlistController.getWishlist
);

export const wishlistModule = router;