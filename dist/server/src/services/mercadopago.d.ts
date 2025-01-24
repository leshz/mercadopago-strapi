import type { Core } from "@strapi/strapi";
import type { config, reqProduct, buildedProduct, buyer, buyerMeli, shipping, PaymentPayload } from "../types";
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    meliProduct: (product: any, config: any) => buildedProduct[];
    products: (items: reqProduct[]) => Promise<any[]>;
    buyer: (buyer: buyer, ship: shipping) => Promise<buyerMeli>;
    shipment: (shipping: shipping, products: any) => Promise<any>;
    createPreference: ({ products, payer, internalInvoiceId, shipment }: {
        products: any;
        payer: any;
        internalInvoiceId: any;
        shipment: any;
    }, config: config) => Promise<import("mercadopago/dist/clients/preference/commonTypes").PreferenceResponse>;
    paymentHook: (payload: PaymentPayload, config: config) => Promise<void>;
};
export default _default;
