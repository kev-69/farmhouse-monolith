import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { routes } from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

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