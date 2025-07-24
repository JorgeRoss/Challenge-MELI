import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Notification Service API',
    version: '1.0.0',
    description: 'API para recibir notificaciones de SNS.'
  },
  paths: {
    '/api/sns/notify': {
      post: {
        summary: 'Recibir notificación SNS',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Type: { type: 'string' },
                  Message: { type: 'string' }
                },
                required: ['Type', 'Message']
              },
              example: {
                Type: 'Notification',
                Message: '{"auctionId":"auction1","userId":"user123","amount":101}'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Notificación recibida',
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                  example: 'OK'
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