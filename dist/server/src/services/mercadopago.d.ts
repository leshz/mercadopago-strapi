import type { Core } from "@strapi/strapi";
import type { ConfigType, reqProduct, buildedProduct, resCustomer, meliCustomer, fulfillment, PaymentPayload } from "../types";
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    meliProduct: (product: any, config: any) => buildedProduct[];
    products: (items: reqProduct[]) => Promise<buildedProduct[]>;
    parserCustomer: (customer: resCustomer, fulfillment: fulfillment) => Promise<meliCustomer>;
    shipment: (shipping: fulfillment) => Promise<fulfillment>;
    createPreference: ({ products, payer, internalInvoiceId, shipment }: {
        products: any;
        payer: any;
        internalInvoiceId: any;
        shipment: any;
    }, config: ConfigType) => Promise<import("mercadopago/dist/clients/preference/commonTypes").PreferenceResponse>;
    paymentHook: (payload: PaymentPayload, config: ConfigType) => Promise<void>;
};
export default _default;
