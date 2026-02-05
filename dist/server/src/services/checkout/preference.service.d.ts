/**
 * Preference Service
 * Responsabilidad: Crear preferencias de pago en MercadoPago
 */
import type { Core } from '@strapi/strapi';
import type { ConfigType, PreferenceResult } from '../../types';
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    /**
     * Crea una preferencia de pago en MercadoPago
     */
    createPaymentPreference(order: any, products: any[], customer: any, fulfillment: any, config: ConfigType): Promise<PreferenceResult>;
};
export default _default;
