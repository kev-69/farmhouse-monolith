import cron from 'node-cron';
import { cartService } from '../modules/cart/cart.service';
import logger from './logger';

export function initScheduledJobs() {
  // Run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      logger.info('Running scheduled job: cleaning up old carts');
      const result = await cartService.cleanupOldCarts(7); // Clean carts older than 7 days
      logger.info(`Cleaned up ${result.deleted} abandoned carts`);
    } catch (error) {
      logger.error('Error cleaning up old carts:', error);
    }
  });
}