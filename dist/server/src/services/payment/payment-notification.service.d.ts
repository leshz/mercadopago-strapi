/**
 * Payment Notification Service
 * Responsabilidad: Procesar notificaciones de pago (webhooks)
 */
import type { Core } from '@strapi/strapi';
import type { ConfigType, WebhookPayload } from '../../types';
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    /**
     * Procesa una notificación de pago de MercadoPago
     */
    processPaymentNotification(payload: WebhookPayload, config: ConfigType): Promise<void>;
};
export default _default;
