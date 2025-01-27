declare const _default: {
    category: ({ strapi, }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => Partial<import("@strapi/types/dist/core/core-api/service").Base> & import("@strapi/types/dist/core/core-api/service").Generic & import("@strapi/types/dist/core/core-api/service").Base;
    product: ({ strapi, }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => Partial<import("@strapi/types/dist/core/core-api/service").Base> & import("@strapi/types/dist/core/core-api/service").Generic & import("@strapi/types/dist/core/core-api/service").Base;
    order: ({ strapi, }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        createInitialOrder: ({ shipping, products, shopper, shipment, config, }: {
            shipping: import("../types").Reqfulfillment;
            shopper: import("../types").resCustomer;
            products: import("../types").buildedProduct[];
            shipment: import("../types").fulfillment;
            config: import("../types").ConfigType;
        }) => Promise<{
            id: import("@strapi/types/dist/data").ID;
        } & {
            [key: string]: any;
        }>;
        updateInvoice: ({ id, data }: {
            id: any;
            data: any;
        }) => Promise<{
            id: import("@strapi/types/dist/data").ID;
        } & {
            [key: string]: any;
        }>;
    } & import("@strapi/types/dist/core/core-api/service").Base;
    mercadopago: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        meliProduct: (product: any, config: any) => import("../types").buildedProduct[];
        products: (items: import("../types").reqProduct[]) => Promise<import("../types").buildedProduct[]>;
        parserCustomer: (customer: import("../types").resCustomer, fulfillment: import("../types").fulfillment) => Promise<import("../types").meliCustomer>;
        shipment: (shipping: import("../types").fulfillment) => Promise<import("../types").fulfillment>;
        createPreference: ({ products, payer, internalInvoiceId, shipment }: {
            products: any;
            payer: any;
            internalInvoiceId: any;
            shipment: any;
        }, config: import("../types").ConfigType) => Promise<import("mercadopago/dist/clients/preference/commonTypes").PreferenceResponse>;
        paymentHook: (payload: import("../types").PaymentPayload, config: import("../types").ConfigType) => Promise<void>;
    };
};
export default _default;
