/**
 * Payment Verification Service
 * Responsabilidad: Verificar y obtener datos de pagos desde MercadoPago
 */
import type { Core } from '@strapi/strapi';
import type { ConfigType, PaymentInfo } from '../../types';
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    /**
     * Obtiene y verifica información de un pago
     */
    getAndVerifyPayment(paymentId: string, config: ConfigType): Promise<PaymentInfo>;
};
export default _default;
