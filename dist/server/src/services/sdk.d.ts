import type { Core } from "@strapi/strapi";
import type { ConfigType, resCustomer, meliCustomer, fulfillment, PaymentPayload } from "../types";
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    parserProducts: (rawProducts: any, config: ConfigType) => Promise<any>;
    parserCustomer: (customer: resCustomer, fulfillment: fulfillment) => Promise<meliCustomer>;
    parserFulfillment: (shipping: fulfillment) => Promise<fulfillment>;
    createPreference: ({ rawProducts, payer, internalInvoiceId }: {
        rawProducts: any;
        payer: any;
        internalInvoiceId: any;
    }, config: ConfigType) => Promise<import("mercadopago/dist/clients/preference/commonTypes").PreferenceResponse>;
    paymentAction: (payload: PaymentPayload, config: ConfigType) => Promise<void>;
};
export default _default;
