import express from 'express';
import routes from './interfaces/http/routes';
import swaggerRouter from './interfaces/http/swagger';

const app = express();
app.use(express.json());
app.use('/api', routes);
app.use(swaggerRouter);

export default app; 