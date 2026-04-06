/**
 * Stock Reduction Service
 * Responsabilidad: Reducir stock de productos tras pago aprobado
 */
import type { Core } from '@strapi/strapi';
import type { StockItem } from '../../types';
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    /**
     * Reduce el stock de múltiples productos de forma atómica
     * Usa transacción para evitar race conditions
     */
    reduceStock(items: StockItem[]): Promise<void>;
};
export default _default;
