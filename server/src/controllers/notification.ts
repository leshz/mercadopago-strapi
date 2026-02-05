/**
 * Notification Controller (Webhook Handler)
 * Responsabilidad: Recibir webhooks y delegar procesamiento
 */
import type { Core } from '@strapi/strapi';
import type { ConfigType } from '../types';
import { NOTIFICATION_TYPES } from '../constants';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async notification(ctx) {
    const payload = ctx?.request?.body || {};
    const { config }: { config: ConfigType } = ctx.state;
    const { type = '', action = '' } = payload;

    strapi.log.info('Webhook received', { type, action });

    try {
      switch (type) {
        case NOTIFICATION_TYPES.PAYMENT:
          await strapi
            .service('plugin::strapi-mercadopago.payment-notification')
            .processPaymentNotification(payload, config);

          return ctx.send({ message: 'Webhook processed successfully' }, 200);

        default:
          strapi.log.info('Webhook type not handled', { type });
          return ctx.send({ message: 'Webhook received but not processed' }, 200);
      }
    } catch (error) {
      strapi.log.error('Failed to process webhook', {
        error: error.message,
        type,
        action,
      });

      // Retornar 200 para que MercadoPago no reintente
      return ctx.send({ message: 'Webhook received with errors' }, 200);
    }
  },
});
