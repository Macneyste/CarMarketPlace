import express from 'express';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import listingRoutes from './routes/listingRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(express.json({ limit: '12mb' }));

app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Car Marketplace API is running',
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
