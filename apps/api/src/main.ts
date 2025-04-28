import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { routes } from './routes';
import { connectRedis } from '../../../config/redis-config';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Redis
connectRedis()

// Middleware
app.use(json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});