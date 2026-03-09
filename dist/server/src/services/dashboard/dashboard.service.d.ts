/**
 * Dashboard Service
 * Responsabilidad: Agregar estadísticas de órdenes para el dashboard
 */
import type { Core } from '@strapi/strapi';
import type { TimelineEntry, ProductAccum } from '../../types';
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    getStats(days: number): Promise<{
        salesTimeline: TimelineEntry[];
        orderRatio: {
            open: number;
            closed: number;
        };
        rejectionReasons: {
            reason: string;
            count: number;
        }[];
        paymentMethods: {
            method: string;
            count: number;
        }[];
        topProducts: ProductAccum[];
        summary: {
            totalSales: number;
            revenue: any;
            approvedCount: number;
            rejectedCount: number;
            pendingCount: number;
            avgTicket: number;
            conversionRate: number;
        };
    }>;
};
export default _default;
