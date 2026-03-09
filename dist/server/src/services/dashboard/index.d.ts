declare const _default: {
    dashboard: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        getStats(days: number): Promise<{
            salesTimeline: import("../../types").TimelineEntry[];
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
            topProducts: import("../../types").ProductAccum[];
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
};
export default _default;
