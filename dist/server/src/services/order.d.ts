/**
 *  service
 */
import type { buildedProduct, Reqbuyer, Reqship, config } from "../types";
declare const _default: ({ strapi, }: {
    strapi: import("@strapi/types/dist/core").Strapi;
}) => {
    createInitialOrder: ({ shipping, products, shopper, shipment, config, }: {
        shipping: Reqship;
        shopper: Reqbuyer;
        products: buildedProduct[];
        shipment: any;
        config: config;
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
export default _default;
