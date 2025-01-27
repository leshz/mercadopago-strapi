/**
 *  service
 */
import type { buildedProduct, fulfillment, Reqfulfillment, ConfigType, resCustomer } from "../types";
type CreateInitialOrder = {
    shipping: Reqfulfillment;
    shopper: resCustomer;
    products: buildedProduct[];
    shipment: fulfillment;
    config: ConfigType;
};
declare const _default: ({ strapi, }: {
    strapi: import("@strapi/types/dist/core").Strapi;
}) => {
    createInitialOrder: ({ shipping, products, shopper, shipment, config, }: CreateInitialOrder) => Promise<{
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
export default _default;
