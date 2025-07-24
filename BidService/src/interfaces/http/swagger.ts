import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Bid Service API',
    version: '1.0.0',
    description: 'API para recibir y encolar ofertas en el sistema de subastas.'
  },
  paths: {
    '/api/bid': {
      post: {
        summary: 'Enviar una oferta',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  auctionId: { type: 'string' },
                  userId: { type: 'string' },
                  amount: { type: 'number' }
                },
                required: ['auctionId', 'userId', 'amount']
              },
              example: {
                auctionId: 'auction1',
                userId: 'user123',
                amount: 101
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Oferta aceptada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' }
                  }
                },
                example: {
                  success: true,
                  message: 'Bid placed successfully'
                }
              }
            }
          },
          400: {
            description: 'Oferta inválida',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' }
                  }
                },
                example: {
                  success: false,
                  message: 'Bid must be at least 101'
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