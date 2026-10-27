import express from 'express';
import cors from 'cors';
import mealRoutes from './routes/mealRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '30kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'NutriEase API' }));
app.use('/api/meals', mealRoutes);
app.use('/api/ai', aiRoutes);

app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

export default app;
