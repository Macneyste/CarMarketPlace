import express from 'express';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import listingRoutes from './routes/listingRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

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
