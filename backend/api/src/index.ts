import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import identifyRouter from './routes/identify';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '*')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins.includes('*') ? true : allowedOrigins,
  })
);
app.use(express.json({ limit: '10mb' }));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'retro-garden-plant-api' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/identify', identifyRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`[api] listening on port ${PORT}`);
});
