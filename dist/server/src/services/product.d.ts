/**
 *  service
 */
import type { reqProduct, buildedProduct } from 'src/types';
declare const _default: ({ strapi, }: {
    strapi: import("@strapi/types/dist/core").Strapi;
}) => {
    getProducts: (items: reqProduct[]) => Promise<buildedProduct[]>;
} & import("@strapi/types/dist/core/core-api/service").Base;
export default _default;
