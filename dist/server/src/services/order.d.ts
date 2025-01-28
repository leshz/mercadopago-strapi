/**
 *  service
 */
import type { buildedProduct, Reqfulfillment, resCustomer } from "../types";
type CreateInitialOrder = {
    fulfillment: Reqfulfillment;
    customer: resCustomer;
    rawProducts: buildedProduct[];
};
declare const _default: ({ strapi, }: {
    strapi: import("@strapi/types/dist/core").Strapi;
}) => {
    createInitialOrder: ({ fulfillment, rawProducts, customer, }: CreateInitialOrder) => Promise<{
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
export default _default;
