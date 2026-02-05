/**
 * Checkout Controller
 * Responsabilidad: Recibir datos validados y delegar a services
 */
import type { Core } from '@strapi/strapi';
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    checkout(ctx: any): Promise<any>;
};
export default _default;
