/**
 * Order Creation Service
 * Responsabilidad: Crear y actualizar órdenes
 */
import type { Core } from '@strapi/strapi';
import type { OrderData, PreferenceData } from '../../types';
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    /**
     * Crea una orden inicial con status INITIAL
     */
    createInitialOrder(data: OrderData): Promise<{
        id: import("@strapi/types/dist/data").ID;
    } & {
        [key: string]: any;
    }>;
    /**
     * Actualiza una orden con el link de pago
     */
    updateWithPaymentLink(orderId: string | number, preferenceData: PreferenceData): Promise<{
        id: import("@strapi/types/dist/data").ID;
    } & {
        [key: string]: any;
    }>;
};
export default _default;
