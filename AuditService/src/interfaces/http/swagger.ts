import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Audit Service API',
    version: '1.0.0',
    description: 'API para registrar y consultar eventos de auditoría de microservicios.'
  },
  paths: {
    '/api/audit': {
      post: {
        summary: 'Registrar evento de auditoría',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  service: { type: 'string' },
                  type: { type: 'string' },
                  payload: { type: 'object' }
                },
                required: ['service', 'type', 'payload']
              },
              example: {
                service: 'BidService',
                type: 'BID_PLACED',
                payload: {
                  auctionId: 'auction1',
                  userId: 'user123',
                  amount: 101
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Evento registrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' }
                  }
                },
                example: { success: true }
              }
            }
          }
        }
      },
      get: {
        summary: 'Consultar eventos de auditoría',
        responses: {
          200: {
            description: 'Lista de eventos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      service: { type: 'string' },
                      type: { type: 'string' },
                      payload: { type: 'object' },
                      timestamp: { type: 'string', format: 'date-time' }
                    }
                  }
                },
                example: [
                  {
                    id: 'uuid-123',
                    service: 'BidService',
                    type: 'BID_PLACED',
                    payload: { auctionId: 'auction1', userId: 'user123', amount: 101 },
                    timestamp: '2024-07-21T20:00:00.000Z'
                  }
                ]
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