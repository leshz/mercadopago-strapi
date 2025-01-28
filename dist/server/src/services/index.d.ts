declare const _default: {
    category: ({ strapi, }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => Partial<import("@strapi/types/dist/core/core-api/service").Base> & import("@strapi/types/dist/core/core-api/service").Generic & import("@strapi/types/dist/core/core-api/service").Base;
    product: ({ strapi, }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        getProducts: (items: import("../types").reqProduct[]) => Promise<import("../types").buildedProduct[]>;
    } & import("@strapi/types/dist/core/core-api/service").Base;
    order: ({ strapi, }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        createInitialOrder: ({ fulfillment, rawProducts, customer, }: {
            fulfillment: import("../types").Reqfulfillment;
            customer: import("../types").resCustomer;
            rawProducts: import("../types").buildedProduct[];
        }) => Promise<{
            id: import("@strapi/types/dist/data").ID;
        } & {
            [key: string]: any;
        }>;
        updateOrder: ({ id, data }: {
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
        parserProducts: (rawProducts: any, config: import("../types").ConfigType) => Promise<any>;
        parserCustomer: (customer: import("../types").resCustomer, fulfillment: import("../types").fulfillment) => Promise<import("../types").meliCustomer>;
        parserFulfillment: (shipping: import("../types").fulfillment) => Promise<import("../types").fulfillment>;
        createPreference: ({ rawProducts, payer, internalInvoiceId }: {
            rawProducts: any;
            payer: any;
            internalInvoiceId: any;
        }, config: import("../types").ConfigType) => Promise<import("mercadopago/dist/clients/preference/commonTypes").PreferenceResponse>;
        paymentAction: (payload: import("../types").PaymentPayload, config: import("../types").ConfigType) => Promise<void>;
    };
};
export default _default;
