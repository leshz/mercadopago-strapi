/**
 * Notification Controller (Webhook Handler)
 * Responsabilidad: Recibir webhooks y delegar procesamiento
 */
import type { Core } from '@strapi/strapi';
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    notification(ctx: any): Promise<any>;
};
export default _default;
