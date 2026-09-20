import cors from 'cors'; import express from 'express';
import { canvasRouter } from './routes/canvasRoutes.js'; import { errorHandler, notFound } from './middleware/errorHandler.js';
export const app = express();
app.use(cors({ origin: process.env.CLIENT_URL?.split(',').map((x) => x.trim()) || 'http://localhost:3000' }));
app.use(express.json({ limit: '1mb' }));
app.get('/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.use('/api/canvases', canvasRouter); app.use(notFound); app.use(errorHandler);
