declare const _default: {
    'payment-notification': ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        processPaymentNotification(payload: import("../../types").WebhookPayload, config: import("../../types").ConfigType): Promise<void>;
    };
    'payment-verification': ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        getAndVerifyPayment(paymentId: string, config: import("../../types").ConfigType): Promise<import("../../types").PaymentInfo>;
    };
    'stock-reduction': ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        reduceStock(items: import("../../types").StockItem[]): Promise<void>;
    };
};
export default _default;
