declare const _default: {
    checkout: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        processCheckout(data: import("../../types").CheckoutData, config: import("../../types").ConfigType): Promise<import("../../types").CheckoutResult>;
    };
    preference: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        createPaymentPreference(order: any, products: any[], customer: any, fulfillment: any, config: import("../../types").ConfigType): Promise<import("../../types").PreferenceResult>;
    };
    'order-creation': ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        createInitialOrder(data: import("../../types").OrderData): Promise<{
            id: import("@strapi/types/dist/data").ID;
        } & {
            [key: string]: any;
        }>;
        updateWithPaymentLink(orderId: string | number, preferenceData: import("../../types").PreferenceData): Promise<{
            id: import("@strapi/types/dist/data").ID;
        } & {
            [key: string]: any;
        }>;
    };
};
export default _default;
