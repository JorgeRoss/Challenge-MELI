import express from 'express';
import routes from './interfaces/http/routes';
import swaggerRouter from './interfaces/http/swagger';
import { logger } from './infrastructure/logging/logger';

const app = express();
app.use(express.json());
app.use('/api', routes);
app.use(swaggerRouter);

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err });
  res.status(500).json({ success: false, message: 'Internal server error' });
});

export default app; 