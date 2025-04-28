import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

// Get Redis URL from environment variable
const redisUrl = process.env.REDIS_URL!;

if (!redisUrl) {
  console.error('REDIS_URL environment variable is not set');
  process.exit(1);
}

// Create Redis client
const redisClient = createClient({
  url: redisUrl
});

// Set up connection event handlers
redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

redisClient.on('reconnecting', () => {
  console.log('Redis client reconnecting');
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
};

// Export the client for use in other modules
export { redisClient, connectRedis };