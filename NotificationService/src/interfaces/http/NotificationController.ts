import { Request, Response } from 'express';

export class NotificationController {
  static async notify(req: Request, res: Response) {
    try {
      const message = req.body.Message;
      console.log('[NotificationService] Notificación recibida:', message);
      // Confirmar suscripción si es necesario
      if (req.body.Type === 'SubscriptionConfirmation') {
        // Aquí puedes usar fetch o axios para confirmar la suscripción
        // await fetch(req.body.SubscribeURL);
      }
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error en NotificationController.notify', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
} 