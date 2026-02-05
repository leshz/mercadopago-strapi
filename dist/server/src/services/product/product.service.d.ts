import type { ProductItem } from '../../types';
declare const _default: ({ strapi, }: {
    strapi: import("@strapi/types/dist/core").Strapi;
}) => {
    getProducts: (items: ProductItem[]) => Promise<any[]>;
} & import("@strapi/types/dist/core/core-api/service").Base;
export default _default;
