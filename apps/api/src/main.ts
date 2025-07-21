import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { routes } from './routes';
import dotenv from 'dotenv';
dotenv.config();
import { serve, setup } from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from '../../../utils/helpers';
import { initScheduledJobs } from '../../../utils/scheduler';

const app = express();
const PORT = process.env.PORT || 4000;

const requiredEnvVars = ['JWT_SECRET', 'DB_URL', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    // console.error(`Error: Environment variable ${envVar} is not set`);
    process.exit(1);
  }
}

// initilize scgeduled jobs
initScheduledJobs();

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(json());
app.use(cors({
  origin: ['https://farmgh.com', 'http://localhost:8080', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(morgan('dev'));

// Routes
app.use('/api/v1', routes);
app.use('/api-docs', serve, setup(swaggerDocs));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});