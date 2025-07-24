import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Auction Service API',
    version: '1.0.0',
    description: 'API de administración y monitoreo para AuctionService.'
  },
  paths: {
    '/api/health': {
      get: {
        summary: 'Healthcheck',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' }
                  }
                },
                example: {
                  status: 'ok'
                }
              }
            }
          }
        }
      }
    }
  }
};

const router = Router();
router.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
export default router; 