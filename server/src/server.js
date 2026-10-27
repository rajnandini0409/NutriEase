import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

try {
  await connectDB();
  app.listen(PORT, () => console.log(`NutriEase API running at http://localhost:${PORT}`));
} catch (error) {
  console.error('Could not start server:', error.message);
  process.exit(1);
}
