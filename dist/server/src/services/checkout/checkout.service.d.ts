/**
 * Checkout Service (Orchestrator)
 * Responsabilidad: Orquestar el flujo completo de checkout
 */
import type { Core } from '@strapi/strapi';
import type { ConfigType, CheckoutData, CheckoutResult } from '../../types';
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    /**
     * Procesa un checkout completo
     */
    processCheckout(data: CheckoutData, config: ConfigType): Promise<CheckoutResult>;
};
export default _default;
