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
            shipping: import("../types").Reqship;
            shopper: import("../types").Reqbuyer;
            products: import("../types").buildedProduct[];
            shipment: any;
            config: import("../types").config;
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
        products: (items: import("../types").reqProduct[]) => Promise<any[]>;
        buyer: (buyer: import("../types").buyer, ship: import("../types").shipping) => Promise<import("../types").buyerMeli>;
        shipment: (shipping: import("../types").shipping, products: any) => Promise<any>;
        createPreference: ({ products, payer, internalInvoiceId, shipment }: {
            products: any;
            payer: any;
            internalInvoiceId: any;
            shipment: any;
        }, config: import("../types").config) => Promise<import("mercadopago/dist/clients/preference/commonTypes").PreferenceResponse>;
        paymentHook: (payload: import("../types").PaymentPayload, config: import("../types").config) => Promise<void>;
    };
    configuration: ({ strapi, }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => Partial<import("@strapi/types/dist/core/core-api/service").Base> & import("@strapi/types/dist/core/core-api/service").Generic & import("@strapi/types/dist/core/core-api/service").Base;
};
export default _default;
